const jwt = require('jsonwebtoken');
const { verifyAccessToken } = require('../utils/tokens');
const { AppError } = require('./errorHandler');

/**
 * Protect routes - verify JWT
 */
const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return next(new AppError('You are not logged in. Please log in to get access.', 401));
    }

    const decoded = verifyAccessToken(token);
    
    // Attach user payload to request
    req.user = decoded;
    next();
  } catch (error) {
    return next(new AppError('Invalid or expired token. Please log in again.', 401));
  }
};

/**
 * Authorize specific roles
 * @param  {...string} roles - allowed roles (e.g., 'admin', 'alumni')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};

/**
 * Optional authentication - attach user if token present, but don't block
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (token) {
      const decoded = verifyAccessToken(token);
      req.user = decoded;
    }
    next();
  } catch (error) {
    // Ignore error, just proceed without req.user
    next();
  }
};

module.exports = { protect, authorize, optionalAuth };
