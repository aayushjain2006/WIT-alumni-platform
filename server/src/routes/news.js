const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { protect, authorize } = require('../middleware/auth'); 

router.route('/')
  .get(newsController.getNews)
  .post(protect, authorize('admin'), newsController.createNews);

router.route('/:id')
  .get(newsController.getNewsArticle)
  .put(protect, authorize('admin'), newsController.updateNews)
  .delete(protect, authorize('admin'), newsController.deleteNews);

module.exports = router;
