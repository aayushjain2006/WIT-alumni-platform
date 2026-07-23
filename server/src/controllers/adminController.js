const User = require('../models/User');
const AlumniStory = require('../models/AlumniStory');
const Opportunity = require('../models/Opportunity');
const Broadcast = require('../models/Broadcast');
const Notification = require('../models/Notification');
const Event = require('../models/Event');
const Donation = require('../models/Donation');
const { AppError } = require('../middleware/errorHandler');

/**
 * Get Users (Paginated & filtered)
 */
exports.getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    let query = {};
    if (req.query.role) query.role = req.query.role;
    if (req.query.status) query.status = req.query.status;
    if (req.query.department) query.department = req.query.department;
    if (req.query.search) {
      query.$or = [
        { firstName: { $regex: req.query.search, $options: 'i' } },
        { lastName: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const users = await User.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await User.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: users.length,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      data: users
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update User Status
 */
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['active', 'suspended', 'pending'].includes(status)) {
      return next(new AppError('Invalid status', 400));
    }

    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!user) return next(new AppError('User not found', 404));

    await Notification.create({
      user: user._id,
      type: 'system',
      title: 'Account Status Updated',
      description: `Your account status has been updated to ${status}.`
    });

    res.status(200).json({ status: 'success', data: user });
  } catch (error) {
    next(error);
  }
};

/**
 * Create User
 */
exports.createUser = async (req, res, next) => {
  try {
    // Basic implementation. Note: Password should ideally be generated or sent via email link.
    const tempPassword = Math.random().toString(36).slice(-8);
    const userData = { ...req.body, password: tempPassword, isVerified: true, status: 'active' };
    
    const user = await User.create(userData);
    
    // Simulate email sending
    console.log(`Welcome email sent to ${user.email} with password: ${tempPassword}`);

    res.status(201).json({ status: 'success', data: user });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Moderation Queue
 */
exports.getModerationQueue = async (req, res, next) => {
  try {
    const pendingStories = await AlumniStory.find({ status: 'pending' }).populate('author', 'firstName lastName email');
    const pendingOpportunities = await Opportunity.find({ status: 'draft' }).populate('postedBy', 'firstName lastName email'); // Or whatever pending status is

    res.status(200).json({
      status: 'success',
      data: {
        stories: pendingStories,
        opportunities: pendingOpportunities
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Review Content
 */
exports.reviewContent = async (req, res, next) => {
  try {
    const { type, action, reason } = req.body;
    const { id } = req.params;

    if (!['story', 'opportunity'].includes(type) || !['approve', 'reject'].includes(action)) {
      return next(new AppError('Invalid type or action', 400));
    }

    const status = action === 'approve' ? (type === 'story' ? 'published' : 'active') : 'rejected'; // Adjust mapping as needed

    let doc;
    if (type === 'story') {
      doc = await AlumniStory.findByIdAndUpdate(id, { status, verified: action === 'approve' }, { new: true });
      if (doc) {
        await Notification.create({
          user: doc.author,
          type: 'system',
          title: `Story ${action}d`,
          description: `Your story "${doc.title}" has been ${action}d. ${reason ? 'Reason: ' + reason : ''}`
        });
      }
    } else {
      doc = await Opportunity.findByIdAndUpdate(id, { status }, { new: true });
      if (doc) {
        await Notification.create({
          user: doc.postedBy,
          type: 'system',
          title: `Opportunity ${action}d`,
          description: `Your opportunity "${doc.title}" has been ${action}d. ${reason ? 'Reason: ' + reason : ''}`
        });
      }
    }

    if (!doc) return next(new AppError('Document not found', 404));

    res.status(200).json({ status: 'success', data: doc });
  } catch (error) {
    next(error);
  }
};

/**
 * Send Broadcast
 */
exports.sendBroadcast = async (req, res, next) => {
  try {
    const { title, message, type, targetRoles } = req.body;

    const broadcast = await Broadcast.create({
      title, message, type, targetRoles, sentBy: req.user._id
    });

    const query = targetRoles && targetRoles.length > 0 ? { role: { $in: targetRoles } } : {};
    const users = await User.find(query).select('_id');
    
    const notifications = users.map(u => ({
      user: u._id,
      type: 'system',
      title: `Broadcast: ${title}`,
      description: message
    }));
    await Notification.insertMany(notifications);

    if (req.app.get('io')) {
      req.app.get('io').emit('broadcast:new', broadcast);
    }

    res.status(201).json({ status: 'success', data: broadcast });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Analytics
 */
exports.getAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const students = await User.countDocuments({ role: 'student' });
    const alumni = await User.countDocuments({ role: 'alumni' });
    const totalEvents = await Event.countDocuments();
    const activeOpportunities = await Opportunity.countDocuments({ status: 'active' });
    const donations = await Donation.aggregate([{ $match: { status: 'completed' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]);
    const newUsersMonth = await User.countDocuments({ createdAt: { $gte: new Date(new Date().setDate(1)) } });

    res.status(200).json({
      status: 'success',
      data: {
        users: { total: totalUsers, students, alumni, newThisMonth: newUsersMonth },
        events: { total: totalEvents },
        opportunities: { active: activeOpportunities },
        donations: { totalRaised: donations.length ? donations[0].total : 0 }
      }
    });
  } catch (error) {
    next(error);
  }
};
