import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Package, Truck, Calendar, ChevronDown, ChevronUp, MapPin, AlertTriangle } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import { useOrders } from '../hooks/useReduxHooks';
import { fadeIn, staggerContainer, staggerItem } from '../utils/animations';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
};

const OrderCard = ({ order }: { order: any }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  
  const formattedDate = new Date(order.date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const statusIcon = {
    pending: <Package size={16} />,
    processing: <Package size={16} />,
    shipped: <Truck size={16} />,
    delivered: <Truck size={16} />,
    cancelled: <AlertTriangle size={16} />
  };
  
  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-4"
      variants={staggerItem}
    >
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Order #{order.id}
            </h3>
            <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
              <Calendar size={16} className="mr-1" />
              <span>{formattedDate}</span>
            </div>
          </div>
          
          <div className="mt-2 sm:mt-0 flex items-center">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
              {statusIcon[order.status as keyof typeof statusIcon]}
              <span className="ml-1 capitalize">{order.status}</span>
            </span>
            <span className="ml-4 font-medium text-gray-900 dark:text-white">
              ₹{order.total.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <MapPin size={16} className="mr-1" />
            <span className="truncate max-w-[250px]">
              {order.shippingAddress.street}, {order.shippingAddress.city}
            </span>
          </div>
          
          <button
            className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center text-sm font-medium focus:outline-none"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>
                <span>Hide Details</span>
                <ChevronUp size={16} className="ml-1" />
              </>
            ) : (
              <>
                <span>Show Details</span>
                <ChevronDown size={16} className="ml-1" />
              </>
            )}
          </button>
        </div>
        
        {expanded && (
          <motion.div 
            className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Order Items</h4>
              <div className="space-y-3">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex items-center">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="ml-4 flex-1">
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</h5>
                      <div className="flex justify-between mt-1">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Qty: {item.quantity}
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Shipping Address</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}
                </p>
              </div>
              
              {order.trackingNumber && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Tracking Information</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Tracking Number: {order.trackingNumber}
                  </p>
                  {order.estimatedDelivery && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Estimated Delivery: {order.estimatedDelivery}
                    </p>
                  )}
                </div>
              )}
              
              <div className="flex justify-end pt-4">
                <motion.button
                  className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/order/${order.id}`)}
                >
                  View Order Details
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const Orders = () => {
  const { orders } = useOrders();
  const navigate = useNavigate();
  
  // No orders yet
  if (orders.length === 0) {
    return (
      <AnimatedPage className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">My Orders</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <Package size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No orders yet</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            You haven't placed any orders yet. Explore our products and place your first order!
          </p>
          <motion.button
            className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
          >
            Browse Products
          </motion.button>
        </div>
      </AnimatedPage>
    );
  }
  
  return (
    <AnimatedPage className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">My Orders</h1>
      
      <motion.div
        className="space-y-4"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </motion.div>
    </AnimatedPage>
  );
};

export default Orders; 