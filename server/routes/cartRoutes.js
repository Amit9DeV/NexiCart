const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart
} = require('../controllers/cartController');

const router = express.Router();

// All routes are protected
router.use(protect);

// Get user's cart
router.get('/', getCart);

// Add item to cart
router.post('/add', addToCart);

// Remove item from cart
router.delete('/remove', removeFromCart);

// Update item quantity
router.put('/update', updateQuantity);

// Clear cart
router.delete('/clear', clearCart);

module.exports = router;
