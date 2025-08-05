'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usersAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { FiEdit, FiTrash2, FiPlus, FiEye, FiUser, FiMail, FiCalendar } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    phone: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await usersAPI.getUsers();
      setUsers(data.data);
    } catch (error) {
      console.error('Failed to fetch users', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await usersAPI.updateUser(editingUser._id, formData);
        toast.success('User updated successfully');
      } else {
        // Note: Creating user through admin panel would need a separate endpoint
        // For now, we'll just show a message
        toast.info('User creation requires backend implementation');
      }
      setShowAddForm(false);
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        role: 'user',
        phone: ''
      });
      fetchUsers();
    } catch (error) {
      toast.error('Failed to save user');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await usersAPI.deleteUser(id);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || ''
    });
    setShowAddForm(true);
  };

  if (!user || user.role !== 'admin') {
    router.push('/admin/login');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">Redirecting to login...</h1>
      </div>
    );
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Manage Users</h1>
        <Button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2"
        >
          <FiPlus /> Add User
        </Button>
      </div>

      {showAddForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingUser ? 'Edit User' : 'Add New User'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <Input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full p-2 border rounded"
                required
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <div className="md:col-span-2 flex gap-4">
                <Button type="submit">
                  {editingUser ? 'Update User' : 'Add User'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingUser(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <Card key={user._id}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <FiUser className="text-indigo-600" />
                </div>
                <div>
                  <CardTitle className="truncate">{user.name}</CardTitle>
                  <p className="text-sm text-gray-500">{user.role}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <FiMail className="text-gray-400" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FiCalendar className="text-gray-400" />
                  <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {user.role}
                  </span>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    onClick={() => setSelectedUser(user)}
                    className="flex items-center gap-1"
                  >
                    <FiEye size={16} /> View
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleEdit(user)}
                    className="flex items-center gap-1"
                  >
                    <FiEdit size={16} /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(user._id)}
                    className="flex items-center gap-1"
                  >
                    <FiTrash2 size={16} /> Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">User Details</h2>
            <div className="space-y-4">
              <div>
                <p className="font-medium">Name: {selectedUser.name}</p>
                <p>Email: {selectedUser.email}</p>
                <p>Phone: {selectedUser.phone || 'Not provided'}</p>
                <p>Role: {selectedUser.role}</p>
                <p>Member since: {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
              </div>
              {selectedUser.addresses && selectedUser.addresses.length > 0 && (
                <div>
                  <p className="font-medium">Addresses:</p>
                  {selectedUser.addresses.map((address, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded mt-2">
                      <p className="font-medium">{address.type} Address</p>
                      <p>{address.street}</p>
                      <p>{address.city}, {address.state} {address.zipCode}</p>
                      <p>{address.country}</p>
                      {address.isDefault && <span className="text-sm text-green-600">Default</span>}
                    </div>
                  ))}
                </div>
              )}
              {selectedUser.wishlist && selectedUser.wishlist.length > 0 && (
                <div>
                  <p className="font-medium">Wishlist Items: {selectedUser.wishlist.length}</p>
                </div>
              )}
            </div>
            <Button
              onClick={() => setSelectedUser(null)}
              className="mt-4"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
