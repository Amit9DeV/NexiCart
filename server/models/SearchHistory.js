const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    sparse: true // Allow null for guest users
  },
  
  sessionId: {
    type: String,
    required: true
  },

  // Search Query Details
  query: {
    original: { type: String, required: true }, // Original search query
    normalized: String, // Cleaned/normalized query
    language: { type: String, default: 'en' },
    corrected: String, // Auto-corrected query if applicable
    suggestions: [String] // Search suggestions shown
  },

  // Search Context
  context: {
    page: String,
    category: String,
    filters: mongoose.Schema.Types.Mixed,
    sortBy: String,
    searchType: {
      type: String,
      enum: ['text', 'voice', 'image', 'barcode'],
      default: 'text'
    },
    isAutoComplete: { type: Boolean, default: false },
    position: Number // Position in search history
  },

  // Search Results
  results: {
    totalCount: { type: Number, default: 0 },
    returnedCount: { type: Number, default: 0 },
    pageNumber: { type: Number, default: 1 },
    hasResults: { type: Boolean, default: true },
    topProducts: [{ // Top 5 products from results
      product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product'
      },
      name: String,
      price: Number,
      rank: Number
    }],
    categories: [String], // Categories found in results
    brands: [String], // Brands found in results
    priceRange: {
      min: Number,
      max: Number
    }
  },

  // User Interaction
  interaction: {
    timeSpent: Number, // Time spent on search results page
    clickedProducts: [{
      product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product'
      },
      position: Number,
      timestamp: { type: Date, default: Date.now }
    }],
    addedToCart: [{
      product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product'
      },
      timestamp: { type: Date, default: Date.now }
    }],
    addedToWishlist: [{
      product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product'
      },
      timestamp: { type: Date, default: Date.now }
    }],
    refinements: [{ // Search refinements made
      type: {
        type: String,
        enum: ['filter', 'sort', 'query_change']
      },
      value: String,
      timestamp: { type: Date, default: Date.now }
    }],
    exitType: {
      type: String,
      enum: ['product_click', 'new_search', 'navigation', 'bounce'],
      default: 'bounce'
    }
  },

  // Performance Metrics
  performance: {
    searchTime: Number, // Time to execute search (ms)
    renderTime: Number, // Time to render results (ms)
    apiResponseTime: Number
  },

  // Device and Location
  deviceInfo: {
    type: {
      type: String,
      enum: ['desktop', 'mobile', 'tablet'],
      default: 'desktop'
    },
    os: String,
    browser: String
  },

  location: {
    country: String,
    state: String,
    city: String,
    pincode: String
  },

  // Search Success Metrics
  success: {
    isSuccessful: { type: Boolean, default: false },
    conversionType: {
      type: String,
      enum: ['purchase', 'cart_add', 'wishlist_add', 'product_view']
    },
    conversionValue: Number,
    timeToConversion: Number // Time from search to conversion
  },

  // Timestamps
  searchedAt: {
    type: Date,
    default: Date.now
  },
  lastInteractionAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
searchHistorySchema.index({ user: 1, searchedAt: -1 });
searchHistorySchema.index({ sessionId: 1, searchedAt: -1 });
searchHistorySchema.index({ 'query.original': 'text', 'query.normalized': 'text' });
searchHistorySchema.index({ 'query.normalized': 1, searchedAt: -1 });
searchHistorySchema.index({ 'context.category': 1, searchedAt: -1 });
searchHistorySchema.index({ 'results.hasResults': 1 });
searchHistorySchema.index({ 'success.isSuccessful': 1 });
searchHistorySchema.index({ searchedAt: -1 });

// TTL index to automatically delete old search history (keep 1 year)
searchHistorySchema.index({ searchedAt: 1 }, { expireAfterSeconds: 31536000 }); // 1 year

// Methods
searchHistorySchema.methods.markAsSuccessful = function(conversionType, value) {
  this.success.isSuccessful = true;
  this.success.conversionType = conversionType;
  if (value) this.success.conversionValue = value;
  this.success.timeToConversion = Date.now() - this.searchedAt.getTime();
  this.lastInteractionAt = new Date();
  return this.save();
};

searchHistorySchema.methods.addInteraction = function(type, data) {
  this.lastInteractionAt = new Date();
  
  switch(type) {
    case 'product_click':
      this.interaction.clickedProducts.push({
        product: data.productId,
        position: data.position
      });
      break;
    case 'add_to_cart':
      this.interaction.addedToCart.push({
        product: data.productId
      });
      break;
    case 'add_to_wishlist':
      this.interaction.addedToWishlist.push({
        product: data.productId
      });
      break;
  }
  
  return this.save();
};

module.exports = mongoose.model('SearchHistory', searchHistorySchema);
