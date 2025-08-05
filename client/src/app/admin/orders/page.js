'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ordersAPI, adminAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { FiEye, FiPackage, FiTruck, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await ordersAPI.getAllOrders();
      setOrders(data.data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await adminAPI.updateOrderStatus(orderId, status);
      toast.success(`Order status updated to ${status}`);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FiPackage />;
      case 'processing':
        return <FiPackage />;
      case 'shipped':
        return <FiTruck />;
      case 'delivered':
        return <FiCheck />;
      default:
        return <FiPackage />;
    }
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
      <h1 className="text-4xl font-bold mb-8">Manage Orders</h1>

      <div className="grid grid-cols-1 gap-6">
        {orders.map((order) => (
          <Card key={order._id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Order #{order._id.slice(-8)}</CardTitle>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(order.orderStatus)}`}>
                    {getStatusIcon(order.orderStatus)}
                    {order.orderStatus}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="font-medium">{order.user?.name || 'N/A'}</p>
                  <p className="text-sm text-gray-500">{order.user?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="font-bold text-lg">${order.totalPrice}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <p className={`font-medium ${order.isPaid ? 'text-green-600' : 'text-red-600'}`}>
                    {order.isPaid ? 'Paid' : 'Unpaid'}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Order Items</p>
                <div className="space-y-2">
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                      <span>{item.name}</span>
                      <span>{item.quantity} x ${item.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button
                  size="sm"
                  onClick={() => setSelectedOrder(order)}
                  className="flex items-center gap-1"
                >
                  <FiEye size={16} /> View Details
                </Button>
                
                {order.orderStatus === 'pending' && (
                  <Button
                    size="sm"
                    onClick={() => updateOrderStatus(order._id, 'processing')}
                    className="flex items-center gap-1"
                  >
                    <FiPackage size={16} /> Mark Processing
                  </Button>
                )}
                
                {order.orderStatus === 'processing' && (
                  <Button
                    size="sm"
                    onClick={() => updateOrderStatus(order._id, 'shipped')}
                    className="flex items-center gap-1"
                  >
                    <FiTruck size={16} /> Mark Shipped
                  </Button>
                )}
                
                {order.orderStatus === 'shipped' && (
                  <Button
                    size="sm"
                    onClick={() => updateOrderStatus(order._id, 'delivered')}
                    className="flex items-center gap-1"
                  >
                    <FiCheck size={16} /> Mark Delivered
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Order Details</h2>
            <div className="space-y-4">
              <div>
                <p className="font-medium">Order ID: {selectedOrder._id}</p>
                <p>Customer: {selectedOrder.user?.name}</p>
                <p>Email: {selectedOrder.user?.email}</p>
              </div>
              <div>
                <p className="font-medium">Shipping Address:</p>
                <p>{selectedOrder.shippingAddress?.street}</p>
                <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}</p>
                <p>{selectedOrder.shippingAddress?.country}</p>
              </div>
              <div>
                <p className="font-medium">Order Items:</p>
                {selectedOrder.orderItems.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{item.name}</span>
                    <span>{item.quantity} x ${item.price} = ${(item.quantity * item.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${selectedOrder.itemsPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>${selectedOrder.taxPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>${selectedOrder.shippingPrice}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>${selectedOrder.totalPrice}</span>
                </div>
              </div>
            </div>
            <Button
              onClick={() => setSelectedOrder(null)}
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
