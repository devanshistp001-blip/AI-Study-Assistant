import Question from '../models/Question.js';
import * as geminiService from '../services/geminiService.js';

export const generateQuestions = async (req, res) => {
  try {
    const { topic } = req.body;
    const userId = req.user.id;

    if (!topic) {
      return res.status(400).json({
        success: false,
        message: 'Topic is required',
      });
    }

    // Generate questions using Gemini API
    const questions = await geminiService.generateQuestions(topic);

    // Save to database
    const questionDoc = new Question({
      userId,
      topic,
      questions,
    });

    await questionDoc.save();

    res.status(201).json({
      success: true,
      message: 'Questions generated successfully',
      data: questionDoc,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllQuestions = async (req, res) => {
  try {
    const userId = req.user.id;

    const questions = await Question.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Questions retrieved successfully',
      data: questions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const question = await Question.findOne({ _id: id, userId });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Question retrieved successfully',
      data: question,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const question = await Question.findOneAndDelete({ _id: id, userId });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Question deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
