import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpDown, SlidersHorizontal, X, GridIcon, LayoutList } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import { useProducts } from '../hooks/useReduxHooks';
import { staggerContainer, staggerItem } from '../utils/animations';

interface SortOption {
  label: string;
  value: string;
}

interface FilterOption {
  id: string;
  label: string;
  type: 'checkbox' | 'range';
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
}

const sortOptions: SortOption[] = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Popularity', value: 'popularity' },
  { label: 'Rating', value: 'rating' }
];

const filterOptions: FilterOption[] = [
  {
    id: 'price',
    label: 'Price Range',
    type: 'range',
    min: 0,
    max: 20000
  },
  {
    id: 'material',
    label: 'Material',
    type: 'checkbox',
    options: [
      { value: 'silk', label: 'Silk' },
      { value: 'cotton', label: 'Cotton' },
      { value: 'linen', label: 'Linen' },
      { value: 'chiffon', label: 'Chiffon' },
      { value: 'georgette', label: 'Georgette' }
    ]
  },
  {
    id: 'discount',
    label: 'Discount',
    type: 'checkbox',
    options: [
      { value: '10', label: '10% and above' },
      { value: '20', label: '20% and above' },
      { value: '30', label: '30% and above' },
      { value: '40', label: '40% and above' },
      { value: '50', label: '50% and above' }
    ]
  },
  {
    id: 'rating',
    label: 'Rating',
    type: 'checkbox',
    options: [
      { value: '4', label: '4★ & above' },
      { value: '3', label: '3★ & above' },
      { value: '2', label: '2★ & above' },
      { value: '1', label: '1★ & above' }
    ]
  }
];

