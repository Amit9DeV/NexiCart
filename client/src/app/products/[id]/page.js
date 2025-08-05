'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { productsAPI, reviewsAPI } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { FiStar } from 'react-icons/fi';

export default function ProductPage({ params }) {
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
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
  
  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!product) return <div className="text-center py-10">Product not found.</div>;

  const cartItem = getCartItem(product._id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Product Image Gallery */}
      <div>
        <div className="relative aspect-square rounded-lg overflow-hidden">
          <Image 
            src={product.images?.[0]?.url || '/placeholder-image.svg'}
            alt={product.name} 
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Product Details */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <div className="flex items-center mb-4">
          <FiStar className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
          <span>{product.ratings.average.toFixed(1)} ({product.ratings.count} reviews)</span>
        </div>
        <p className="text-lg text-gray-600 mb-4">{product.description}</p>
        <p className="text-2xl font-bold mb-4">${product.price.toFixed(2)}</p>
        
        <div className="flex items-center mb-4">
          <Label htmlFor="quantity" className="mr-2">Quantity:</Label>
          <Input 
            id="quantity"
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            min="1"
            max={product.stock}
            className="w-20"
          />
        </div>

        <Button 
          onClick={() => addToCart(product, quantity)}
          disabled={product.stock === 0 || quantityInCart >= product.stock}
          className="w-full"
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
        {quantityInCart > 0 && (
          <p className="text-sm text-gray-600 mt-2 text-center">
            You have {quantityInCart} of this item in your cart.
          </p>
        )}

        {/* Review Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Reviews</h2>
          {isAuthenticated && (
            <form onSubmit={handleReviewSubmit} className="mb-6">
              <div className="flex items-center mb-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <FiStar 
                    key={star} 
                    className={`h-6 w-6 cursor-pointer ${star <= newReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                  />
                ))}
              </div>
              <textarea
                value={newReview.comment}
                onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                className="w-full border rounded p-2 mb-2"
                placeholder="Write your review..."
                rows="3"
              />
              <Button type="submit">Submit Review</Button>
            </form>
          )}
          <div className="space-y-4">
            {reviews.map(review => (
              <div key={review._id} className="border-b pb-4">
                <div className="flex items-center mb-1">
                  <p className="font-semibold mr-2">{review.user.name}</p>
                  <div className="flex">
                    {[...Array(review.rating)].map((_, i) => (
                      <FiStar key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p>{review.comment}</p>
              </div>
            ))}
            {reviews.length === 0 && <p>No reviews yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
