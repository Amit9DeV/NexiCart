'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usersAPI, ordersAPI } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import Link from 'next/link';
import { FiUser, FiBox, FiHeart, FiCalendar, FiDollarSign, FiCheckCircle, FiClock, FiArrowRight, FiLock } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      const fetchData = async () => {
        try {
          setLoading(true);
          const [ordersResponse, wishlistResponse] = await Promise.all([
            ordersAPI.getMyOrders(),
            usersAPI.getWishlist()
          ]);
          setOrders(ordersResponse.data.data);
          setWishlist(wishlistResponse.data.data);
        } catch (error) {
          console.error('Failed to fetch user data', error);
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

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>Please login to view your profile.</p>;

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
    </div>
  );
}
