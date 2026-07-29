const express = require('express');
const { GoogleGenAI } = require('@google/genai');

const router = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post('/generate-description', async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Task title is required to generate a description.' });
    }

    const prompt = `Write a concise, professional, 2-3 sentence task description for a task titled: "${title}". Output only the description text without extra formatting or quotes.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const description = response.text ? response.text.trim() : '';

    return res.status(200).json({ description });
  } catch (error) {
    console.error('Error generating description with AI:', error);
    return res.status(500).json({ error: 'Failed to generate task description.' });
  }
});

module.exports = router;