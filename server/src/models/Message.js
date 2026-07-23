const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema({
  url: String,
  name: String,
  type: String,
  size: Number
}, { _id: false });

const messageSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: String,
  type: {
    type: String,
    enum: ['text', 'file', 'inquiry'],
    default: 'text'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  attachments: [attachmentSchema]
}, {
  timestamps: true
});

messageSchema.index({ conversation: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);
