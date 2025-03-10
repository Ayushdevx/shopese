import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import toast from 'react-hot-toast';
import { 
  User, 
  login as loginAction, 
  signup as signupAction, 
  logout as logoutAction,
  updateProfile as updateProfileAction,
  addAddress as addAddressAction,
  removeAddress as removeAddressAction,
  setDefaultAddress as setDefaultAddressAction,
  addToWishlist as addToWishlistAction,
  removeFromWishlist as removeFromWishlistAction,
  createDemoProfile as createDemoProfileAction
} from '../store/slices/userSlice';

import {
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
  updateQuantity as updateQuantityAction,
  clearCart as clearCartAction
} from '../store/slices/cartSlice';

// Use throughout your app instead of plain useDispatch and useSelector
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Custom hook for cart operations
export const useCart = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state: any) => state.cart.items);
  
  // Calculate cart totals
  const subtotal = cartItems.reduce(
    (total: number, item: any) => total + item.price * (item.quantity || 1),
    0
  );
  
  const itemCount = cartItems.reduce(
    (count: number, item: any) => count + (item.quantity || 1),
    0
  );

  // Cart actions
  const addToCart = (product: any, quantity = 1) => {
    dispatch({
      type: 'cart/addToCart',
      payload: typeof product === 'string' ? product : { ...product, quantity }
    });
    toast.success('Added to cart!');
  };

  const removeFromCart = (productId: string) => {
    dispatch({
      type: 'cart/removeFromCart',
      payload: productId
    });
    toast.success('Removed from cart');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({
      type: 'cart/updateQuantity',
      payload: { id: productId, quantity }
    });
  };

  const clearCart = () => {
    dispatch({ type: 'cart/clearCart' });
  };

  return {
    cartItems,
    subtotal,
    itemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };
};

// Custom hook for wishlist operations
export const useWishlist = () => {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state: any) => state.wishlist.items);
  
  const addToWishlist = (product: any) => {
    dispatch({
      type: 'wishlist/addItem',
      payload: product
    });
    toast.success('Added to wishlist!');
  };
  
  const removeFromWishlist = (productId: string) => {
    dispatch({
      type: 'wishlist/removeItem',
      payload: productId
    });
    toast.success('Removed from wishlist');
  };
  
  const isInWishlist = (productId: string) => {
    return wishlistItems.some((item: any) => item.id === productId);
  };
  
  return {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist
  };
};

// Custom hook for products
export const useProducts = () => {
  const products = useAppSelector((state: any) => state.products.items);
  const categories = useAppSelector((state: any) => state.products.categories);
  const featuredCollections = useAppSelector((state: any) => state.products.featuredCollections);
  
  // Get featured products
  const featuredProducts = products.filter((product: any) => product.featured);
  
  // Get new arrivals
  const newArrivals = products.filter((product: any) => product.isNew);
  
  // Get best sellers
  const bestSellers = products.filter((product: any) => product.bestSeller);
  
  // Get products by category
  const getProductsByCategory = (categoryId: string) => {
    return products.filter((product: any) => 
      product.category === categoryId || 
      product.categories?.includes(categoryId)
    );
  };
  
  // Search products
  const searchProducts = (query: string) => {
    const searchTerm = query.toLowerCase();
    return products.filter((product: any) => 
      product.name.toLowerCase().includes(searchTerm) || 
      product.description.toLowerCase().includes(searchTerm) ||
      product.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm))
    );
  };
  
  // Get product by ID
  const getProductById = (productId: string) => {
    return products.find((product: any) => product.id === productId);
  };
  
  // Get related products
  const getRelatedProducts = (productId: string, limit = 4) => {
    const product = getProductById(productId);
    if (!product) return [];
    
    // Get products in same category, excluding the current product
    const sameCategory = products.filter(
      (p: any) => 
        p.id !== productId && 
        (p.category === product.category || 
         p.categories?.some((cat: string) => product.categories?.includes(cat)))
    );
    
    // If we have enough products in the same category, return those
    if (sameCategory.length >= limit) {
      return sameCategory.slice(0, limit);
    }
    
    // Otherwise, fill in with other products
    const otherProducts = products.filter(
      (p: any) => 
        p.id !== productId && 
        !sameCategory.some((sc: any) => sc.id === p.id)
    );
    
    return [...sameCategory, ...otherProducts].slice(0, limit);
  };
  
  return {
    products,
    categories,
    featuredCollections,
    featuredProducts,
    newArrivals,
    bestSellers,
    getProductsByCategory,
    searchProducts,
    getProductById,
    getRelatedProducts
  };
};

// Custom hook for orders
export const useOrders = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state: any) => state.orders.items);
  
  // Get order by ID
  const getOrderById = (orderId: string) => {
    return orders.find((order: any) => order.id === orderId);
  };
  
  // Add new order
  const addOrder = (orderData: any) => {
    dispatch({
      type: 'orders/addOrder',
      payload: orderData
    });
  };
  
  // Update order status
  const updateOrderStatus = (orderId: string, status: string) => {
    dispatch({
      type: 'orders/updateStatus',
      payload: { id: orderId, status }
    });
  };
  
  return {
    orders,
    getOrderById,
    addOrder,
    updateOrderStatus
  };
};

// Custom hook for user profile
export const useUser = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: any) => state.user);

  return {
    ...user,
    isAuthenticated: user.isAuthenticated,
    login: (credentials: { email: string; password: string }) => {
      dispatch(loginAction(credentials));
    },
    signup: (userData: { name: string; email: string; password: string }) => {
      dispatch(signupAction(userData));
    },
    logout: () => {
      dispatch(logoutAction());
    },
    updateProfile: (profileData: { name: string; email: string; phone: string }) => {
      dispatch(updateProfileAction(profileData));
    },
    addAddress: (addressData: any) => {
      dispatch(addAddressAction(addressData));
    },
    removeAddress: (addressId: string) => {
      dispatch(removeAddressAction(addressId));
    },
    setDefaultAddress: (addressId: string) => {
      dispatch(setDefaultAddressAction(addressId));
    },
    createDemoProfile: () => {
      dispatch(createDemoProfileAction());
    }
  };
}; 