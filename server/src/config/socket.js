const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

let io;

/**
 * Initialize Socket.IO server
 * @param {Object} server - HTTP Server instance
 * @returns {Object} io instance
 */
const initSocket = (server) => {
  const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  io = new Server(server, {
    cors: {
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin) || /^https:\/\/[^/]+\.onrender\.com$/.test(origin)) {
          return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
      },
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Authentication middleware
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token || (socket.handshake.headers.cookie && getCookieToken(socket.handshake.headers.cookie));
      if (!token) {
        return next(new Error('Authentication error: Token missing'));
      }

      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected to socket: ${socket.id}, User ID: ${socket.user.id}`);

    // Join a room based on user ID for private messages/notifications
    socket.join(socket.user.id);

    socket.on('disconnect', () => {
      console.log(`User disconnected from socket: ${socket.id}`);
    });
  });

  return io;
};

/**
 * Extract token from cookie string
 * @param {string} cookieString
 * @returns {string|null} token
 */
const getCookieToken = (cookieString) => {
  const match = cookieString.match(new RegExp('(^| )accessToken=([^;]+)'));
  if (match) return match[2];
  return null;
};

/**
 * Get Socket.IO instance
 * @returns {Object} io instance
 */
const getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

module.exports = { initSocket, getIo };
