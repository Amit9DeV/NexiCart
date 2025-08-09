const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');

// @desc    Create a new admin user (accessible only by existing admins)
// @route   POST /api/admin/create
// @access  Private/Admin
exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name, email, and password'
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email'
      });
    }
    
    // Create admin user
    const adminUser = new User({
      name,
      email,
      password,
      role: 'admin'
    });
    
    await adminUser.save();
    
    res.status(201).json({
      success: true,
      message: 'Admin account created successfully',
      data: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role
      }
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while creating admin'
    });
  }
};

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    // Get current date ranges
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    // Count totals
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    // This month stats
    const monthlyUsers = await User.countDocuments({
      role: 'user',
      createdAt: { $gte: startOfMonth }
    });
    const monthlyOrders = await Order.countDocuments({
      createdAt: { $gte: startOfMonth }
    });
    const monthlyRevenue = await Order.aggregate([
      { 
        $match: { 
          isPaid: true, 
          createdAt: { $gte: startOfMonth }
        }
      },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    // This week stats
    const weeklyUsers = await User.countDocuments({
      role: 'user',
      createdAt: { $gte: startOfWeek }
    });
    const weeklyOrders = await Order.countDocuments({
      createdAt: { $gte: startOfWeek }
    });

    // Recent orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    // Top selling products
    const topProducts = await Order.aggregate([
      { $unwind: '$orderItems' },
      {
        $group: {
          _id: '$orderItems.product',
          totalSold: { $sum: '$orderItems.quantity' },
          revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' }
    ]);

    // Order status distribution
    const orderStatuses = await Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    // Monthly revenue chart data (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 6);
    
    const monthlyChart = await Order.aggregate([
      {
        $match: {
          isPaid: true,
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Low stock products
    const lowStockProducts = await Product.find({ stock: { $lt: 10 } })
      .select('name stock price')
      .sort({ stock: 1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalProducts,
          totalOrders,
          totalRevenue: totalRevenue[0]?.total || 0,
          monthlyUsers,
          monthlyOrders,
          monthlyRevenue: monthlyRevenue[0]?.total || 0,
          weeklyUsers,
          weeklyOrders
        },
        recentOrders,
        topProducts,
        orderStatuses,
        monthlyChart,
        lowStockProducts
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get users analytics
// @route   GET /api/admin/analytics/users
// @access  Private/Admin
exports.getUsersAnalytics = async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    
    let dateRange;
    const now = new Date();
    
    switch (period) {
      case '24h':
        dateRange = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        dateRange = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        dateRange = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        dateRange = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        dateRange = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const userGrowth = await User.aggregate([
      {
        $match: {
          role: 'user',
          createdAt: { $gte: dateRange }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: period === '24h' ? '%Y-%m-%d %H:00' : '%Y-%m-%d',
              date: '$createdAt'
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: userGrowth
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get sales analytics
// @route   GET /api/admin/analytics/sales
// @access  Private/Admin
exports.getSalesAnalytics = async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    
    let dateRange;
    const now = new Date();
    
    switch (period) {
      case '24h':
        dateRange = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        dateRange = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        dateRange = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        dateRange = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        dateRange = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const salesData = await Order.aggregate([
      {
        $match: {
          isPaid: true,
          createdAt: { $gte: dateRange }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: period === '24h' ? '%Y-%m-%d %H:00' : '%Y-%m-%d',
              date: '$createdAt'
            }
          },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: salesData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    order.orderStatus = status;
    
    if (status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    await order.save();

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get homepage sections configuration
// @route   GET /api/admin/homepage-sections
// @access  Private/Admin
exports.getHomepageSections = async (req, res) => {
  try {
    const heroProducts = await Product.find({ showInHero: true, isActive: true })
      .sort({ heroOrder: 1, createdAt: -1 })
      .limit(8)
      .select('name price images ratings showInHero heroOrder');

    const featuredProducts = await Product.find({ isFeatured: true, isActive: true })
      .sort({ featuredOrder: 1, createdAt: -1 })
      .limit(8)
      .select('name price images ratings isFeatured featuredOrder');

    const newArrivals = await Product.find({ showInNewArrivals: true, isActive: true })
      .sort({ newArrivalsOrder: 1, createdAt: -1 })
      .limit(8)
      .select('name price images ratings showInNewArrivals newArrivalsOrder');

    res.status(200).json({
      success: true,
      data: {
        heroProducts,
        featuredProducts,
        newArrivals
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Update product homepage sections
// @route   PUT /api/admin/homepage-sections/:id
// @access  Private/Admin
exports.updateProductSections = async (req, res) => {
  try {
    const { showInHero, isFeatured, showInNewArrivals, heroOrder, featuredOrder, newArrivalsOrder } = req.body;
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Update section flags and orders
    if (showInHero !== undefined) product.showInHero = showInHero;
    if (isFeatured !== undefined) product.isFeatured = isFeatured;
    if (showInNewArrivals !== undefined) product.showInNewArrivals = showInNewArrivals;
    if (heroOrder !== undefined) product.heroOrder = heroOrder;
    if (featuredOrder !== undefined) product.featuredOrder = featuredOrder;
    if (newArrivalsOrder !== undefined) product.newArrivalsOrder = newArrivalsOrder;

    await product.save();

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Batch update homepage sections
// @route   PUT /api/admin/homepage-sections/batch
// @access  Private/Admin
exports.batchUpdateSections = async (req, res) => {
  try {
    const { updates } = req.body; // Array of {productId, ...updates}
    
    if (!Array.isArray(updates)) {
      return res.status(400).json({
        success: false,
        error: 'Updates must be an array'
      });
    }

    const results = [];
    
    for (const update of updates) {
      const { productId, ...updateData } = update;
      
      try {
        const product = await Product.findByIdAndUpdate(
          productId,
          updateData,
          { new: true, runValidators: true }
        );
        
        if (product) {
          results.push({ success: true, productId, product });
        } else {
          results.push({ success: false, productId, error: 'Product not found' });
        }
      } catch (updateError) {
        results.push({ success: false, productId, error: updateError.message });
      }
    }

    res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get products for homepage section management
// @route   GET /api/admin/products-for-sections
// @access  Private/Admin
exports.getProductsForSections = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', category = '' } = req.query;
    
    const query = { isActive: true };
    
    // Add search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Add category filter
    if (category) {
      query.category = category;
    }
    
    const products = await Product.find(query)
      .select('name brand category price images ratings stock showInHero isFeatured showInNewArrivals heroOrder featuredOrder newArrivalsOrder')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const totalProducts = await Product.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          current: page,
          pages: Math.ceil(totalProducts / limit),
          total: totalProducts
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};
