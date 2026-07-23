const User = require('../models/User');
const Connection = require('../models/Connection');
const MentorshipSession = require('../models/MentorshipSession');
const Notification = require('../models/Notification');
const { AppError } = require('../middleware/errorHandler');
const Joi = require('joi');

const sessionSchema = Joi.object({
  menteeId: Joi.string().required(),
  date: Joi.date().required(),
  duration: Joi.number().required(),
  type: Joi.string().valid('video', 'phone').required(),
  topic: Joi.string().optional(),
  meetingLink: Joi.string().optional(),
  notes: Joi.string().optional()
});

/**
 * Get mentors (alumni who opted into mentoring)
 * GET /api/mentorship/mentors
 */
exports.getMentors = async (req, res, next) => {
  try {
    const { department, skills, search, page = 1, limit = 10 } = req.query;
    const query = { role: 'alumni', mentoring: true };

    if (department) query.department = department;
    if (search) {
      query.$text = { $search: search };
    }
    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim());
      query.skills = { $in: skillsArray };
    }

    const skip = (page - 1) * limit;

    const mentors = await User.find(query)
      .select('firstName lastName profileImage company jobTitle location department skills rating responseRate connectionsHelped willingToHelp')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: mentors.length,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      data: mentors
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get my mentees (for alumni)
 * GET /api/mentorship/mentees
 */
exports.getMyMentees = async (req, res, next) => {
  try {
    const connections = await Connection.find({
      $or: [{ requester: req.user.id }, { recipient: req.user.id }],
      status: 'accepted',
      type: 'mentorship'
    }).populate('requester recipient', 'firstName lastName profileImage department graduationYear role email');

    const mentees = [];
    for (const conn of connections) {
      const isRequester = conn.requester._id.toString() === req.user.id;
      const otherUser = isRequester ? conn.recipient : conn.requester;

      // Ensure the other user is a student or we consider them a mentee
      const sessions = await MentorshipSession.find({
        mentor: req.user.id,
        mentee: otherUser._id
      }).sort({ date: -1 });

      mentees.push({
        user: otherUser,
        connectionId: conn._id,
        connectedAt: conn.updatedAt,
        sessions
      });
    }

    res.status(200).json({
      status: 'success',
      data: mentees
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Schedule a session (alumni only)
 * POST /api/mentorship/sessions
 */
exports.scheduleSession = async (req, res, next) => {
  try {
    const { error, value } = sessionSchema.validate(req.body);
    if (error) {
      return next(new AppError(`Validation error: ${error.details.map(x => x.message).join(', ')}`, 400));
    }

    const { menteeId, date, duration, type, topic, meetingLink, notes } = value;

    const session = await MentorshipSession.create({
      mentor: req.user.id,
      mentee: menteeId,
      date,
      duration,
      type,
      topic,
      meetingLink,
      notes,
      status: 'pending'
    });

    await Notification.create({
      recipient: menteeId,
      sender: req.user.id,
      type: 'mentorship',
      title: 'New Mentorship Session Scheduled',
      message: `A new session has been scheduled with you on ${new Date(date).toLocaleDateString()}`,
      link: `/mentorship/sessions/${session._id}`
    });

    res.status(201).json({
      status: 'success',
      data: session
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update session
 * PUT /api/mentorship/sessions/:id
 */
exports.updateSession = async (req, res, next) => {
  try {
    const { status, notes, meetingLink } = req.body;
    const session = await MentorshipSession.findById(req.params.id);

    if (!session) {
      return next(new AppError('Session not found', 404));
    }

    // Only mentor or mentee can update
    if (session.mentor.toString() !== req.user.id && session.mentee.toString() !== req.user.id) {
      return next(new AppError('Not authorized', 403));
    }

    if (status) session.status = status;
    if (notes !== undefined) session.notes = notes;
    if (meetingLink !== undefined) session.meetingLink = meetingLink;

    await session.save();

    res.status(200).json({
      status: 'success',
      data: session
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update availability
 * PUT /api/mentorship/availability
 */
exports.updateAvailability = async (req, res, next) => {
  try {
    const { mentoring, preferredContact, willingToHelp } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    if (mentoring !== undefined) user.mentoring = mentoring;
    if (preferredContact) user.preferredContact = preferredContact;
    if (willingToHelp) user.willingToHelp = willingToHelp;

    await user.save();

    res.status(200).json({
      status: 'success',
      data: {
        mentoring: user.mentoring,
        preferredContact: user.preferredContact,
        willingToHelp: user.willingToHelp
      }
    });
  } catch (error) {
    next(error);
  }
};
