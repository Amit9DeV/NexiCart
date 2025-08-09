const express = require('express');
const {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  updateOrderStatus
} = require('../controllers/orderController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .post(protect, addOrderItems)
  .get(protect, authorize('admin'), getOrders);

router.route('/myorders')
  .get(protect, getMyOrders);

router.route('/:id')
  .get(protect, getOrderById);

router.route('/:id/pay')
  .put(protect, updateOrderToPaid);

router.route('/:id/deliver')
  .put(protect, authorize('admin'), updateOrderToDelivered);

router.route('/:id/status')
  .put(protect, authorize('admin'), updateOrderStatus);

// Validate products before order creation
router.post('/validate-products', protect, async (req, res) => {
  try {
    const { orderItems } = req.body;
    const Product = require('../models/Product');
    
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No items to validate'
      });
    }
    
    const validatedItems = [];
    const errors = [];
    
    for (let item of orderItems) {
      let product;
      
      try {
        product = await Product.findById(item.product);
      } catch (error) {
        product = await Product.findOne({ name: { $regex: item.name, $options: 'i' } });
      }
      
      if (!product) {
        errors.push(`Product "${item.name}" (ID: ${item.product}) not found`);
        continue;
      }
      
      if (product.stock < item.quantity) {
        errors.push(`Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`);
        continue;
      }
      
      validatedItems.push({
        originalProduct: item.product,
        validProduct: product._id,
        name: product.name,
        price: product.discountPrice || product.price,
        stock: product.stock,
        image: product.images && product.images.length > 0 ? product.images[0].url : null
      });
    }
    
    res.json({
      success: errors.length === 0,
      validatedItems,
      errors,
      message: errors.length === 0 ? 'All products validated successfully' : 'Some products have issues'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
