import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart } from 'lucide-react';
import { useCart, useWishlist } from '../hooks/useReduxHooks';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  description: string;
  rating?: number;
  reviews?: number;
  category?: string;
  tags?: string[];
  features?: string[];
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  originalPrice,
  discount,
  image,
  description,
  rating,
  reviews,
  category,
  tags,
  features
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  
  const inWishlist = isInWishlist(id);

  const handleAddToCart = () => {
    addToCart({ 
      id, 
      name, 
      price, 
      image, 
      description, 
      category 
    }, 1);
  };

  const handleToggleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(id);
    } else {
      addToWishlist({ 
        id, 
        name, 
        price, 
        image, 
        description,
        originalPrice,
        discount,
        category
      });
    }
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link to={`/product/${id}`} className="block relative overflow-hidden group">
        <motion.img
          src={image}
          alt={name}
          className="w-full h-64 object-cover transform transition-transform duration-500"
          animate={{ scale: isHovered ? 1.1 : 1 }}
        />
        {discount && discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium transform rotate-3">
            -{discount}% OFF
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Link to={`/product/${id}`}>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              {name}
            </h3>
          </Link>
          <motion.button
            onClick={handleToggleWishlist}
            className={`text-2xl ${inWishlist ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'} hover:scale-110 transition-transform`}
            whileTap={{ scale: 0.9 }}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart 
              size={20} 
              className={inWishlist ? 'fill-current' : ''} 
            />
          </motion.button>
        </div>

        {category && (
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">{category}</div>
        )}
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-2">{description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              ₹{price.toLocaleString('en-IN')}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                ₹{originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          {rating && (
            <div className="flex items-center">
              <span className="text-yellow-400 mr-1">★</span>
              <span className="text-sm font-medium dark:text-gray-300">{rating}</span>
              {reviews && (
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({reviews})</span>
              )}
            </div>
          )}
        </div>

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.map(tag => (
              <span key={tag} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <motion.button
          onClick={handleAddToCart}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center space-x-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ShoppingCart size={18} />
          <span>Add to Cart</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard; 