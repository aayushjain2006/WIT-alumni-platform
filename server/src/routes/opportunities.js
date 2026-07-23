const express = require('express');
const router = express.Router();
const opportunityController = require('../controllers/opportunityController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', opportunityController.getOpportunities);
router.get('/:id', opportunityController.getOpportunity);

router.post('/:id/apply', authorize('student'), opportunityController.applyForOpportunity);
router.post('/:id/bookmark', opportunityController.bookmarkOpportunity);

router.post('/', authorize('alumni', 'admin'), opportunityController.createOpportunity);
router.put('/:id', authorize('alumni', 'admin'), opportunityController.updateOpportunity);
router.patch('/:id/status', authorize('alumni', 'admin'), opportunityController.updateOpportunityStatus);
router.delete('/:id', authorize('alumni', 'admin'), opportunityController.deleteOpportunity);

module.exports = router;
