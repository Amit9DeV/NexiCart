const User = require('../models/User');
const UserProfile = require('../models/UserProfile');
const Order = require('../models/Order');
const Review = require('../models/Review');
const UserActivity = require('../models/UserActivity');
const path = require('path');
const fs = require('fs').promises;
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

// @desc    Get user profile with extended information
// @route   GET /api/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('wishlist');
    
    let userProfile = await UserProfile.findOne({ user: req.user.id });
    
    // Create profile if it doesn't exist
    if (!userProfile) {
      userProfile = await UserProfile.create({
        user: req.user.id,
        personalInfo: {},
        preferences: {},
        loyalty: {}
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user,
        profile: userProfile
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { personalInfo, preferences, socialMedia } = req.body;
    
    // Update basic user info if provided
    if (req.body.name || req.body.email || req.body.phone) {
      await User.findByIdAndUpdate(req.user.id, {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone
      }, {
        new: true,
        runValidators: true
      });
    }

    // Update extended profile
    let userProfile = await UserProfile.findOne({ user: req.user.id });
    
    if (!userProfile) {
      userProfile = new UserProfile({ user: req.user.id });
    }

    if (personalInfo) {
      userProfile.personalInfo = { ...userProfile.personalInfo, ...personalInfo };
    }
    
    if (preferences) {
      userProfile.preferences = { ...userProfile.preferences, ...preferences };
    }
    
    if (socialMedia) {
      userProfile.socialMedia = { ...userProfile.socialMedia, ...socialMedia };
    }

    userProfile.lastUpdated = new Date();
    await userProfile.save();

    // Log activity
    await UserActivity.create({
      user: req.user.id,
      sessionId: req.sessionID || Date.now().toString(),
      activityType: 'profile_update',
      activityData: {
        customData: { updatedFields: Object.keys(req.body) }
      },
      location: {
        ip: req.ip
      },
      deviceInfo: {
        userAgent: req.get('User-Agent')
      }
    });

    res.status(200).json({
      success: true,
      data: userProfile
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get user addresses
// @route   GET /api/profile/addresses
// @access  Private
exports.getAddresses = async (req, res) => {
  try {
    const userProfile = await UserProfile.findOne({ user: req.user.id });
    
    res.status(200).json({
      success: true,
      data: userProfile?.addresses || []
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Add new address
// @route   POST /api/profile/addresses
// @access  Private
exports.addAddress = async (req, res) => {
  try {
    let userProfile = await UserProfile.findOne({ user: req.user.id });
    
    if (!userProfile) {
      userProfile = new UserProfile({ user: req.user.id });
    }

    // If this is set as default, remove default from other addresses
    if (req.body.isDefault) {
      userProfile.addresses.forEach(address => {
        address.isDefault = false;
      });
    }

    userProfile.addresses.push(req.body);
    await userProfile.save();

    // Log activity
    await UserActivity.create({
      user: req.user.id,
      sessionId: req.sessionID || Date.now().toString(),
      activityType: 'address_added',
      activityData: {
        customData: { addressType: req.body.type }
      },
      location: {
        ip: req.ip
      },
      deviceInfo: {
        userAgent: req.get('User-Agent')
      }
    });

    res.status(201).json({
      success: true,
      data: userProfile.addresses
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update address
// @route   PUT /api/profile/addresses/:addressId
// @access  Private
exports.updateAddress = async (req, res) => {
  try {
    const userProfile = await UserProfile.findOne({ user: req.user.id });
    
    if (!userProfile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      });
    }

    const address = userProfile.addresses.id(req.params.addressId);
    
    if (!address) {
      return res.status(404).json({
        success: false,
        error: 'Address not found'
      });
    }

    // If this is set as default, remove default from other addresses
    if (req.body.isDefault) {
      userProfile.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    Object.assign(address, req.body);
    await userProfile.save();

    res.status(200).json({
      success: true,
      data: userProfile.addresses
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete address
// @route   DELETE /api/profile/addresses/:addressId
// @access  Private
exports.deleteAddress = async (req, res) => {
  try {
    const userProfile = await UserProfile.findOne({ user: req.user.id });
    
    if (!userProfile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      });
    }

    userProfile.addresses.pull(req.params.addressId);
    await userProfile.save();

    res.status(200).json({
      success: true,
      data: userProfile.addresses
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get order history with pagination
// @route   GET /api/profile/orders
// @access  Private
exports.getOrderHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const orders = await Order.find({ user: req.user.id })
      .populate('orderItems.product', 'name price images')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(startIndex);

    const total = await Order.countDocuments({ user: req.user.id });

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        hasNext: startIndex + limit < total,
        hasPrev: page > 1
      },
      data: orders
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get order statistics
// @route   GET /api/profile/orders/stats
// @access  Private
exports.getOrderStats = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id });
    
    const stats = {
      totalOrders: orders.length,
      totalSpent: orders.reduce((sum, order) => sum + order.totalPrice, 0),
      averageOrderValue: orders.length > 0 ? 
        orders.reduce((sum, order) => sum + order.totalPrice, 0) / orders.length : 0,
      ordersByStatus: {},
      monthlyStats: []
    };

    // Count orders by status
    orders.forEach(order => {
      stats.ordersByStatus[order.orderStatus] = 
        (stats.ordersByStatus[order.orderStatus] || 0) + 1;
    });

    // Monthly stats for last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyOrders = orders.filter(order => 
      new Date(order.createdAt) >= sixMonthsAgo
    );

    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date();
      monthStart.setMonth(monthStart.getMonth() - i);
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      
      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1);
      
      const monthOrders = monthlyOrders.filter(order => 
        new Date(order.createdAt) >= monthStart && 
        new Date(order.createdAt) < monthEnd
      );

      stats.monthlyStats.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        orders: monthOrders.length,
        amount: monthOrders.reduce((sum, order) => sum + order.totalPrice, 0)
      });
    }

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get wishlist
// @route   GET /api/profile/wishlist
// @access  Private
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'wishlist',
        select: 'name price images category rating numReviews'
      });

    res.status(200).json({
      success: true,
      count: user.wishlist.length,
      data: user.wishlist
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Add to wishlist
// @route   POST /api/profile/wishlist/:productId
// @access  Private
exports.addToWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.wishlist.includes(req.params.productId)) {
      return res.status(400).json({
        success: false,
        error: 'Product already in wishlist'
      });
    }

    user.wishlist.push(req.params.productId);
    await user.save();

    await user.populate('wishlist');

    // Log activity
    await UserActivity.create({
      user: req.user.id,
      sessionId: req.sessionID || Date.now().toString(),
      activityType: 'add_to_wishlist',
      activityData: {
        product: req.params.productId,
        customData: { productId: req.params.productId }
      },
      location: {
        ip: req.ip
      },
      deviceInfo: {
        userAgent: req.get('User-Agent')
      }
    });

    res.status(200).json({
      success: true,
      data: user.wishlist
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Remove from wishlist
// @route   DELETE /api/profile/wishlist/:productId
// @access  Private
exports.removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.wishlist.pull(req.params.productId);
    await user.save();

    await user.populate('wishlist');

    res.status(200).json({
      success: true,
      data: user.wishlist
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update preferences
// @route   PUT /api/profile/preferences
// @access  Private
exports.updatePreferences = async (req, res) => {
  try {
    let userProfile = await UserProfile.findOne({ user: req.user.id });
    
    if (!userProfile) {
      userProfile = new UserProfile({ user: req.user.id });
    }

    userProfile.preferences = { ...userProfile.preferences, ...req.body };
    userProfile.lastUpdated = new Date();
    await userProfile.save();

    res.status(200).json({
      success: true,
      data: userProfile.preferences
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get review history
// @route   GET /api/profile/reviews
// @access  Private
exports.getReviewHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const reviews = await Review.find({ user: req.user.id })
      .populate('product', 'name images price')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(startIndex);

    const total = await Review.countDocuments({ user: req.user.id });

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit)
      },
      data: reviews
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update notification settings
// @route   PUT /api/profile/notifications
// @access  Private
exports.updateNotificationSettings = async (req, res) => {
  try {
    let userProfile = await UserProfile.findOne({ user: req.user.id });
    
    if (!userProfile) {
      userProfile = new UserProfile({ user: req.user.id });
    }

    userProfile.preferences.communicationPreferences = {
      ...userProfile.preferences.communicationPreferences,
      ...req.body
    };
    userProfile.lastUpdated = new Date();
    await userProfile.save();

    res.status(200).json({
      success: true,
      data: userProfile.preferences.communicationPreferences
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Upload profile picture
// @route   POST /api/profile/avatar
// @access  Private
exports.uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload a file'
      });
    }

    // Update user avatar
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: req.file.filename },
      { new: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      data: {
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get loyalty information
// @route   GET /api/profile/loyalty
// @access  Private
exports.getLoyaltyInfo = async (req, res) => {
  try {
    let userProfile = await UserProfile.findOne({ user: req.user.id });
    
    if (!userProfile) {
      userProfile = new UserProfile({ user: req.user.id });
      await userProfile.save();
    }

    // Calculate total spent from orders
    const orders = await Order.find({ 
      user: req.user.id, 
      orderStatus: { $in: ['Delivered', 'Paid'] }
    });
    
    const totalSpent = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    
    // Update loyalty points based on spending (1 point per dollar)
    const points = Math.floor(totalSpent);
    
    // Determine tier based on spending
    let tier = 'bronze';
    if (totalSpent >= 10000) tier = 'platinum';
    else if (totalSpent >= 5000) tier = 'gold';
    else if (totalSpent >= 2000) tier = 'silver';

    // Update profile
    userProfile.loyalty.points = points;
    userProfile.loyalty.totalSpent = totalSpent;
    userProfile.loyalty.tier = tier;
    await userProfile.save();

    res.status(200).json({
      success: true,
      data: userProfile.loyalty
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get activity history
// @route   GET /api/profile/activity
// @access  Private
exports.getActivityHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;

    const activities = await UserActivity.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(startIndex);

    const total = await UserActivity.countDocuments({ user: req.user.id });

    res.status(200).json({
      success: true,
      count: activities.length,
      total,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit)
      },
      data: activities
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Export user data
// @route   GET /api/profile/export
// @access  Private
exports.exportData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const userProfile = await UserProfile.findOne({ user: req.user.id });
    const orders = await Order.find({ user: req.user.id })
      .populate('orderItems.product', 'name');
    const reviews = await Review.find({ user: req.user.id })
      .populate('product', 'name');
    const activities = await UserActivity.find({ user: req.user.id });

    const exportData = {
      exportDate: new Date(),
      user,
      profile: userProfile,
      orders,
      reviews,
      activities
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="profile-data-${user._id}.json"`);
    
    res.status(200).json({
      success: true,
      data: exportData
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update privacy settings
// @route   PUT /api/profile/privacy
// @access  Private
exports.updatePrivacySettings = async (req, res) => {
  try {
    let userProfile = await UserProfile.findOne({ user: req.user.id });
    
    if (!userProfile) {
      userProfile = new UserProfile({ user: req.user.id });
    }

    userProfile.privacy = { ...userProfile.privacy, ...req.body };
    userProfile.lastUpdated = new Date();
    await userProfile.save();

    res.status(200).json({
      success: true,
      data: userProfile.privacy
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update security settings
// @route   PUT /api/profile/security
// @access  Private
exports.updateSecuritySettings = async (req, res) => {
  try {
    let userProfile = await UserProfile.findOne({ user: req.user.id });
    
    if (!userProfile) {
      userProfile = new UserProfile({ user: req.user.id });
    }

    userProfile.security = { ...userProfile.security, ...req.body };
    userProfile.lastUpdated = new Date();
    await userProfile.save();

    // Log security change
    await UserActivity.create({
      user: req.user.id,
      sessionId: req.sessionID || Date.now().toString(),
      activityType: 'profile_update',
      activityData: {
        customData: { action: 'security_settings_updated', updatedFields: Object.keys(req.body) }
      },
      location: {
        ip: req.ip
      },
      deviceInfo: {
        userAgent: req.get('User-Agent')
      }
    });

    res.status(200).json({
      success: true,
      data: userProfile.security
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Enable two-factor authentication
// @route   POST /api/profile/2fa/enable
// @access  Private
exports.enable2FA = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    const secret = speakeasy.generateSecret({
      name: `NexiCart (${user.email})`,
      issuer: 'NexiCart'
    });

    // Generate QR code
    const qrCode = await QRCode.toDataURL(secret.otpauth_url);

    // Store secret temporarily (you might want to encrypt this)
    let userProfile = await UserProfile.findOne({ user: req.user.id });
    if (!userProfile) {
      userProfile = new UserProfile({ user: req.user.id });
    }

    userProfile.security.twoFactorSecret = secret.base32;
    await userProfile.save();

    res.status(200).json({
      success: true,
      data: {
        qrCode,
        secret: secret.base32
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Verify and activate 2FA
// @route   POST /api/profile/2fa/verify
// @access  Private
exports.verify2FA = async (req, res) => {
  try {
    const { token } = req.body;
    
    const userProfile = await UserProfile.findOne({ user: req.user.id });
    
    if (!userProfile || !userProfile.security.twoFactorSecret) {
      return res.status(400).json({
        success: false,
        error: '2FA setup not initiated'
      });
    }

    const verified = speakeasy.totp.verify({
      secret: userProfile.security.twoFactorSecret,
      encoding: 'base32',
      token,
      window: 2
    });

    if (!verified) {
      return res.status(400).json({
        success: false,
        error: 'Invalid token'
      });
    }

    userProfile.security.twoFactorEnabled = true;
    await userProfile.save();

    // Log security change
    await UserActivity.create({
      user: req.user.id,
      sessionId: req.sessionID || Date.now().toString(),
      activityType: 'profile_update',
      activityData: {
        customData: { action: '2fa_enabled' }
      },
      location: {
        ip: req.ip
      },
      deviceInfo: {
        userAgent: req.get('User-Agent')
      }
    });

    res.status(200).json({
      success: true,
      message: '2FA enabled successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Disable 2FA
// @route   POST /api/profile/2fa/disable
// @access  Private
exports.disable2FA = async (req, res) => {
  try {
    const { token } = req.body;
    
    const userProfile = await UserProfile.findOne({ user: req.user.id });
    
    if (!userProfile || !userProfile.security.twoFactorEnabled) {
      return res.status(400).json({
        success: false,
        error: '2FA is not enabled'
      });
    }

    const verified = speakeasy.totp.verify({
      secret: userProfile.security.twoFactorSecret,
      encoding: 'base32',
      token,
      window: 2
    });

    if (!verified) {
      return res.status(400).json({
        success: false,
        error: 'Invalid token'
      });
    }

    userProfile.security.twoFactorEnabled = false;
    userProfile.security.twoFactorSecret = undefined;
    await userProfile.save();

    // Log security change
    await UserActivity.create({
      user: req.user.id,
      sessionId: req.sessionID || Date.now().toString(),
      activityType: 'profile_update',
      activityData: {
        customData: { action: '2fa_disabled' }
      },
      location: {
        ip: req.ip
      },
      deviceInfo: {
        userAgent: req.get('User-Agent')
      }
    });

    res.status(200).json({
      success: true,
      message: '2FA disabled successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get security logs
// @route   GET /api/profile/security/logs
// @access  Private
exports.getSecurityLogs = async (req, res) => {
  try {
    const securityActions = [
      'login', 'logout', 'profile_update'
    ];

    const logs = await UserActivity.find({ 
      user: req.user.id,
      activityType: { $in: securityActions }
    })
    .sort({ timestamp: -1 })
    .limit(50);

    res.status(200).json({
      success: true,
      data: logs
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete account
// @route   DELETE /api/profile/delete-account
// @access  Private
exports.deleteAccount = async (req, res) => {
  try {
    const { password, confirmText } = req.body;

    if (confirmText !== 'DELETE') {
      return res.status(400).json({
        success: false,
        error: 'Please type DELETE to confirm account deletion'
      });
    }

    const user = await User.findById(req.user.id).select('+password');

    // Verify password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid password'
      });
    }

    // Delete related data
    await UserProfile.findOneAndDelete({ user: req.user.id });
    await UserActivity.deleteMany({ user: req.user.id });
    await Review.deleteMany({ user: req.user.id });

    // Delete user
    await User.findByIdAndDelete(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};
