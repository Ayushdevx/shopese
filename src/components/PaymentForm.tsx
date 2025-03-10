import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, DollarSign, Package, Check } from 'lucide-react';
import { fadeIn, slideUp } from '../utils/animations';

// Payment method icons
const PAYMENT_ICONS = {
  visa: 'https://cdn-icons-png.flaticon.com/512/349/349221.png',
  mastercard: 'https://cdn-icons-png.flaticon.com/512/349/349228.png',
  rupay: 'https://cdn-icons-png.flaticon.com/512/825/825454.png',
  upi: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1200px-UPI-Logo-vector.svg.png',
  cod: 'https://cdn-icons-png.flaticon.com/512/1254/1254498.png'
};

interface PaymentFormProps {
  onPaymentSubmit: (paymentData: any) => void;
  amount: number;
  isProcessing: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onPaymentSubmit, amount, isProcessing }) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [cardType, setCardType] = useState<'visa' | 'mastercard' | 'rupay' | ''>('');
  const [flipped, setFlipped] = useState(false);
  const [formValid, setFormValid] = useState(false);

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Format expiry date (MM/YY)
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
  };

  // Detect card type based on card number
  const detectCardType = (cardNumber: string) => {
    const number = cardNumber.replace(/\s+/g, '');
    
    // Visa
    if (/^4/.test(number)) {
      return 'visa';
    }
    
    // Mastercard
    if (/^5[1-5]/.test(number)) {
      return 'mastercard';
    }
    
    // RuPay (simplified check)
    if (/^6/.test(number)) {
      return 'rupay';
    }
    
    return '';
  };

  // Handle card number input with formatting
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatCardNumber(e.target.value);
    setCardNumber(value);
    setCardType(detectCardType(value));
    validateForm();
  };

  // Handle expiry date input with formatting
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatExpiryDate(e.target.value.substring(0, 5));
    setCardExpiry(value);
    validateForm();
  };

  // Flip the card when focusing on CVV
  const handleCvvFocus = () => {
    setFlipped(true);
  };

  // Flip back when leaving CVV field
  const handleCvvBlur = () => {
    setFlipped(false);
  };

  // Validate the payment form
  const validateForm = () => {
    if (paymentMethod === 'card') {
      setFormValid(
        cardNumber.replace(/\s/g, '').length >= 16 &&
        cardExpiry.length === 5 &&
        cardCvv.length >= 3 &&
        cardName.length > 0
      );
    } else if (paymentMethod === 'upi') {
      setFormValid(upiId.includes('@') && upiId.length > 3);
    } else {
      setFormValid(true); // COD is always valid
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValid && paymentMethod !== 'cod') return;
    
    const paymentData = {
      method: paymentMethod,
      data: paymentMethod === 'card' 
        ? { cardNumber, cardExpiry, cardCvv, cardName, saveCard } 
        : paymentMethod === 'upi' 
          ? { upiId } 
          : { cashOnDelivery: true }
    };
    
    onPaymentSubmit(paymentData);
  };

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Payment Method</h2>
      
      {/* Payment method selector */}
      <div className="flex mb-8 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => { setPaymentMethod('card'); validateForm(); }}
          className={`flex-1 py-4 flex items-center justify-center gap-2 transition-colors ${
            paymentMethod === 'card' 
              ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' 
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <CreditCard size={20} />
          <span>Card</span>
        </button>
        <button
          type="button"
          onClick={() => { setPaymentMethod('upi'); validateForm(); }}
          className={`flex-1 py-4 flex items-center justify-center gap-2 transition-colors ${
            paymentMethod === 'upi' 
              ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' 
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <img src={PAYMENT_ICONS.upi} alt="UPI" className="w-5 h-5" />
          <span>UPI</span>
        </button>
        <button
          type="button"
          onClick={() => { setPaymentMethod('cod'); validateForm(); }}
          className={`flex-1 py-4 flex items-center justify-center gap-2 transition-colors ${
            paymentMethod === 'cod' 
              ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' 
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <DollarSign size={20} />
          <span>Cash</span>
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          {/* Credit Card Form */}
          {paymentMethod === 'card' && (
            <motion.div
              key="card-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Card Preview */}
              <div className="perspective-1000 mb-6">
                <div className={`w-full h-48 relative transition-transform duration-700 transform-style-3d ${flipped ? 'rotate-y-180' : ''}`}>
                  {/* Front of Card */}
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl p-6 backface-hidden">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-sm opacity-80">Card Number</p>
                        <p className="text-lg tracking-wider font-medium">{cardNumber || '•••• •••• •••• ••••'}</p>
                      </div>
                      {cardType && (
                        <img
                          src={PAYMENT_ICONS[cardType]}
                          alt={cardType}
                          className="h-10 w-auto"
                        />
                      )}
                    </div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm opacity-80">Card Holder</p>
                          <p className="font-medium">{cardName || 'Your Name'}</p>
                        </div>
                        <div>
                          <p className="text-sm opacity-80">Expires</p>
                          <p className="font-medium">{cardExpiry || 'MM/YY'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Back of Card */}
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-xl backface-hidden rotate-y-180">
                    <div className="w-full h-12 bg-gray-800 mt-5"></div>
                    <div className="px-6 mt-6">
                      <div className="bg-gray-200 h-10 flex items-center justify-end px-4">
                        <span className="text-gray-800 font-medium">
                          {cardCvv || 'CVV'}
                        </span>
                      </div>
                      <div className="mt-6 text-xs opacity-80 text-center">
                        This card is property of ShopEasy. Misuse is a punishable offense.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    onKeyPress={(e) => {
                      if (!/[0-9\s]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Card Holder Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="J"
                    value={cardName}
                    onChange={(e) => {
                      setCardName(e.target.value);
                      validateForm();
                    }}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="MM/YY"
                      maxLength={5}
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      onKeyPress={(e) => {
                        if (!/[0-9/]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="123"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => {
                        if (/^\d{0,4}$/.test(e.target.value)) {
                          setCardCvv(e.target.value);
                          validateForm();
                        }
                      }}
                      onFocus={handleCvvFocus}
                      onBlur={handleCvvBlur}
                    />
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="save-card"
                    checked={saveCard}
                    onChange={(e) => setSaveCard(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label
                    htmlFor="save-card"
                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                  >
                    Save card for future payments
                  </label>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* UPI Form */}
          {paymentMethod === 'upi' && (
            <motion.div
              key="upi-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex justify-center mb-6">
                <img src={PAYMENT_ICONS.upi} alt="UPI" className="h-20" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  UPI ID
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="name@upi"
                  value={upiId}
                  onChange={(e) => {
                    setUpiId(e.target.value);
                    validateForm();
                  }}
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Enter your UPI ID (e.g. name@okaxis, name@ybl)
                </p>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
                <p className="text-blue-800 dark:text-blue-300 text-sm">
                  You will receive a payment request on your UPI app. Please complete the payment there.
                </p>
              </div>
            </motion.div>
          )}
          
          {/* Cash on Delivery */}
          {paymentMethod === 'cod' && (
            <motion.div
              key="cod-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20">
                  <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Cash on Delivery
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  You will pay ₹{amount.toLocaleString('en-IN')} when your order is delivered.
                </p>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md">
                <p className="text-yellow-800 dark:text-yellow-300 text-sm">
                  Please keep the exact amount ready at the time of delivery. Our delivery partner may not carry change.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.div
          className="mt-8"
          variants={slideUp}
          initial="hidden"
          animate="visible"
        >
          <button
            type="submit"
            disabled={isProcessing || (!formValid && paymentMethod !== 'cod')}
            className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
              isProcessing || (!formValid && paymentMethod !== 'cod')
                ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing Payment...</span>
              </div>
            ) : (
              <span>Pay ₹{amount.toLocaleString('en-IN')}</span>
            )}
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default PaymentForm; 