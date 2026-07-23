const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary } = require('../config/cloudinary');
const { AppError } = require('./errorHandler');

// Allowed image formats
const ALLOWED_FORMATS = ['jpg', 'jpeg', 'png', 'webp'];

// Filter for images only
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

// Storage for avatars
const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'alumni-platform/avatars',
    allowed_formats: ALLOWED_FORMATS,
    transformation: [{ width: 500, height: 500, crop: 'fill' }],
  },
});

// Storage for event images
const eventImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'alumni-platform/events',
    allowed_formats: ALLOWED_FORMATS,
    transformation: [{ width: 1200, height: 800, crop: 'limit' }],
  },
});

// Storage for stories
const storyImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'alumni-platform/stories',
    allowed_formats: ALLOWED_FORMATS,
    transformation: [{ width: 1080, height: 1080, crop: 'limit' }],
  },
});

// Middleware exports
const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).single('avatar');

const uploadEventImage = multer({
  storage: eventImageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single('image');

const uploadStoryImage = multer({
  storage: storyImageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single('image');

module.exports = {
  uploadAvatar,
  uploadEventImage,
  uploadStoryImage
};
