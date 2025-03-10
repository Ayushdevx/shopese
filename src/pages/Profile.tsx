import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  User as UserIcon,
  Settings,
  LogOut,
  Package,
  MapPin,
  PlusIcon,
  Trash2,
  Edit2,
  Heart,
  CreditCard,
  Phone,
  Mail,
  Calendar,
  Star,
  DownloadCloud,
  ShoppingBag,
  ShoppingCart,
  Camera
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { fadeIn, slideUp, itemVariants, containerVariants, staggerContainer, staggerItem } from '../utils/animations';
import { useUser, useOrders, useWishlist, useCart } from '../hooks/useReduxHooks';
import AnimatedPage from '../components/AnimatedPage';
import { 
  updateProfile, 
  addAddress, 
  removeAddress, 
  setDefaultAddress, 
  removeFromWishlist, 
  createDemoProfile 
} from '../store/slices/userSlice';
import { addToCart } from '../store/slices/cartSlice';

const ProfileTab = {
  PROFILE: 'profile',
  ORDERS: 'orders',
  ADDRESSES: 'addresses',
  WISHLIST: 'wishlist',
  SETTINGS: 'settings'
};

interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  date: string;
  status: string;
  items: OrderItem[];
  total: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

interface Address {
  id: string;
  type: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
}

interface AddressFormData {
  type: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { 
    isAuthenticated, 
    updateProfile: updateUserProfile, 
    addAddress: addUserAddress,
    removeAddress: removeUserAddress,
    setDefaultAddress: setUserDefaultAddress,
    createDemoProfile 
  } = useUser();
  const orders = [
    {
      id: 'ORD123456',
      date: '2023-07-15T12:00:00Z',
      status: 'Delivered',
      items: [
        {
          id: 'product1',
          name: 'Banarasi Silk Saree',
          price: 5999,
          image: 'https://images.pexels.com/photos/2235071/pexels-photo-2235071.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          quantity: 1
        }
      ],
      total: 5999,
      shippingAddress: {
        street: '123 Main Street, Apartment 4B',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001'
      }
    },
    {
      id: 'ORD789012',
      date: '2023-08-22T15:30:00Z',
      status: 'Shipped',
      items: [
        {
          id: 'product2',
          name: 'Men\'s Nehru Jacket',
          price: 2499,
          image: 'https://images.pexels.com/photos/2897531/pexels-photo-2897531.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          quantity: 1
        },
        {
          id: 'product3',
          name: 'Designer Anarkali Suit',
          price: 3499,
          image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          quantity: 1
        }
      ],
      total: 5998,
      shippingAddress: {
        street: 'Tech Park, Building C, Floor 5',
        city: 'Bangalore',
        state: 'Karnataka',
        zipCode: '560001'
      }
    }
  ];
  const { removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  
  const user = useSelector((state: any) => state.user);
  
  const [activeTab, setActiveTab] = useState(ProfileTab.PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [profileForm, setProfileForm] = useState<ProfileFormData>({
    name: '',
    email: '',
    phone: '',
  });
  
  const [newAddress, setNewAddress] = useState<AddressFormData>({
    type: 'Home',
    address: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });
  
  const dispatch = useDispatch();
  
  // Initialize profile form when user data is available
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !user) {
      // We'll keep this commented for now to allow the demo profile creation
      // navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);
  
  // Handle profile update
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(profileForm);
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddressInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addUserAddress(newAddress);
    toast.success('Address added successfully');
    setShowAddAddressForm(false);
    setNewAddress({
      type: 'Home',
      address: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false
    });
  };
  
  const handleRemoveAddress = (addressId: string) => {
    removeUserAddress(addressId);
    toast.success('Address removed successfully');
  };
  
  const handleSetDefaultAddress = (addressId: string) => {
    setUserDefaultAddress(addressId);
    toast.success('Default address updated');
  };
  
  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlist(productId);
    toast.success('Removed from wishlist');
  };
  
  const handleAddToCart = (productId: string) => {
    addToCart(productId);
    toast.success('Added to cart');
  };
  
  const handleCreateDemoProfile = () => {
    createDemoProfile();
    toast.success('Demo profile created');
  };
  
  // Add handleLogout function
  const handleLogout = () => {
    // If we had a logout action in Redux:
    // dispatch(logout());
    navigate('/login');
    toast.success('Logged out successfully');
  };
  
