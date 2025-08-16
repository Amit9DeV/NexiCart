const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.addOrderItems = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    // Validate required fields
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No order items provided'
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        error: 'Shipping address is required'
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        error: 'Payment method is required'
      });
    }

    // Validate and set default values for shipping address
    const validatedShippingAddress = {
      street: shippingAddress.address || shippingAddress.street || '',
      city: shippingAddress.city || '',
      state: shippingAddress.state || '',
      zipCode: shippingAddress.pincode || shippingAddress.zipCode || '',
      country: shippingAddress.country || 'India'
    };

    // Validate required address fields
    if (!validatedShippingAddress.city || !validatedShippingAddress.state) {
      return res.status(400).json({
        success: false,
        error: 'City and state are required in shipping address'
      });
    }

    // Validate payment method
    const validPaymentMethods = ['stripe', 'paypal', 'cash', 'cod', 'upi', 'razorpay'];
    
    // Map client payment method IDs to server values
    let mappedPaymentMethod = paymentMethod;
    if (paymentMethod === 'card') {
      mappedPaymentMethod = 'stripe';
    } else if (paymentMethod === 'netbanking') {
      mappedPaymentMethod = 'razorpay';
    } else if (paymentMethod === 'emi') {
      mappedPaymentMethod = 'razorpay';
    }
    
    if (!validPaymentMethods.includes(mappedPaymentMethod)) {
      return res.status(400).json({
        success: false,
        error: `Invalid payment method. Must be one of: ${validPaymentMethods.join(', ')}`
      });
    }

    // Check if all products exist and have sufficient stock
    const validatedItems = [];
    for (let item of orderItems) {
      let product;
      
      // Try to find by ObjectId first, then by name if not found
      try {
        product = await Product.findById(item.product);
      } catch (error) {
        // If ObjectId is invalid, try to find by name
        product = await Product.findOne({ name: { $regex: item.name, $options: 'i' } });
      }

      // If still not found by ID or name, try to find any similar product
      if (!product && item.name) {
        product = await Product.findOne({ 
          $or: [
            { name: { $regex: item.name.replace(/[^a-zA-Z0-9\s]/g, ''), $options: 'i' } },
            { brand: { $regex: item.name, $options: 'i' } }
          ]
        });
      }

      if (!product) {
        return res.status(404).json({
          success: false,
          error: `Product "${item.name}" not found. Please refresh the product catalog.`,
          productId: item.product
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          error: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
        });
      }

      // Use the actual product data from database
      validatedItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.discountPrice || product.price,
        image: product.images && product.images.length > 0 ? product.images[0].url : item.image
      });
    }

    const order = new Order({
      orderItems: validatedItems,
      user: req.user._id,
      shippingAddress: validatedShippingAddress,
      paymentMethod: mappedPaymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    // Update product stock
    for (let item of validatedItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
    }

    res.status(201).json({
      success: true,
      data: createdOrder
    });
  } catch (error) {
    console.error('Error in addOrderItems:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name price images');

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Check if user owns the order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to view this order'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
exports.updateOrderToPaid = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Check if user owns the order
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this order'
      });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.status = 'processing';
    
    // Handle different payment methods
    if (req.body.paymentMethod === 'upi' || req.body.paymentMethod === 'razorpay') {
      order.paymentResult = {
        id: req.body.razorpay_payment_id || req.body.id,
        status: req.body.status,
        update_time: req.body.update_time || new Date().toISOString(),
        razorpay_payment_id: req.body.razorpay_payment_id,
        razorpay_order_id: req.body.razorpay_order_id,
        razorpay_signature: req.body.razorpay_signature,
        method: req.body.method,
        amount: req.body.amount,
        currency: req.body.currency || 'INR'
      };
      
      // Add UPI specific details
      if (req.body.upi) {
        order.paymentResult.upi = {
          vpa: req.body.upi.vpa
        };
      }
    } else {
      // PayPal or Stripe payment
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer ? req.body.payer.email_address : req.body.email_address,
      };
    }

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
exports.updateOrderToDelivered = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.status = 'delivered';

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('orderItems.product', 'name price images')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'id name email')
      .populate('orderItems.product', 'name price')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, trackingNumber } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    order.status = status;
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    if (status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};
