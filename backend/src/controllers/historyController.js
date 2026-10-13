import Note from '../models/Note.js';
import Question from '../models/Question.js';
import MCQ from '../models/MCQ.js';
import ChatHistory from '../models/ChatHistory.js';

export const getHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get counts from all collections
    const notesCount = await Note.countDocuments({ userId });
    const questionsCount = await Question.countDocuments({ userId });
    const mcqsCount = await MCQ.countDocuments({ userId });
    const chatsCount = await ChatHistory.countDocuments({ userId });

    // Get recent items
    const recentNotes = await Note.find({ userId })
      .sort({ createdAt: -1 })
      .limit(3);
    const recentQuestions = await Question.find({ userId })
      .sort({ createdAt: -1 })
      .limit(3);
    const recentMCQs = await MCQ.find({ userId })
      .sort({ createdAt: -1 })
      .limit(3);
    const recentChats = await ChatHistory.find({ userId })
      .sort({ lastMessageTime: -1 })
      .limit(3);

    res.status(200).json({
      success: true,
      message: 'History retrieved successfully',
      data: {
        stats: {
          totalNotes: notesCount,
          totalQuestions: questionsCount,
          totalMCQs: mcqsCount,
          totalChats: chatsCount,
        },
        recent: {
          notes: recentNotes,
          questions: recentQuestions,
          mcqs: recentMCQs,
          chats: recentChats,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
