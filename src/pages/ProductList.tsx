import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { products } from '../data/products';
import { Filter } from 'lucide-react';

export default function ProductList() {
  const { category } = useParams();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  const filteredProducts = products.filter(product => 
    (category === 'all' || product.category === category) &&
    product.price >= priceRange[0] &&
    product.price <= priceRange[1] &&
    (selectedSizes.length === 0 || product.sizes.some(size => selectedSizes.includes(size)))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex gap-8">
        <div className="w-64 flex-shrink-0">
          <div className="sticky top-24 bg-white p-4 rounded-lg shadow">
            <div className="flex items-center mb-4">
              <Filter size={20} className="mr-2" />
              <h2 className="text-xl font-semibold">Filters</h2>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-2">Price Range</h3>
              <input
                type="range"
                min="0"
                max="200"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Sizes</h3>
              <div className="flex flex-wrap gap-2">
                {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSizes(prev => 
                      prev.includes(size) 
                        ? prev.filter(s => s !== size)
                        : [...prev, size]
                    )}
                    className={`px-3 py-1 rounded ${
                      selectedSizes.includes(size)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-8 capitalize">
            {category === 'all' ? 'All Products' : `${category}'s Collection`}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-lg overflow-hidden shadow-md"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-2">${product.price}</p>
                  <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}