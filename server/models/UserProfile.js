const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // Personal Information
  personalInfo: {
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer-not-to-say']
    },
    maritalStatus: {
      type: String,
      enum: ['single', 'married', 'divorced', 'widowed', 'other']
    },
    occupation: String,
    education: {
      type: String,
      enum: ['high-school', 'bachelor', 'master', 'phd', 'other']
    },
    annualIncome: {
      type: String,
      enum: ['0-2L', '2-5L', '5-10L', '10-20L', '20L+']
    }
  },

  // Shopping Preferences
  preferences: {
    favoriteCategories: [String],
    preferredBrands: [String],
    priceRange: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 10000 }
    },
    paymentMethods: [String],
    deliveryPreference: {
      type: String,
      enum: ['standard', 'express', 'scheduled'],
      default: 'standard'
    },
    communicationPreferences: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true },
      whatsapp: { type: Boolean, default: false }
    }
  },

  // Addresses with Indian format
  addresses: [{
    type: {
      type: String,
      enum: ['home', 'work', 'other'],
      default: 'home'
    },
    name: { type: String, required: true },
    mobile: { 
      type: String, 
      required: true,
      match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number']
    },
    pincode: { 
      type: String, 
      required: true,
      match: [/^[0-9]{6}$/, 'Please enter a valid 6-digit pincode']
    },
    locality: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    landmark: String,
    alternatePhone: {
      type: String,
      match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number']
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    isDefault: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }],

  // Loyalty Program
  loyalty: {
    points: { type: Number, default: 0 },
    tier: {
      type: String,
      enum: ['bronze', 'silver', 'gold', 'platinum'],
      default: 'bronze'
    },
    totalSpent: { type: Number, default: 0 },
    memberSince: { type: Date, default: Date.now }
  },

  // Account Security
  security: {
    twoFactorEnabled: { type: Boolean, default: false },
    loginAttempts: { type: Number, default: 0 },
    lastLoginAt: Date,
    lastLoginIP: String,
    securityQuestions: [{
      question: String,
      answer: String
    }]
  },

  // Privacy Settings
  privacy: {
    profileVisibility: {
      type: String,
      enum: ['public', 'friends', 'private'],
      default: 'private'
    },
    dataSharing: { type: Boolean, default: false },
    marketingEmails: { type: Boolean, default: true },
    personalizedAds: { type: Boolean, default: true }
  },

  // Social Media Links
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
    linkedin: String
  },

  // Account Status
  status: {
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    blockedReason: String,
    verificationToken: String,
    verificationExpires: Date
  },

  // Timestamps
  lastUpdated: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Indexes for better performance
userProfileSchema.index({ user: 1 });
userProfileSchema.index({ 'addresses.pincode': 1 });
userProfileSchema.index({ 'loyalty.tier': 1 });
userProfileSchema.index({ 'status.isActive': 1 });

module.exports = mongoose.model('UserProfile', userProfileSchema);
