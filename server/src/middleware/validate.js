const { AppError } = require('./errorHandler');

/**
 * Generic Joi validation middleware factory
 * @param {Object} schema - Joi schema object
 * @param {string} property - Request property to validate ('body', 'query', 'params')
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false, // Return all errors
      stripUnknown: true, // Remove unknown keys
    });

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      return next(new AppError(errorMessage, 400));
    }

    // Overwrite the request property with validated and sanitized value
    req[property] = value;
    next();
  };
};

module.exports = { validate };
