const express = require('express');
const {
  createRazorpayOrder,
  verifyRazorpayPayment,
  createUPIPayment,
  getPaymentStatus,
  refundPayment,
  handleWebhook
} = require('../controllers/paymentController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Webhook endpoint (must be before other routes to avoid auth middleware)
router.post('/webhook', handleWebhook);

// Create Razorpay order
router.post('/create-razorpay-order', protect, createRazorpayOrder);

// Verify Razorpay payment
router.post('/verify-razorpay-payment', protect, verifyRazorpayPayment);

// Create UPI payment
router.post('/create-upi-payment', protect, createUPIPayment);

// Get payment status
router.get('/status/:paymentId', protect, getPaymentStatus);

// Refund payment (Admin only)
router.post('/refund', protect, authorize('admin'), refundPayment);

module.exports = router;
