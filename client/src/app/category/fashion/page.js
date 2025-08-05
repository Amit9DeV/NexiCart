'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/product/ProductCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { productsAPI } from '@/lib/api';
import {
  FiGrid,
  FiFilter,
  FiSortAsc,
  FiStar,
  FiTruck,
  FiShield,
  FiHeart,
  FiShoppingCart,
  FiChevronDown,
  FiChevronUp,
  FiUser,
  FiShoppingBag,
  FiGift,
  FiBox,
  FiTrendingUp
} from 'react-icons/fi';
import { AnimatePresence } from 'framer-motion';

export default function FashionPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productsAPI.getProducts({ 
          category: 'fashion',
          limit: 50 
        });
        const productsData = response.data?.data || [];
        setProducts(productsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching fashion products:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const fashionCategories = [
    { name: "Men's Clothing", icon: FiUser, count: 45 },
    { name: "Women's Clothing", icon: FiUser, count: 68 },
    { name: 'Accessories', icon: FiShoppingBag, count: 32 },
    { name: 'Footwear', icon: FiBox, count: 28 },
    { name: 'Jewelry', icon: FiGift, count: 25 },
    { name: 'Bags', icon: FiShoppingBag, count: 18 },
    { name: 'Watches', icon: FiGrid, count: 22 },
    { name: 'Sunglasses', icon: FiTrendingUp, count: 15 },
  ];

  const features = [
    {
      icon: FiTrendingUp,
      title: 'Latest Trends',
      description: 'Stay ahead of fashion'
    },
    {
      icon: FiShield,
      title: 'Quality Assured',
      description: 'Premium materials'
    },
    {
      icon: FiTruck,
      title: 'Free Shipping',
      description: 'On orders over $100'
    },
    {
      icon: FiHeart,
      title: 'Easy Returns',
      description: '30-day return policy'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" text="Loading fashion collection..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container-nexkartin relative z-10">
          <div className="py-12 sm:py-16 lg:py-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center px-4 py-2 bg-pink-100 text-pink-800 rounded-full text-sm font-medium mb-6">
                <FiTrendingUp className="w-5 h-5 mr-2" />
                Fashion Collection
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Express Your
                <span className="gradient-text block"> Unique Style</span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                Discover the latest trends in fashion and accessories. From casual wear to elegant pieces, 
                find your perfect style that reflects your personality and confidence.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="btn-nexkartin btn-nexkartin-primary btn-nexkartin-lg">
                  Shop Now
                </Button>
                <Button className="btn-nexkartin btn-nexkartin-outline btn-nexkartin-lg">
                  View Categories
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-nexkartin-sm">
        <div className="container-nexkartin">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card-nexkartin p-4 sm:p-6 text-center hover-lift"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-100 text-pink-600 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="section-nexkartin-sm bg-gray-50">
        <div className="container-nexkartin">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-heading-2 mb-4">Shop by Category</h2>
            <p className="text-sm sm:text-base lg:text-body text-gray-600">
              Find the perfect fashion items for your style
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-6">
            {fashionCategories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card-nexkartin p-4 sm:p-6 text-center hover-lift cursor-pointer group"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <category.icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                </div>
                <h3 className="text-sm sm:text-base lg:text-heading-4 mb-1 sm:mb-2">{category.name}</h3>
                <p className="text-xs sm:text-sm lg:text-caption">{category.count} items</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="section-nexkartin-sm lg:section-nexkartin">
        <div className="container-nexkartin">
          {/* Filters and Sort */}
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-nexkartin btn-nexkartin-outline flex items-center justify-center"
              >
                <FiFilter className="w-4 h-4 mr-2" />
                Filters
                {showFilters ? <FiChevronUp className="w-4 h-4 ml-2" /> : <FiChevronDown className="w-4 h-4 ml-2" />}
              </Button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="btn-nexkartin btn-nexkartin-outline flex items-center"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            <div className="text-sm text-gray-600">
              {products.length} products found
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="card-nexkartin p-6 mb-8"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Price Range */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0"
                        max="500"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Categories */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
                    <div className="space-y-2">
                      {fashionCategories.map((category) => (
                        <label key={category.name} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category.name)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCategories([...selectedCategories, category.name]);
                              } else {
                                setSelectedCategories(selectedCategories.filter(c => c !== category.name));
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm">{category.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Rating</h3>
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <label key={rating} className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          <div className="flex items-center">
                            {[...Array(rating)].map((_, i) => (
                              <FiStar key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                            ))}
                            <span className="text-sm ml-1">& up</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Availability */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Availability</h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-sm">In Stock</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-sm">Free Shipping</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-sm">On Sale</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-sm">New Arrival</span>
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product, index) => (
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

          {/* Load More */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-12"
          >
            <Button className="btn-nexkartin btn-nexkartin-primary btn-nexkartin-lg">
              Load More Products
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 