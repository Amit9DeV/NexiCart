const mongoose = require('mongoose');

const userActivitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },

  // Session Information
  sessionId: {
    type: String,
    required: true
  },
  
  // Device and Browser Information
  deviceInfo: {
    userAgent: String,
    browser: String,
    browserVersion: String,
    os: String,
    osVersion: String,
    device: String,
    deviceType: {
      type: String,
      enum: ['desktop', 'mobile', 'tablet'],
      default: 'desktop'
    },
    screenResolution: String,
    language: String,
    timezone: String
  },

  // Location Information
  location: {
    ip: String,
    country: String,
    state: String,
    city: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    pincode: String
  },

  // Activity Type
  activityType: {
    type: String,
    enum: [
      'login', 'logout', 'register', 'page_view', 'product_view', 
      'category_view', 'search', 'add_to_cart', 'remove_from_cart',
      'add_to_wishlist', 'remove_from_wishlist', 'checkout_start',
      'checkout_complete', 'payment_start', 'payment_complete',
      'payment_failed', 'order_placed', 'review_added', 'profile_update',
      'address_added', 'app_open', 'app_close', 'notification_clicked',
      'email_opened', 'promo_code_used', 'support_ticket', 'download',
      'share', 'filter_applied', 'sort_applied'
    ],
    required: true
  },

  // Activity Details
  activityData: {
    page: String,
    url: String,
    referrer: String,
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product'
    },
    category: String,
    searchQuery: String,
    filters: mongoose.Schema.Types.Mixed,
    sortBy: String,
    cartValue: Number,
    orderValue: Number,
    paymentMethod: String,
    promoCode: String,
    discountAmount: Number,
    timeSpent: Number, // in seconds
    scrollDepth: Number, // percentage
    clickPosition: {
      x: Number,
      y: Number
    },
    errorCode: String,
    errorMessage: String,
    customData: mongoose.Schema.Types.Mixed
  },

  // Performance Metrics
  performance: {
    pageLoadTime: Number,
    domContentLoadedTime: Number,
    firstContentfulPaint: Number,
    largestContentfulPaint: Number,
    networkType: String,
    connectionSpeed: String
  },

  // A/B Testing
  experiments: [{
    experimentId: String,
    variant: String,
    conversionGoal: String
  }],

  // Marketing Attribution
  attribution: {
    source: String,
    medium: String,
    campaign: String,
    term: String,
    content: String,
    gclid: String, // Google Click ID
    fbclid: String, // Facebook Click ID
    utmSource: String,
    utmMedium: String,
    utmCampaign: String,
    utmTerm: String,
    utmContent: String
  },

  // Timestamps
  timestamp: {
    type: Date,
    default: Date.now
  },
  serverTime: {
    type: Date,
    default: Date.now
  },
  clientTime: Date,

  // Additional Metadata
  metadata: {
    isBot: { type: Boolean, default: false },
    isBounce: { type: Boolean, default: false },
    isReturningUser: { type: Boolean, default: false },
    visitNumber: { type: Number, default: 1 },
    pageNumber: { type: Number, default: 1 },
    eventValue: Number,
    currency: { type: String, default: 'INR' }
  }
}, {
  timestamps: true
});

// Compound indexes for efficient querying
userActivitySchema.index({ user: 1, timestamp: -1 });
userActivitySchema.index({ sessionId: 1, timestamp: -1 });
userActivitySchema.index({ activityType: 1, timestamp: -1 });
userActivitySchema.index({ 'activityData.product': 1, timestamp: -1 });
userActivitySchema.index({ 'activityData.category': 1, timestamp: -1 });
userActivitySchema.index({ 'location.pincode': 1 });
userActivitySchema.index({ 'deviceInfo.deviceType': 1 });
userActivitySchema.index({ timestamp: -1 }); // For time-based queries
userActivitySchema.index({ 'attribution.source': 1, 'attribution.campaign': 1 });

// TTL index to automatically delete old records (optional - keep 2 years of data)
userActivitySchema.index({ timestamp: 1 }, { expireAfterSeconds: 63072000 }); // 2 years

module.exports = mongoose.model('UserActivity', userActivitySchema);
