const express = require('express');
const { updateProfile, uploadAvatar, updateSettings, deleteAccount, getPublicProfile } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { uploadAvatar: uploadAvatarMiddleware } = require('../middleware/upload'); 

const router = express.Router();

router.use(protect);

router.put('/profile', updateProfile);
router.post('/avatar', uploadAvatarMiddleware, uploadAvatar);
router.put('/settings', updateSettings);
router.delete('/account', deleteAccount);
router.get('/:id/profile', getPublicProfile);

module.exports = router;
