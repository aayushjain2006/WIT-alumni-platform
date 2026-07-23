const Razorpay = require('razorpay');
const crypto = require('crypto');
const Donation = require('../models/Donation');
const Campaign = require('../models/Campaign');
const Notification = require('../models/Notification');
const { AppError } = require('../middleware/errorHandler');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder'
});

/**
 * Get active campaigns
 * @route GET /api/donations/campaigns
 */
exports.getCampaigns = async (req, res, next) => {
  try {
    const campaigns = await Campaign.find({ status: 'active' }).sort({ endDate: 1 });

    res.status(200).json({
      status: 'success',
      results: campaigns.length,
      data: campaigns
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create checkout order
 * @route POST /api/donations/checkout
 */
exports.createOrder = async (req, res, next) => {
  try {
    const { campaignId, amount, type } = req.body;

    if (!campaignId || !amount || !type) {
      return next(new AppError('Please provide campaignId, amount and type', 400));
    }

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return next(new AppError('Campaign not found', 404));
    }

    const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      return next(new AppError('Error creating Razorpay order', 500));
    }

    // Create pending donation record
    const donation = await Donation.create({
      user: req.user._id,
      campaign: campaignId,
      amount,
      type,
      razorpayOrderId: order.id,
      receiptNumber: options.receipt
    });

    res.status(201).json({
      status: 'success',
      orderId: order.id,
      key: process.env.RAZORPAY_KEY_ID,
      donationId: donation._id
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify Razorpay payment
 * @route POST /api/donations/verify
 */
exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder')
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Find donation and update status
      const donation = await Donation.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { 
          status: 'completed',
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature
        },
        { new: true }
      );

      if (!donation) {
        return next(new AppError('Donation record not found', 404));
      }

      // Update Campaign
      await Campaign.findByIdAndUpdate(donation.campaign, {
        $inc: { raised: donation.amount, donorCount: 1 }
      });

      // Create Notification
      await Notification.create({
        user: donation.user,
        type: 'system',
        title: 'Donation Successful',
        description: `Thank you for your generous donation of ₹${donation.amount}.`
      });

      res.status(200).json({
        status: 'success',
        message: 'Payment verified successfully'
      });
    } else {
      res.status(400).json({
        status: 'fail',
        message: 'Invalid signature'
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get User's Donation History
 * @route GET /api/donations/history
 */
exports.getDonationHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const donations = await Donation.find({ user: req.user._id })
      .populate('campaign', 'title category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Donation.countDocuments({ user: req.user._id });

    res.status(200).json({
      status: 'success',
      results: donations.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data: donations
    });
  } catch (error) {
    next(error);
  }
};
