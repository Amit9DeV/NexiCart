const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  searchProducts,
  getHeroProducts,
  getFeaturedProducts,
  getNewArrivals,
  getCategories
} = require('../controllers/productController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, authorize('admin'), createProduct);

router.route('/search/:searchterm')
  .get(searchProducts);

router.route('/categories')
  .get(getCategories);

router.route('/category/:category')
  .get(getProductsByCategory);

// Homepage section routes
router.route('/homepage/hero')
  .get(getHeroProducts);

router.route('/homepage/featured')
  .get(getFeaturedProducts);

router.route('/homepage/new-arrivals')
  .get(getNewArrivals);

router.route('/:id')
  .get(getProduct)
  .put(protect, authorize('admin'), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

module.exports = router;
