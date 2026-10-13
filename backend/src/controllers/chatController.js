import ChatHistory from '../models/ChatHistory.js';
import * as geminiService from '../services/geminiService.js';

export const sendMessage = async (req, res) => {
  try {
    const { message, topic = 'General', conversationId } = req.body;
    const userId = req.user.id;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
      });
    }

    let conversation;

    if (conversationId) {
      // Continue existing conversation
      conversation = await ChatHistory.findOne({
        _id: conversationId,
        userId,
      });

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: 'Conversation not found',
        });
      }
    } else {
      // Create new conversation
      conversation = new ChatHistory({
        userId,
        topic,
        messages: [],
      });
    }

    // Add user message
    conversation.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date(),
    });

    // Get AI response
    const aiResponse = await geminiService.askQuestion(
      message,
      conversation.messages.slice(0, -1) // Exclude the message we just added
    );

    // Add AI response
    conversation.messages.push({
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date(),
    });

    conversation.lastMessageTime = new Date();

    await conversation.save();

    res.status(200).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        conversationId: conversation._id,
        userMessage: message,
        aiResponse,
        conversation,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getChats = async (req, res) => {
  try {
    const userId = req.user.id;

    const chats = await ChatHistory.find({ userId }).sort({ lastMessageTime: -1 });

    res.status(200).json({
      success: true,
      message: 'Chats retrieved successfully',
      data: chats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getChat = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const chat = await ChatHistory.findOne({ _id: id, userId });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Chat retrieved successfully',
      data: chat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteChat = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const chat = await ChatHistory.findOneAndDelete({ _id: id, userId });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Chat deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
