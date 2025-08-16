'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminAPI } from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  FiStar, 
  FiTrendingUp, 
  FiGift, 
  FiHome, 
  FiSearch,
  FiCheck,
  FiX,
  FiMove,
  FiEye
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import Image from 'next/image';
import HomepagePreview from '@/components/admin/HomepagePreview';

export default function HomepageSectionsAdmin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [changes, setChanges] = useState({});
  const [showPreview, setShowPreview] = useState(false);

  const categories = [
    'Electronics', 'Clothing', 'Books', 'Home & Garden', 
    'Sports', 'Beauty', 'Toys', 'Automotive', 'Health', 'Food', 'Other'
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = {
          page: currentPage,
          limit: 20,
          search: searchTerm,
          category: categoryFilter
        };
        const response = await adminAPI.getProductsForSections(params);
        setProducts(response.data.data.products);
        setTotalPages(response.data.data.pagination.pages);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [currentPage, searchTerm, categoryFilter]);

  const handleSectionToggle = (productId, section, value) => {
    setChanges(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [section]: value
      }
    }));
  };

  const handleOrderChange = (productId, orderField, value) => {
    setChanges(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [orderField]: parseInt(value) || 0
      }
    }));
  };

  const getProductValue = (product, field) => {
    return changes[product._id]?.[field] !== undefined 
      ? changes[product._id][field] 
      : product[field];
  };

  const saveChanges = async () => {
    setSaving(true);
    try {
      const updates = Object.keys(changes).map(productId => ({
        productId,
        ...changes[productId]
      }));

      if (updates.length === 0) {
        toast.error('No changes to save');
        setSaving(false);
        return;
      }

      await adminAPI.batchUpdateSections(updates);
      toast.success(`Successfully updated ${updates.length} products`);
      setChanges({});
      
      // Refresh the data
      const params = {
        page: currentPage,
        limit: 20,
        search: searchTerm,
        category: categoryFilter
      };
      const response = await adminAPI.getProductsForSections(params);
      setProducts(response.data.data.products);
      setTotalPages(response.data.data.pagination.pages);
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error('Failed to save changes');
    }
    setSaving(false);
  };

  const resetChanges = () => {
    setChanges({});
    toast.success('Changes reset');
  };

  const hasChanges = Object.keys(changes).length > 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" text="Loading products..." />
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <FiHome className="w-6 h-6 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">Homepage Sections</h1>
            </div>
            <div className="flex space-x-3">
              <Button 
                onClick={() => setShowPreview(true)}
                className="btn-nexkartin btn-nexkartin-outline"
              >
                <FiEye className="w-4 h-4 mr-2" />
                Preview Homepage
              </Button>
              
              {hasChanges && (
                <>
                  <Button 
                    onClick={resetChanges}
                    className="btn-nexkartin btn-nexkartin-outline"
                    disabled={saving}
                  >
                    <FiX className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                  <Button 
                    onClick={saveChanges}
                    className="btn-nexkartin btn-nexkartin-primary"
                    disabled={saving}
                  >
                    {saving ? (
                      <LoadingSpinner size="sm" className="mr-2" />
                    ) : (
                      <FiCheck className="w-4 h-4 mr-2" />
                    )}
                    Save Changes ({Object.keys(changes).length})
                  </Button>
                </>
              )}
            </div>
          </div>
          
          <p className="text-gray-600 mb-6">
            Manage which products appear in different sections of your homepage. 
            Set display order to control the sequence of products in each section.
          </p>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Section Legend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Section Types</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <FiHome className="w-5 h-5 text-blue-600" />
              <div>
                <span className="font-medium text-blue-900">Hero Section</span>
                <p className="text-sm text-blue-700">Main banner products (up to 4)</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <FiTrendingUp className="w-5 h-5 text-purple-600" />
              <div>
                <span className="font-medium text-purple-900">Featured Products</span>
                <p className="text-sm text-purple-700">Highlighted products (up to 8)</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <FiGift className="w-5 h-5 text-green-600" />
              <div>
                <span className="font-medium text-green-900">New Arrivals</span>
                <p className="text-sm text-green-700">Latest products (up to 8)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-900">Product</th>
                  <th className="text-center p-4 font-semibold text-gray-900">
                    <div className="flex items-center justify-center space-x-2">
                      <FiHome className="w-4 h-4 text-blue-600" />
                      <span>Hero</span>
                    </div>
                  </th>
                  <th className="text-center p-4 font-semibold text-gray-900">
                    <div className="flex items-center justify-center space-x-2">
                      <FiTrendingUp className="w-4 h-4 text-purple-600" />
                      <span>Featured</span>
                    </div>
                  </th>
                  <th className="text-center p-4 font-semibold text-gray-900">
                    <div className="flex items-center justify-center space-x-2">
                      <FiGift className="w-4 h-4 text-green-600" />
                      <span>New Arrivals</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <motion.tr
                    key={product._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`hover:bg-gray-50 ${changes[product._id] ? 'bg-yellow-50' : ''}`}
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {product.images?.[0] && (
                            <Image
                              src={product.images[0].url}
                              alt={product.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate">
                            {product.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {product.brand} • ${product.price}
                          </p>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-1">
                            {product.category}
                          </span>
                        </div>
                      </div>
                    </td>
                    
                    {/* Hero Section */}
                    <td className="p-4">
                      <div className="flex flex-col items-center space-y-2">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={getProductValue(product, 'showInHero')}
                            onChange={(e) => handleSectionToggle(product._id, 'showInHero', e.target.checked)}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            getProductValue(product, 'showInHero')
                              ? 'bg-blue-600 border-blue-600 text-white' 
                              : 'border-gray-300'
                          }`}>
                            {getProductValue(product, 'showInHero') && <FiCheck className="w-3 h-3" />}
                          </div>
                        </label>
                        {getProductValue(product, 'showInHero') && (
                          <div className="flex items-center space-x-1">
                            <FiMove className="w-3 h-3 text-gray-400" />
                            <input
                              type="number"
                              min="0"
                              max="999"
                              value={getProductValue(product, 'heroOrder')}
                              onChange={(e) => handleOrderChange(product._id, 'heroOrder', e.target.value)}
                              className="w-16 px-2 py-1 text-xs border border-gray-300 rounded text-center focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Order"
                            />
                          </div>
                        )}
                      </div>
                    </td>
                    
                    {/* Featured Section */}
                    <td className="p-4">
                      <div className="flex flex-col items-center space-y-2">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={getProductValue(product, 'isFeatured')}
                            onChange={(e) => handleSectionToggle(product._id, 'isFeatured', e.target.checked)}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            getProductValue(product, 'isFeatured')
                              ? 'bg-purple-600 border-purple-600 text-white' 
                              : 'border-gray-300'
                          }`}>
                            {getProductValue(product, 'isFeatured') && <FiCheck className="w-3 h-3" />}
                          </div>
                        </label>
                        {getProductValue(product, 'isFeatured') && (
                          <div className="flex items-center space-x-1">
                            <FiMove className="w-3 h-3 text-gray-400" />
                            <input
                              type="number"
                              min="0"
                              max="999"
                              value={getProductValue(product, 'featuredOrder')}
                              onChange={(e) => handleOrderChange(product._id, 'featuredOrder', e.target.value)}
                              className="w-16 px-2 py-1 text-xs border border-gray-300 rounded text-center focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                              placeholder="Order"
                            />
                          </div>
                        )}
                      </div>
                    </td>
                    
                    {/* New Arrivals Section */}
                    <td className="p-4">
                      <div className="flex flex-col items-center space-y-2">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={getProductValue(product, 'showInNewArrivals')}
                            onChange={(e) => handleSectionToggle(product._id, 'showInNewArrivals', e.target.checked)}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            getProductValue(product, 'showInNewArrivals')
                              ? 'bg-green-600 border-green-600 text-white' 
                              : 'border-gray-300'
                          }`}>
                            {getProductValue(product, 'showInNewArrivals') && <FiCheck className="w-3 h-3" />}
                          </div>
                        </label>
                        {getProductValue(product, 'showInNewArrivals') && (
                          <div className="flex items-center space-x-1">
                            <FiMove className="w-3 h-3 text-gray-400" />
                            <input
                              type="number"
                              min="0"
                              max="999"
                              value={getProductValue(product, 'newArrivalsOrder')}
                              onChange={(e) => handleOrderChange(product._id, 'newArrivalsOrder', e.target.value)}
                              className="w-16 px-2 py-1 text-xs border border-gray-300 rounded text-center focus:ring-1 focus:ring-green-500 focus:border-green-500"
                              placeholder="Order"
                            />
                          </div>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="btn-nexkartin btn-nexkartin-outline btn-nexkartin-sm"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="btn-nexkartin btn-nexkartin-outline btn-nexkartin-sm"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Save Changes Footer */}
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 right-6 bg-white rounded-xl shadow-lg border border-gray-200 p-4"
          >
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {Object.keys(changes).length} product(s) modified
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={resetChanges}
                  className="btn-nexkartin btn-nexkartin-outline btn-nexkartin-sm"
                  disabled={saving}
                >
                  Reset
                </Button>
                <Button 
                  onClick={saveChanges}
                  className="btn-nexkartin btn-nexkartin-primary btn-nexkartin-sm"
                  disabled={saving}
                >
                  {saving ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : (
                    <FiCheck className="w-4 h-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
    
    {/* Homepage Preview Modal */}
    {showPreview && (
      <HomepagePreview onClose={() => setShowPreview(false)} />
    )}
    </AdminLayout>
  );
}
