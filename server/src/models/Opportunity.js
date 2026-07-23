const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  appliedDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'shortlisted', 'rejected'],
    default: 'pending'
  },
  resume: String
});

const opportunitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['job', 'internship', 'project', 'full-time', 'part-time', 'contract'],
    required: true
  },
  company: {
    type: String,
    required: true
  },
  companyLogo: String,
  location: String,
  category: String,
  experience: String,
  salary: String,
  stipend: String,
  duration: String,
  description: {
    type: String,
    required: true
  },
  skills: [String],
  remote: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  urgent: {
    type: Boolean,
    default: false
  },
  deadline: Date,
  status: {
    type: String,
    enum: ['active', 'paused', 'expired', 'draft'],
    default: 'active'
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  applications: [applicationSchema],
  views: {
    type: Number,
    default: 0
  },
  bookmarkedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

opportunitySchema.index({ title: 'text', company: 'text', description: 'text', skills: 'text' });

module.exports = mongoose.model('Opportunity', opportunitySchema);
