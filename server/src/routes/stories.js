const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(storyController.getStories)
  .post(protect, storyController.createStory);

router.route('/:id')
  .get(storyController.getStory)
  .put(protect, storyController.updateStory)
  .delete(protect, storyController.deleteStory);

router.post('/:id/like', protect, storyController.toggleLike);

module.exports = router;
