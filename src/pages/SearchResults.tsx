import React from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProductCard from '../components/ProductCard';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

const SearchResults: React.FC = () => {
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('q') || '';
  
  // TODO: Replace with actual search results from Redux store
  const products: Product[] = useSelector((state: any) => state.products?.items || []);
  
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Search Results</h1>
      <p className="text-gray-600 mb-8">
        {filteredProducts.length} results for "{searchQuery}"
      </p>
      
      {filteredProducts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No products found matching your search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              description={product.description}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults; 