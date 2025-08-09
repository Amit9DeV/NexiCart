const crypto = require('crypto');
const Order = require('../models/Order');
const razorpay = require('../config/razorpay');

// @desc    Create Razorpay order for UPI payment
// @route   POST /api/payments/create-razorpay-order
// @access  Private
exports.createRazorpayOrder = async (req, res) => {
  try {
    // Check if Razorpay is initialized
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        error: 'UPI payment service is not configured. Please contact administrator.'
      });
    }

    const { orderId } = req.body;
    
    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Check if user owns the order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this order'
      });
    }

    // Convert total price to paise (Razorpay uses paise)
    const amount = Math.round(order.totalPrice * 100);
    
    const options = {
      amount: amount, // amount in paise
      currency: 'INR',
      receipt: `order_${order._id}`,
      payment_capture: 1,
      notes: {
        order_id: order._id.toString(),
        user_id: req.user._id.toString()
      }
    };

    const razorpayOrder = await razorpay.orders.create(options);
    
    res.status(200).json({
      success: true,
      data: {
        razorpay_order_id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        order_id: order._id,
        key_id: process.env.RAZORPAY_KEY_ID
      }
    });
    
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create Razorpay order'
    });
  }
};

// @desc    Verify Razorpay payment and update order
// @route   POST /api/payments/verify-razorpay-payment
// @access  Private
exports.verifyRazorpayPayment = async (req, res) => {
  try {
    // Check if Razorpay is initialized
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        error: 'UPI payment service is not configured. Please contact administrator.'
      });
    }

    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      order_id
    } = req.body;

    // Verify the signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Invalid payment signature'
      });
    }

    // Find the order
    const order = await Order.findById(order_id);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Check if user owns the order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this order'
      });
    }

    // Get payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    
    // Update order with payment information
    order.isPaid = true;
    order.paidAt = Date.now();
    order.status = 'processing';
    order.paymentResult = {
      id: razorpay_payment_id,
      status: payment.status,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      method: payment.method,
      amount: payment.amount / 100, // Convert paise to rupees
      currency: payment.currency,
      description: payment.description,
      update_time: new Date().toISOString()
    };

    // Add UPI specific details if payment method is UPI
    if (payment.method === 'upi' && payment.upi) {
      order.paymentResult.upi = {
        vpa: payment.upi.vpa
      };
    }

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: updatedOrder
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify payment'
    });
  }
};

// @desc    Create UPI payment request
// @route   POST /api/payments/create-upi-payment
// @access  Private
exports.createUPIPayment = async (req, res) => {
  try {
    // Check if Razorpay is initialized
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        error: 'UPI payment service is not configured. Please contact administrator.'
      });
    }

    const { orderId, upiId } = req.body;
    
    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Check if user owns the order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this order'
      });
    }

    // Convert total price to paise
    const amount = Math.round(order.totalPrice * 100);
    
    const options = {
      amount: amount,
      currency: 'INR',
      receipt: `upi_${order._id}`,
      payment_capture: 1,
      method: {
        upi: true
      },
      notes: {
        order_id: order._id.toString(),
        user_id: req.user._id.toString(),
        upi_id: upiId
      }
    };

    const razorpayOrder = await razorpay.orders.create(options);
    
    // Generate UPI payment URL
    const upiUrl = `upi://pay?pa=${process.env.UPI_MERCHANT_ID || 'merchant@paytm'}&pn=NexiCart&am=${order.totalPrice}&cu=INR&tn=Order%20${order._id}`;
    
    res.status(200).json({
      success: true,
      data: {
        razorpay_order_id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        order_id: order._id,
        upi_url: upiUrl,
        upi_id: upiId,
        key_id: process.env.RAZORPAY_KEY_ID
      }
    });
    
  } catch (error) {
    console.error('UPI payment creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create UPI payment'
    });
  }
};

// @desc    Get payment status
// @route   GET /api/payments/status/:paymentId
// @access  Private
exports.getPaymentStatus = async (req, res) => {
  try {
    // Check if Razorpay is initialized
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        error: 'UPI payment service is not configured. Please contact administrator.'
      });
    }

    const { paymentId } = req.params;
    
    const payment = await razorpay.payments.fetch(paymentId);
    
    res.status(200).json({
      success: true,
      data: {
        id: payment.id,
        status: payment.status,
        method: payment.method,
        amount: payment.amount / 100,
        currency: payment.currency,
        created_at: payment.created_at,
        captured: payment.captured
      }
    });
    
  } catch (error) {
    console.error('Payment status fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payment status'
    });
  }
};

