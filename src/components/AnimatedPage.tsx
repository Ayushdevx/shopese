import React from 'react';
import { motion } from 'framer-motion';
import { pageTransition } from '../utils/animations';

interface AnimatedPageProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * A wrapper component that adds page transition animations
 */
const AnimatedPage: React.FC<AnimatedPageProps> = ({ children, className = '' }) => {
  return (
    <motion.div
      className={className}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage; 