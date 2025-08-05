'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ordersAPI } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { FiShoppingCart, FiBox, FiMapPin, FiCreditCard, FiArrowRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function CheckoutPage() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    mobile: '',
    pincode: '',
    locality: '',
    address: '',
    city: '',
    state: '',
    landmark: '',
    alternatePhone: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('upi');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    if (cartItems.length === 0) {
      router.push('/cart');
      return;
    }
  }, [isAuthenticated, cartItems.length, router]);

  if (!isAuthenticated || cartItems.length === 0) {
    return <div className="text-center py-10">Redirecting...</div>;
  }

  const subtotal = getCartTotal();
  const tax = subtotal * 0.1;
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + tax + shipping;
  const freeShippingThreshold = 100;
  const freeShippingProgress = Math.min(1, subtotal / freeShippingThreshold);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const orderItems = cartItems.map(item => ({
        product: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image
      }));
      const orderData = {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice: subtotal,
        taxPrice: tax,
        shippingPrice: shipping,
        totalPrice: total
      };
      await ordersAPI.createOrder(orderData);
      clearCart();
      toast.success('Order placed successfully!');
      router.push('/checkout/success');
    } catch (error) {
      console.error('Checkout failed:', error);
      toast.error('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white/80 py-8 px-2 sm:px-4 md:px-8">
      {/* Hero Section */}
      <section className="container-nexkartin mb-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
            <FiShoppingCart className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Checkout</h1>
            <p className="text-sm text-gray-500">Enter your details and place your order</p>
          </div>
        </motion.div>
      </section>

      <div className="container-nexkartin grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="sticky top-24">
          <div className="card-nexkartin bg-gradient-to-br from-indigo-50 to-purple-50/80 backdrop-blur-md rounded-2xl shadow-xl p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
              <FiBox className="w-5 h-5 text-indigo-500" /> Order Summary
            </h2>
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center gap-4 pb-4 border-b last:border-b-0">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-base text-gray-900 line-clamp-2">{item.name}</h3>
                    <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-indigo-700">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2 pt-4">
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
          </div>
        </motion.div>

        {/* Shipping & Payment Form */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Shipping Address */}
            <div className="card-nexkartin bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-lg font-bold mb-4 text-gray-900 flex items-center gap-2">
                <FiMapPin className="w-5 h-5 text-indigo-500" /> Shipping Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={shippingAddress.name}
                    onChange={(e) => setShippingAddress({...shippingAddress, name: e.target.value})}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="mobile">Mobile Number *</Label>
                  <Input
                    id="mobile"
                    type="tel"
                    value={shippingAddress.mobile}
                    onChange={(e) => setShippingAddress({...shippingAddress, mobile: e.target.value})}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    pattern="[0-9]{10}"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    value={shippingAddress.pincode}
                    onChange={(e) => setShippingAddress({...shippingAddress, pincode: e.target.value})}
                    placeholder="6 digits [0-9] PIN code"
                    maxLength={6}
                    pattern="[0-9]{6}"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="locality">Locality *</Label>
                  <Input
                    id="locality"
                    value={shippingAddress.locality}
                    onChange={(e) => setShippingAddress({...shippingAddress, locality: e.target.value})}
                    placeholder="Locality / Area / Street"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="address">Address (Area and Street) *</Label>
                  <textarea
                    id="address"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={shippingAddress.address}
                    onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                    placeholder="Flat, House no, Building, Apartment"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="city">City/District/Town *</Label>
                  <Input
                    id="city"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                    placeholder="Your City"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <select
                    id="state"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                    required
                  >
                    <option value="">Select State</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                    <option value="Assam">Assam</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Chhattisgarh">Chhattisgarh</option>
                    <option value="Goa">Goa</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Himachal Pradesh">Himachal Pradesh</option>
                    <option value="Jharkhand">Jharkhand</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Manipur">Manipur</option>
                    <option value="Meghalaya">Meghalaya</option>
                    <option value="Mizoram">Mizoram</option>
                    <option value="Nagaland">Nagaland</option>
                    <option value="Odisha">Odisha</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Sikkim">Sikkim</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Tripura">Tripura</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Uttarakhand">Uttarakhand</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Chandigarh">Chandigarh</option>
                    <option value="Puducherry">Puducherry</option>
                    <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                    <option value="Ladakh">Ladakh</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="landmark">Landmark (Optional)</Label>
                  <Input
                    id="landmark"
                    value={shippingAddress.landmark}
                    onChange={(e) => setShippingAddress({...shippingAddress, landmark: e.target.value})}
                    placeholder="Near famous shop, mall, temple"
                  />
                </div>
                <div>
                  <Label htmlFor="alternatePhone">Alternate Phone (Optional)</Label>
                  <Input
                    id="alternatePhone"
                    type="tel"
                    value={shippingAddress.alternatePhone}
                    onChange={(e) => setShippingAddress({...shippingAddress, alternatePhone: e.target.value})}
                    placeholder="10-digit alternate number"
                    maxLength={10}
                    pattern="[0-9]{10}"
                  />
                </div>
              </div>
            </div>

            {/* Payment Options */}
            <div className="card-nexkartin bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-lg font-bold mb-4 text-gray-900 flex items-center gap-2">
                <FiCreditCard className="w-5 h-5 text-indigo-500" /> Payment Options
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {/* UPI */}
                <div className={`border rounded-lg p-4 transition-all ${paymentMethod === 'upi' ? 'ring-2 ring-indigo-400 bg-indigo-50/50' : 'bg-white/60'}`}>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      id="upi"
                      name="paymentMethod"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-indigo-500"
                    />
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">RECOMMENDED</span>
                    <span className="font-medium">UPI</span>
                    <span className="flex gap-1 ml-2">
                      <span className="text-xs bg-gray-100 px-1 rounded">GPay</span>
                      <span className="text-xs bg-gray-100 px-1 rounded">PhonePe</span>
                      <span className="text-xs bg-gray-100 px-1 rounded">Paytm</span>
                      <span className="text-xs bg-gray-100 px-1 rounded">BHIM</span>
                    </span>
                  </label>
                </div>
                {/* Wallets */}
                <div className={`border rounded-lg p-4 transition-all ${['paytm','phonepe','amazonpay','mobikwik'].includes(paymentMethod) ? 'ring-2 ring-indigo-400 bg-indigo-50/50' : 'bg-white/60'}`}>
                  <div className="font-medium mb-2">Wallets</div>
                  <div className="flex flex-wrap gap-3">
                    {['paytm','phonepe','amazonpay','mobikwik'].map((method) => (
                      <label key={method} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          id={method}
                          name="paymentMethod"
                          value={method}
                          checked={paymentMethod === method}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="accent-indigo-500"
                        />
                        <span className="capitalize">{method}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {/* Card */}
                <div className={`border rounded-lg p-4 transition-all ${paymentMethod === 'card' ? 'ring-2 ring-indigo-400 bg-indigo-50/50' : 'bg-white/60'}`}>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      id="card"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-indigo-500"
                    />
                    <span className="font-medium">Credit/Debit/ATM Card</span>
                    <span className="flex gap-1 ml-2">
                      <span className="text-xs bg-blue-100 px-1 rounded">Visa</span>
                      <span className="text-xs bg-red-100 px-1 rounded">MasterCard</span>
                      <span className="text-xs bg-orange-100 px-1 rounded">RuPay</span>
                    </span>
                  </label>
                </div>
                {/* Net Banking */}
                <div className={`border rounded-lg p-4 transition-all ${paymentMethod === 'netbanking' ? 'ring-2 ring-indigo-400 bg-indigo-50/50' : 'bg-white/60'}`}>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      id="netbanking"
                      name="paymentMethod"
                      value="netbanking"
                      checked={paymentMethod === 'netbanking'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-indigo-500"
                    />
                    <span className="font-medium">Net Banking</span>
                    <span className="flex gap-1 ml-2">
                      <span className="text-xs bg-blue-100 px-1 rounded">SBI</span>
                      <span className="text-xs bg-red-100 px-1 rounded">HDFC</span>
                      <span className="text-xs bg-orange-100 px-1 rounded">ICICI</span>
                      <span className="text-xs bg-green-100 px-1 rounded">Axis</span>
                    </span>
                  </label>
                </div>
                {/* EMI */}
                <div className={`border rounded-lg p-4 transition-all ${['emi','cardless-emi'].includes(paymentMethod) ? 'ring-2 ring-indigo-400 bg-indigo-50/50' : 'bg-white/60'}`}>
                  <div className="font-medium mb-2">EMI (Easy Installments)</div>
                  <div className="flex flex-wrap gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        id="emi"
                        name="paymentMethod"
                        value="emi"
                        checked={paymentMethod === 'emi'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="accent-indigo-500"
                      />
                      <span>Credit Card EMI</span>
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">No Cost EMI</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        id="cardless-emi"
                        name="paymentMethod"
                        value="cardless-emi"
                        checked={paymentMethod === 'cardless-emi'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="accent-indigo-500"
                      />
                      <span>Cardless EMI</span>
                    </label>
                  </div>
                </div>
                {/* Cash on Delivery */}
                <div className={`border rounded-lg p-4 transition-all ${paymentMethod === 'cod' ? 'ring-2 ring-indigo-400 bg-indigo-50/50' : 'bg-white/60'}`}>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      id="cod"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-indigo-500"
                    />
                    <span className="font-medium">Cash/UPI on Delivery</span>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">₹20 handling fee</span>
                  </label>
                </div>
                {/* Gift Card */}
                <div className={`border rounded-lg p-4 transition-all ${paymentMethod === 'giftcard' ? 'ring-2 ring-indigo-400 bg-indigo-50/50' : 'bg-white/60'}`}>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      id="giftcard"
                      name="paymentMethod"
                      value="giftcard"
                      checked={paymentMethod === 'giftcard'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-indigo-500"
                    />
                    <span className="font-medium">Flipkart Gift Card</span>
                  </label>
                </div>
              </div>
            </div>
            <Button type="submit" className="btn-nexkartin btn-nexkartin-primary btn-nexkartin-lg w-full mt-6 flex items-center justify-center gap-2" loading={loading}>
              Place Order <FiArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
