'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usersAPI, ordersAPI, authAPI } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import Link from 'next/link';
import { 
  FiUser, FiBox, FiHeart, FiCalendar, FiDollarSign, FiCheckCircle, FiClock, 
  FiArrowRight, FiLock, FiMapPin, FiSettings, FiShield, FiActivity, 
  FiStar, FiGift, FiEye, FiEyeOff, FiDownload, FiCamera, FiEdit3,
  FiMail, FiPhone, FiBell, FiGlobe, FiAward
} from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [profileStats, setProfileStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    wishlistCount: 0,
    loyaltyPoints: 0
  });

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      const fetchData = async () => {
        try {
          setLoading(true);
          setError(null);
          
          const [ordersResponse, wishlistResponse] = await Promise.all([
            ordersAPI.getMyOrders(),
            usersAPI.getWishlist()
          ]);
          
          console.log('Orders response:', ordersResponse);
          console.log('Wishlist response:', wishlistResponse);
          
          const ordersData = ordersResponse.data.data || [];
          const wishlistData = wishlistResponse.data.data || [];
          
          console.log('Setting orders:', ordersData);
          console.log('Orders length:', ordersData.length);
          
          setOrders(ordersData);
          setWishlist(wishlistData);
          
          // Calculate profile stats
          const totalSpent = ordersData.reduce((sum, order) => sum + order.totalPrice, 0);
          const loyaltyPoints = Math.floor(totalSpent); // 1 point per dollar
          
          setProfileStats({
            totalOrders: ordersData.length,
            totalSpent: totalSpent,
            wishlistCount: wishlistData.length,
            loyaltyPoints: loyaltyPoints
          });
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          setError({
            message: 'Failed to load profile data',
            details: error.response?.data?.error || error.message,
            status: error.response?.status
          });
          
          // Set empty arrays to prevent crashes
          setOrders([]);
          setWishlist([]);
          setProfileStats({
            totalOrders: 0,
            totalSpent: 0,
            wishlistCount: 0,
            loyaltyPoints: 0
          });
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    await updateProfile({ name, email });
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordMessage(null);
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'All fields are required.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    setPasswordLoading(true);
    try {
      await usersAPI.updatePassword({ currentPassword, newPassword });
      setPasswordMessage({ type: 'success', text: 'Password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setPasswordMessage({ type: 'error', text: error?.response?.data?.message || 'Failed to update password.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white/80 py-8 px-2 sm:px-4 md:px-8">
      <div className="container-nexkartin">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
            <p className="text-sm text-gray-400 mt-2">Validating authentication...</p>
          </div>
        </div>
      </div>
    </div>
  );
  
  if (!user) return (
    <div className="min-h-screen bg-white/80 py-8 px-2 sm:px-4 md:px-8">
      <div className="container-nexkartin">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
            <p className="text-gray-600 mb-6">You need to be logged in to view your profile.</p>
            <Link href="/auth/login" className="btn-nexkartin btn-nexkartin-primary">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white/80 py-8 px-2 sm:px-4 md:px-8">
      {/* Hero Section */}
      <section className="container-nexkartin mb-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
            <FiUser className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-sm text-gray-500">Manage your account, orders, and wishlist</p>
          </div>
        </motion.div>
      </section>

      {/* Error Display */}
      {error && (
        <section className="container-nexkartin mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-2">⚠️ Profile Data Loading Error</h3>
              <p className="text-red-700 mb-2">{error.message}</p>
              {error.details && (
                <p className="text-red-600 text-sm mb-2">Details: {error.details}</p>
              )}
              {error.status && (
                <p className="text-red-600 text-sm mb-2">Status: {error.status}</p>
              )}
              <div className="text-sm text-red-600">
                <p>This usually means:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>The backend server is not running</li>
                  <li>There&apos;s a network connectivity issue</li>
                  <li>Your authentication token has expired</li>
                </ul>
                <p className="mt-2">
                  <strong>Solution:</strong> Make sure the backend server is running on port 5000, 
                  or check the <Link href="/debug" className="underline">debug page</Link> for more information.
                </p>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* Debug Information */}
      <section className="container-nexkartin mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">🔍 Debug Info</h3>
            <div className="text-xs text-blue-700 space-y-1">
              <p><strong>Orders State:</strong> {orders.length} orders loaded</p>
              <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
              <p><strong>User:</strong> {user ? 'Logged in' : 'Not logged in'}</p>
              <p><strong>Profile Stats:</strong> {profileStats.totalOrders} orders, ${profileStats.totalSpent.toFixed(2)} spent</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Quick Stats Cards */}
      <section className="container-nexkartin mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Total Orders */}
          <div className="card-nexkartin bg-gradient-to-br from-blue-50 to-indigo-100/80 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-blue-200/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Orders</p>
                <p className="text-2xl font-bold text-blue-900">{profileStats.totalOrders}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                <FiBox className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Total Spent */}
          <div className="card-nexkartin bg-gradient-to-br from-green-50 to-emerald-100/80 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-green-200/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Spent</p>
                <p className="text-2xl font-bold text-green-900">${profileStats.totalSpent.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
                <FiDollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Wishlist Items */}
          <div className="card-nexkartin bg-gradient-to-br from-pink-50 to-rose-100/80 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-pink-200/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-pink-600">Wishlist Items</p>
                <p className="text-2xl font-bold text-pink-900">{profileStats.wishlistCount}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-md">
                <FiHeart className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Loyalty Points */}
          <div className="card-nexkartin bg-gradient-to-br from-purple-50 to-violet-100/80 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-purple-200/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Loyalty Points</p>
                <p className="text-2xl font-bold text-purple-900">{profileStats.loyaltyPoints}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-md">
                <FiAward className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

        </motion.div>
      </section>

      <div className="container-nexkartin grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile/Account Details */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="md:col-span-1 flex flex-col gap-8">
          <div className="card-nexkartin bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 mb-2">
            <h2 className="text-lg font-bold mb-4 text-gray-900 flex items-center gap-2">
              <FiUser className="w-5 h-5 text-indigo-500" /> Account Details
            </h2>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <Button type="submit" className="btn-nexkartin btn-nexkartin-primary btn-nexkartin-lg w-full flex items-center justify-center gap-2">
                Update Profile <FiArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </form>
          </div>
          {/* Change Password Section */}
          <div className="card-nexkartin bg-gradient-to-br from-indigo-50 to-purple-50/80 backdrop-blur-md rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold mb-4 text-gray-900 flex items-center gap-2">
              <FiLock className="w-5 h-5 text-indigo-500" /> Change Password
            </h2>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required autoComplete="current-password" />
              </div>
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required autoComplete="new-password" />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required autoComplete="new-password" />
              </div>
              {passwordMessage && (
                <div className={`text-sm rounded px-3 py-2 ${passwordMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{passwordMessage.text}</div>
              )}
              <Button type="submit" className="btn-nexkartin btn-nexkartin-primary btn-nexkartin-lg w-full flex items-center justify-center gap-2" loading={passwordLoading}>
                Update Password <FiArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </form>
          </div>
        </motion.div>

        {/* Order History & Wishlist */}
        <div className="md:col-span-2 flex flex-col gap-8">
          {/* Order History */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="card-nexkartin bg-gradient-to-br from-indigo-50 to-purple-50/80 backdrop-blur-md rounded-2xl shadow-xl p-6 mb-6">
              <h2 className="text-lg font-bold mb-4 text-gray-900 flex items-center gap-2">
                <FiBox className="w-5 h-5 text-indigo-500" /> My Orders
              </h2>
              {orders.length > 0 ? (
                <ul className="space-y-4">
                  {orders.map(order => (
                    <li key={order._id} className="bg-white/70 border border-gray-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow hover:shadow-md transition-shadow">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <FiCalendar className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <FiDollarSign className="w-4 h-4 text-green-500" />
                          <span className="font-semibold text-indigo-700">${order.totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          {order.status === 'Delivered' ? (
                            <FiCheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <FiClock className="w-4 h-4 text-yellow-500" />
                          )}
                          <span className={`text-xs font-medium ${order.status === 'Delivered' ? 'text-green-600' : 'text-yellow-600'}`}>{order.status}</span>
                        </div>
                        <div className="text-xs text-gray-400">Order ID: {order._id}</div>
                      </div>
                      <Link href={`/orders/${order._id}`}>
                        <Button variant="outline" className="btn-nexkartin flex items-center gap-2">
                          View Details <FiArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : <p>You have no orders.</p>}
            </div>
          </motion.div>

          {/* Wishlist */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="card-nexkartin bg-gradient-to-br from-pink-50 to-purple-50/80 backdrop-blur-md rounded-2xl shadow-xl p-6">
              <h2 className="text-lg font-bold mb-4 text-gray-900 flex items-center gap-2">
                <FiHeart className="w-5 h-5 text-pink-500" /> My Wishlist
              </h2>
              {wishlist.length > 0 ? (
                <ul className="space-y-4">
                  {wishlist.map(item => (
                    <li key={item._id} className="bg-white/70 border border-gray-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow hover:shadow-md transition-shadow">
                      <div className="flex-1">
                        <span className="font-semibold text-indigo-700">{item.name}</span>
                        <div className="text-xs text-gray-400">Product ID: {item._id}</div>
                      </div>
                      <Link href={`/products/${item._id}`}>
                        <Button variant="outline" className="btn-nexkartin flex items-center gap-2">
                          View <FiArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : <p>Your wishlist is empty.</p>}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Additional Profile Sections */}
      <div className="container-nexkartin mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <div className="card-nexkartin bg-gradient-to-br from-amber-50 to-orange-100/80 backdrop-blur-md rounded-2xl shadow-xl p-6">
              <h2 className="text-lg font-bold mb-4 text-gray-900 flex items-center gap-2">
                <FiSettings className="w-5 h-5 text-amber-500" /> Quick Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <Button variant="outline" className="btn-nexkartin flex items-center gap-2 justify-start p-4 h-auto">
                  <FiMapPin className="w-5 h-5 text-blue-500" />
                  <div className="text-left">
                    <div className="font-medium">Addresses</div>
                    <div className="text-xs text-gray-500">Manage delivery addresses</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="btn-nexkartin flex items-center gap-2 justify-start p-4 h-auto">
                  <FiBell className="w-5 h-5 text-purple-500" />
                  <div className="text-left">
                    <div className="font-medium">Notifications</div>
                    <div className="text-xs text-gray-500">Email & SMS preferences</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="btn-nexkartin flex items-center gap-2 justify-start p-4 h-auto">
                  <FiShield className="w-5 h-5 text-green-500" />
                  <div className="text-left">
                    <div className="font-medium">Privacy</div>
                    <div className="text-xs text-gray-500">Privacy settings</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="btn-nexkartin flex items-center gap-2 justify-start p-4 h-auto">
                  <FiDownload className="w-5 h-5 text-indigo-500" />
                  <div className="text-left">
                    <div className="font-medium">Export Data</div>
                    <div className="text-xs text-gray-500">Download your data</div>
                  </div>
                </Button>
                
              </div>
            </div>
          </motion.div>
          
          {/* Account Summary */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <div className="card-nexkartin bg-gradient-to-br from-slate-50 to-gray-100/80 backdrop-blur-md rounded-2xl shadow-xl p-6">
              <h2 className="text-lg font-bold mb-4 text-gray-900 flex items-center gap-2">
                <FiActivity className="w-5 h-5 text-slate-500" /> Account Summary
              </h2>
              <div className="space-y-3">
                
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <FiUser className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Member since</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long' 
                    }) : 'N/A'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <FiMail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Email verified</span>
                  </div>
                  <span className="flex items-center gap-1">
                    <FiCheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-green-600">Yes</span>
                  </span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <FiStar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Customer tier</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {profileStats.totalSpent >= 1000 ? 'Gold' : 
                     profileStats.totalSpent >= 500 ? 'Silver' : 'Bronze'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <FiGift className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Available rewards</span>
                  </div>
                  <span className="text-sm font-medium text-purple-600">
                    {Math.floor(profileStats.loyaltyPoints / 100)} vouchers
                  </span>
                </div>
                
              </div>
            </div>
          </motion.div>
          
        </div>
        
        {/* Recent Activity */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }} className="mt-8">
          <div className="card-nexkartin bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-6">
            <h2 className="text-lg font-bold mb-4 text-gray-900 flex items-center gap-2">
              <FiActivity className="w-5 h-5 text-gray-500" /> Recent Activity
            </h2>
            <div className="space-y-3">
              
              {orders.slice(0, 3).map((order, index) => (
                <div key={order._id} className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                    <FiBox className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      Order #{order._id.slice(-6).toUpperCase()}
                    </div>
                    <div className="text-xs text-gray-500">
                      ${order.totalPrice.toFixed(2)} • {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status}
                  </div>
                </div>
              ))}
              
              {orders.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FiBox className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p>No recent activity</p>
                </div>
              )}
              
            </div>
          </div>
        </motion.div>
        
      </div>
    </div>
  );
}
