const express = require('express');
const router = express.Router();
const mentorshipController = require('../controllers/mentorshipController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/mentors', mentorshipController.getMentors);
router.get('/mentees', authorize('alumni', 'admin'), mentorshipController.getMyMentees);

router.put('/availability', authorize('alumni'), mentorshipController.updateAvailability);

router.post('/sessions', authorize('alumni'), mentorshipController.scheduleSession);
router.put('/sessions/:id', mentorshipController.updateSession);

module.exports = router;
