'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminAPI } from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { 
  FiRefreshCw,
  FiEye,
  FiMonitor,
  FiSmartphone
} from 'react-icons/fi';
import Image from 'next/image';
import toast from 'react-hot-toast';

const HomepagePreview = ({ onClose }) => {
  const [sections, setSections] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('desktop'); // desktop or mobile

  useEffect(() => {
    fetchHomepageSections();
  }, []);

  const fetchHomepageSections = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getHomepageSections();
      setSections(response.data.data);
    } catch (error) {
      console.error('Error fetching homepage sections:', error);
      toast.error('Failed to load preview');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8">
          <LoadingSpinner size="lg" text="Loading preview..." />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl max-w-7xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <FiEye className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-900">Homepage Preview</h2>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('desktop')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                  viewMode === 'desktop'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FiMonitor className="w-4 h-4" />
                <span className="text-sm font-medium">Desktop</span>
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                  viewMode === 'mobile'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FiSmartphone className="w-4 h-4" />
                <span className="text-sm font-medium">Mobile</span>
              </button>
            </div>
            
            <Button
              onClick={fetchHomepageSections}
              className="btn-nexkartin btn-nexkartin-outline btn-nexkartin-sm"
            >
              <FiRefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            
            <Button
              onClick={onClose}
              className="btn-nexkartin btn-nexkartin-outline btn-nexkartin-sm"
            >
              Close
            </Button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className={`bg-gray-50 p-6 ${viewMode === 'mobile' ? 'max-w-sm mx-auto' : ''}`}>
            
            {/* Hero Section Preview */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Hero Section</h3>
                <span className="text-sm text-gray-500">
                  {sections?.heroProducts?.length || 0} products
                </span>
              </div>
              
              {sections?.heroProducts?.length > 0 ? (
                <div className={`grid gap-4 ${
                  viewMode === 'mobile' 
                    ? 'grid-cols-2' 
                    : 'grid-cols-4'
                }`}>
                  {sections.heroProducts.slice(0, viewMode === 'mobile' ? 2 : 4).map((product, index) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                    >
                      <div className="w-full h-24 bg-gray-100 rounded-lg mb-3 overflow-hidden">
                        {product.images?.[0] && (
                          <Image
                            src={product.images[0].url}
                            alt={product.name}
                            width={100}
                            height={96}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <h4 className="font-medium text-sm text-gray-900 line-clamp-1">
                        {product.name}
                      </h4>
                      <p className="text-indigo-600 font-semibold text-sm">
                        ${product.price}
                      </p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                  <p className="text-gray-500">No hero products configured</p>
                </div>
              )}
            </div>

            {/* Featured Products Preview */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Featured Products</h3>
                <span className="text-sm text-gray-500">
                  {sections?.featuredProducts?.length || 0} products
                </span>
              </div>
              
              {sections?.featuredProducts?.length > 0 ? (
                <div className={`grid gap-4 ${
                  viewMode === 'mobile' 
                    ? 'grid-cols-1' 
                    : 'grid-cols-4'
                }`}>
                  {sections.featuredProducts.slice(0, viewMode === 'mobile' ? 2 : 4).map((product, index) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                    >
                      <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 overflow-hidden">
                        {product.images?.[0] && (
                          <Image
                            src={product.images[0].url}
                            alt={product.name}
                            width={120}
                            height={128}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <h4 className="font-medium text-sm text-gray-900 line-clamp-2 mb-2">
                        {product.name}
                      </h4>
                      <p className="text-purple-600 font-semibold">
                        ${product.price}
                      </p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                  <p className="text-gray-500">No featured products configured</p>
                </div>
              )}
            </div>

            {/* New Arrivals Preview */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">New Arrivals</h3>
                <span className="text-sm text-gray-500">
                  {sections?.newArrivals?.length || 0} products
                </span>
              </div>
              
              {sections?.newArrivals?.length > 0 ? (
                <div className={`grid gap-4 ${
                  viewMode === 'mobile' 
                    ? 'grid-cols-1' 
                    : 'grid-cols-4'
                }`}>
                  {sections.newArrivals.slice(0, viewMode === 'mobile' ? 2 : 4).map((product, index) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                    >
                      <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 overflow-hidden">
                        {product.images?.[0] && (
                          <Image
                            src={product.images[0].url}
                            alt={product.name}
                            width={120}
                            height={128}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <h4 className="font-medium text-sm text-gray-900 line-clamp-2 mb-2">
                        {product.name}
                      </h4>
                      <p className="text-green-600 font-semibold">
                        ${product.price}
                      </p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                  <p className="text-gray-500">No new arrivals configured</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HomepagePreview;
