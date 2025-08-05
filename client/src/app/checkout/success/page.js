'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FiCheckCircle } from 'react-icons/fi';

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear cart on success
    clearCart();
  }, [clearCart]);

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <FiCheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-green-600">Order Placed Successfully!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your order has been placed and will be processed shortly.
          </p>
          <div className="space-y-4">
            <Link href="/profile">
              <Button className="w-full">View My Orders</Button>
            </Link>
            <Link href="/products">
              <Button variant="outline" className="w-full">Continue Shopping</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
