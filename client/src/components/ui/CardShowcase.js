import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardBadge, CardImage } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FiStar, FiHeart, FiEye, FiShoppingCart, FiTruck, FiShield, FiHeadphones } from 'react-icons/fi';
import { motion } from 'framer-motion';

const CardShowcase = () => {
  const cardVariants = [
    {
      variant: 'default',
      title: 'Default Card',
      description: 'Clean and modern design with subtle shadows',
      icon: <FiStar className="w-6 h-6" />
    },
    {
      variant: 'elevated',
      title: 'Elevated Card',
      description: 'Prominent shadow with hover effects',
      icon: <FiHeart className="w-6 h-6" />
    },
    {
      variant: 'glass',
      title: 'Glass Card',
      description: 'Modern glass morphism effect',
      icon: <FiEye className="w-6 h-6" />
    },
    {
      variant: 'gradient',
      title: 'Gradient Card',
      description: 'Beautiful gradient background',
      icon: <FiShoppingCart className="w-6 h-6" />
    },
    {
      variant: 'premium',
      title: 'Premium Card',
      description: 'Premium design with subtle gradients',
      icon: <FiTruck className="w-6 h-6" />
    },
    {
      variant: 'dark',
      title: 'Dark Card',
      description: 'Dark theme for modern aesthetics',
      icon: <FiShield className="w-6 h-6" />
    }
  ];

  return (
    <div className="py-20 bg-gradient-to-br from-gray-50 to-indigo-50">
      <div className="container-modern">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Modern Card Design</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our collection of beautifully designed card components
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cardVariants.map((card, index) => (
            <motion.div
              key={card.variant}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Card variant={card.variant} className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                      {card.icon}
                    </div>
                    <CardBadge variant="gradient">
                      {card.variant}
                    </CardBadge>
                  </div>
                  <CardTitle variant="gradient">
                    {card.title}
                  </CardTitle>
                  <CardDescription>
                    {card.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">Premium Quality</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FiTruck className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">Free Shipping</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FiShield className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-600">Secure Payment</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button className="w-full btn-modern bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    <FiShoppingCart className="mr-2 w-4 h-4" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Feature Cards</h3>
            <p className="text-lg text-gray-600">
              Specialized cards for different use cases
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Card Example */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card variant="premium" className="overflow-hidden">
                <CardImage 
                  src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500" 
                  alt="Product"
                  className="h-48"
                />
                <CardContent>
                  <div className="flex items-center justify-between mb-3">
                    <CardBadge variant="gradient">New</CardBadge>
                    <div className="flex items-center space-x-1">
                      <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">4.8 (120)</span>
                    </div>
                  </div>
                  <CardTitle variant="large">Premium Smartphone</CardTitle>
                  <CardDescription>
                    Latest technology with advanced features and stunning design.
                  </CardDescription>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-bold text-indigo-600">$999</span>
                      <span className="text-sm text-gray-400 line-through">$1,199</span>
                    </div>
                    <CardBadge variant="success">In Stock</CardBadge>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full btn-modern bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    <FiShoppingCart className="mr-2 w-4 h-4" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Service Card Example */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card variant="glass" className="h-full">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <FiHeadphones className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle variant="gradient" className="text-center">
                    24/7 Customer Support
                  </CardTitle>
                  <CardDescription className="text-center">
                    Get help anytime, anywhere with our dedicated support team.
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Live Chat Available</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Phone Support</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Email Support</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Knowledge Base</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Contact Support
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CardShowcase; 