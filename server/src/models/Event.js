const mongoose = require('mongoose');

const agendaSchema = new mongoose.Schema({
  time: String,
  activity: String,
  speaker: String
}, { _id: false });

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  endDate: Date,
  endTime: String,
  location: String,
  address: String,
  type: {
    type: String,
    enum: ['Networking', 'Career', 'Entrepreneurship', 'Reunion', 'Workshop', 'Seminar'],
    required: true
  },
  category: {
    type: String,
    enum: ['Social', 'Professional', 'Academic', 'Business'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'draft', 'cancelled'],
    default: 'active'
  },
  capacity: {
    type: Number,
    required: true
  },
  registeredUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  attendedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isVirtual: {
    type: Boolean,
    default: false
  },
  image: String,
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  speakers: [String],
  agenda: [agendaSchema],
  registrationDeadline: Date,
  ticketPrice: {
    type: Number,
    default: 0
  },
  tags: [String],
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

eventSchema.virtual('registeredCount').get(function() {
  return this.registeredUsers ? this.registeredUsers.length : 0;
});

eventSchema.virtual('spotsLeft').get(function() {
  if (!this.capacity) return null;
  return Math.max(0, this.capacity - this.registeredCount);
});

module.exports = mongoose.model('Event', eventSchema);
