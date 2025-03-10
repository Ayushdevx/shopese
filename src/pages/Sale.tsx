import React from 'react';
import { useSelector } from 'react-redux';
import ProductCard from '../components/ProductCard';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  description: string;
}

const Sale: React.FC = () => {
  // TODO: Replace with actual sale products from Redux store
  const products: Product[] = useSelector((state: any) => state.products?.items || []);
  
  // Filter products that are on sale (have a discount)
  const saleProducts = products.filter(product => product.discount && product.discount > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Sale</h1>
        <p className="text-gray-600">Discover amazing deals on our products</p>
      </div>

      {saleProducts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No products currently on sale</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {saleProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                originalPrice={product.originalPrice}
                discount={product.discount}
                image={product.image}
                description={product.description}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Sale; 