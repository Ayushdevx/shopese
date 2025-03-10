import React from 'react';
import { motion } from 'framer-motion';
import AnimatedPage from '../components/AnimatedPage';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Credits: React.FC = () => {
  return (
    <AnimatedPage>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
        <motion.div 
          className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-6 sm:p-10">
            <Link to="/" className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mb-6">
              <ArrowLeft size={16} className="mr-2" />
              Back to Home
            </Link>
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Credits</h1>
            <div className="h-1 w-20 bg-indigo-600 mb-6"></div>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Developer</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300 text-lg">
                  Designed and developed by <span className="font-semibold text-indigo-600 dark:text-indigo-400">Ayush Upadhyay</span>
                </p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Project</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  This e-commerce application showcases a modern React implementation with TypeScript,
                  Redux Toolkit for state management, and Framer Motion for smooth animations.
                </p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Technologies Used</h2>
                <ul className="mt-2 space-y-1 list-disc list-inside text-gray-600 dark:text-gray-300">
                  <li>React with TypeScript</li>
                  <li>Redux Toolkit</li>
                  <li>Framer Motion</li>
                  <li>Tailwind CSS</li>
                  <li>React Router</li>
                </ul>
              </div>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-center text-gray-500 dark:text-gray-400">
                  &copy; {new Date().getFullYear()} - All rights reserved
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatedPage>
  );
};

export default Credits; 