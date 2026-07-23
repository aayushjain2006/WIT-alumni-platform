const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const { protect } = require('../middleware/auth');

router.get('/campaigns', donationController.getCampaigns);

router.use(protect);

router.post('/checkout', donationController.createOrder);
router.post('/verify', donationController.verifyPayment);
router.get('/history', donationController.getDonationHistory);

module.exports = router;
