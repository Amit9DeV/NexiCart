'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { productsAPI, reviewsAPI } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { 
  FiStar, 
  FiShoppingCart, 
  FiHeart, 
  FiShare2, 
  FiTruck, 
  FiShield, 
  FiRotateCcw,
  FiCheckCircle,
  FiMinus,
  FiPlus,
  FiArrowLeft,
  FiStar as FiStarOutline
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function ProductPage({ params }) {
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart, getCartItem } = useCart();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        setLoading(true);
        const productResponse = await productsAPI.getProduct(params.id);
        const reviewsResponse = await reviewsAPI.getProductReviews(params.id);
        
        setProduct(productResponse.data.data);
        setReviews(reviewsResponse.data.data);
      } catch (err) {
        setError('Failed to fetch product details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndReviews();
  }, [params.id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0 && value <= product.stock) {
      setQuantity(value);
    } else if (e.target.value === '') {
      setQuantity('');
    }
  };

  const handleQuantityIncrement = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleQuantityDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (newReview.rating === 0 || !newReview.comment.trim()) return;
    
    try {
      const reviewData = { 
        product: product._id, 
        rating: newReview.rating, 
        comment: newReview.comment 
      };
      const response = await reviewsAPI.createReview(reviewData);
      setReviews([response.data.data, ...reviews]);
      setNewReview({ rating: 0, comment: '' });
    } catch (err) {
      console.error(err);
      alert('Failed to submit review.');
    }
  };

  const displayPrice = product?.discountPrice && product.discountPrice < product.price 
    ? product.discountPrice 
    : product?.price;

  const hasDiscount = product?.discountPrice && product.discountPrice < product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" text="Loading product details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <Link href="/products">
            <Button className="btn-nexkartin btn-nexkartin-primary">
              <FiArrowLeft className="mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-xl mb-4">Product not found.</div>
          <Link href="/products">
            <Button className="btn-nexkartin btn-nexkartin-primary">
              <FiArrowLeft className="mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const cartItem = getCartItem(product._id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container-nexkartin py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-indigo-600 transition-colors">Products</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-nexkartin py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-6 bg-white shadow-lg">
              {/* Main Image */}
              <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-gray-100">
                <Image 
                  src={product.images?.[selectedImage]?.url || product.images?.[0]?.url || '/placeholder-image.svg'}
                  alt={product.name} 
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
                {hasDiscount && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    {discountPercentage}% OFF
                  </div>
                )}
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white font-semibold tracking-wider uppercase text-lg">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        selectedImage === index 
                          ? 'border-indigo-500 shadow-md' 
                          : 'border-gray-200 hover:border-indigo-300'
                      }`}
                    >
                      <Image 
                        src={image.url} 
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Product Header */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex items-center mr-4">
                  {[...Array(5)].map((_, i) => (
                    <FiStar 
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.ratings?.average || 0) 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {product.ratings?.average?.toFixed(1) || '0.0'} ({product.ratings?.count || 0} reviews)
                  </span>
                </div>
                <span className="text-sm text-gray-500">•</span>
                <span className="ml-2 text-sm text-gray-500">
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline space-x-3 mb-6">
                <span className="text-3xl lg:text-4xl font-bold text-indigo-600">
                  ₹{displayPrice?.toFixed(2)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      ₹{product.price.toFixed(2)}
                    </span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-semibold">
                      Save ₹{(product.price - product.discountPrice).toFixed(2)}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Quantity Selector */}
            <div className="bg-white rounded-xl p-6 border">
              <div className="flex items-center justify-between mb-4">
                <Label className="text-lg font-semibold text-gray-900">Quantity</Label>
                <span className="text-sm text-gray-500">
                  {product.stock} available
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <button
                    onClick={handleQuantityDecrement}
                    disabled={quantity <= 1}
                    className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FiMinus className="h-4 w-4" />
                  </button>
                  <Input 
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    min="1"
                    max={product.stock}
                    className="w-20 text-center border-0 focus:ring-0"
                  />
                  <button
                    onClick={handleQuantityIncrement}
                    disabled={quantity >= product.stock}
                    className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FiPlus className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex space-x-3">
                  <Button 
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    variant="outline"
                    size="lg"
                    className={`${isWishlisted ? 'text-red-500 border-red-500' : ''}`}
                  >
                    <FiHeart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </Button>
                  <Button variant="outline" size="lg">
                    <FiShare2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-4">
              <Button 
                onClick={() => addToCart(product, quantity)}
                disabled={product.stock === 0 || quantityInCart >= product.stock}
                size="lg"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:transform-none"
              >
                <FiShoppingCart className="mr-3 h-6 w-6" />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              
              {quantityInCart > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <FiCheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-blue-800">
                      You have {quantityInCart} of this item in your cart.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 text-center border">
                <FiTruck className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                <h4 className="font-semibold text-sm">Free Shipping</h4>
                <p className="text-xs text-gray-600">On orders over ₹150</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center border">
                <FiShield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-semibold text-sm">Secure Payment</h4>
                <p className="text-xs text-gray-600">100% secure checkout</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center border">
                <FiRotateCcw className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <h4 className="font-semibold text-sm">Easy Returns</h4>
                <p className="text-xs text-gray-600">30-day return policy</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16"
        >
          <Card className="p-8 bg-white shadow-lg">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Customer Reviews</h2>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FiStar 
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.ratings?.average || 0) 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  {product.ratings?.average?.toFixed(1) || '0.0'}
                </span>
                <span className="text-gray-500">({product.ratings?.count || 0} reviews)</span>
              </div>
            </div>

            {/* Review Form */}
            {isAuthenticated && (
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Rating</Label>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          className="focus:outline-none"
                        >
                          {star <= newReview.rating ? (
                            <FiStar className="h-8 w-8 fill-yellow-400 text-yellow-400 hover:scale-110 transition-transform" />
                          ) : (
                            <FiStarOutline className="h-8 w-8 text-gray-300 hover:text-yellow-400 transition-colors" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="review-comment" className="text-sm font-medium text-gray-700 mb-2 block">
                      Your Review
                    </Label>
                    <textarea
                      id="review-comment"
                      value={newReview.comment}
                      onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                      placeholder="Share your experience with this product..."
                      rows="4"
                    />
                  </div>
                  
                  <Button 
                    type="submit"
                    disabled={newReview.rating === 0 || !newReview.comment.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    Submit Review
                  </Button>
                </form>
              </div>
            )}

            {/* Reviews List */}
            <div className="space-y-6">
              {reviews.length > 0 ? (
                reviews.map(review => (
                  <motion.div
                    key={review._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-b border-gray-200 pb-6 last:border-b-0"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-indigo-600 font-semibold">
                            {review.user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{review.user.name}</h4>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <FiStar 
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating 
                                    ? 'fill-yellow-400 text-yellow-400' 
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FiStarOutline className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
