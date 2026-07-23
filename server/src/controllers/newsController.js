const NewsArticle = require('../models/NewsArticle');
const { AppError } = require('../middleware/errorHandler');

/**
 * Get published news
 * @route GET /api/news
 */
exports.getNews = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    let query = { status: 'published' };

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { content: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    if (req.query.tags) {
      const tagsArray = req.query.tags.split(',');
      query.tags = { $in: tagsArray };
    }

    const news = await NewsArticle.find(query)
      .populate('author', 'firstName lastName profileImage')
      .sort({ publishedDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await NewsArticle.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: news.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data: news
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single news article
 * @route GET /api/news/:id
 */
exports.getNewsArticle = async (req, res, next) => {
  try {
    const news = await NewsArticle.findById(req.params.id)
      .populate('author', 'firstName lastName profileImage');

    if (!news) {
      return next(new AppError('News article not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: news
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create news (Admin only)
 * @route POST /api/news
 */
exports.createNews = async (req, res, next) => {
  try {
    const { title, excerpt, content, category, tags, image, priority, status } = req.body;

    if (!title || !content || !category) {
      return next(new AppError('Please provide title, content and category', 400));
    }

    // Auto-calculate read time (assuming ~200 words per minute)
    const words = content.trim().split(/\s+/).length;
    const readTime = Math.ceil(words / 200);

    const news = await NewsArticle.create({
      title,
      excerpt,
      content,
      category,
      tags,
      image,
      priority,
      status: status || 'draft',
      author: req.user._id,
      readTime,
      publishedDate: status === 'published' ? Date.now() : undefined
    });

    res.status(201).json({
      status: 'success',
      data: news
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update news (Admin only)
 * @route PUT /api/news/:id
 */
exports.updateNews = async (req, res, next) => {
  try {
    let news = await NewsArticle.findById(req.params.id);

    if (!news) {
      return next(new AppError('News article not found', 404));
    }

    if (req.body.content) {
      const words = req.body.content.trim().split(/\s+/).length;
      req.body.readTime = Math.ceil(words / 200);
    }

    if (req.body.status === 'published' && news.status !== 'published') {
      req.body.publishedDate = Date.now();
    }

    news = await NewsArticle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('author', 'firstName lastName profileImage');

    res.status(200).json({
      status: 'success',
      data: news
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete news (Admin only)
 * @route DELETE /api/news/:id
 */
exports.deleteNews = async (req, res, next) => {
  try {
    const news = await NewsArticle.findById(req.params.id);

    if (!news) {
      return next(new AppError('News article not found', 404));
    }

    await news.deleteOne();

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};