const CategoryProducts: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, categories } = useProducts();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    material: [],
    discount: [],
    rating: []
  });
  
  // Get the current category
  const currentCategory = categories.find((category: any) => category.id === id);
  
  // Filter products by category
  const categoryProducts = products.filter((product: any) => {
    // Return true if product belongs to this category
    return (
      product.category === id || 
      (product.categories && product.categories.includes(id))
    );
  });
  
  // Apply filters and sorting
  const filteredAndSortedProducts = categoryProducts
    .filter((product: any) => {
      // Apply price range filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }
      
      // Apply material filter if any selected
      if (
        selectedFilters.material.length > 0 &&
        (!product.material || 
         !selectedFilters.material.some(material => 
           product.material.toLowerCase().includes(material.toLowerCase())
         ))
      ) {
        return false;
      }
      
      // Apply discount filter
      if (selectedFilters.discount.length > 0) {
        const productDiscount = product.originalPrice 
          ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
          : 0;
        
        // Check if product discount is greater than or equal to any selected discount
        const passesDiscountFilter = selectedFilters.discount.some(discount => {
          return productDiscount >= parseInt(discount, 10);
        });
        
        if (!passesDiscountFilter) {
          return false;
        }
      }
      
      // Apply rating filter
      if (
        selectedFilters.rating.length > 0 &&
        !selectedFilters.rating.some(rating => product.rating >= parseInt(rating, 10))
      ) {
        return false;
      }
      
      return true;
    })
    .sort((a: any, b: any) => {
      switch (sortBy) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'popularity':
          return (b.reviews || 0) - (a.reviews || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
        default:
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
    });
  
  const handleFilterChange = (filterId: string, value: string, checked: boolean) => {
    setSelectedFilters(prev => {
      const currentValues = [...(prev[filterId] || [])];
      
      if (checked) {
        return { ...prev, [filterId]: [...currentValues, value] };
      } else {
        return { ...prev, [filterId]: currentValues.filter(v => v !== value) };
      }
    });
  };
  
  const handlePriceRangeChange = (value: [number, number]) => {
    setPriceRange(value);
  };
  
  const clearAllFilters = () => {
    setSelectedFilters({
      material: [],
      discount: [],
      rating: []
    });
    setPriceRange([0, 20000]);
  };
  
  const totalFilterCount = Object.values(selectedFilters).reduce(
    (count, values) => count + values.length, 
    0
  ) + (priceRange[0] > 0 || priceRange[1] < 20000 ? 1 : 0);
  
  return (
    <AnimatedPage className="max-w-7xl mx-auto px-4 py-12">
      {/* Category Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {currentCategory?.name || 'Products'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? 'product' : 'products'} available
        </p>
      </div>
      
      {/* Filters and Sorting Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6 p-4 flex flex-wrap items-center justify-between">
        <div className="flex items-center space-x-2 mb-2 sm:mb-0">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <SlidersHorizontal size={18} className="mr-1" />
            <span>Filters</span>
            {totalFilterCount > 0 && (
              <span className="ml-1 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalFilterCount}
              </span>
            )}
          </button>
          
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300 focus:outline-none"
            >
              <option value="" disabled>Sort By</option>
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ArrowUpDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none" />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md ${
              viewMode === 'grid'
                ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <GridIcon size={18} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md ${
              viewMode === 'list'
                ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <LayoutList size={18} />
          </button>
        </div>
      </div>
      
      {/* Applied Filters */}
      {totalFilterCount > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-700 dark:text-gray-300">Applied Filters:</span>
          
          {priceRange[0] > 0 || priceRange[1] < 20000 ? (
            <div className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-sm flex items-center">
              <span>₹{priceRange[0]} - ₹{priceRange[1]}</span>
              <button
                onClick={() => setPriceRange([0, 20000])}
                className="ml-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
              >
                <X size={14} />
              </button>
            </div>
          ) : null}
          
          {Object.entries(selectedFilters).map(([filterId, values]) =>
            values.map(value => {
              const filterOption = filterOptions.find(option => option.id === filterId);
              const optionLabel = filterOption?.options?.find(opt => opt.value === value)?.label || value;
              
              return (
                <div 
                  key={`${filterId}-${value}`}
                  className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-sm flex items-center"
                >
                  <span>{filterOption?.label}: {optionLabel}</span>
                  <button
                    onClick={() => handleFilterChange(filterId, value, false)}
                    className="ml-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            })
          )}
          
          <button
            onClick={clearAllFilters}
            className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Clear All
          </button>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filter Sidebar - Mobile */}
        {isFilterOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden" onClick={() => setIsFilterOpen(false)}>
            <motion.div
              className="absolute top-0 right-0 h-full w-80 bg-white dark:bg-gray-800 p-4 overflow-y-auto"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Filters</h3>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Render mobile filters */}
                {filterOptions.map(filter => (
                  <div key={filter.id} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">{filter.label}</h4>
                    
                    {filter.type === 'checkbox' && filter.options && (
                      <div className="space-y-2">
                        {filter.options.map(option => (
                          <label key={option.value} className="flex items-center">
                            <input
                              type="checkbox"
                              className="rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600"
                              checked={selectedFilters[filter.id]?.includes(option.value) || false}
                              onChange={(e) => handleFilterChange(filter.id, option.value, e.target.checked)}
                            />
                            <span className="ml-2 text-gray-700 dark:text-gray-300">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    )}
                    
                    {filter.type === 'range' && (
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <input
                            type="number"
                            className="w-24 px-2 py-1 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                            value={priceRange[0]}
                            onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                            min={0}
                            max={priceRange[1]}
                          />
                          <input
                            type="number"
                            className="w-24 px-2 py-1 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 0])}
                            min={priceRange[0]}
                            max={20000}
                          />
                        </div>
                        <input
                          type="range"
                          className="w-full"
                          min={0}
                          max={20000}
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                        />
                        <input
                          type="range"
                          className="w-full"
                          min={0}
                          max={20000}
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        />
                      </div>
                    )}
                  </div>
                ))}
                
                <div className="pt-4">
                  <button
                    onClick={clearAllFilters}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 mr-2"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
        
        {/* Desktop Filter Sidebar */}
        <div className="hidden md:block w-64 space-y-6 flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Filters</h3>
            
            <div className="space-y-6">
              {filterOptions.map(filter => (
                <div key={filter.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0 last:pb-0">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">{filter.label}</h4>
                  
                  {filter.type === 'checkbox' && filter.options && (
                    <div className="space-y-2">
                      {filter.options.map(option => (
                        <label key={option.value} className="flex items-center">
                          <input
                            type="checkbox"
                            className="rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600"
                            checked={selectedFilters[filter.id]?.includes(option.value) || false}
                            onChange={(e) => handleFilterChange(filter.id, option.value, e.target.checked)}
                          />
                          <span className="ml-2 text-gray-700 dark:text-gray-300">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  
                  {filter.type === 'range' && (
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <input
                          type="number"
                          className="w-24 px-2 py-1 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                          min={0}
                          max={priceRange[1]}
                        />
                        <input
                          type="number"
                          className="w-24 px-2 py-1 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 0])}
                          min={priceRange[0]}
                          max={20000}
                        />
                      </div>
                      <input
                        type="range"
                        className="w-full"
                        min={0}
                        max={20000}
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      />
                      <input
                        type="range"
                        className="w-full"
                        min={0}
                        max={20000}
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      />
                    </div>
                  )}
                </div>
              ))}
              
              {totalFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Product Grid */}
        <div className="flex-1">
          {filteredAndSortedProducts.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No Products Found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Try adjusting your filters or check out our other categories.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className={viewMode === 'grid' 
                ? "grid grid-cols-2 md:grid-cols-3 gap-4"
                : "space-y-4"
              }
            >
              {filteredAndSortedProducts.map((product: any) => (
                <motion.div
                  key={product.id}
                  variants={staggerItem}
                  className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${
                    viewMode === 'list' ? "flex" : ""
                  }`}
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className={`${viewMode === 'list' ? "w-40 h-40" : "w-full"}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className={`p-4 ${viewMode === 'list' ? "flex-1" : ""}`}>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1 line-clamp-1">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-baseline">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.originalPrice && (
                          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 line-through">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      
                      {product.rating && (
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">{product.rating}</span>
                        </div>
                      )}
                    </div>
                    
                    {viewMode === 'list' && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    
                    {viewMode === 'list' && (
                      <div className="flex space-x-2">
                        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md">
                          View Details
                        </button>
                        <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                          Add to Cart
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </AnimatedPage>
  );
};

export default CategoryProducts; 