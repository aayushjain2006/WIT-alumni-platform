const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { protect } = require('../middleware/auth'); // Assuming protect middleware exists

router.use(protect);

router.route('/conversations')
  .get(messageController.getConversations)
  .post(messageController.createConversation);

router.route('/:conversationId/messages')
  .get(messageController.getMessages)
  .post(messageController.sendMessage);

module.exports = router;
