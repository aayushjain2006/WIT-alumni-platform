const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['message', 'connection_request', 'connection_accepted', 'event', 'event_reminder', 'job', 'system'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  isRead: {
    type: Boolean,
    default: false
  },
  actionUrl: String,
  avatar: String,
  metadata: mongoose.Schema.Types.Mixed,
  relatedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
