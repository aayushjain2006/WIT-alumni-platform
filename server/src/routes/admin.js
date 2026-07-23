const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.route('/users')
  .get(adminController.getUsers)
  .post(adminController.createUser);

router.put('/users/:id/status', adminController.updateUserStatus);

router.get('/moderation', adminController.getModerationQueue);
router.put('/moderation/:id', adminController.reviewContent);

router.post('/broadcast', adminController.sendBroadcast);
router.get('/analytics', adminController.getAnalytics);

module.exports = router;
