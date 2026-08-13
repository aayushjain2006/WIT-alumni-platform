const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');
const Joi = require('joi');

const profileUpdateSchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  department: Joi.string().valid('CSE', 'ECM', 'IT', 'ENTC', 'MECH AND AUTOMATION', 'CIVIL', 'AIML'),
  graduationYear: Joi.number(),
  company: Joi.string().allow(''),
  jobTitle: Joi.string().allow(''),
  location: Joi.string().allow(''),
  bio: Joi.string().allow(''),
  skills: Joi.array().items(Joi.string()),
  phone: Joi.string().allow(''),
  website: Joi.string().allow(''),
  linkedin: Joi.string().allow(''),
  github: Joi.string().allow(''),
  twitter: Joi.string().allow(''),
  mentoring: Joi.boolean(),
  preferredContact: Joi.array().items(Joi.string()),
  willingToHelp: Joi.array().items(Joi.string()),
  isProfileComplete: Joi.boolean()
});

/**
 * Update user profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const { error, value } = profileUpdateSchema.validate(req.body, { stripUnknown: true });
    if (error) return next(new AppError(error.details[0].message, 400));

    // Check if key fields are filled
    let isProfileComplete = false;
    const userToUpdate = await User.findById(req.user.id);
    
    // Honor the client's explicit intent when provided (e.g. "Skip for now")
    if (value.isProfileComplete !== undefined) {
      isProfileComplete = value.isProfileComplete;
    } else {
      const mergedData = { ...userToUpdate.toObject(), ...value };
      if (mergedData.company && mergedData.jobTitle && mergedData.location && mergedData.bio) {
        isProfileComplete = true;
      }
    }
    
    value.isProfileComplete = isProfileComplete;

    const user = await User.findByIdAndUpdate(req.user.id, value, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: { user: user.toPublicJSON() }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Upload Avatar
 */
const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError('Please upload an image file', 400));
    }
    
    // Cloudinary returns the URL in req.file.path if using multer-storage-cloudinary
    const avatarUrl = req.file.path;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profileImage: avatarUrl },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      data: { user: user.toPublicJSON() }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update Settings (Stub for now, or minimal fields)
 */
const updateSettings = async (req, res, next) => {
  try {
    // Assuming settings might go into metadata or specific fields
    const { mentoring, preferredContact, willingToHelp } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { mentoring, preferredContact, willingToHelp },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      data: { user: user.toPublicJSON() }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Soft delete account
 */
const deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { status: 'suspended' });

    res.status(200).json({
      status: 'success',
      message: 'Account deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get public profile
 */
const getPublicProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError('User not found', 404));

    if (user.status !== 'active') {
      return next(new AppError('User account is not active', 400));
    }

    res.status(200).json({
      status: 'success',
      data: { user: user.toPublicJSON() }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  updateProfile,
  uploadAvatar,
  updateSettings,
  deleteAccount,
  getPublicProfile
};
