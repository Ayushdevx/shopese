import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import { useWishlist, useCart } from '../hooks/useReduxHooks';
import { staggerContainer, staggerItem } from '../utils/animations';

const Wishlist: React.FC = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  const handleMoveToCart = (product: any) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };
  
  // If wishlist is empty, show a message
  if (wishlistItems.length === 0) {
    return (
      <AnimatedPage className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">My Wishlist</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <Heart size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Save items you like to your wishlist and review them anytime.
          </p>
          <motion.button
            className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
          >
            Explore Products
          </motion.button>
        </div>
      </AnimatedPage>
    );
  }
  
  return (
    <AnimatedPage className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Wishlist</h1>
        <span className="text-gray-600 dark:text-gray-400">
          {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
        </span>
      </div>
      
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {wishlistItems.map((item: any) => (
          <motion.div 
            key={item.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            variants={staggerItem}
          >
            <Link to={`/product/${item.id}`} className="block relative">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-full h-64 object-cover transition-transform hover:scale-105 duration-500"
              />
              <div className="absolute top-0 right-0 p-2">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    removeFromWishlist(item.id);
                  }}
                  className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-md text-red-500 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </Link>
            
            <div className="p-4">
              <Link to={`/product/${item.id}`} className="block">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  {item.name}
                </h3>
              </Link>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-baseline">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    ₹{item.price.toLocaleString('en-IN')}
                  </span>
                  {item.originalPrice && (
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 line-through">
                      ₹{item.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                
                {item.rating && (
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1">{item.rating}</span>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <motion.button 
                  onClick={() => handleMoveToCart(item)}
                  className="flex items-center justify-center py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm transition-colors"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <ShoppingCart size={16} className="mr-1" />
                  <span>Add to Cart</span>
                </motion.button>
                
                <motion.button 
                  onClick={() => navigate(`/product/${item.id}`)}
                  className="flex items-center justify-center py-2 px-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-sm transition-colors"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span>View Details</span>
                  <ArrowRight size={16} className="ml-1" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </AnimatedPage>
  );
};

export default Wishlist; 