// @desc    Refund payment
// @route   POST /api/payments/refund
// @access  Private/Admin
exports.refundPayment = async (req, res) => {
  try {
    // Check if Razorpay is initialized
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        error: 'UPI payment service is not configured. Please contact administrator.'
      });
    }

    const { paymentId, amount, orderId } = req.body;
    
    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    const refundAmount = amount ? Math.round(amount * 100) : undefined;
    
    const refund = await razorpay.payments.refund(paymentId, {
      amount: refundAmount,
      speed: 'normal',
      notes: {
        reason: 'Order cancellation',
        order_id: orderId
      }
    });
    
    res.status(200).json({
      success: true,
      message: 'Refund initiated successfully',
      data: {
        refund_id: refund.id,
        amount: refund.amount / 100,
        status: refund.status
      }
    });
    
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initiate refund'
    });
  }
};

// @desc    Handle Razorpay webhooks
// @route   POST /api/payments/webhook
// @access  Public (but secured with signature verification)
exports.handleWebhook = async (req, res) => {
  try {
    const receivedSignature = req.headers['x-razorpay-signature'];
    const webhookBody = JSON.stringify(req.body);
    
    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET)
      .update(webhookBody)
      .digest('hex');
    
    if (receivedSignature !== expectedSignature) {
      console.log('Webhook signature verification failed');
      return res.status(400).json({ error: 'Invalid signature' });
    }
    
    const event = req.body.event;
    const payloadData = req.body.payload.payment || req.body.payload.order;
    
    console.log('Webhook event:', event, payloadData.id);
    
    switch (event) {
      case 'payment.captured':
        await handlePaymentCaptured(payloadData);
        break;
        
      case 'payment.failed':
        await handlePaymentFailed(payloadData);
        break;
        
      case 'payment.authorized':
        await handlePaymentAuthorized(payloadData);
        break;
        
      case 'refund.created':
        await handleRefundCreated(req.body.payload.refund);
        break;
        
      default:
        console.log('Unhandled webhook event:', event);
    }
    
    res.status(200).json({ status: 'ok' });
    
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

// Helper function to handle payment captured event
const handlePaymentCaptured = async (payment) => {
  try {
    const orderId = payment.notes?.order_id;
    if (!orderId) return;
    
    const order = await Order.findById(orderId);
    if (!order) return;
    
    if (!order.isPaid) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.status = 'processing';
      order.paymentResult = {
        id: payment.id,
        status: 'captured',
        razorpay_payment_id: payment.id,
        razorpay_order_id: payment.order_id,
        method: payment.method,
        amount: payment.amount / 100,
        currency: payment.currency,
        description: payment.description,
        update_time: new Date().toISOString()
      };
      
      if (payment.method === 'upi' && payment.upi) {
        order.paymentResult.upi = {
          vpa: payment.upi.vpa
        };
      }
      
      await order.save();
      console.log('Order payment updated via webhook:', orderId);
    }
  } catch (error) {
    console.error('Error handling payment captured:', error);
  }
};

// Helper function to handle payment failed event
const handlePaymentFailed = async (payment) => {
  try {
    const orderId = payment.notes?.order_id;
    if (!orderId) return;
    
    const order = await Order.findById(orderId);
    if (!order) return;
    
    order.paymentResult = {
      ...order.paymentResult,
      id: payment.id,
      status: 'failed',
      error_code: payment.error_code,
      error_description: payment.error_description,
      update_time: new Date().toISOString()
    };
    
    await order.save();
    console.log('Order payment failed via webhook:', orderId);
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
};

// Helper function to handle payment authorized event
const handlePaymentAuthorized = async (payment) => {
  try {
    console.log('Payment authorized:', payment.id);
    // Handle authorization if needed
  } catch (error) {
    console.error('Error handling payment authorized:', error);
  }
};

// Helper function to handle refund created event
const handleRefundCreated = async (refund) => {
  try {
    console.log('Refund created:', refund.id, refund.amount / 100);
    // Handle refund processing if needed
  } catch (error) {
    console.error('Error handling refund created:', error);
  }
};
