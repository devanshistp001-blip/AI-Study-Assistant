import MCQ from '../models/MCQ.js';
import * as geminiService from '../services/geminiService.js';

export const generateMCQs = async (req, res) => {
  try {
    const { topic } = req.body;
    const userId = req.user.id;

    if (!topic) {
      return res.status(400).json({
        success: false,
        message: 'Topic is required',
      });
    }

    // Generate MCQs using Gemini API
    const mcqs = await geminiService.generateMCQs(topic);

    // Save to database
    const mcqDoc = new MCQ({
      userId,
      topic,
      mcqs,
    });

    await mcqDoc.save();

    res.status(201).json({
      success: true,
      message: 'MCQs generated successfully',
      data: mcqDoc,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllMCQs = async (req, res) => {
  try {
    const userId = req.user.id;

    const mcqs = await MCQ.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'MCQs retrieved successfully',
      data: mcqs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMCQ = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const mcq = await MCQ.findOne({ _id: id, userId });

    if (!mcq) {
      return res.status(404).json({
        success: false,
        message: 'MCQ not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'MCQ retrieved successfully',
      data: mcq,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteMCQ = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const mcq = await MCQ.findOneAndDelete({ _id: id, userId });

    if (!mcq) {
      return res.status(404).json({
        success: false,
        message: 'MCQ not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'MCQ deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
