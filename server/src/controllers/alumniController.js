const User = require('../models/User');
const Connection = require('../models/Connection');
const Notification = require('../models/Notification');
const { AppError } = require('../middleware/errorHandler');

/**
 * Search Alumni
 */
const searchAlumni = async (req, res, next) => {
  try {
    const { search, industry, location, department, graduationYear, sortBy, page = 1, limit = 10 } = req.query;

    const query = { role: 'alumni', status: 'active' };

    if (search) {
      query.$text = { $search: search };
    }
    if (industry) {
      // Assuming 'industry' maps to 'company' or a similar field if it existed, but we have 'company'
      query.company = new RegExp(industry, 'i');
    }
    if (location) {
      query.location = new RegExp(location, 'i');
    }
    if (department) {
      query.department = department;
    }
    if (graduationYear) {
      query.graduationYear = graduationYear;
    }

    let sortOption = { createdAt: -1 };
    if (sortBy === 'name') {
      sortOption = { firstName: 1, lastName: 1 };
    } else if (sortBy === 'graduationYear') {
      sortOption = { graduationYear: -1 };
    } else if (sortBy === 'rating') {
      sortOption = { rating: -1 };
    }

    const skip = (page - 1) * limit;

    const alumni = await User.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-password -refreshToken');

    const total = await User.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: alumni.length,
      data: {
        alumni,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get Alumni Profile
 */
const getAlumniProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id, role: 'alumni', status: 'active' })
      .select('-password -refreshToken');

    if (!user) return next(new AppError('Alumni not found', 404));

    // Optional: fetch connections count or other stats if needed
    
    res.status(200).json({
      status: 'success',
      data: { alumni: user }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Send Connection Request
 */
const sendConnectionRequest = async (req, res, next) => {
  try {
    const recipientId = req.params.id;
    const requesterId = req.user.id;

    if (recipientId === requesterId) {
      return next(new AppError('You cannot connect with yourself', 400));
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) return next(new AppError('User not found', 404));

    const existingConnection = await Connection.findOne({
      $or: [
        { requester: requesterId, recipient: recipientId },
        { requester: recipientId, recipient: requesterId }
      ]
    });

    if (existingConnection) {
      return next(new AppError('Connection request already exists or you are already connected', 400));
    }

    const newConnection = await Connection.create({
      requester: requesterId,
      recipient: recipientId,
      status: 'pending',
      message: req.body.message || ''
    });

    // Create notification
    await Notification.create({
      user: recipientId,
      type: 'connection_request',
      title: 'New Connection Request',
      description: 'You have a new connection request.',
      relatedUser: requesterId
    });

    res.status(201).json({
      status: 'success',
      data: { connection: newConnection }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get Connections
 */
const getConnections = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const connections = await Connection.find({
      $or: [
        { requester: userId },
        { recipient: userId }
      ]
    }).populate('requester recipient', 'firstName lastName profileImage headline role company jobTitle');

    res.status(200).json({
      status: 'success',
      results: connections.length,
      data: { connections }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Respond to Connection Request
 */
const respondToConnection = async (req, res, next) => {
  try {
    const connectionId = req.params.id;
    const { status } = req.body; // 'accepted' or 'declined'

    if (!['accepted', 'declined'].includes(status)) {
      return next(new AppError('Invalid status', 400));
    }

    const connection = await Connection.findOne({
      _id: connectionId,
      recipient: req.user.id,
      status: 'pending'
    });

    if (!connection) {
      return next(new AppError('Connection request not found or already processed', 404));
    }

    connection.status = status;
    await connection.save();

    if (status === 'accepted') {
      await Notification.create({
        user: connection.requester,
        type: 'connection_accepted',
        title: 'Connection Accepted',
        description: 'Your connection request was accepted.',
        relatedUser: req.user.id
      });
    }

    res.status(200).json({
      status: 'success',
      data: { connection }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  searchAlumni,
  getAlumniProfile,
  sendConnectionRequest,
  getConnections,
  respondToConnection
};
