import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Truck, Package, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import AnimatedPage from '../components/AnimatedPage';
import PaymentForm from '../components/PaymentForm';
import { useCart } from '../hooks/useReduxHooks';
import { fadeIn, slideUp } from '../utils/animations';

// Payment icons
const paymentIcons = {
  visa: 'https://cdn-icons-png.flaticon.com/512/349/349221.png',
  mastercard: 'https://cdn-icons-png.flaticon.com/512/349/349228.png',
  amex: 'https://cdn-icons-png.flaticon.com/512/349/349230.png',
  paytm: 'https://cdn-icons-png.flaticon.com/512/825/825454.png',
  upi: 'https://cdn-icons-png.flaticon.com/512/4594/4594472.png',
  cod: 'https://cdn-icons-png.flaticon.com/512/1254/1254498.png'
};

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  upiId?: string;
}

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, subtotal, clearCart } = useCart();
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: 'Aarav',
    lastName: 'Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 9876543210',
    address: '123 Lotus Colony, Sector 42',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    paymentMethod: 'creditCard',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    upiId: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOrderComplete, setIsOrderComplete] = useState(false);

  // Calculate shipping and total
  const shipping = subtotal > 999 ? 0 : 99;
  const discount = 0;
  const total = subtotal + shipping - discount;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStepChange = (step: number) => {
    // Basic validation before proceeding
    if (step > activeStep) {
      if (step === 2 && !validateAddressForm()) {
        return; // Error toast is already shown in validateAddressForm
      }
    }
    
    // Use smooth scrolling for step change
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveStep(step);
  };

  const validateAddressForm = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
    const emptyFields = requiredFields.filter(field => !formData[field as keyof FormData]);
    
    if (emptyFields.length > 0) {
      const fieldNames = emptyFields.map(field => field.charAt(0).toUpperCase() + field.slice(1)).join(', ');
      toast.error(`Please fill in the following fields: ${fieldNames}`);
      return false;
    }
    
    return true;
  };

  const handlePaymentSubmit = (paymentData: any) => {
    setIsProcessing(true);
    
    // Simulate payment processing with a visual delay for better UX
    setTimeout(() => {
      setIsProcessing(false);
      setIsOrderComplete(true);
      
      // Clear cart after successful order
      clearCart();
      
      // Show success message
      toast.success('Order placed successfully!');
      
      // Save order to order history
      const orderId = `ORD${Math.floor(100000 + Math.random() * 900000)}`;
      dispatch({
        type: 'orders/addOrder',
        payload: {
          id: orderId,
          date: new Date().toISOString(),
          status: 'pending',
          items: cartItems,
          total,
          shippingAddress: {
            street: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.pincode
          }
        }
      });
      
      // Scroll to top for success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
  };

  // If cart is empty, show a message
  if (cartItems.length === 0 && !isOrderComplete) {
    return (
      <AnimatedPage className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Your cart is empty</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Add some products to your cart to proceed to checkout.</p>
        <motion.button
          onClick={() => navigate('/')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Continue Shopping
        </motion.button>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Checkout</h1>
      
      {isOrderComplete ? (
        <motion.div 
          className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <motion.div 
            className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
          >
            <Check size={32} className="text-green-600 dark:text-green-400" />
          </motion.div>
          <motion.h2 
            className="text-2xl font-bold mb-4 text-gray-900 dark:text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Order Placed Successfully!
          </motion.h2>
          <motion.p 
            className="text-gray-600 dark:text-gray-400 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Thank you for your purchase. Your order has been received and is being processed.
          </motion.p>
          <motion.p 
            className="text-gray-800 dark:text-gray-200 font-medium mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            A confirmation email has been sent to {formData.email}
          </motion.p>
          <motion.div 
            className="flex justify-center space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.button
              onClick={() => navigate('/orders')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Order
            </motion.button>
            <motion.button
              onClick={() => navigate('/')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white px-6 py-3 rounded-md transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Continue Shopping
            </motion.button>
          </motion.div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Steps */}
          <div className="lg:col-span-2">
            {/* Checkout Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <motion.div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activeStep >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                    animate={{
                      scale: activeStep === 1 ? [1, 1.1, 1] : 1
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    1
                  </motion.div>
                  <span className={`ml-2 ${
                    activeStep >= 1 ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    Cart
                  </span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 w-8 sm:w-16"></div>
                <div className="flex items-center">
                  <motion.div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activeStep >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                    animate={{
                      scale: activeStep === 2 ? [1, 1.1, 1] : 1
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    2
                  </motion.div>
                  <span className={`ml-2 ${
                    activeStep >= 2 ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    Delivery
                  </span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 w-8 sm:w-16"></div>
                <div className="flex items-center">
                  <motion.div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activeStep >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                    animate={{
                      scale: activeStep === 3 ? [1, 1.1, 1] : 1
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    3
                  </motion.div>
                  <span className={`ml-2 ${
                    activeStep >= 3 ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    Payment
                  </span>
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {/* Step 1: Shopping Cart */}
              {activeStep === 1 && (
                <motion.div
                  key="cart"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8"
                  variants={fadeIn}
                >
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Shopping Cart</h2>
                    <div className="space-y-4">
                      {cartItems.map((item: any) => (
                        <motion.div 
                          key={item.id} 
                          className="flex border-b dark:border-gray-700 pb-4"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-md"
                          />
                          <div className="ml-4 flex-grow">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{item.name}</h3>
                            <div className="flex justify-between mt-1">
                              <p className="text-gray-600 dark:text-gray-400">
                                Qty: {item.quantity || 1}
                              </p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                ₹{(item.price * (item.quantity || 1)).toLocaleString('en-IN')}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <div className="p-6 bg-gray-50 dark:bg-gray-900">
                    <motion.button
                      type="button"
                      onClick={() => handleStepChange(2)}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-md flex items-center justify-center space-x-2 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>Continue to Delivery</span>
                      <ChevronRight size={18} />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Delivery Address */}
              {activeStep === 2 && (
                <motion.div
                  key="delivery"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8"
                  variants={fadeIn}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Delivery Address</h2>
                      <motion.button
                        type="button"
                        onClick={() => {
                          setFormData({
                            firstName: 'Aarav',
                            lastName: 'Sharma',
                            email: 'aarav.sharma@example.com',
                            phone: '+91 9876543210',
                            address: '123 Lotus Colony, Sector 42',
                            city: 'Mumbai',
                            state: 'Maharashtra',
                            pincode: '400001',
                            paymentMethod: formData.paymentMethod,
                            cardNumber: formData.cardNumber,
                            cardExpiry: formData.cardExpiry,
                            cardCvv: formData.cardCvv,
                            upiId: formData.upiId
                          });
                          toast.success('Address information filled');
                        }}
                        className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Use Sample Information
                      </motion.button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Address *
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          State *
                        </label>
                        <select
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        >
                          <option value="">Select State</option>
                          <option value="Andhra Pradesh">Andhra Pradesh</option>
                          <option value="Delhi">Delhi</option>
                          <option value="Gujarat">Gujarat</option>
                          <option value="Karnataka">Karnataka</option>
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Tamil Nadu">Tamil Nadu</option>
                          <option value="Uttar Pradesh">Uttar Pradesh</option>
                          <option value="West Bengal">West Bengal</option>
                          {/* Add more states as needed */}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Pincode *
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-gray-50 dark:bg-gray-900 flex justify-between">
                    <motion.button
                      type="button"
                      onClick={() => handleStepChange(1)}
                      className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Back
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => handleStepChange(3)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-md flex items-center space-x-2 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>Continue to Payment</span>
                      <ChevronRight size={18} />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Payment */}
              {activeStep === 3 && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  variants={fadeIn}
                >
                  <PaymentForm 
                    onPaymentSubmit={handlePaymentSubmit} 
                    amount={total} 
                    isProcessing={isProcessing} 
                  />
                  
                  <div className="mt-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <div className="flex justify-between">
                      <motion.button
                        type="button"
                        onClick={() => handleStepChange(2)}
                        className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Back
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden sticky top-24"
              variants={slideUp}
              initial="hidden"
              animate="visible"
            >
              <div className="p-6">
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
                  {discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Discount</span>
                      <span className="font-medium text-green-600 dark:text-green-400">-₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between">
                    <span className="font-bold text-gray-900 dark:text-white">Total</span>
                    <span className="font-bold text-gray-900 dark:text-white">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <Truck size={20} className="mr-2 text-green-500" />
                    <span>Free shipping on orders over ₹999</span>
                  </div>
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <Package size={20} className="mr-2 text-green-500" />
                    <span>Secure packaging and delivery</span>
                  </div>
                </div>

                {/* Display cart items in summary */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-4">Items in Cart</h3>
                  <div className="max-h-60 overflow-y-auto space-y-4 pr-2">
                    {cartItems.map((item: any) => (
                      <div key={item.id} className="flex items-center text-sm">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-10 h-10 object-cover rounded-md mr-3"
                        />
                        <div className="flex-1">
                          <p className="text-gray-900 dark:text-white line-clamp-1">{item.name}</p>
                          <div className="flex justify-between text-gray-600 dark:text-gray-400">
                            <span>x{item.quantity || 1}</span>
                            <span>₹{(item.price * (item.quantity || 1)).toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatedPage>
  );
};

export default Checkout;