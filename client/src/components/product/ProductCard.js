import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import { FiStar, FiShoppingCart, FiCheck, FiZap, FiMonitor, FiSmartphone, FiHeadphones, FiWatch } from 'react-icons/fi';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  const { addToCart, isInCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const displayPrice = product.discountPrice && product.discountPrice < product.price 
    ? product.discountPrice 
    : product.price;

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  // Generate random features for demonstration
  const features = [
    "4K Display",
    "16-Hour Battery", 
    "Thunderbolt 4",
    "WiFi 6",
    "Backlit Keyboard"
  ].slice(0, 3);

  // Get category icon based on product category
  const getCategoryIcon = (category) => {
    const categoryLower = category?.toLowerCase() || '';
    if (categoryLower.includes('laptop') || categoryLower.includes('computer')) return FiMonitor;
    if (categoryLower.includes('phone') || categoryLower.includes('mobile')) return FiSmartphone;
    if (categoryLower.includes('headphone') || categoryLower.includes('audio')) return FiHeadphones;
    if (categoryLower.includes('watch') || categoryLower.includes('smartwatch')) return FiWatch;
    return FiMonitor; // default
  };

  const CategoryIcon = getCategoryIcon(product.category);

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="group"
    >
      <div
        className={`card overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 h-full ${hasDiscount ? 'card-discount' : 'card-tech'}`}
      >
        {/* Title Section */}
        <div className="title">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            {product.category || 'ELECTRONICS'}
          </div>
          <h3 className="font-bold text-lg text-gray-800 mb-2 cursor-pointer hover:text-indigo-600 transition-colors duration-200 line-clamp-2">
            {product.name}
          </h3>
        </div>

        {/* Icon Section */}
        <div className="icon">
          <CategoryIcon />
        </div>

        {/* Content Section */}
        <div className="content">
          {/* Product Image */}
          <Link href={`/products/${product._id}`} className="block relative mb-4">
            <div className="relative aspect-[4/3] overflow-hidden cursor-pointer bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
              <Image
                src={product.images?.[0]?.url || '/placeholder-image.svg'}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
              />
              
              {/* Hot Sale Badge */}
              {hasDiscount && discountPercentage > 20 && (
                <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  HOT SALE
                </div>
              )}
              
              {/* Discount Badge */}
              {hasDiscount && (
                <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                  {discountPercentage}% OFF
                </div>
              )}
              
              {/* Out of Stock Overlay */}
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl">
                  <span className="text-white font-bold tracking-wider uppercase text-sm">Out of Stock</span>
                </div>
              )}
            </div>
          </Link>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            {product.description || 'Cutting-edge performance with premium features in a sleek, modern design.'}
          </p>
          
          {/* Feature Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {features.map((feature, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
              >
                {feature}
              </span>
            ))}
          </div>

          {/* Pricing Section */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through font-medium">
                  ${product.price.toFixed(2)}
                </span>
              )}
              <span className="text-2xl font-bold text-gray-800">
                ${displayPrice.toFixed(2)}
              </span>
            </div>
            
            {/* Add to Cart Button */}
            <Button 
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isInCart(product._id)}
              className={`btn-sophisticated ${hasDiscount ? 'btn-sophisticated-discount' : 'btn-sophisticated-primary'} px-4 py-2 text-sm font-semibold disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed`}
            >
              {isInCart(product._id) ? 
                <><FiCheck className="mr-2 h-4 w-4" /> In Cart</> : 
                <><FiShoppingCart className="mr-2 h-4 w-4" /> Add to Cart</>
              }
            </Button>
          </div>

          {/* Reviews and Stock Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <FiStar className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <FiStar className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <FiStar className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <FiStar className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <FiStar className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              </div>
              <span className="text-sm text-gray-600 font-medium">
                {product.ratings?.count || Math.floor(Math.random() * 500) + 50} Reviews
              </span>
            </div>
            
            <span className={`text-sm font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
