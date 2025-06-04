const express = require('express');
const { OpenAI } = require('openai');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-0125',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4 // Lower temp = more consistent output
    });

    const content = response.choices?.[0]?.message?.content?.trim();

    if (!content) {
      return res.status(500).json({ error: 'Empty GPT response' });
    }

    // Extract JSON array safely
    const jsonMatch = content.match(/\[\s*{[\s\S]*}\s*\]/);
    if (!jsonMatch) {
      return res.status(500).json({ error: 'No JSON array found in GPT response', raw: content });
    }

    let blocks;
    try {
      blocks = JSON.parse(jsonMatch[0]);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to parse JSON', raw: jsonMatch[0] });
    }

    if (
      !Array.isArray(blocks) ||
      blocks.length === 0 ||
      !blocks.every(
        b =>
          typeof b.description === 'string' &&
          typeof b.code === 'string' &&
          typeof b.explanation === 'string'
      )
    ) {
      return res.status(500).json({ error: 'Invalid block structure', blocks });
    }

    res.json({ blocks });
  } catch (err) {
    console.error('GPT error:', err);
    res.status(500).json({ error: 'OpenAI request failed', details: err.message });
  }
});

module.exports = router;
