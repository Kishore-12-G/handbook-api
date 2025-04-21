const { v4: uuidv4 } = require('uuid');
const ragService = require('../services/ragService');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const chatbotController = {
  async processQuery(req, res) {
    const { query, sessionId, resetMemory } = req.body;
    
    // Get userId from the authenticated user object that's attached by your protect middleware
    const userId = req.user.userId;  // This should be set by your auth middleware
  
    if (!query) {
      return res.status(400).json({ success: false, message: 'query is required' });
    }
  
    const currentSessionId = sessionId || uuidv4();
  
    try {
      const response = await ragService.askQuestion(query, resetMemory);
      
      const conversation = await prisma.chatbot.create({
        data: {
          query,
          response,
          sessionId: currentSessionId,
          userId: userId,  // This is now the authenticated user's ID
        },
      });
  
      res.status(201).json({
        success: true,
        data: {
          id: conversation.id,
          sessionId: conversation.sessionId,
          userId: userId,
          query,
          response,
          timestamp: conversation.createdAt,
        },
        message: 'conversation added successfully',
      });
    } catch (error) {
      console.error('Error occurred during the conversation creation:', error.message);
      res.status(500).json({ success: false, message: 'internal server error' });
    }
  },

  async getConversationById(req, res) {
    const { sessionId } = req.params;
    const userId = req.params.userId;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'session id is required to get the conversation',
      });
    }

    try {
      const conversation = await prisma.chatbot.findMany({
        where: {
          sessionId,
          ...(userId && { userId }),
        },
        select: {
          id: true,
          query: true,
          response: true,
          createdAt: true,
        },
      });

      res.status(200).json({
        success: true,
        data: conversation,
        message: 'session message fetched successfully',
      });
    } catch (error) {
      console.error('Error fetching conversation history:', error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching conversation history',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  },
};

module.exports = chatbotController;
