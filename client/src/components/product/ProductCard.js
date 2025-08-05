import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import { FiStar, FiShoppingCart, FiCheck } from 'react-icons/fi';
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

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Card className="group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
        <Link href={`/products/${product._id}`} className="block">
            <div className="relative aspect-[4/3] overflow-hidden cursor-pointer">
              <Image
                src={product.images?.[0]?.url || '/placeholder-image.svg'}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
              />
              {hasDiscount && (
                <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                  {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                </div>
              )}
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white font-semibold tracking-wider uppercase">Out of Stock</span>
                </div>
              )}
            </div>
        </Link>
        
        <CardContent className="p-4 flex-grow">
          <Link href={`/products/${product._id}`} className="block">
              <h3 className="font-bold text-lg mb-2 cursor-pointer hover:text-indigo-600 transition-colors duration-200 line-clamp-2">
                {product.name}
              </h3>
          </Link>
          
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              <FiStar className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-gray-500 ml-1.5">
                {product.ratings?.average?.toFixed(1) || '0.0'} ({product.ratings?.count || 0} reviews)
              </span>
            </div>
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-indigo-600">
              ${displayPrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
          <span className={`text-xs font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </CardContent>

        <CardFooter className="p-4 pt-0 mt-auto">
          <Button 
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isInCart(product._id)}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 transform hover:scale-105 shadow-md disabled:cursor-not-allowed"
          >
            {isInCart(product._id) ? 
              <><FiCheck className="mr-2 h-5 w-5" /> In Cart</> : 
              <><FiShoppingCart className="mr-2 h-5 w-5" /> Add to Cart</>
            }
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
