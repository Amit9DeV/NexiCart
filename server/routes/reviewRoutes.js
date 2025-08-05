const express = require('express');
const {
  getProductReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');

const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .post(protect, createReview);

router.route('/product/:productId')
  .get(getProductReviews);

router.route('/:id')
  .get(getReview)
  .put(protect, updateReview)
  .delete(protect, deleteReview);

module.exports = router;
