const { v4: uuidv4 } = require('uuid');
const ragService = require('../services/ragService');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const chatbotController = {
  async processQuery(req, res) {
    const { query, sessionId, resetMemory } = req.body;
    const userId = req.params.userId; // or req.body.userId depending on route structure

    if (!query) {
      return res.status(400).json({ success: false, message: 'query is required' });
    }

    const currentSessionId = sessionId || uuidv4();

    try {
      const response = await ragService.askQuestion(query, resetMemory);
      if (!prisma.chatbot) {
        console.error('prisma.chatbot is undefined. Prisma client may not be properly initialized.');
        return res.status(500).json({ success: false, message: 'Database configuration error' });
      }
      const conversation = await prisma.chatbot.create({
        data: {
          query,
          response,
          sessionId: currentSessionId,
          userId: userId || null,
        },
      });

      res.status(201).json({
        success: true,
        data: {
          id: conversation.id,
          sessionId: conversation.sessionId,
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
