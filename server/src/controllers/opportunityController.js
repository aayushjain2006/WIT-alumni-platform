const Opportunity = require('../models/Opportunity');
const Notification = require('../models/Notification');
const { AppError } = require('../middleware/errorHandler');
const Joi = require('joi');

const opportunitySchema = Joi.object({
  title: Joi.string().required().trim(),
  type: Joi.string().valid('job', 'internship', 'project', 'full-time', 'part-time', 'contract').required(),
  company: Joi.string().required(),
  companyLogo: Joi.string().optional(),
  location: Joi.string().optional(),
  category: Joi.string().optional(),
  experience: Joi.string().optional(),
  salary: Joi.string().optional(),
  stipend: Joi.string().optional(),
  duration: Joi.string().optional(),
  description: Joi.string().required(),
  skills: Joi.array().items(Joi.string()).optional(),
  remote: Joi.boolean().optional(),
  urgent: Joi.boolean().optional(),
  deadline: Joi.date().optional()
});

/**
 * Get opportunities with filters and pagination
 * GET /api/opportunities
 */
exports.getOpportunities = async (req, res, next) => {
  try {
    const { type, remote, category, search, page = 1, limit = 10 } = req.query;
    const query = { status: 'active' };

    if (type) query.type = type;
    if (remote !== undefined) query.remote = remote === 'true';
    if (category) query.category = category;
    
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (page - 1) * limit;

    const opportunities = await Opportunity.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('postedBy', 'firstName lastName profileImage company');

    const total = await Opportunity.countDocuments(query);

    // Add isBookmarked flag
    const data = opportunities.map(opp => {
      const oppObj = opp.toObject();
      oppObj.isBookmarked = opp.bookmarkedBy && opp.bookmarkedBy.includes(req.user.id);
      return oppObj;
    });

    res.status(200).json({
      status: 'success',
      results: opportunities.length,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get opportunity by ID
 * GET /api/opportunities/:id
 */
exports.getOpportunity = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id)
      .populate('postedBy', 'firstName lastName profileImage company jobTitle role')
      .populate('applications.userId', 'firstName lastName profileImage email role');

    if (!opportunity) {
      return next(new AppError('Opportunity not found', 404));
    }

    // Increment views
    opportunity.views += 1;
    await opportunity.save();

    const isBookmarked = opportunity.bookmarkedBy && opportunity.bookmarkedBy.includes(req.user.id);
    let hasApplied = false;
    if (opportunity.applications) {
      hasApplied = opportunity.applications.some(app => app.userId._id.toString() === req.user.id);
    }

    const oppObj = opportunity.toObject();
    oppObj.isBookmarked = isBookmarked;
    oppObj.hasApplied = hasApplied;

    res.status(200).json({
      status: 'success',
      data: oppObj
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new opportunity
 * POST /api/opportunities
 */
exports.createOpportunity = async (req, res, next) => {
  try {
    const { error, value } = opportunitySchema.validate(req.body);
    if (error) {
      return next(new AppError(`Validation error: ${error.details.map(x => x.message).join(', ')}`, 400));
    }

    const newOpp = await Opportunity.create({
      ...value,
      postedBy: req.user.id
    });

    res.status(201).json({
      status: 'success',
      data: newOpp
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update opportunity
 * PUT /api/opportunities/:id
 */
exports.updateOpportunity = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return next(new AppError('Opportunity not found', 404));
    }

    if (opportunity.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to update this opportunity', 403));
    }

    const { error, value } = opportunitySchema.validate(req.body, { allowUnknown: true });
    if (error) {
      return next(new AppError(`Validation error: ${error.details.map(x => x.message).join(', ')}`, 400));
    }

    const updatedOpp = await Opportunity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: updatedOpp
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update opportunity status
 * PATCH /api/opportunities/:id/status
 */
exports.updateOpportunityStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['active', 'paused', 'expired', 'draft'].includes(status)) {
      return next(new AppError('Invalid status value', 400));
    }

    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return next(new AppError('Opportunity not found', 404));
    }

    if (opportunity.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to update status', 403));
    }

    opportunity.status = status;
    await opportunity.save();

    res.status(200).json({
      status: 'success',
      data: opportunity
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an opportunity
 * DELETE /api/opportunities/:id
 */
exports.deleteOpportunity = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return next(new AppError('Opportunity not found', 404));
    }

    if (opportunity.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to delete this opportunity', 403));
    }

    await opportunity.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Opportunity deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Apply for opportunity
 * POST /api/opportunities/:id/apply
 */
exports.applyForOpportunity = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return next(new AppError('Opportunity not found', 404));
    }

    if (opportunity.status !== 'active') {
      return next(new AppError('Opportunity is not active', 400));
    }

    // Only allow students? Based on requirements: "Only students." Wait, some alumni might apply. But prompt says "Only students. Add to applications array." The routing will restrict to students. Let's do a double check.
    if (req.user.role !== 'student') {
      return next(new AppError('Only students can apply for opportunities', 403));
    }

    // Check duplicate
    const hasApplied = opportunity.applications.some(app => app.userId.toString() === req.user.id);
    if (hasApplied) {
      return next(new AppError('You have already applied for this opportunity', 400));
    }

    opportunity.applications.push({
      userId: req.user.id,
      resume: req.body.resume || ''
    });

    await opportunity.save();

    // Notify poster
    if (opportunity.postedBy.toString() !== req.user.id) {
      await Notification.create({
        recipient: opportunity.postedBy,
        sender: req.user.id,
        type: 'job',
        title: 'New Application',
        message: `Someone applied for your opportunity: ${opportunity.title}`,
        link: `/opportunities/${opportunity._id}/applications`
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Successfully applied'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Bookmark opportunity
 * POST /api/opportunities/:id/bookmark
 */
exports.bookmarkOpportunity = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return next(new AppError('Opportunity not found', 404));
    }

    const index = opportunity.bookmarkedBy.indexOf(req.user.id);
    let isBookmarked = false;

    if (index === -1) {
      opportunity.bookmarkedBy.push(req.user.id);
      isBookmarked = true;
    } else {
      opportunity.bookmarkedBy.splice(index, 1);
    }

    await opportunity.save();

    res.status(200).json({
      status: 'success',
      message: isBookmarked ? 'Opportunity bookmarked' : 'Opportunity unbookmarked',
      isBookmarked
    });
  } catch (error) {
    next(error);
  }
};
