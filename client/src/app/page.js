'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { productsAPI } from '@/lib/api';
import ProductCard from '@/components/product/ProductCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { 
  FiArrowRight, 
  FiStar, 
  FiTruck, 
  FiShield, 
  FiHeadphones,
  FiTrendingUp,
  FiClock,
  FiGift,
  FiGrid,
  FiShoppingBag,
  FiHeart,
  FiAward,
  FiZap,
  FiCheckCircle
} from 'react-icons/fi';

export default function Home() {
  const [heroProducts, setHeroProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        const [heroResponse, featuredResponse, newArrivalsResponse] = await Promise.all([
          productsAPI.getHeroProducts(),
          productsAPI.getFeaturedProducts(),
          productsAPI.getNewArrivals()
        ]);
        
        setHeroProducts(heroResponse.data?.data || []);
        setFeaturedProducts(featuredResponse.data?.data || []);
        setNewArrivals(newArrivalsResponse.data?.data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching homepage data:', error);
        // Fallback to regular products if homepage APIs fail
        try {
          const response = await productsAPI.getProducts({ limit: 12 });
          const productsData = response.data?.data || [];
          setHeroProducts(productsData.slice(0, 4));
          setFeaturedProducts(productsData.filter(p => p.isFeatured || p.ratings?.average > 4).slice(0, 4));
          setNewArrivals(productsData.slice(4, 8));
        } catch (fallbackError) {
          console.error('Error fetching fallback products:', fallbackError);
        }
        setLoading(false);
      }
    };

    fetchHomepageData();
  }, []);

  const features = [
    {
      icon: FiTruck,
      title: 'FREE SHIPPING',
      description: 'For orders above $150',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: FiShield,
      title: '100% SAFE',
      description: 'View our benefits',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: FiHeadphones,
      title: '24/7 SUPPORT',
      description: 'Unlimited help desk',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: FiClock,
      title: 'FREE RETURNS',
      description: 'Track or off orders',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const categories = [
    { name: 'Furniture', icon: FiGrid, count: '1,234', color: 'from-orange-500 to-red-500' },
    { name: 'Electronics', icon: FiZap, count: '2,567', color: 'from-blue-500 to-cyan-500' },
    { name: 'Fashion', icon: FiShoppingBag, count: '3,890', color: 'from-pink-500 to-purple-500' },
    { name: 'Home & Garden', icon: FiHeart, count: '1,456', color: 'from-green-500 to-emerald-500' },
    { name: 'Sports', icon: FiAward, count: '2,345', color: 'from-yellow-500 to-orange-500' },
    { name: 'Books', icon: FiStar, count: '1,789', color: 'from-indigo-500 to-purple-500' }
  ];

  const stats = [
    { number: '50K+', label: 'Happy Customers' },
    { number: '10K+', label: 'Products Available' },
    { number: '24/7', label: 'Customer Support' },
    { number: '99%', label: 'Satisfaction Rate' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" text="Loading amazing products..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-indigo-50">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/20 to-purple-100/20"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-20 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-40 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
          </div>
        </div>
        
        <div className="container-nexkartin relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center py-12 sm:py-16 lg:py-20 xl:py-32">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6 lg:space-y-8 order-2 lg:order-1"
            >
              <div className="space-y-4 lg:space-y-6">
                <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-xs sm:text-sm font-medium">
                  <FiZap className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  New Collection Available
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Discover Amazing
                  <span className="gradient-text block"> Products</span>
                </h1>
                
                <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-lg leading-relaxed">
                  Shop the latest trends in furniture, electronics, fashion, and more. 
                  Quality products at unbeatable prices with free shipping on orders over $150.
                </p>
            </div>
            
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button className="btn-nexkartin btn-nexkartin-primary btn-nexkartin-lg sm:btn-nexkartin-xl">
                  Shop Now
                  <FiArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Button>
                <Button className="btn-nexkartin btn-nexkartin-outline btn-nexkartin-lg sm:btn-nexkartin-xl">
                  View Categories
              </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-6 lg:pt-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{stat.number}</div>
                    <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative order-1 lg:order-2"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl lg:rounded-3xl transform rotate-3"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl lg:rounded-3xl transform -rotate-3"></div>
                <div className="relative bg-white rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {heroProducts.slice(0, 4).map((product, index) => (
                      <motion.div
                        key={product._id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="card-nexkartin p-3 sm:p-4 hover-lift"
                      >
                        <div className="w-full h-16 sm:h-20 lg:h-24 bg-gray-100 rounded-lg mb-2 sm:mb-3">
                          {product.images && product.images[0] && (
                            <Image 
                              className='w-full h-full object-cover' 
                              src={product.images[0].url} 
                              alt={product.name}
                              width={200}
                              height={200}
                            />
                          )}
                        </div>
                        <h3 className="font-semibold text-xs sm:text-sm text-gray-900 line-clamp-2">{product.name}</h3>
                        <p className="text-sm sm:text-lg font-bold text-indigo-600">${product.price}</p>
                      </motion.div>
                    ))}
            </div>
          </div>
        </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="section-nexkartin-sm lg:section-nexkartin">
        <div className="container-nexkartin">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${feature.bgColor} rounded-xl p-4 sm:p-6 text-center hover-lift`}
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${feature.color} bg-white rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-sm`}>
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section-nexkartin-sm lg:section-nexkartin bg-gray-50">
        <div className="container-nexkartin">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-heading-2 mb-4">Shop by Category</h2>
            <p className="text-sm sm:text-base lg:text-body text-gray-600 max-w-2xl mx-auto px-4">
              Explore our wide range of categories and find exactly what you&apos;re looking for
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card-nexkartin p-3 sm:p-4 lg:p-6 text-center hover-lift cursor-pointer group"
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                </div>
                <h3 className="text-sm sm:text-base lg:text-heading-4 mb-1 sm:mb-2">{category.name}</h3>
                <p className="text-xs sm:text-sm lg:text-caption">{category.count} products</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-nexkartin-sm lg:section-nexkartin">
        <div className="container-nexkartin">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 sm:mb-12"
          >
            <div className="flex items-center justify-center space-x-2 mb-4">
              <FiTrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
              <h2 className="text-2xl sm:text-3xl lg:text-heading-2">Featured Products</h2>
            </div>
            <p className="text-sm sm:text-base lg:text-body text-gray-600 max-w-2xl mx-auto px-4">
              Discover our handpicked selection of premium products that our customers love
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-8 sm:mt-12"
          >
            <Button className="btn-nexkartin btn-nexkartin-primary btn-nexkartin-lg">
              View All Products
              <FiArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Button>
          </motion.div>
              </div>
      </section>

      {/* New Arrivals */}
      <section className="section-nexkartin-sm lg:section-nexkartin bg-gray-50">
        <div className="container-nexkartin">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 sm:mb-12"
          >
            <div className="flex items-center justify-center space-x-2 mb-4">
              <FiGift className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              <h2 className="text-2xl sm:text-3xl lg:text-heading-2">New Arrivals</h2>
            </div>
            <p className="text-sm sm:text-base lg:text-body text-gray-600 max-w-2xl mx-auto px-4">
              Be the first to discover our latest products and exclusive releases
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
              </div>
            </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-nexkartin-sm lg:section-nexkartin">
        <div className="container-nexkartin">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-heading-2 mb-4">Why Choose NexiCart?</h2>
            <p className="text-sm sm:text-base lg:text-body text-gray-600 max-w-2xl mx-auto px-4">
              We provide the best shopping experience with premium services
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[
              {
                icon: FiCheckCircle,
                title: 'Quality Guaranteed',
                description: 'All our products are carefully selected and quality tested'
              },
              {
                icon: FiTruck,
                title: 'Fast Delivery',
                description: 'Get your orders delivered within 24-48 hours'
              },
              {
                icon: FiShield,
                title: 'Secure Shopping',
                description: 'Your data is protected with bank-level security'
              },
              {
                icon: FiHeadphones,
                title: '24/7 Support',
                description: 'Our dedicated team is here to help you anytime'
              },
              {
                icon: FiHeart,
                title: 'Customer First',
                description: 'Your satisfaction is our top priority'
              },
              {
                icon: FiAward,
                title: 'Best Prices',
                description: 'Competitive pricing with regular deals and discounts'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card-nexkartin p-4 sm:p-6 text-center hover-lift"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-sm sm:text-base lg:text-heading-4 mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-xs sm:text-sm lg:text-body text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
            </div>
      </section>

      {/* Newsletter Section */}
      <section className="section-nexkartin-sm lg:section-nexkartin bg-gradient-nexkartin text-white">
        <div className="container-nexkartin">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-2xl mx-auto px-4"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-heading-2 mb-4">Stay Updated</h2>
            <p className="text-sm sm:text-base lg:text-body mb-6 sm:mb-8 opacity-90">
              Subscribe to our newsletter and be the first to know about new products, 
              exclusive offers, and special discounts.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white text-sm sm:text-base"
              />
              <Button className="btn-nexkartin bg-white text-indigo-600 hover:bg-gray-100 text-sm sm:text-base">
                Subscribe
                </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
