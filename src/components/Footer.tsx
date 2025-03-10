import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      // In a real app, you would send this to your backend
      console.log('Subscribing email:', email);
      setEmail('');
      // Show success message or toast notification
    }
  };
  
  return (
    <footer className="bg-white dark:bg-gray-900 pt-10 pb-6 border-t border-gray-200 dark:border-gray-800 mt-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* About */}
          <div className="col-span-1 lg:col-span-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">ShopEasy</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Your one-stop destination for authentic Indian ethnic wear and accessories. 
              Showcasing the rich heritage and craftsmanship of India.
            </p>
            <div className="flex space-x-4">
              <motion.a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400"
                whileHover={{ y: -3 }}
              >
                <Instagram size={20} />
              </motion.a>
              <motion.a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                whileHover={{ y: -3 }}
              >
                <Facebook size={20} />
              </motion.a>
              <motion.a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-400 dark:text-gray-400 dark:hover:text-blue-300"
                whileHover={{ y: -3 }}
              >
                <Twitter size={20} />
              </motion.a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/category/new-arrivals" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/category/best-sellers" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link to="/category/sale" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Sale
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="text-gray-600 dark:text-gray-400 mr-2 mt-1 shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">
                  123 Fashion Street, Textile Market, New Delhi, 110001, India
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="text-gray-600 dark:text-gray-400 mr-2 shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">
                  +91 1234567890
                </span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="text-gray-600 dark:text-gray-400 mr-2 shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">
                  support@ethnicelegance.com
                </span>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div className="md:col-span-3 lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Newsletter</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <motion.button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Subscribe
              </motion.button>
            </form>
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6">
              <Link to="/privacy-policy" className="text-gray-600 dark:text-gray-400 text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-gray-600 dark:text-gray-400 text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Terms of Service
              </Link>
              <Link to="/shipping-policy" className="text-gray-600 dark:text-gray-400 text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Shipping Policy
              </Link>
              <Link to="/credits" className="text-gray-600 dark:text-gray-400 text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Credits
              </Link>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} ShopEasy. All rights reserved. Designed and Developed by Ayush Upadhyay.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 