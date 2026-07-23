const Event = require('../models/Event');
const Notification = require('../models/Notification');
const { AppError } = require('../middleware/errorHandler');
const Joi = require('joi');

const eventSchema = Joi.object({
  title: Joi.string().required().trim(),
  description: Joi.string().required(),
  date: Joi.date().required(),
  time: Joi.string().required(),
  endDate: Joi.date().optional(),
  endTime: Joi.string().optional(),
  location: Joi.string().optional(),
  address: Joi.string().optional(),
  type: Joi.string().valid('Networking', 'Career', 'Entrepreneurship', 'Reunion', 'Workshop', 'Seminar').required(),
  category: Joi.string().valid('Social', 'Professional', 'Academic', 'Business').required(),
  capacity: Joi.number().min(1).required(),
  isVirtual: Joi.boolean().optional(),
  image: Joi.string().optional(),
  speakers: Joi.array().items(Joi.string()).optional(),
  agenda: Joi.array().items(
    Joi.object({
      time: Joi.string(),
      activity: Joi.string(),
      speaker: Joi.string()
    })
  ).optional(),
  registrationDeadline: Joi.date().optional(),
  ticketPrice: Joi.number().min(0).optional(),
  tags: Joi.array().items(Joi.string()).optional()
});

/**
 * Get all events with filtering and pagination
 * GET /api/events
 */
exports.getEvents = async (req, res, next) => {
  try {
    const { type, category, search, virtual, status, time, page = 1, limit = 10 } = req.query;
    const query = {};

    if (type) query.type = type;
    if (category) query.category = category;
    if (virtual !== undefined) query.isVirtual = virtual === 'true';
    if (status) query.status = status;
    else query.status = { $ne: 'cancelled' }; // default don't show cancelled
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (time === 'upcoming') {
      query.date = { $gte: new Date() };
    } else if (time === 'past') {
      query.date = { $lt: new Date() };
    }

    const skip = (page - 1) * limit;

    const events = await Event.find(query)
      .sort({ date: 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('organizer', 'firstName lastName profileImage');

    const total = await Event.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: events.length,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      data: events
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single event by ID
 * GET /api/events/:id
 */
exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'firstName lastName profileImage company jobTitle')
      .populate('speakers')
      .populate('registeredUsers', 'firstName lastName profileImage');

    if (!event) {
      return next(new AppError('Event not found', 404));
    }

    let isRegistered = false;
    if (req.user && event.registeredUsers) {
      isRegistered = event.registeredUsers.some(user => user._id.toString() === req.user.id);
    }

    res.status(200).json({
      status: 'success',
      data: {
        event,
        isRegistered
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new event
 * POST /api/events
 */
exports.createEvent = async (req, res, next) => {
  try {
    const { error, value } = eventSchema.validate(req.body);
    if (error) {
      return next(new AppError(`Validation error: ${error.details.map(x => x.message).join(', ')}`, 400));
    }

    const newEvent = await Event.create({
      ...value,
      organizer: req.user.id
    });

    res.status(201).json({
      status: 'success',
      data: newEvent
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an event
 * PUT /api/events/:id
 */
exports.updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return next(new AppError('Event not found', 404));
    }

    // Check ownership or admin
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to update this event', 403));
    }

    // validate partial update
    const { error, value } = eventSchema.validate(req.body, { allowUnknown: true });
    if (error) {
      return next(new AppError(`Validation error: ${error.details.map(x => x.message).join(', ')}`, 400));
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: updatedEvent
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete (soft delete) an event
 * DELETE /api/events/:id
 */
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return next(new AppError('Event not found', 404));
    }

    // Check ownership or admin
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to delete this event', 403));
    }

    event.status = 'cancelled';
    await event.save();

    res.status(200).json({
      status: 'success',
      message: 'Event cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Register for an event
 * POST /api/events/:id/register
 */
exports.registerForEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return next(new AppError('Event not found', 404));
    }

    if (event.status !== 'active') {
      return next(new AppError('Event is not active', 400));
    }

    // Check capacity
    if (event.registeredUsers.length >= event.capacity) {
      return next(new AppError('Event is full', 400));
    }

    // Check if already registered
    if (event.registeredUsers.includes(req.user.id)) {
      return next(new AppError('Already registered for this event', 400));
    }

    event.registeredUsers.push(req.user.id);
    await event.save();

    // Create Notification for organizer
    if (event.organizer.toString() !== req.user.id) {
      await Notification.create({
        recipient: event.organizer,
        sender: req.user.id,
        type: 'event',
        title: 'New Event Registration',
        message: `Someone just registered for your event: ${event.title}`,
        link: `/events/${event._id}`
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Successfully registered for event'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Unregister from an event
 * DELETE /api/events/:id/register
 */
exports.unregisterFromEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return next(new AppError('Event not found', 404));
    }

    const index = event.registeredUsers.indexOf(req.user.id);
    if (index === -1) {
      return next(new AppError('Not registered for this event', 400));
    }

    event.registeredUsers.splice(index, 1);
    await event.save();

    res.status(200).json({
      status: 'success',
      message: 'Successfully unregistered from event'
    });
  } catch (error) {
    next(error);
  }
};
