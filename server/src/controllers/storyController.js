const AlumniStory = require('../models/AlumniStory');
const { AppError } = require('../middleware/errorHandler');

/**
 * Get stories
 * @route GET /api/stories
 */
exports.getStories = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    let query = { status: 'published', verified: true };

    if (req.query.category) {
      query.category = req.query.category;
    }

    const stories = await AlumniStory.find(query)
      .populate('author', 'firstName lastName profileImage company jobTitle')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await AlumniStory.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: stories.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data: stories
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single story
 * @route GET /api/stories/:id
 */
exports.getStory = async (req, res, next) => {
  try {
    const story = await AlumniStory.findById(req.params.id)
      .populate('author', 'firstName lastName profileImage company jobTitle bio');

    if (!story) {
      return next(new AppError('Story not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: story
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a story
 * @route POST /api/stories
 */
exports.createStory = async (req, res, next) => {
  try {
    const { title, excerpt, content, category, tags, image } = req.body;

    const words = content.trim().split(/\s+/).length;
    const readTime = Math.ceil(words / 200);

    const story = await AlumniStory.create({
      title,
      excerpt,
      content,
      category,
      tags,
      image,
      author: req.user._id,
      readTime,
      status: 'pending' // requires admin approval
    });

    res.status(201).json({
      status: 'success',
      data: story
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle like on a story
 * @route POST /api/stories/:id/like
 */
exports.toggleLike = async (req, res, next) => {
  try {
    const story = await AlumniStory.findById(req.params.id);

    if (!story) {
      return next(new AppError('Story not found', 404));
    }

    const likeIndex = story.likes.indexOf(req.user._id);
    
    if (likeIndex === -1) {
      story.likes.push(req.user._id);
    } else {
      story.likes.splice(likeIndex, 1);
    }

    await story.save();

    res.status(200).json({
      status: 'success',
      data: story
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a story
 * @route PUT /api/stories/:id
 */
exports.updateStory = async (req, res, next) => {
  try {
    let story = await AlumniStory.findById(req.params.id);

    if (!story) {
      return next(new AppError('Story not found', 404));
    }

    // Check ownership or admin
    if (story.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to update this story', 403));
    }

    if (req.body.content) {
      const words = req.body.content.trim().split(/\s+/).length;
      req.body.readTime = Math.ceil(words / 200);
    }

    // Any user update sets status back to pending, unless it's admin
    if (req.user.role !== 'admin') {
      req.body.status = 'pending';
      req.body.verified = false;
    }

    story = await AlumniStory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('author', 'firstName lastName profileImage');

    res.status(200).json({
      status: 'success',
      data: story
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a story
 * @route DELETE /api/stories/:id
 */
exports.deleteStory = async (req, res, next) => {
  try {
    const story = await AlumniStory.findById(req.params.id);

    if (!story) {
      return next(new AppError('Story not found', 404));
    }

    if (story.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to delete this story', 403));
    }

    await story.deleteOne();

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};
