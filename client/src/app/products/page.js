'use client';

import { useState, useEffect, useCallback } from 'react';
import { productsAPI } from '@/lib/api';
import ProductCard from '@/components/product/ProductCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const categories = [
  'All',
  'Electronics',
  'Clothing',
  'Books',
  'Home & Garden',
  'Sports',
  'Beauty',
  'Toys',
  'Automotive',
  'Health',
  'Food'
];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let response;
      
      if (selectedCategory === 'All') {
        response = await productsAPI.getProducts();
      } else {
        response = await productsAPI.getProductsByCategory(selectedCategory);
      }
      
      // Ensure we have a valid array of products
      const productsData = response.data?.data || [];
      setProducts(productsData);
    } catch (err) {
      setError('Failed to fetch products. Please try again later.');
      console.error('Products page - API Error:', err);
      console.error('Products page - Error details:', err.response || err.message);
      setProducts([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const response = await productsAPI.searchProducts(searchTerm);
      const searchResults = response.data?.data || [];
      setProducts(searchResults);
      setSelectedCategory('All');
    } catch (err) {
      setError('Failed to search products.');
      console.error('Search error:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSearchTerm('');
  };

  if (loading) {
    return <div className="text-center py-10">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Shop Products</h1>
        
        {/* Search */}
        <form onSubmit={handleSearch} className="flex mb-6">
          <Input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 mr-2"
          />
          <Button type="submit">Search</Button>
        </form>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <p className="col-span-full text-center">No products found.</p>
        )}
      </div>
    </div>
  );
}
