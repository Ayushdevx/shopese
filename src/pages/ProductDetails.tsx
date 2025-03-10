import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Minus, 
  Plus, 
  Share2,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import { useProducts, useCart, useWishlist } from '../hooks/useReduxHooks';
import ProductCard from '../components/ProductCard';
import { cardScale, fadeIn } from '../utils/animations';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProductById, getRelatedProducts } = useProducts();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [openSection, setOpenSection] = useState<string | null>('description');
  
  const product = getProductById(id || '');
  const relatedProducts = getRelatedProducts(id || '', 4);
  
  // If product not found, navigate to 404
  useEffect(() => {
    if (!product && id) {
      navigate('/not-found');
    }
  }, [product, id, navigate]);
  
  if (!product) {
    return (
      <AnimatedPage className="max-w-7xl mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Loading product...</h2>
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-32 w-32 bg-gray-300 dark:bg-gray-600 rounded-md mb-4"></div>
            <div className="h-4 w-48 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
            <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
        </div>
      </AnimatedPage>
    );
  }
  
  const inWishlist = isInWishlist(product.id);
  
  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= (product.stock || 10)) {
      setQuantity(value);
    }
  };
  
  const handleAddToCart = () => {
    addToCart(product, quantity);
  };
  
  const handleToggleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };
  
  const handleToggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };
  
  const getDiscountPercentage = () => {
    if (product.originalPrice && product.price < product.originalPrice) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
    return null;
  };
  
  const discount = getDiscountPercentage();

  return (
    <AnimatedPage className="max-w-7xl mx-auto px-4 py-12">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Product Images */}
          <div className="space-y-4">
            <motion.div 
              className="relative h-96 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700"
              variants={cardScale}
              initial="hidden"
              animate="visible"
            >
              <img 
                src={product.images?.[selectedImage] || product.image} 
                alt={product.name} 
                className="w-full h-full object-contain"
              />
              {discount && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {discount}% OFF
                </div>
              )}
            </motion.div>
            
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto py-2">
                {product.images.map((img, index) => (
                  <motion.button
                    key={index}
                    className={`w-20 h-20 rounded-md overflow-hidden flex-shrink-0 border-2 ${
                      index === selectedImage 
                        ? 'border-indigo-500 dark:border-indigo-400' 
                        : 'border-transparent'
                    }`}
                    onClick={() => setSelectedImage(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img 
                      src={img} 
                      alt={`${product.name} - view ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <motion.div
            className="flex flex-col"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h1>
            
            {/* Ratings */}
            {product.rating && (
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={18}
                      className={`${
                        star <= Math.round(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-600 dark:text-gray-400 text-sm">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
            )}
            
            {/* Price */}
            <div className="flex items-center mb-6">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="ml-3 text-lg text-gray-500 dark:text-gray-400 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            
            {/* Short Description */}
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {product.description}
            </p>
            
            {/* Stock Status */}
            <div className="mb-6">
              {product.stock ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Out of Stock
                </span>
              )}
            </div>
            
            {/* Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
                <motion.button
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  whileTap={{ scale: 0.95 }}
                >
                  <Minus size={18} />
                </motion.button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(Number(e.target.value))}
                  min="1"
                  max={product.stock || 10}
                  className="w-16 text-center border-x border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <motion.button
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= (product.stock || 10)}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus size={18} />
                </motion.button>
              </div>
              
              <motion.button
                onClick={handleAddToCart}
                className="flex-1 flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!product.stock}
              >
                <ShoppingBag size={20} />
                <span>Add to Cart</span>
              </motion.button>
              
              <motion.button
                onClick={handleToggleWishlist}
                className={`flex justify-center items-center gap-2 px-6 py-3 rounded-md border ${
                  inWishlist 
                    ? 'bg-red-50 border-red-300 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                } transition-colors`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Heart size={20} className={inWishlist ? 'fill-current' : ''} />
              </motion.button>
            </div>
            
            {/* Features */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Truck size={20} className="text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300">Free shipping on orders above ₹999</span>
                </li>
                <li className="flex items-start">
                  <ShieldCheck size={20} className="text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300">Genuine products, quality guaranteed</span>
                </li>
                <li className="flex items-start">
                  <RotateCcw size={20} className="text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300">Easy 7-day returns and exchanges</span>
                </li>
              </ul>
            </div>
            
            {/* Share */}
            <div className="flex items-center">
              <span className="text-gray-700 dark:text-gray-300 mr-3">Share:</span>
              <div className="flex space-x-2">
                <motion.button 
                  className="p-2 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Share2 size={18} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Product Details Accordion */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6">
          <div className="space-y-4">
            <div>
              <button
                onClick={() => handleToggleSection('description')}
                className="flex justify-between items-center w-full py-3 px-4 rounded-md bg-gray-100 dark:bg-gray-700 text-left text-gray-900 dark:text-white font-medium focus:outline-none"
              >
                <span>Product Description</span>
                {openSection === 'description' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {openSection === 'description' && (
                <div className="mt-4 px-4 text-gray-600 dark:text-gray-300">
                  <p className="mb-4">{product.description}</p>
                  {product.features && (
                    <>
                      <h4 className="font-medium text-gray-900 dark:text-white mt-4 mb-2">Key Features:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {product.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}
            </div>
            
            <div>
              <button
                onClick={() => handleToggleSection('specifications')}
                className="flex justify-between items-center w-full py-3 px-4 rounded-md bg-gray-100 dark:bg-gray-700 text-left text-gray-900 dark:text-white font-medium focus:outline-none"
              >
                <span>Specifications</span>
                {openSection === 'specifications' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {openSection === 'specifications' && (
                <div className="mt-4 px-4">
                  <table className="w-full border-collapse">
                    <tbody>
                      {product.material && (
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <td className="py-3 text-gray-600 dark:text-gray-400 font-medium">Material</td>
                          <td className="py-3 text-gray-900 dark:text-white">{product.material}</td>
                        </tr>
                      )}
                      {product.specs && Object.entries(product.specs).map(([key, value]) => (
                        <tr key={key} className="border-b border-gray-200 dark:border-gray-700">
                          <td className="py-3 text-gray-600 dark:text-gray-400 font-medium">{key}</td>
                          <td className="py-3 text-gray-900 dark:text-white">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} {...relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </AnimatedPage>
  );
};

export default ProductDetails; 