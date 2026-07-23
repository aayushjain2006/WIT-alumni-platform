const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['one-time', 'recurring'],
    required: true
  },
  method: {
    type: String,
    default: 'razorpay'
  },
  status: {
    type: String,
    enum: ['completed', 'pending', 'failed', 'refunded'],
    default: 'pending'
  },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  receiptNumber: String
}, {
  timestamps: true
});

donationSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Donation', donationSchema);
