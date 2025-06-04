import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import {
  doc, getDoc, collection, getDocs, query, orderBy
} from 'firebase/firestore';
import Editor from '@monaco-editor/react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './NotebookView.css';

export default function NotebookView() {
  const { id } = useParams();
  const [notebook, setNotebook] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [step, setStep] = useState('typing');
  const [hintVisible, setHintVisible] = useState(false);
  const navigate = useNavigate();
 useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    const loadNotebook = async () => {
      const docRef = doc(db, 'notebooks', id);
      const snap = await getDoc(docRef);
      if (snap.exists()) setNotebook(snap.data());

      const blocksSnap = await getDocs(query(
        collection(db, 'notebooks', id, 'blocks'),
        orderBy('createdAt')
      ));

      setBlocks(blocksSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    loadNotebook();
  }, [id]);

  const currentBlock = blocks[currentIndex];

  const handleCheck = () => {
    if (userInput.trim() === currentBlock.code.trim()) {
      setStep('review');
      setHintVisible(false);
    }
  };

  const handleNext = () => {
    setUserInput('');
    setStep('typing');
    setCurrentIndex(prev => prev + 1);
  };

  const handleCompletion = () => {
    navigate('/notebook-input');
  };

  if (!notebook || !currentBlock) return <div className="notebook-view">Loading...</div>;

  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < blocks.length - 1;

  return (
    <div className="notebook-view-main">

      <div className="notebook-view">
        <h2>{notebook.goal}</h2>

        {blocks.length > 0 && (
          <div className="notebook-project-description">
            <h3>📁 Project Overview</h3>
            <p>{blocks[0].description}</p>
          </div>
        )}

        <p className="notebook-step-label">Step {currentIndex + 1} of {blocks.length}</p>
        <p className="notebook-code-block">{currentBlock.explanation}</p>

        {step === 'typing' && (
          <>
           <Editor
  height="300px"
  defaultLanguage="javascript"
  theme="vs-dark"
  value={userInput}
  onChange={(value) => setUserInput(value)}
  beforeMount={(monaco) => {
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
    });
  }}
  options={{
    fontSize: 16,
    fontFamily: "'Fira Code', monospace",
    minimap: { enabled: false },
    lineNumbers: "on",
    padding: { top: 10 },
    scrollbar: {
      verticalScrollbarSize: 5,
      horizontalScrollbarSize: 5,
    },
    overviewRulerLanes: 0,
    scrollBeyondLastLine: false,
    spellCheck: false,
    tabSize: 2,
    wordWrap: 'on',
  }}
/>

            <div className="notebook-button-group">
              <button className="notebook-button" onClick={handleCheck}>Continue</button>
              <button
                className="notebook-button"
                onClick={() => setHintVisible(prev => !prev)}
              >
                {hintVisible ? 'Hide Reminder' : 'Remind Me'}
              </button>
            </div>
          </>
        )}

        {step === 'review' && (
          <div className="notebook-review-block">
            <p>✅ Correct!</p>
            <h4>Next Step:</h4>
            <pre className="notebook-code-block">
              {blocks[currentIndex + 1]?.explanation || '🎉 All done!'}
            </pre>
            <div className="notebook-button-group">
              {blocks[currentIndex + 1] ? (
                <button className="notebook-button" onClick={handleNext}>Try Next Block</button>
              ) : (
                <button className="notebook-button" onClick={handleCompletion}>Finish Notebook</button>
              )}
            </div>
          </div>
        )}

        <div className="step-navigation">
          <button
            className="notebook-button"
            disabled={!canGoBack}
            onClick={() => {
              setCurrentIndex(prev => prev - 1);
              setUserInput('');
              setStep('typing');
              setHintVisible(false);
            }}
          >
            ← Previous
          </button>

          <button
            className="notebook-button"
            disabled={!canGoForward}
            onClick={() => {
              setCurrentIndex(prev => prev + 1);
              setUserInput('');
              setStep('typing');
              setHintVisible(false);
            }}
          >
            Next →
          </button>
        </div>
      </div>

      <div className="notebook">
        {hintVisible && (
          <div className="notebook-hint-block">
            <h3 className="notebook-hint-title">Reminder</h3>
            <SyntaxHighlighter language="javascript" style={atomDark} wrapLongLines className="notebook-hint">
              {currentBlock.code}
            </SyntaxHighlighter>
          </div>
        )}

        {step === 'review' && blocks[currentIndex + 1] && (
          <div className="notebook-next-code">
            <h4 className="notebook-final-title">➡️ Next Step Code</h4>
            <div className="notebook-final-scroll">
              <SyntaxHighlighter language="javascript" style={atomDark} wrapLongLines>
                {blocks[currentIndex + 1].code}
              </SyntaxHighlighter>
            </div>
          </div>
        )}

        {step === 'review' && !blocks[currentIndex + 1] && (
          <div className="notebook-final-code">
            <h4 className="notebook-final-title">Final Code</h4>
            <div className="notebook-final-scroll">
              <SyntaxHighlighter language="javascript" style={atomDark} wrapLongLines>
                {blocks.map((block) => block.code).join('\n\n')}
              </SyntaxHighlighter>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
