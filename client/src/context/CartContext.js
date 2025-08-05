'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { cartAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  // Load cart from backend when user is authenticated
  useEffect(() => {
    const loadCart = async () => {
      console.log('🛒 CartContext: Loading cart...', {
        authLoading,
        isAuthenticated,
        user: user?._id,
        timestamp: new Date().toISOString()
      });

      // Wait for auth loading to complete
      if (authLoading) {
        console.log('🛒 CartContext: Auth still loading, waiting...');
        return;
      }

      if (isAuthenticated && user?._id) {
        console.log('🛒 CartContext: User authenticated, loading from backend...');
        try {
          const response = await cartAPI.getCart();
          console.log('🛒 CartContext: Backend cart loaded:', response.data.items?.length || 0, 'items');
          setCartItems(response.data.items || []);
        } catch (error) {
          console.error('🛒 CartContext: Error loading cart from backend:', error);
          // If cart doesn't exist, start with empty cart
          if (error.response?.status === 404) {
            console.log('🛒 CartContext: No cart found in backend, starting empty');
            setCartItems([]);
          } else {
            console.error('🛒 CartContext: Backend error, falling back to localStorage');
            // Fallback to localStorage
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
              setCartItems(JSON.parse(savedCart));
            } else {
              setCartItems([]);
            }
          }
        }
      } else if (!authLoading) {
        console.log('🛒 CartContext: Guest user, loading from localStorage...');
        // For guest users, use localStorage (only after auth loading is done)
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart);
            console.log('🛒 CartContext: localStorage cart loaded:', parsedCart.length, 'items');
            setCartItems(parsedCart);
          } catch (error) {
            console.error('Error parsing cart from localStorage:', error);
            setCartItems([]);
            localStorage.removeItem('cart'); // Remove corrupted data
          }
        } else {
          console.log('🛒 CartContext: No cart in localStorage, starting empty');
          setCartItems([]);
        }
      }
      
      if (!authLoading) {
        console.log('🛒 CartContext: Cart loading complete');
        setIsLoading(false);
      }
    };

    loadCart();
  }, [isAuthenticated, user, authLoading]);

  // Save to localStorage for guest users
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isLoading, isAuthenticated]);

  const addToCart = async (product, quantity = 1) => {
    try {
      if (isAuthenticated && user?._id) {
        // Add to backend
        const response = await cartAPI.addToCart({
          productId: product._id,
          quantity
        });
        setCartItems(response.data.items || []);
        toast.success('Added to cart!');
      } else {
        // Guest user - use localStorage
        setCartItems(prevItems => {
          const existingItem = prevItems.find(item => item._id === product._id);
          
          if (existingItem) {
            const updatedItems = prevItems.map(item =>
              item._id === product._id
                ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
                : item
            );
            toast.success('Cart updated!');
            return updatedItems;
          } else {
            const newItem = {
              _id: product._id,
              name: product.name,
              price: product.discountPrice || product.price,
              image: product.images?.[0]?.url || '/placeholder-image.svg',
              stock: product.stock,
              quantity: Math.min(quantity, product.stock)
            };
            toast.success('Added to cart!');
            return [...prevItems, newItem];
          }
        });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      if (isAuthenticated && user?._id) {
        // Remove from backend
        const response = await cartAPI.removeFromCart({
          productId
        });
        setCartItems(response.data.items || []);
        toast.success('Removed from cart!');
      } else {
        // Guest user - use localStorage
        setCartItems(prevItems => {
          const updatedItems = prevItems.filter(item => item._id !== productId);
          toast.success('Removed from cart!');
          return updatedItems;
        });
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove from cart');
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    try {
      if (isAuthenticated && user?._id) {
        // Update quantity in backend
        const response = await cartAPI.updateQuantity({
          productId,
          quantity
        });
        setCartItems(response.data.items || []);
      } else {
        // Guest user - update localStorage
        setCartItems(prevItems =>
          prevItems.map(item =>
            item._id === productId
              ? { ...item, quantity: Math.min(quantity, item.stock) }
              : item
          )
        );
      }
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const clearCart = async () => {
    try {
      if (isAuthenticated && user?._id) {
        // Clear backend cart
        await cartAPI.clearCart();
        setCartItems([]);
        toast.success('Cart cleared!');
      } else {
        // Guest user - clear localStorage
        setCartItems([]);
        toast.success('Cart cleared!');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const isInCart = (productId) => {
    return cartItems.some(item => item._id === productId);
  };

  const getCartItem = (productId) => {
    return cartItems.find(item => item._id === productId);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    isInCart,
    getCartItem,
    isLoading
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
