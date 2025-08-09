const express = require('express');
const {
  getProfile,
  updateProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  getOrderHistory,
  getOrderStats,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  updatePreferences,
  getReviewHistory,
  updateNotificationSettings,
  deleteAccount,
  uploadProfilePicture,
  getLoyaltyInfo,
  getActivityHistory,
  exportData,
  updatePrivacySettings,
  updateSecuritySettings,
  enable2FA,
  verify2FA,
  disable2FA,
  getSecurityLogs
} = require('../controllers/profileController');

const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Profile Routes
router.route('/')
  .get(protect, getProfile)
  .put(protect, updateProfile);

// Address management
router.route('/addresses')
  .get(protect, getAddresses)
  .post(protect, addAddress);

router.route('/addresses/:addressId')
  .put(protect, updateAddress)
  .delete(protect, deleteAddress);

// Order history and stats
router.route('/orders')
  .get(protect, getOrderHistory);

router.route('/orders/stats')
  .get(protect, getOrderStats);

// Wishlist management
router.route('/wishlist')
  .get(protect, getWishlist);

router.route('/wishlist/:productId')
  .post(protect, addToWishlist)
  .delete(protect, removeFromWishlist);

// Preferences and settings
router.route('/preferences')
  .put(protect, updatePreferences);

router.route('/notifications')
  .put(protect, updateNotificationSettings);

router.route('/privacy')
  .put(protect, updatePrivacySettings);

// Reviews
router.route('/reviews')
  .get(protect, getReviewHistory);

// Profile picture upload
router.route('/avatar')
  .post(protect, upload.single('avatar'), uploadProfilePicture);

// Loyalty and activity
router.route('/loyalty')
  .get(protect, getLoyaltyInfo);

router.route('/activity')
  .get(protect, getActivityHistory);

// Data export
router.route('/export')
  .get(protect, exportData);

// Account deletion
router.route('/delete-account')
  .delete(protect, deleteAccount);

// Security settings
router.route('/security')
  .put(protect, updateSecuritySettings);

router.route('/security/logs')
  .get(protect, getSecurityLogs);

// Two-Factor Authentication
router.route('/2fa/enable')
  .post(protect, enable2FA);

router.route('/2fa/verify')
  .post(protect, verify2FA);

router.route('/2fa/disable')
  .post(protect, disable2FA);

module.exports = router;
