import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShoppingCart, Heart, Share2, ChevronRight, ChevronLeft, Plus, Minus } from 'lucide-react';
import toast from 'react-hot-toast';
import ProductCard from '../components/ProductCard';
import { useCart, useWishlist } from '../hooks/useReduxHooks';

// Sample review data
const sampleReviews = [
  {
    id: '1',
    user: {
      name: 'Aarav Sharma',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    },
    rating: 5,
    date: '2023-12-15',
    title: 'Beautiful and high-quality product',
    comment: 'The fabric quality is excellent, and the embroidery work is intricate. Exactly as shown in the pictures. Very satisfied with my purchase!',
    helpful: 42,
    images: ['https://images.pexels.com/photos/12404353/pexels-photo-12404353.jpeg']
  },
  {
    id: '2',
    user: {
      name: 'Priya Patel',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    },
    rating: 4,
    date: '2023-11-28',
    title: 'Good product but minor issues',
    comment: 'The design and color are beautiful. The only issue was that the stitching had some loose threads. Otherwise, it\'s a good product for the price.',
    helpful: 15,
  },
  {
    id: '3',
    user: {
      name: 'Rajesh Kumar',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    },
    rating: 5,
    date: '2024-01-05',
    title: 'Perfect for festival season',
    comment: 'Wore this for Diwali celebrations and received many compliments. The fit is perfect and the material is comfortable to wear for long hours.',
    helpful: 28,
    images: ['https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg']
  }
];

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const allProducts = useSelector((state: any) => state.products.items);
  const product = allProducts.find((p: any) => p.id === id);
  
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const inWishlist = id ? isInWishlist(id) : false;

  // Related products (products in the same category)
  const relatedProducts = product 
    ? allProducts.filter((p: any) => p.category === product.category && p.id !== product.id)
    : [];

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Demo product images (including the main one)
  const productImages = product ? [
    product.image,
    'https://images.pexels.com/photos/5872361/pexels-photo-5872361.jpeg',
    'https://images.pexels.com/photos/2235071/pexels-photo-2235071.jpeg'
  ] : [];

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const nextImage = () => {
    setActiveImage((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setActiveImage((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Product Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Link 
          to="/"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md transition-colors"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  // Calculate average rating
  const averageRating = sampleReviews.reduce((acc, review) => acc + review.rating, 0) / sampleReviews.length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 transition-colors duration-300">
      {/* Breadcrumb */}
      <nav className="flex mb-8 text-sm">
        <ol className="flex items-center space-x-2">
          <li>
            <Link to="/" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">Home</Link>
          </li>
          <li className="flex items-center">
            <ChevronRight size={14} className="text-gray-400" />
            <Link to={`/categories/${product.category?.toLowerCase().replace(' ', '-')}`} className="ml-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
              {product.category}
            </Link>
          </li>
          <li className="flex items-center">
            <ChevronRight size={14} className="text-gray-400" />
            <span className="ml-2 text-gray-800 dark:text-gray-200">{product.name}</span>
          </li>
        </ol>
      </nav>

      {/* Product Detail Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
            <motion.img
              key={activeImage}
              src={productImages[activeImage]}
              alt={product.name}
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
            
            {/* Navigation arrows */}
            <button 
              onClick={prevImage} 
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={nextImage} 
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
            
            {/* Discount badge */}
            {product.discount && product.discount > 0 && (
              <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium transform rotate-3">
                -{product.discount}% OFF
              </div>
            )}
          </div>
          
          {/* Thumbnail gallery */}
          <div className="flex space-x-2 overflow-x-auto py-2">
            {productImages.map((img, idx) => (
              <motion.button
                key={idx}
                className={`w-20 h-20 rounded-md overflow-hidden flex-shrink-0 ${
                  idx === activeImage ? 'ring-2 ring-indigo-600 dark:ring-indigo-400' : ''
                }`}
                onClick={() => setActiveImage(idx)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{product.name}</h1>
            <div className="mt-2 flex items-center space-x-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={i < Math.round(averageRating) 
                      ? "text-yellow-400 fill-current" 
                      : "text-gray-300 dark:text-gray-600"
                    }
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {averageRating.toFixed(1)} ({sampleReviews.length} reviews)
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xl text-gray-500 dark:text-gray-400 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Product tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag: string) => (
                <span 
                  key={tag} 
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <p className="text-gray-700 dark:text-gray-300">{product.description}</p>

          {/* Product features */}
          {product.features && product.features.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Features:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                {product.features.map((feature: string) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Quantity selector */}
          <div className="flex items-center space-x-2">
            <span className="text-gray-700 dark:text-gray-300">Quantity:</span>
            <div className="flex items-center border dark:border-gray-700 rounded-md">
              <motion.button
                className="px-3 py-1 border-r dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                whileTap={{ scale: 0.95 }}
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </motion.button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-12 text-center py-1 border-none focus:outline-none bg-transparent text-gray-800 dark:text-gray-200"
              />
              <motion.button
                className="px-3 py-1 border-l dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setQuantity(quantity + 1)}
                whileTap={{ scale: 0.95 }}
              >
                <Plus size={16} />
              </motion.button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-md flex items-center justify-center space-x-2 transition-colors"
              onClick={handleAddToCart}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus size={20} className="mr-2" />
              <span>Add to Cart</span>
            </motion.button>
            <motion.button
              className={`flex-1 py-3 px-6 rounded-md flex items-center justify-center space-x-2 transition-colors ${
                inWishlist 
                  ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200'
              }`}
              onClick={handleToggleWishlist}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Heart size={20} className={inWishlist ? 'fill-current' : ''} />
              <span>{inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
            </motion.button>
          </div>

          {/* Shipping info */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Free shipping on orders over ₹999</span>
            </div>
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Delivery within 3-5 business days</span>
            </div>
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Easy returns within 30 days</span>
            </div>
          </div>

          {/* Share buttons */}
          <div className="pt-4">
            <button className="flex items-center text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              <Share2 size={20} className="mr-2" />
              <span>Share Product</span>
            </button>
          </div>
        </div>
      </div>

      {/* Product details tabs */}
      <div className="mt-16 border-t border-gray-200 dark:border-gray-700 pt-10">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`pb-4 px-1 mr-8 text-sm font-medium ${
              activeTab === 'description'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'
            }`}
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button
            className={`pb-4 px-1 mr-8 text-sm font-medium ${
              activeTab === 'reviews'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'
            }`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews ({sampleReviews.length})
          </button>
          <button
            className={`pb-4 px-1 text-sm font-medium ${
              activeTab === 'shipping'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'
            }`}
            onClick={() => setActiveTab('shipping')}
          >
            Shipping & Returns
          </button>
        </div>

        <div className="py-6">
          <AnimatePresence mode="wait">
            {activeTab === 'description' && (
              <motion.div
                key="description"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="prose prose-indigo dark:prose-invert max-w-none"
              >
                <p className="text-gray-700 dark:text-gray-300">{product.description}</p>
                <h3 className="text-lg font-medium mt-6 text-gray-900 dark:text-white">Product Details:</h3>
                <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700 dark:text-gray-300">
                  {product.features && product.features.map((feature: string) => (
                    <li key={feature}>{feature}</li>
                  ))}
                  <li>Product Code: {product.id}</li>
                  <li>Category: {product.category}</li>
                </ul>
                <h3 className="text-lg font-medium mt-6 text-gray-900 dark:text-white">Care Instructions:</h3>
                <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Dry clean only</li>
                  <li>Do not bleach</li>
                  <li>Store in a cool, dry place</li>
                  <li>Iron on low heat if needed</li>
                </ul>
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="flex mr-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={24}
                          className={i < Math.round(averageRating) 
                            ? "text-yellow-400 fill-current" 
                            : "text-gray-300 dark:text-gray-600"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-xl font-medium text-gray-900 dark:text-white">
                      {averageRating.toFixed(1)} out of 5
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Based on {sampleReviews.length} reviews
                  </p>
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md transition-colors"
                  >
                    Write a Review
                  </button>
                </div>

                <AnimatePresence>
                  {showReviewForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-8 overflow-hidden"
                    >
                      <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Write a Review</h3>
                      <form className="space-y-4">
                        <div>
                          <label className="block text-gray-700 dark:text-gray-300 mb-1">Rating</label>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                className="text-gray-300 hover:text-yellow-400"
                              >
                                <Star size={24} className="text-gray-300 hover:text-yellow-400 cursor-pointer" />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-gray-700 dark:text-gray-300 mb-1">Title</label>
                          <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="Give your review a title"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 dark:text-gray-300 mb-1">Review</label>
                          <textarea
                            rows={4}
                            className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="What did you like or dislike about this product?"
                          ></textarea>
                        </div>
                        <div>
                          <label className="block text-gray-700 dark:text-gray-300 mb-1">Photos (optional)</label>
                          <input type="file" accept="image/*" multiple className="text-gray-700 dark:text-gray-300" />
                        </div>
                        <div className="flex justify-end space-x-4">
                          <button
                            type="button"
                            onClick={() => setShowReviewForm(false)}
                            className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
                          >
                            Submit Review
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-8">
                  {sampleReviews.map((review) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border-b dark:border-gray-700 pb-8"
                    >
                      <div className="flex justify-between mb-4">
                        <div className="flex items-center">
                          <img
                            src={review.user.avatar}
                            alt={review.user.name}
                            className="w-10 h-10 rounded-full mr-4 object-cover"
                          />
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{review.user.name}</h4>
                            <div className="flex items-center mt-1">
                              <div className="flex mr-2">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={16}
                                    className={i < review.rating 
                                      ? "text-yellow-400 fill-current" 
                                      : "text-gray-300 dark:text-gray-600"
                                    }
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(review.date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <h5 className="font-medium text-gray-900 dark:text-white mb-2">{review.title}</h5>
                      <p className="text-gray-700 dark:text-gray-300 mb-4">{review.comment}</p>
                      
                      {review.images && review.images.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {review.images.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`Review image ${idx + 1}`}
                              className="w-20 h-20 object-cover rounded-md"
                            />
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center text-sm">
                        <button className="flex items-center text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                          </svg>
                          <span>Helpful ({review.helpful})</span>
                        </button>
                        <span className="mx-4 text-gray-300 dark:text-gray-600">|</span>
                        <button className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400">
                          Report
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'shipping' && (
              <motion.div
                key="shipping"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="prose prose-indigo dark:prose-invert max-w-none"
              >
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Shipping Information</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We ship all across India. Orders are typically processed within 24 hours and shipped within 1-2 business days.
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Free standard shipping on all orders above ₹999</li>
                  <li>Standard shipping (3-5 business days): ₹99</li>
                  <li>Express shipping (1-2 business days): ₹199</li>
                  <li>Remote areas may take an additional 2-3 days</li>
                </ul>

                <h3 className="text-lg font-medium mt-8 text-gray-900 dark:text-white">Return Policy</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We accept returns within 30 days of delivery for a full refund or exchange.
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Items must be unused and in their original packaging</li>
                  <li>Return shipping costs are borne by the customer</li>
                  <li>Refunds are processed within 7-10 business days</li>
                  <li>Damaged or defective items can be returned for free</li>
                </ul>

                <h3 className="text-lg font-medium mt-8 text-gray-900 dark:text-white">International Shipping</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We currently ship to select international destinations. International shipping rates and delivery times vary by location.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.slice(0, 4).map((relatedProduct: any) => (
              <ProductCard key={relatedProduct.id} {...relatedProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;