const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const { AppError } = require('../middleware/errorHandler');

/**
 * Get all conversations where current user is participant
 * @route GET /api/messages/conversations
 */
exports.getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
      isActive: true
    })
      .populate('participants', 'firstName lastName profileImage role')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      status: 'success',
      results: conversations.length,
      data: conversations
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create direct or group conversation
 * @route POST /api/messages/conversations
 */
exports.createConversation = async (req, res, next) => {
  try {
    const { type, participants, name } = req.body;

    if (!participants || participants.length === 0) {
      return next(new AppError('Please provide participants', 400));
    }

    // Include current user in participants
    const allParticipants = [...new Set([...participants, req.user._id.toString()])];

    if (type === 'direct') {
      if (allParticipants.length !== 2) {
        return next(new AppError('Direct conversation must have exactly 2 participants', 400));
      }
      
      // Check if direct conversation already exists
      const existingConv = await Conversation.findOne({
        type: 'direct',
        participants: { $all: allParticipants, $size: 2 }
      });

      if (existingConv) {
        return res.status(200).json({
          status: 'success',
          data: existingConv
        });
      }
    } else if (type === 'group' && !name) {
      return next(new AppError('Group conversation must have a name', 400));
    }

    const conversation = await Conversation.create({
      type,
      name,
      participants: allParticipants,
      unreadCounts: allParticipants.reduce((acc, curr) => {
        acc[curr] = 0;
        return acc;
      }, {})
    });

    const populatedConv = await Conversation.findById(conversation._id)
      .populate('participants', 'firstName lastName profileImage role');

    res.status(201).json({
      status: 'success',
      data: populatedConv
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get paginated messages for a conversation
 * @route GET /api/messages/:conversationId/messages
 */
exports.getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = (page - 1) * limit;

    const conversation = await Conversation.findById(conversationId);
    
    if (!conversation) {
      return next(new AppError('Conversation not found', 404));
    }

    // Check if user is participant
    if (!conversation.participants.includes(req.user._id)) {
      return next(new AppError('Not authorized to access this conversation', 403));
    }

    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'firstName lastName profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Mark unread messages as read
    await Message.updateMany(
      { 
        conversation: conversationId,
        sender: { $ne: req.user._id },
        isRead: false
      },
      { 
        $set: { isRead: true },
        $addToSet: { readBy: req.user._id }
      }
    );

    res.status(200).json({
      status: 'success',
      results: messages.length,
      data: messages
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Send a message
 * @route POST /api/messages/:conversationId/messages
 */
exports.sendMessage = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { content, type = 'text', attachments } = req.body;

    if (!content && (!attachments || attachments.length === 0)) {
      return next(new AppError('Message must have content or attachments', 400));
    }

    const conversation = await Conversation.findById(conversationId);
    
    if (!conversation) {
      return next(new AppError('Conversation not found', 404));
    }

    if (!conversation.participants.includes(req.user._id)) {
      return next(new AppError('Not authorized to send message to this conversation', 403));
    }

    const message = await Message.create({
      conversation: conversationId,
      sender: req.user._id,
      content,
      type,
      attachments
    });

    // Update conversation lastMessage
    conversation.lastMessage = {
      content: content || 'Attachment',
      sender: req.user._id,
      timestamp: Date.now()
    };
    await conversation.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'firstName lastName profileImage');

    // Emit socket event to other participants
    if (req.app.get('io')) {
      const io = req.app.get('io');
      conversation.participants.forEach(participantId => {
        if (participantId.toString() !== req.user._id.toString()) {
          io.to(participantId.toString()).emit('message:new', populatedMessage);
        }
      });
    }

    res.status(201).json({
      status: 'success',
      data: populatedMessage
    });
  } catch (error) {
    next(error);
  }
};
