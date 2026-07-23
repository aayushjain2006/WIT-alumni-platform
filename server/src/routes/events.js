const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

// Protected routes - all endpoints require authentication
router.use(protect);

router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEvent);


router.post('/:id/register', eventController.registerForEvent);
router.delete('/:id/register', eventController.unregisterFromEvent);

// Restricted to alumni and admin
router.post('/', authorize('alumni', 'admin'), eventController.createEvent);
router.put('/:id', authorize('alumni', 'admin'), eventController.updateEvent);
router.delete('/:id', authorize('alumni', 'admin'), eventController.deleteEvent);

module.exports = router;
