import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useTheme } from '../context/ThemeContext';
import AnimatedPage from '../components/AnimatedPage';

const Home = () => {
  const { items: products, categories, featuredCollections } = useSelector((state: any) => state.products);
  const { theme } = useTheme();
  const [activeSlide, setActiveSlide] = useState(0);
  const [testimonials] = useState([
    {
      id: 1,
      name: 'Ayush Upadhyay',
      role: 'Fashion Enthusiast',
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
      text: 'The Banarasi silk saree I ordered exceeded my expectations. The quality and craftsmanship are outstanding. Will definitely shop here again!'
    },
    {
      id: 2,
      name: 'Rasika Gupta',
      role: 'Regular Customer',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
      text: 'The Nehru jacket I purchased for my wedding was perfect. The fit was excellent and I received many compliments. Highly recommend!'
    },
    {
      id: 3,
      name: 'Arunima Singh',
      role: 'Stylist',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
      text: 'As a stylist, I appreciate the variety and authenticity of products offered here. My clients are always pleased with the quality.'
    }
  ]);

  const heroSlides = [
    {
      title: 'Discover Indian Fashion',
      subtitle: 'Explore our collection of traditional and modern Indian wear',
      image: 'https://images.pexels.com/photos/5872361/pexels-photo-5872361.jpeg',
      cta: 'Shop Now',
      link: '/categories/ethnic-wear'
    },
    {
      title: 'Festival Season Sale',
      subtitle: 'Get up to 40% off on festival collections',
      image: 'https://images.pexels.com/photos/1721558/pexels-photo-1721558.jpeg',
      cta: 'View Sale',
      link: '/sale'
    },
    {
      title: 'New Arrivals',
      subtitle: 'Check out our latest collections',
      image: 'https://images.pexels.com/photos/2060242/pexels-photo-2060242.jpeg',
      cta: 'Explore',
      link: '/categories/casual-wear'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % heroSlides.length);
  };

  return (
    <AnimatedPage className="min-h-screen transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative h-[80vh] overflow-hidden">
        <AnimatePresence mode="wait">
          {heroSlides.map((slide, index) => (
            index === activeSlide && (
              <motion.div
                key={index}
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute inset-0 bg-black opacity-40"></div>
                  <motion.img
                    src={slide.image}
                    alt="Hero"
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 10 }}
                  />
                </div>
                <div className="relative text-center max-w-4xl mx-auto px-4 text-white">
                  <motion.h1 
                    className="text-5xl md:text-6xl font-bold mb-6"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {slide.title}
                  </motion.h1>
                  <motion.p 
                    className="text-xl mb-8"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {slide.subtitle}
                  </motion.p>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Link
                      to={slide.link}
                      className="bg-white text-indigo-600 px-8 py-3 rounded-full font-medium hover:bg-indigo-50 transition-colors inline-flex items-center"
                    >
                      {slide.cta} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            )
          ))}
        </AnimatePresence>

        {/* Slide controls */}
        <button 
          onClick={handlePrevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={handleNextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>

        {/* Slide indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === activeSlide ? 'bg-white' : 'bg-white/40'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Shop by Category
          </motion.h2>
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {categories.map((category: any) => (
              <motion.div
                key={category.id}
                variants={item}
                whileHover={{ y: -5 }}
                className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
              >
                <Link to={`/categories/${category.id}`}>
                  <div className="aspect-square bg-gray-200 dark:bg-gray-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform transition-transform duration-300 group-hover:translate-y-0">
                      <h3 className="font-medium text-lg">{category.name}</h3>
                      <p className="text-sm opacity-80">{category.count} items</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Featured Products
          </motion.h2>
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {products.slice(0, 4).map((product: any) => (
              <motion.div key={product.id} variants={item}>
                <ProductCard {...product} />
              </motion.div>
            ))}
          </motion.div>
          <div className="text-center mt-10">
            <Link
              to="/categories/all"
              className="inline-flex items-center px-6 py-3 border border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 rounded-md hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-400 dark:hover:text-gray-900 transition-colors duration-300"
            >
              View All Products <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Banner Section */}
      <section className="py-20 bg-indigo-600 dark:bg-indigo-800 text-white relative overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute w-full h-full transform rotate-45">
            <pattern id="pattern-circles" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
              <circle id="pattern-circle" cx="10" cy="10" r="1.5" fill="white"></circle>
            </pattern>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)"></rect>
          </svg>
        </div>
        <motion.div 
          className="max-w-7xl mx-auto px-4 relative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="md:flex items-center justify-between">
            <div className="md:w-1/2 md:pr-16 mb-10 md:mb-0">
              <h2 className="text-4xl font-bold mb-6">Festive Season Sale</h2>
              <p className="text-xl mb-8 opacity-90">Get up to 40% off on all traditional wear for this festive season. Limited time offer!</p>
              <Link
                to="/sale"
                className="inline-flex items-center px-8 py-3 bg-white text-indigo-600 rounded-full font-medium hover:bg-indigo-50 transition-colors"
              >
                Shop the Sale <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.pexels.com/photos/10679171/pexels-photo-10679171.jpeg" 
                alt="Festive Sale" 
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </motion.div>
      </section>
      {/* Testimonials */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            What Our Customers Say
          </motion.h2>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                variants={item}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-medium text-lg text-gray-900 dark:text-white">{testimonial.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">"{testimonial.text}"</p>
                <div className="mt-4 flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-16 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Featured Collections
          </motion.h2>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {featuredCollections.map((collection: any) => (
              <motion.div
                key={collection.id}
                variants={item}
                whileHover={{ y: -5 }}
                className="relative rounded-lg overflow-hidden group cursor-pointer"
              >
                <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-700">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-300 group-hover:translate-y-0">
                    <h3 className="font-medium text-xl mb-2">{collection.name}</h3>
                    <Link
                      to={`/collections/${collection.id}`}
                      className="inline-block text-sm bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-full backdrop-blur-sm"
                    >
                      View Collection
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-blue-600 dark:bg-blue-800 text-white transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-lg mb-8 opacity-90">Subscribe to our newsletter for exclusive offers and updates</p>
            <form className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <motion.button
                type="submit"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>
    </AnimatedPage>
  );
};

export default Home;