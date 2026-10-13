import { GoogleGenAI } from '@google/genai';

const getAI = () => {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GOOGLE_GEMINI_API_KEY is missing from .env');
  }

  return new GoogleGenAI({
    apiKey: apiKey,
  });
};

const generateAIContent = async (prompt) => {
  const ai = getAI();

  const response = await ai.models.generateContent({
    model: 'gemini-3.5-flash',
    contents: prompt,
  });

  return response.text;
};

export const generateNotes = async (topic) => {
  try {
    const prompt = `
Create comprehensive, easy-to-understand study notes for the topic: "${topic}".

Include:

1. Introduction
2. Important definitions
3. Key concepts
4. Detailed explanations
5. Examples
6. Important points for exams
7. Summary

Use clear headings, bullet points and simple language suitable for a college student.
`;

    return await generateAIContent(prompt);
  } catch (error) {
    console.error('Gemini Notes Error:', error);
    throw new Error(`Failed to generate notes: ${error.message}`);
  }
};

export const generateQuestions = async (topic) => {
  try {
    const prompt = `
Generate 5 educational practice questions for the topic "${topic}".

Return ONLY a valid JSON array in this format:

[
  {
    "questionText": "Question here",
    "answer": "Detailed answer here"
  }
]

Do not include markdown or any text outside the JSON.
`;

    const text = await generateAIContent(prompt);

    const jsonMatch = text.match(/\[[\s\S]*\]/);

    if (!jsonMatch) {
      throw new Error('Invalid JSON response from Gemini');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Gemini Questions Error:', error);
    throw new Error(`Failed to generate questions: ${error.message}`);
  }
};

export const generateMCQs = async (topic) => {
  try {
    const prompt = `
Generate 5 multiple-choice questions for the topic "${topic}".

Each question must have exactly 4 options.

Return ONLY a valid JSON array:

[
  {
    "questionText": "Question here",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correctOptionIndex": 0,
    "explanation": "Explanation here"
  }
]

correctOptionIndex must be 0, 1, 2, or 3.
Do not include markdown or any text outside the JSON.
`;

    const text = await generateAIContent(prompt);

    const jsonMatch = text.match(/\[[\s\S]*\]/);

    if (!jsonMatch) {
      throw new Error('Invalid JSON response from Gemini');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Gemini MCQ Error:', error);
    throw new Error(`Failed to generate MCQs: ${error.message}`);
  }
};

export const askQuestion = async (userMessage, previousMessages = []) => {
  try {
    const conversationHistory = previousMessages
      .map(
        (msg) =>
          `${msg.role === 'user' ? 'Student' : 'Assistant'}: ${msg.content}`
      )
      .join('\n');

    const prompt = `
You are an AI Study Assistant helping a college student.

Previous conversation:
${conversationHistory}

Student's question:
${userMessage}

Give a clear, educational and easy-to-understand answer.
Use examples when useful.
`;

    return await generateAIContent(prompt);
  } catch (error) {
    console.error('Gemini Chat Error:', error);
    throw new Error(`Failed to get response: ${error.message}`);
  }
};