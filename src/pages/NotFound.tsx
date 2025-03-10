import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AnimatedPage from '../components/AnimatedPage';
import { ShoppingBag } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <AnimatedPage className="max-w-5xl mx-auto px-4 py-20 text-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 md:p-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="relative mb-6">
            <motion.div 
              className="text-indigo-600 dark:text-indigo-400"
              animate={{ 
                rotate: [0, 10, 0, -10, 0],
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 3,
                ease: "easeInOut" 
              }}
            >
              <ShoppingBag size={80} />
            </motion.div>
            <motion.div 
              className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xl font-bold h-12 w-12 flex items-center justify-center rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              404
            </motion.div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Page Not Found</h1>
          
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-md">
            Oops! The page you're looking for seems to have vanished like a great deal on sale day.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Go Back
            </motion.button>
            
            <motion.button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back to Home
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatedPage>
  );
};

export default NotFound; 