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
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { 
  FiShoppingCart, 
  FiBox, 
  FiMapPin, 
  FiCreditCard, 
  FiArrowRight,
  FiArrowLeft,
  FiShield,
  FiTruck,
  FiCheckCircle,
  FiLock,
  FiStar,
  FiGift,
  FiClock,
  FiZap,
  FiDollarSign,
  FiSmartphone,
  FiHome,
  FiUser,
  FiMail,
  FiPhone,
  FiNavigation,
  FiEdit3,
  FiTrash2,
  FiPlus,
  FiMinus
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || '',
    mobile: user?.mobile || '',
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" text="Redirecting..." />
      </div>
    );
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

  const paymentMethods = [
    {
      id: 'upi',
      name: 'UPI',
      description: 'Pay using UPI apps',
      icon: FiZap,
      badge: 'RECOMMENDED',
      badgeColor: 'bg-green-100 text-green-800',
      options: ['GPay', 'PhonePe', 'Paytm', 'BHIM'],
      popular: true
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Visa, MasterCard, RuPay',
      icon: FiCreditCard,
      options: ['Visa', 'MasterCard', 'RuPay'],
      popular: false
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      description: 'Pay using your bank account',
      icon: FiHome,
      options: ['SBI', 'HDFC', 'ICICI', 'Axis'],
      popular: false
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay when you receive',
      icon: FiDollarSign,
      badge: '₹20 fee',
      badgeColor: 'bg-yellow-100 text-yellow-800',
      popular: false
    },
    {
      id: 'emi',
      name: 'EMI Options',
      description: 'Pay in easy installments',
      icon: FiClock,
      badge: 'No Cost EMI',
      badgeColor: 'bg-purple-100 text-purple-800',
      popular: false
    }
  ];

  const steps = [
    { id: 1, name: 'Address', icon: FiMapPin },
    { id: 2, name: 'Payment', icon: FiCreditCard },
    { id: 3, name: 'Review', icon: FiCheckCircle }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container-nexkartin py-4">
          <div className="flex items-center justify-between">
            <Link href="/cart" className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors">
              <FiArrowLeft className="w-5 h-5 mr-2" />
              Back to Cart
            </Link>
            <div className="flex items-center space-x-6">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    currentStep >= step.id 
                      ? 'bg-indigo-600 border-indigo-600 text-white' 
                      : 'border-gray-300 text-gray-400'
                  }`}>
                    <step.icon className="w-4 h-4" />
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    currentStep >= step.id ? 'text-indigo-600' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-4 ${
                      currentStep > step.id ? 'bg-indigo-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <FiShield className="w-4 h-4" />
              <span>Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container-nexkartin py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary - Sticky */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="sticky top-32"
            >
              <Card className="bg-white shadow-xl border-0 rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <FiBox className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Order Summary</CardTitle>
                      <p className="text-indigo-100 text-sm">{cartItems.length} items</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Items List */}
                  <div className="space-y-4 max-h-64 overflow-y-auto mb-6">
                    {cartItems.map((item, index) => (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white shadow-sm">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center">
                            {item.quantity}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{item.name}</h3>
                          <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-indigo-600">₹{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 border-t pt-4">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax (10%)</span>
                      <span>₹{tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span className={shipping === 0 ? 'text-green-600 font-semibold' : ''}>
                        {shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    
                    {/* Free Shipping Progress */}
                    {subtotal < freeShippingThreshold && (
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="flex justify-between text-xs text-gray-600 mb-2">
                          <span>Free shipping on orders over ₹{freeShippingThreshold}</span>
                          <span>{Math.round(freeShippingProgress * 100)}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-400 to-indigo-500 transition-all duration-500"
                            style={{ width: `${freeShippingProgress * 100}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Add ₹{(freeShippingThreshold - subtotal).toFixed(2)} more for free shipping
                        </p>
                      </div>
                    )}

                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">Total</span>
                        <span className="text-2xl font-bold text-indigo-600">₹{total.toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Including all taxes</p>
                    </div>
                  </div>

                  {/* Trust Indicators */}
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <FiShield className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm font-semibold text-green-800">Secure Payment</p>
                        <p className="text-xs text-green-600">256-bit SSL encryption</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <FiTruck className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-semibold text-blue-800">Fast Delivery</p>
                        <p className="text-xs text-blue-600">2-4 business days</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Shipping Address Section */}
                <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                          <FiMapPin className="w-5 h-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">Delivery Address</CardTitle>
                          <p className="text-blue-100 text-sm">Where should we deliver your order?</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAddressForm(!showAddressForm)}
                        className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                      >
                        <FiEdit3 className="w-4 h-4 mr-2" />
                        {showAddressForm ? 'Cancel' : 'Add New'}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name" className="flex items-center space-x-2 mb-2">
                          <FiUser className="w-4 h-4 text-gray-500" />
                          <span>Full Name *</span>
                        </Label>
                        <Input
                          id="name"
                          value={shippingAddress.name}
                          onChange={(e) => setShippingAddress({...shippingAddress, name: e.target.value})}
                          placeholder="Enter your full name"
                          className="h-12"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="mobile" className="flex items-center space-x-2 mb-2">
                          <FiPhone className="w-4 h-4 text-gray-500" />
                          <span>Mobile Number *</span>
                        </Label>
                        <Input
                          id="mobile"
                          type="tel"
                          value={shippingAddress.mobile}
                          onChange={(e) => setShippingAddress({...shippingAddress, mobile: e.target.value})}
                          placeholder="10-digit mobile number"
                          maxLength={10}
                          pattern="[0-9]{10}"
                          className="h-12"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="pincode" className="flex items-center space-x-2 mb-2">
                          <FiNavigation className="w-4 h-4 text-gray-500" />
                          <span>Pincode *</span>
                        </Label>
                        <Input
                          id="pincode"
                          value={shippingAddress.pincode}
                          onChange={(e) => setShippingAddress({...shippingAddress, pincode: e.target.value})}
                          placeholder="6 digits PIN code"
                          maxLength={6}
                          pattern="[0-9]{6}"
                          className="h-12"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="locality" className="flex items-center space-x-2 mb-2">
                          <FiHome className="w-4 h-4 text-gray-500" />
                          <span>Locality *</span>
                        </Label>
                        <Input
                          id="locality"
                          value={shippingAddress.locality}
                          onChange={(e) => setShippingAddress({...shippingAddress, locality: e.target.value})}
                          placeholder="Locality / Area / Street"
                          className="h-12"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="address" className="flex items-center space-x-2 mb-2">
                          <FiHome className="w-4 h-4 text-gray-500" />
                          <span>Complete Address *</span>
                        </Label>
                        <textarea
                          id="address"
                          className="flex min-h-[100px] w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                          value={shippingAddress.address}
                          onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                          placeholder="Flat, House no, Building, Apartment, etc."
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="city" className="flex items-center space-x-2 mb-2">
                          <FiHome className="w-4 h-4 text-gray-500" />
                          <span>City *</span>
                        </Label>
                        <Input
                          id="city"
                          value={shippingAddress.city}
                          onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                          placeholder="Your City"
                          className="h-12"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state" className="flex items-center space-x-2 mb-2">
                          <FiNavigation className="w-4 h-4 text-gray-500" />
                          <span>State *</span>
                        </Label>
                        <select
                          id="state"
                          className="flex h-12 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                        <Label htmlFor="landmark" className="flex items-center space-x-2 mb-2">
                          <FiNavigation className="w-4 h-4 text-gray-500" />
                          <span>Landmark (Optional)</span>
                        </Label>
                        <Input
                          id="landmark"
                          value={shippingAddress.landmark}
                          onChange={(e) => setShippingAddress({...shippingAddress, landmark: e.target.value})}
                          placeholder="Near famous shop, mall, temple"
                          className="h-12"
                        />
                      </div>
                      <div>
                        <Label htmlFor="alternatePhone" className="flex items-center space-x-2 mb-2">
                          <FiPhone className="w-4 h-4 text-gray-500" />
                          <span>Alternate Phone (Optional)</span>
                        </Label>
                        <Input
                          id="alternatePhone"
                          type="tel"
                          value={shippingAddress.alternatePhone}
                          onChange={(e) => setShippingAddress({...shippingAddress, alternatePhone: e.target.value})}
                          placeholder="10-digit alternate number"
                          maxLength={10}
                          pattern="[0-9]{10}"
                          className="h-12"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Options Section */}
                <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <FiCreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Payment Method</CardTitle>
                        <p className="text-green-100 text-sm">Choose your preferred payment option</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {paymentMethods.map((method) => (
                        <motion.div
                          key={method.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`relative border-2 rounded-xl p-4 transition-all duration-300 cursor-pointer hover:shadow-md ${
                            paymentMethod === method.id
                              ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                              : 'border-gray-200 bg-white hover:border-indigo-300'
                          }`}
                          onClick={() => setPaymentMethod(method.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                paymentMethod === method.id
                                  ? 'bg-indigo-100 text-indigo-600'
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                <method.icon className="w-6 h-6" />
                              </div>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <h3 className="font-semibold text-gray-900">{method.name}</h3>
                                  {method.badge && (
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${method.badgeColor}`}>
                                      {method.badge}
                                    </span>
                                  )}
                                  {method.popular && (
                                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-semibold">
                                      POPULAR
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                                {method.options && (
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {method.options.map((option) => (
                                      <span key={option} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                        {option}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              paymentMethod === method.id
                                ? 'border-indigo-500 bg-indigo-500'
                                : 'border-gray-300'
                            }`}>
                              {paymentMethod === method.id && (
                                <FiCheckCircle className="w-3 h-3 text-white" />
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Security Notice */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start space-x-3">
                        <FiLock className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-blue-900">Secure Payment</h4>
                          <p className="text-sm text-blue-700 mt-1">
                            Your payment information is encrypted and secure. We never store your card details.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Place Order Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <LoadingSpinner size="sm" />
                        <span>Processing Order...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <FiLock className="w-5 h-5" />
                        <span>Place Order Securely</span>
                        <FiArrowRight className="w-5 h-5" />
                      </div>
                    )}
                  </Button>
                  
                  <p className="text-center text-sm text-gray-500 mt-3">
                    By placing your order, you agree to our{' '}
                    <Link href="/terms" className="text-indigo-600 hover:underline">Terms of Service</Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</Link>
                  </p>
                </motion.div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
