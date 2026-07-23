/**
 * Convert a string to a slug URL
 * @param {string} text 
 * @returns {string} slug
 */
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\\s+/g, '-')        // Replace spaces with -
    .replace(/[^\\w\\-]+/g, '')     // Remove all non-word chars
    .replace(/\\-\\-+/g, '-');      // Replace multiple - with single -
};

/**
 * Calculate estimated read time for content
 * @param {string} content 
 * @returns {number} read time in minutes
 */
const calculateReadTime = (content) => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\\s+/).length;
  const time = Math.ceil(words / wordsPerMinute);
  return time > 0 ? time : 1;
};

/**
 * Generate a random 6-digit OTP
 * @returns {string} 6-digit OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Helper to paginate Mongoose queries
 * @param {Object} query - Mongoose Query object
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {Object} result containing paginated data and metadata
 */
const paginateQuery = async (query, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const model = query.model;
  const total = await model.countDocuments(query.getFilter());
  
  const data = await query.skip(skip).limit(limit).exec();
  
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage,
      hasPrevPage
    }
  };
};

module.exports = {
  slugify,
  calculateReadTime,
  generateOTP,
  paginateQuery
};
