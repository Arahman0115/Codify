import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NotebookInput.css';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function NotebookInput({ onComplete = () => {} }) {
  const [goal, setGoal] = useState('');
  const [notebookId, setNotebookId] = useState(null);
  const [gptResult, setGptResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!goal.trim()) return;

    setLoading(true);

    try {
      const notebookRef = await addDoc(collection(db, 'notebooks'), {
        goal,
        userId: auth.currentUser.uid,
        createdAt: new Date()  // fallback timestamp to ensure immediate visibility
      });

      const prompt = `
      You are an expert code generator. The user wants to learn: "${goal}".

      Design a real-world coding tutorial to fulfill this goal. First, invent a simple but realistic project. Then output a JSON array containing **at least 10 steps**, each of which includes:

      - "description": repeat the full project description in every object
      - "code": a valid, executable code block — no comments or placeholders, this code should be explicit and directly relevant to the project that you created in the beginning
      - "explanation": 1–2 sentences about what this step does

      Format:
      [
        {
          "description": "Project overview here...",
          "code": "ACTUAL CODE",
          "explanation": "Short explanation"
        },
        ...
      ]

      Rules:
      - Do NOT include markdown (no \`\`\` or ##), headings, or text outside the array
      - Do NOT explain what you're doing
      - Do NOT wrap the JSON in prose
      - Just return the JSON array. Nothing else.
      - Make sure the output is valid JSON
      `;



      const res = await fetch('/api/gpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      const { blocks } = await res.json();

      if (!Array.isArray(blocks) || blocks.length === 0) {
        throw new Error('Invalid GPT response structure');
      }

      await Promise.all(
        blocks.map(block => {
          const code = block.code ?? '// missing code';
          const explanation = block.explanation ?? 'No explanation provided.';
          const description = block.description ?? 'No description.';
          return addDoc(collection(db, 'notebooks', notebookRef.id, 'blocks'), {
            code,
            explanation,
            description,
            createdAt: serverTimestamp()
          });
        })
      );


      setNotebookId(notebookRef.id);
      setGptResult(blocks[0]); // preview only the first block
    } catch (err) {
      console.error('Error creating notebook:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartPractice = () => {
    if (notebookId) {
      navigate(`/notebook/${notebookId}`);
      onComplete();
    }
  };



  return (
    <div className="notebook-input-container">
      <div className="notebook-input">
        <h2>What do you want to learn?</h2>
        <textarea
  placeholder="I want to learn..."
  value={goal}
  onChange={(e) => setGoal(e.target.value)}
  className="goal-textarea"
/>
        <button className="startlearning" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Generating...' : 'Start Learning'}
        </button>

        {gptResult && (
          <div className="gpt-preview">
            <h3>📘 Explanation</h3>
            <pre>{gptResult.explanation}</pre>

            <h3>💻 Code</h3>
            <pre>{gptResult.code}</pre>

            <button onClick={handleStartPractice}>I'm Ready to Try</button>
          </div>
        )}
      </div>
    </div>
  );
}