  // If not authenticated, show the welcome screen
  if (!isAuthenticated || !user) {
    return (
      <AnimatedPage className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <UserIcon size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Welcome to Your Profile</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            For demo purposes, we can create a sample profile for you.
          </p>
          <motion.button
            onClick={handleCreateDemoProfile}
            className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Create Demo Profile
          </motion.button>
          <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Already have an account?
            </p>
            <div className="flex justify-center space-x-4">
              <motion.button
                onClick={() => navigate('/login')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white px-6 py-2 rounded-md transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Login
              </motion.button>
              <motion.button
                onClick={() => navigate('/signup')}
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/30 dark:text-indigo-400 px-6 py-2 rounded-md transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign Up
              </motion.button>
            </div>
          </div>
        </div>
      </AnimatedPage>
    );
  }
  
  const renderTabContent = () => {
    switch (activeTab) {
      case ProfileTab.PROFILE:
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col md:flex-row items-center md:items-start">
                <div className="mb-6 md:mb-0 md:mr-8">
                  <div className="relative">
                    <img
                      src={user.avatar || 'https://i.pravatar.cc/300'}
                      alt={user.name}
                      className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-md"
                    />
                    <motion.button
                      className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full shadow-md"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Camera size={16} />
                    </motion.button>
                  </div>
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  {isEditing ? (
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={profileForm.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={profileForm.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={profileForm.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                      </div>
                      <div className="flex justify-end space-x-4 pt-4">
                        <motion.button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Cancel
                        </motion.button>
                        <motion.button
                          type="submit"
                          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Save Changes
                        </motion.button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                        <motion.button
                          onClick={() => setIsEditing(true)}
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center text-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Edit2 size={16} className="mr-1" />
                          Edit Profile
                        </motion.button>
                      </div>
                      <div className="space-y-2 mb-6">
                        <p className="text-gray-600 dark:text-gray-400 flex items-center">
                          <Mail size={16} className="mr-2 text-gray-500" />
                          <span className="font-medium text-gray-800 dark:text-gray-200">{user.email}</span>
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 flex items-center">
                          <Phone size={16} className="mr-2 text-gray-500" />
                          <span className="font-medium text-gray-800 dark:text-gray-200">{user.phone || 'Not provided'}</span>
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 flex items-center">
                          <Calendar size={16} className="mr-2 text-gray-500" />
                          <span className="font-medium text-gray-800 dark:text-gray-200">Member since {new Date().toLocaleDateString()}</span>
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
        
      case ProfileTab.ORDERS:
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Your Orders</h2>
              
              {orders && orders.length > 0 ? (
                <motion.div 
                  className="space-y-6"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  {orders.map((order: Order) => (
                    <motion.div 
                      key={order.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                      variants={staggerItem}
                    >
                      <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Order #{order.id}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Placed on {new Date(order.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="mt-2 sm:mt-0 flex items-center">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            order.status === 'Delivered' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                              : order.status === 'Shipped' 
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                              : order.status === 'Processing'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="px-4 py-4">
                        {order.items.map((item: OrderItem) => (
                          <div key={item.id} className="flex py-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
                            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                            <div className="ml-4 flex flex-1 flex-col">
                              <div>
                                <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                                  <h3 className="line-clamp-1">{item.name}</h3>
                                  <p className="ml-4">₹{item.price.toFixed(2)}</p>
                                </div>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                              <div className="flex flex-1 items-end justify-between text-sm">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                                >
                                  Track Package
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                                >
                                  Buy Again
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex justify-between items-center">
                        <p className="text-base font-medium text-gray-900 dark:text-white">
                          Total: ₹{order.total.toFixed(2)}
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          View Order Details
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-12 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                  <ShoppingBag size={32} className="mx-auto text-gray-400 dark:text-gray-500 mb-3" />
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    You haven't placed any orders yet.
                  </p>
                  <Link to="/" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium">
                    Continue shopping
                  </Link>
                </div>
              )}
            </div>
          </div>
        );
        
      case ProfileTab.ADDRESSES:
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Saved Addresses</h2>
                <motion.button
                  onClick={() => setShowAddAddressForm(true)}
                  className="flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <PlusIcon size={16} className="mr-1" />
                  Add New Address
                </motion.button>
              </div>
              
              {showAddAddressForm && (
                <motion.div 
                  className="mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <form onSubmit={handleAddressSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Address Type
                        </label>
                        <select
                          name="type"
                          value={newAddress.type}
                          onChange={handleAddressInputChange}
                          className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="Home">Home</option>
                          <option value="Office">Office</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Address *
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={newAddress.address}
                          onChange={handleAddressInputChange}
                          className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                          value={newAddress.city}
                          onChange={handleAddressInputChange}
                          className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          State *
                        </label>
                        <select
                          name="state"
                          value={newAddress.state}
                          onChange={handleAddressInputChange}
                          className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Pincode *
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          value={newAddress.pincode}
                          onChange={handleAddressInputChange}
                          className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="isDefault"
                          name="isDefault"
                          checked={newAddress.isDefault}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, isDefault: e.target.checked }))}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          Set as default address
                        </label>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                      <motion.button
                        type="button"
                        onClick={() => setShowAddAddressForm(false)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Save Address
                      </motion.button>
                    </div>
                  </form>
                </motion.div>
              )}
              
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {user.addresses && user.addresses.length > 0 ? (
                  user.addresses.map((address: Address) => (
                    <motion.div 
                      key={address.id}
                      className={`p-4 border rounded-lg ${
                        address.isDefault 
                          ? 'border-indigo-300 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20' 
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                      variants={staggerItem}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">{address.type}</span>
                          {address.isDefault && (
                            <span className="ml-2 text-xs px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          {!address.isDefault && (
                            <motion.button
                              onClick={() => handleSetDefaultAddress(address.id)}
                              className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Set Default
                            </motion.button>
                          )}
                          <motion.button
                            onClick={() => handleRemoveAddress(address.id)}
                            className="text-red-500 hover:text-red-700 dark:hover:text-red-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Trash2 size={16} />
                          </motion.button>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-1">
                        {address.address}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {address.city}, {address.state} - {address.pincode}
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                    <MapPin size={32} className="mx-auto text-gray-400 dark:text-gray-500 mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">
                      You haven't added any addresses yet.
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        );
        
      case ProfileTab.WISHLIST:
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Your Wishlist</h2>
              
              {user.wishlist && user.wishlist.length > 0 ? (
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  {user.wishlist.map((item: WishlistItem) => (
                    <motion.div 
                      key={item.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden group"
                      variants={staggerItem}
                    >
                      <div className="relative h-48 w-full overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover object-center transform group-hover:scale-105 transition-transform duration-200"
                        />
                        <motion.button
                          onClick={() => handleRemoveFromWishlist(item.id)}
                          className="absolute top-2 right-2 bg-white dark:bg-gray-800 p-1.5 rounded-full text-red-500 hover:text-red-700 shadow-sm"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Heart size={16} fill="currentColor" />
                        </motion.button>
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{item.name}</h3>
                        <div className="mt-1 flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">₹{item.price.toFixed(2)}</p>
                          <div className="flex items-center">
                            <Star size={14} className="text-yellow-400 fill-current" />
                            <span className="ml-1 text-xs text-gray-600 dark:text-gray-400">{item.rating}</span>
                          </div>
                        </div>
                        <motion.button
                          onClick={() => handleAddToCart(item.id)}
                          className="mt-3 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <ShoppingCart size={14} className="mr-2" />
                          Add to Cart
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-12 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                  <Heart size={32} className="mx-auto text-gray-400 dark:text-gray-500 mb-3" />
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Your wishlist is empty.
                  </p>
                  <Link to="/" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium">
                    Browse products
                  </Link>
                </div>
              )}
            </div>
          </div>
        );
        
      case ProfileTab.SETTINGS:
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Account Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Password</h3>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <motion.button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Update Password
                      </motion.button>
                    </div>
                  </form>
                </div>
                
                <hr className="border-gray-200 dark:border-gray-700" />
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="email_notifications"
                          type="checkbox"
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          defaultChecked
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="email_notifications" className="font-medium text-gray-700 dark:text-gray-300">
                          Email Notifications
                        </label>
                        <p className="text-gray-500 dark:text-gray-400">Receive emails about your orders, account updates, and special offers.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="sms_notifications"
                          type="checkbox"
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="sms_notifications" className="font-medium text-gray-700 dark:text-gray-300">
                          SMS Notifications
                        </label>
                        <p className="text-gray-500 dark:text-gray-400">Receive text messages about your orders and delivery updates.</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <motion.button
                      type="button"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Save Preferences
                    </motion.button>
                  </div>
                </div>
                
                <hr className="border-gray-200 dark:border-gray-700" />
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Account Actions</h3>
                  <div className="space-y-4">
                    <motion.button
                      onClick={handleLogout}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </motion.button>
                    <motion.button
                      className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <DownloadCloud size={16} className="mr-2" />
                      Download My Data
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <AnimatedPage className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">My Account</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <img
                  src={user.avatar || 'https://i.pravatar.cc/300'}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{user.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
              </div>
            </div>
            <nav className="p-2">
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setActiveTab(ProfileTab.PROFILE)}
                    className={`w-full flex items-center px-3 py-2 rounded-md ${
                      activeTab === ProfileTab.PROFILE
                        ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <UserIcon size={18} className="mr-3" />
                    <span>Profile</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab(ProfileTab.ORDERS)}
                    className={`w-full flex items-center px-3 py-2 rounded-md ${
                      activeTab === ProfileTab.ORDERS
                        ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <ShoppingBag size={18} className="mr-3" />
                    <span>Orders</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab(ProfileTab.ADDRESSES)}
                    className={`w-full flex items-center px-3 py-2 rounded-md ${
                      activeTab === ProfileTab.ADDRESSES
                        ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <MapPin size={18} className="mr-3" />
                    <span>Addresses</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab(ProfileTab.WISHLIST)}
                    className={`w-full flex items-center px-3 py-2 rounded-md ${
                      activeTab === ProfileTab.WISHLIST
                        ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Heart size={18} className="mr-3" />
                    <span>Wishlist</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab(ProfileTab.SETTINGS)}
                    className={`w-full flex items-center px-3 py-2 rounded-md ${
                      activeTab === ProfileTab.SETTINGS
                        ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Settings size={18} className="mr-3" />
                    <span>Settings</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="col-span-1 md:col-span-3">
          {renderTabContent()}
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Profile;

// Helper icon component for Trash since we didn't import it
const Trash = ({ size = 24, className = '' }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M3 6h18"></path>
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
  </svg>
);

// Helper icon component for Plus since we didn't import it
const Plus = ({ size = 24, className = '' }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 5v14M5 12h14"></path>
  </svg>
);