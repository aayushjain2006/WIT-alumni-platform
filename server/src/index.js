require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/database');
const { configureCloudinary } = require('./config/cloudinary');
const { initSocket } = require('./config/socket');
const { apiLimiter } = require('./middleware/rateLimiter');
const { errorHandler, AppError } = require('./middleware/errorHandler');

// Import Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const alumniRoutes = require('./routes/alumni');
const eventRoutes = require('./routes/events');
const opportunityRoutes = require('./routes/opportunities');
const mentorshipRoutes = require('./routes/mentorship');
const messageRoutes = require('./routes/messages');
const newsRoutes = require('./routes/news');
const storyRoutes = require('./routes/stories');
const donationRoutes = require('./routes/donations');
const adminRoutes = require('./routes/admin');
const seedData = require('../seed/seedData');

// Initialize app and server
const app = express();
const server = http.createServer(app);

// Connect to MongoDB
const startServer = async () => {
  await connectDB();
  
  if (process.env.MONGODB_URI === 'memory' || process.env.USING_MEMORY_DB === 'true') {
    await seedData();
  }

  // Configure Cloudinary
  configureCloudinary();

  // Initialize Socket.io
  initSocket(server);



// --- Middleware ---

// Security Headers
app.use(helmet());

// CORS config
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser requests (curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      // Allow any *.onrender.com deployment of this app
      if (/^https:\/\/[^/]+\.onrender\.com$/.test(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Cookie parser
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// HTTP request logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Apply global rate limiter to all /api routes
app.use('/api', apiLimiter);

// --- Routes ---
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/alumni', alumniRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/opportunities', opportunityRoutes);
app.use('/api/v1/mentorship', mentorshipRoutes);
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/news', newsRoutes);
app.use('/api/v1/stories', storyRoutes);
app.use('/api/v1/donations', donationRoutes);
app.use('/api/v1/admin', adminRoutes);
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is healthy',
  });
});

// Handle unhandled routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(errorHandler);

// --- Start Server ---
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
};

startServer();

// --- Graceful Shutdown ---
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
