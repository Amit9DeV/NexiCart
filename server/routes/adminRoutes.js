const express = require('express');
const {
  getDashboardStats,
  getUsersAnalytics,
  getSalesAnalytics,
  updateOrderStatus,
  createAdmin
} = require('../controllers/adminController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require admin access
router.use(protect);
router.use(authorize('admin'));

// Dashboard stats
router.get('/stats', getDashboardStats);

// Analytics
router.get('/analytics/users', getUsersAnalytics);
router.get('/analytics/sales', getSalesAnalytics);

// Order management
router.put('/orders/:id/status', updateOrderStatus);

// Admin user management
router.post('/create', createAdmin);

module.exports = router;
