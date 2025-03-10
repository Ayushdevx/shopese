import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, ShoppingBag, Heart, Search, User, ChevronDown } from 'lucide-react';
import { useCart, useWishlist } from '../hooks/useReduxHooks';

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { itemCount } = useCart();
  const { wishlistItems } = useWishlist();
  
  // Categories for dropdown
  const categories = [
    { id: 'sarees', name: 'Sarees' },
    { id: 'lehengas', name: 'Lehengas' },
    { id: 'suits', name: 'Suits' },
    { id: 'mens', name: 'Mens' },
    { id: 'jewelry', name: 'Jewelry' },
    { id: 'accessories', name: 'Accessories' },
  ];
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);
  
  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSearch(false);
    }
  };
  
  return (
    <header 
      className={`fixed w-full top-0 z-50 transition-all duration-200 ${
        isScrolled 
          ? 'bg-white dark:bg-gray-900 shadow-md py-2' 
          : 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <motion.h1 
            className="text-2xl font-bold text-indigo-600 dark:text-indigo-400"
            whileHover={{ scale: 1.05 }}
          >
            ShopEasy
          </motion.h1>
        </Link>
        
        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Home
          </Link>
          
          {/* Categories Dropdown */}
          <div className="relative group">
            <button className="flex items-center text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              <span>Categories</span>
              <ChevronDown size={16} className="ml-1" />
            </button>
            <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top scale-95 group-hover:scale-100">
              <div className="py-2">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/category/${category.id}`}
                    className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          
          <Link 
            to="/orders" 
            className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Orders
          </Link>
        </nav>
        
        {/* Right Actions */}
        <div className="flex items-center">
          {/* Search Button */}
          <motion.button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
            whileTap={{ scale: 0.95 }}
          >
            <Search size={20} />
          </motion.button>
          
          {/* Wishlist */}
          <Link to="/wishlist" className="p-2 text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 relative">
            <Heart size={20} />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {wishlistItems.length}
              </span>
            )}
          </Link>
          
          {/* Cart */}
          <Link to="/cart" className="p-2 text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 relative">
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {itemCount}
              </span>
            )}
          </Link>
          
          {/* User Profile */}
          <Link to="/profile" className="p-2 text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400">
            <User size={20} />
          </Link>
          
          {/* Dark/Light Mode Toggle */}
          <motion.button
            onClick={toggleDarkMode}
            className="p-2 text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
            whileTap={{ scale: 0.95 }}
            whileHover={{ rotate: 15 }}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>
          
          {/* Mobile Menu Button */}
          <button 
            className="p-2 ml-2 text-gray-700 dark:text-gray-200 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>
      
      {/* Search Bar Overlay */}
      <AnimatePresence>
        {showSearch && (
          <motion.div 
            className="absolute top-full left-0 w-full bg-white dark:bg-gray-800 shadow-md py-4 px-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto relative">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
              <button 
                type="submit" 
                className="absolute right-0 top-0 h-full px-3 text-gray-500 dark:text-gray-400 hover:text-indigo-600"
              >
                <Search size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween' }}
            >
              <div className="p-5">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Menu</h2>
                  <button 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                <nav className="space-y-4">
                  <Link 
                    to="/" 
                    className="block py-2 text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    Home
                  </Link>
                  
                  <div className="py-2">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Categories</h3>
                    <div className="space-y-2 ml-2">
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          to={`/category/${category.id}`}
                          className="block py-1 text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                  
                  <Link 
                    to="/orders" 
                    className="block py-2 text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    Orders
                  </Link>
                  
                  <Link 
                    to="/wishlist" 
                    className="block py-2 text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    Wishlist
                  </Link>
                  
                  <Link 
                    to="/cart" 
                    className="block py-2 text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    Cart
                  </Link>
                  
                  <Link 
                    to="/profile" 
                    className="block py-2 text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    Profile
                  </Link>
                </nav>
                
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={toggleDarkMode}
                    className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md w-full"
                  >
                    {isDarkMode ? (
                      <>
                        <Sun size={18} className="mr-2" />
                        <span>Light Mode</span>
                      </>
                    ) : (
                      <>
                        <Moon size={18} className="mr-2" />
                        <span>Dark Mode</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header; 