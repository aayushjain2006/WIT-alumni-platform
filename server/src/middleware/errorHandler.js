/**
 * Custom Error class for operational errors
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Make a copy of the error object
  let error = { ...err };
  error.message = err.message;
  error.name = err.name;

  // 1. Mongoose bad ObjectId
  if (error.name === 'CastError') {
    const message = `Invalid ${error.path}: ${error.value}.`;
    error = new AppError(message, 400);
  }

  // 2. Mongoose duplicate key error
  if (error.code === 11000) {
    const value = Object.values(error.keyValue)[0];
    const message = `Duplicate field value: '${value}'. Please use another value.`;
    error = new AppError(message, 400);
  }

  // 3. Mongoose validation error
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    error = new AppError(message, 400);
  }

  // 4. JWT errors
  if (error.name === 'JsonWebTokenError') {
    const message = 'Invalid token. Please log in again!';
    error = new AppError(message, 401);
  }

  if (error.name === 'TokenExpiredError') {
    const message = 'Your token has expired! Please log in again.';
    error = new AppError(message, 401);
  }

  // 5. Multer error
  if (error.name === 'MulterError') {
    const message = `Upload error: ${error.message}`;
    error = new AppError(message, 400);
  }

  // Send response
  if (process.env.NODE_ENV === 'development') {
    res.status(error.statusCode).json({
      status: error.status,
      error: err,
      message: error.message,
      stack: err.stack
    });
  } else {
    // Production: don't leak error details for non-operational errors
    if (error.isOperational) {
      res.status(error.statusCode).json({
        status: error.status,
        message: error.message
      });
    } else {
      // Log error for developers
      console.error('ERROR 💥', err);
      // Send generic message
      res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!'
      });
    }
  }
};

module.exports = {
  AppError,
  errorHandler
};
