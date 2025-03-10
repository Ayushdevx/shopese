import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Trash2, ShoppingBag, Minus, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state.cart.items);

  const subtotal = cartItems.reduce(
    (sum: number, item: any) => sum + item.price * (item.quantity || 1), 
    0
  );
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  const handleRemoveFromCart = (itemId: string) => {
    dispatch({
      type: 'cart/removeFromCart',
      payload: itemId
    });
    toast.success('Item removed from cart');
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    
    dispatch({
      type: 'cart/updateQuantity',
      payload: { id: itemId, quantity }
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Your cart is empty</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Add some products to your cart to proceed to checkout.</p>
        <Link
          to="/"
          className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Shopping Cart</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {cartItems.map((item: any) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row gap-4 border-b dark:border-gray-700 py-6"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-md self-start"
              />
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{item.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{item.category}</p>
                  </div>
                  <p className="text-gray-900 dark:text-white font-medium">₹{item.price.toLocaleString('en-IN')}</p>
                </div>
                
                <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                  <div className="flex items-center border dark:border-gray-700 rounded-md">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, (item.quantity || 1) - 1)}
                      className="px-3 py-1 border-r dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      disabled={(item.quantity || 1) <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity || 1}
                      onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                      className="w-12 text-center py-1 border-none focus:outline-none bg-transparent text-gray-800 dark:text-gray-200"
                    />
                    <button
                      onClick={() => handleUpdateQuantity(item.id, (item.quantity || 1) + 1)}
                      className="px-3 py-1 border-l dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex items-center transition-colors"
                  >
                    <Trash2 className="w-5 h-5 mr-1" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-fit sticky top-24">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Order Summary</h2>
          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
              <span className="font-medium text-gray-900 dark:text-white">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Shipping</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {shipping === 0 ? 'Free' : `₹${shipping.toLocaleString('en-IN')}`}
              </span>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between">
              <span className="font-bold text-gray-900 dark:text-white">Total</span>
              <span className="font-bold text-gray-900 dark:text-white">₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <Link
            to="/checkout"
            className="block bg-indigo-600 hover:bg-indigo-700 text-white text-center py-3 px-4 rounded-md transition-colors"
          >
            Proceed to Checkout
          </Link>
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;