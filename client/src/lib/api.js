import axios from 'axios';

const API_BASE_URL = "https://nexicart.onrender.com/api";
// const API_BASE_URL = process.env.NODE_ENV === 'development' ? "/api" : "http://localhost:5000/api";


console.log('API_BASE_URL:', API_BASE_URL);
console.log('Environment:', process.env.NODE_ENV);

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add cache-busting headers during development to avoid 304 responses
    if (process.env.NODE_ENV === 'development') {
      config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
      config.headers['Pragma'] = 'no-cache';
      config.headers['Expires'] = '0';
      // Add timestamp to prevent caching - ensure params object exists
      if (!config.params) {
        config.params = {};
      }
      config.params._t = Date.now();
    }
    
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      response: error.response?.data
    });
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/updatedetails', userData),
  updatePassword: (passwordData) => api.put('/auth/updatepassword', passwordData),
};

// Products API
export const productsAPI = {
  getProducts: (params = {}) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  createProduct: (productData) => api.post('/products', productData),
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  getCategories: () => api.get('/products/categories'),
  getProductsByCategory: (category) => api.get(`/products/category/${category}`),
  searchProducts: (searchTerm) => api.get(`/products/search/${searchTerm}`),
  // Homepage sections
  getHeroProducts: () => api.get('/products/homepage/hero'),
  getFeaturedProducts: () => api.get('/products/homepage/featured'),
  getNewArrivals: () => api.get('/products/homepage/new-arrivals'),
};

// Orders API
export const ordersAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getOrder: (id) => api.get(`/orders/${id}`),
  getMyOrders: () => api.get('/orders/myorders'),
  getAllOrders: () => api.get('/orders'),
  updateOrderToPaid: (id, paymentResult) => api.put(`/orders/${id}/pay`, paymentResult),
  updateOrderToDelivered: (id) => api.put(`/orders/${id}/deliver`),
  updateOrderStatus: (id, statusData) => api.put(`/orders/${id}/status`, statusData),
};

// Users API
export const usersAPI = {
  getUsers: () => api.get('/users'),
  getUser: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  addAddress: (addressData) => api.post('/users/addresses', addressData),
  updateAddress: (addressId, addressData) => api.put(`/users/addresses/${addressId}`, addressData),
  deleteAddress: (addressId) => api.delete(`/users/addresses/${addressId}`),
  getWishlist: () => api.get('/users/wishlist'),
  addToWishlist: (productId) => api.post(`/users/wishlist/${productId}`),
  removeFromWishlist: (productId) => api.delete(`/users/wishlist/${productId}`),
  updatePassword: (passwordData) => api.put('/auth/updatepassword', passwordData),
};

// Profile API
export const profileAPI = {
  getProfile: () => api.get('/profile'),
  updateProfile: (profileData) => api.put('/profile', profileData),
  getAddresses: () => api.get('/profile/addresses'),
  addAddress: (addressData) => api.post('/profile/addresses', addressData),
  updateAddress: (addressId, addressData) => api.put(`/profile/addresses/${addressId}`, addressData),
  deleteAddress: (addressId) => api.delete(`/profile/addresses/${addressId}`),
  getOrderHistory: (params = {}) => api.get('/profile/orders', { params }),
  getOrderStats: () => api.get('/profile/orders/stats'),
  getWishlist: () => api.get('/profile/wishlist'),
  addToWishlist: (productId) => api.post(`/profile/wishlist/${productId}`),
  removeFromWishlist: (productId) => api.delete(`/profile/wishlist/${productId}`),
  updatePreferences: (preferences) => api.put('/profile/preferences', preferences),
  updateNotificationSettings: (settings) => api.put('/profile/notifications', settings),
  updatePrivacySettings: (settings) => api.put('/profile/privacy', settings),
  updateSecuritySettings: (settings) => api.put('/profile/security', settings),
  uploadAvatar: (formData) => api.post('/profile/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getLoyaltyInfo: () => api.get('/profile/loyalty'),
  getActivityHistory: (params = {}) => api.get('/profile/activity', { params }),
  getReviewHistory: (params = {}) => api.get('/profile/reviews', { params }),
  exportData: () => api.get('/profile/export'),
  deleteAccount: (confirmData) => api.delete('/profile/delete-account', { data: confirmData }),
  enable2FA: () => api.post('/profile/2fa/enable'),
  verify2FA: (tokenData) => api.post('/profile/2fa/verify', tokenData),
  disable2FA: (tokenData) => api.post('/profile/2fa/disable', tokenData),
  getSecurityLogs: () => api.get('/profile/security/logs'),
};

// Reviews API
export const reviewsAPI = {
  getProductReviews: (productId) => api.get(`/reviews/product/${productId}`),
  createReview: (reviewData) => api.post('/reviews', reviewData),
  updateReview: (id, reviewData) => api.put(`/reviews/${id}`, reviewData),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
};

// Cart API
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (cartData) => api.post('/cart/add', cartData),
  removeFromCart: (cartData) => api.delete('/cart/remove', { data: cartData }),
  updateQuantity: (cartData) => api.put('/cart/update', cartData),
  clearCart: () => api.delete('/cart/clear'),
};

// Admin API
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/stats'),
  getUsersAnalytics: (period) => api.get(`/admin/analytics/users?period=${period}`),
  getSalesAnalytics: (period) => api.get(`/admin/analytics/sales?period=${period}`),
  updateOrderStatus: (orderId, status) => api.put(`/admin/orders/${orderId}/status`, { status }),
  createAdmin: (adminData) => api.post('/admin/create', adminData),
  // Homepage sections management
  getHomepageSections: () => api.get('/admin/homepage-sections'),
  getProductsForSections: (params = {}) => api.get('/admin/products-for-sections', { params }),
  updateProductSections: (productId, sectionData) => api.put(`/admin/homepage-sections/${productId}`, sectionData),
  batchUpdateSections: (updates) => api.put('/admin/homepage-sections/batch', { updates }),
};

export default api;
