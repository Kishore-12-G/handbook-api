const express = require('express');
const chatbot = require('../controllers/chatbotController');
// Uncomment if you're using auth middleware
const { protect } = require('../middleware/auth');

const router = express.Router();

// Route to process queries
router.post('/', protect,chatbot.processQuery);

// Route to get conversation history
router.get('/:sessionId/:userId?', /*protect,*/ chatbot.getConversationById);

module.exports = router;