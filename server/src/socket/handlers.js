const Message = require('../models/Message');
const User = require('../models/User');

const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join personal room
    socket.on('join', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their personal room`);
      // Update online status (can emit to all or update DB)
    });

    // Handle incoming message
    socket.on('message:send', async (data) => {
      // Logic handled mainly via REST API but can add pure socket logic here
      // For real-time typing/read indicators:
      const { conversationId, senderId, text } = data;
      // broadcast to conversation participants
    });

    // Typing indicator
    socket.on('message:typing', (data) => {
      const { conversationId, userId, participants } = data;
      participants.forEach(pId => {
        if (pId !== userId) {
          io.to(pId).emit('message:typing', { conversationId, userId });
        }
      });
    });

    // Mark as read
    socket.on('message:read', async (data) => {
      const { conversationId, userId, messageIds } = data;
      // Update in DB
      await Message.updateMany(
        { _id: { $in: messageIds } },
        { $set: { isRead: true }, $addToSet: { readBy: userId } }
      );
      // Notify sender
      // io.to(senderId).emit('message:read_receipt', { conversationId, messageIds, userId });
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      // Update offline status
    });
  });
};

module.exports = setupSocketHandlers;
