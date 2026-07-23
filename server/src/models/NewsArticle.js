const mongoose = require('mongoose');

const newsArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  excerpt: String,
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Campus Updates', 'Alumni Success', 'Student Life', 'Academic', 'Student Achievement', 'Alumni Network', 'Financial Aid'],
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  publishedDate: Date,
  readTime: Number,
  image: String,
  tags: [String],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  commentsCount: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['published', 'draft', 'archived'],
    default: 'draft'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('NewsArticle', newsArticleSchema);
