const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: String,
  goal: {
    type: Number,
    required: true
  },
  raised: {
    type: Number,
    default: 0
  },
  donorCount: {
    type: Number,
    default: 0
  },
  endDate: {
    type: Date,
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  image: String,
  urgency: {
    type: String,
    enum: ['high', 'medium', 'low']
  },
  impact: String,
  status: {
    type: String,
    enum: ['active', 'completed', 'paused'],
    default: 'active'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

campaignSchema.virtual('daysLeft').get(function() {
  if (!this.endDate) return 0;
  const now = new Date();
  const diffTime = this.endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
});

campaignSchema.virtual('progress').get(function() {
  if (!this.goal || this.goal === 0) return 0;
  return Math.min(100, Math.round((this.raised / this.goal) * 100));
});

module.exports = mongoose.model('Campaign', campaignSchema);
