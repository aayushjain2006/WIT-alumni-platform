const mongoose = require('mongoose');

const mentorshipSessionSchema = new mongoose.Schema({
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mentee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['video', 'phone'],
    required: true
  },
  topic: String,
  status: {
    type: String,
    enum: ['confirmed', 'pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  meetingLink: String,
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('MentorshipSession', mentorshipSessionSchema);
