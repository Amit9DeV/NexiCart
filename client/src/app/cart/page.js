'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { FiTrash2, FiMinus, FiPlus, FiShoppingCart, FiArrowRight, FiBox } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    if (cartItems.length === 0) return;
    router.push('/checkout');
  };

  const subtotal = getCartTotal();
  const tax = subtotal * 0.1;
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + tax + shipping;
  const freeShippingThreshold = 100;
  const freeShippingProgress = Math.min(1, subtotal / freeShippingThreshold);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center py-16">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-200 to-purple-200 flex items-center justify-center mb-6 shadow-lg">
            <FiShoppingCart className="w-10 h-10 text-indigo-600" />
          </div>
        </motion.div>
        <h1 className="text-3xl font-bold mb-2">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">Add some products to your cart to get started!</p>
        <Link href="/products">
          <Button className="btn-nexkartin btn-nexkartin-primary btn-nexkartin-lg">
            <FiArrowRight className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white/80 py-8 px-2 sm:px-4 md:px-8">
      {/* Hero Section */}
      <section className="container-nexkartin mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
            <FiShoppingCart className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-sm text-gray-500">Review your items and proceed to checkout</p>
          </div>
        </div>
      </section>

      <div className="container-nexkartin grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <AnimatePresence>
            {cartItems.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.3 }}
                className="mb-4"
              >
                <div className="card-nexkartin bg-white/70 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl transition-shadow flex flex-col sm:flex-row items-center p-4 gap-4 relative group">
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">{item.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-indigo-600 font-bold text-base">${item.price.toFixed(2)}</span>
                          {item.stock - item.quantity < 5 && (
                            <span className="ml-2 px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-medium animate-pulse flex items-center gap-1">
                              <FiBox className="w-3 h-3 mr-1" />Low Stock
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full border-gray-300"
                          onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                        >
                          <FiMinus className="h-4 w-4" />
                        </Button>
                        <span className="w-10 text-center font-semibold text-gray-800 select-none">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full border-gray-300"
                          onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                        >
                          <FiPlus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 min-w-[80px]">
                    <span className="font-bold text-lg text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:bg-red-50"
                      onClick={() => removeFromCart(item._id)}
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="outline" onClick={clearCart} className="btn-nexkartin">
              Clear Cart
            </Button>
            <Link href="/products">
              <Button className="btn-nexkartin btn-nexkartin-outline">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="sticky top-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="card-nexkartin bg-gradient-to-br from-indigo-50 to-purple-50/80 backdrop-blur-md rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
                <FiBox className="w-5 h-5 text-indigo-500" /> Order Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden my-2">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-indigo-500 transition-all duration-500"
                    style={{ width: `${freeShippingProgress * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mb-2">
                  {subtotal < freeShippingThreshold ? (
                    <span>
                      Spend <span className="font-semibold text-indigo-600">${(freeShippingThreshold - subtotal).toFixed(2)}</span> more for free shipping!
                    </span>
                  ) : (
                    <span className="text-green-600 font-semibold">🎉 You have free shipping!</span>
                  )}
                </div>
                <div className="border-t pt-4 flex justify-between items-center font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <Button
                className="btn-nexkartin btn-nexkartin-primary btn-nexkartin-lg w-full mt-6 flex items-center justify-center gap-2"
                onClick={handleCheckout}
                loading={loading}
              >
                {isAuthenticated ? (
                  <>
                    Proceed to Checkout <FiArrowRight className="w-4 h-4 ml-1" />
                  </>
                ) : (
                  <>
                    Login to Checkout <FiArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
