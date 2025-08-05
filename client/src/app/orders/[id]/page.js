'use client';

import { useState, useEffect } from 'react';
import { ordersAPI } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';

export default function OrderDetailsPage({ params }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await ordersAPI.getOrder(params.id);
        setOrder(response.data.data);
      } catch (err) {
        setError('Failed to fetch order details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params.id]);

  if (loading) return <div>Loading order details...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!order) return <div>Order not found.</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Details</CardTitle>
      </CardHeader>
      <CardContent>
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <div className="mt-4">
          <h3 className="font-bold">Items:</h3>
          {order.orderItems.map(item => (
            <div key={item.product} className="flex items-center my-2">
              <Image src={item.image} alt={item.name} width={50} height={50} />
              <span className="ml-4">{item.name} - ${item.price} x {item.quantity}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
