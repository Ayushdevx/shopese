import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<string | CartItem>) => {
      // If the payload is just a product ID, we would normally fetch the product details
      // For demo purposes, we'll add a mock product
      if (typeof action.payload === 'string') {
        const productId = action.payload;
        const existingItem = state.items.find(item => item.id === productId);
        
        if (existingItem) {
          // Increment quantity if item already exists
          existingItem.quantity += 1;
        } else {
          // Add new item with mock data
          state.items.push({
            id: productId,
            name: `Product ${productId}`,
            price: 1999,
            originalPrice: 2499,
            image: 'https://images.pexels.com/photos/2235071/pexels-photo-2235071.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            quantity: 1
          });
        }
      } else {
        // If full product object is provided
        const existingItem = state.items.find(item => item.id === action.payload.id);
        
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          state.items.push({
            ...action.payload,
            quantity: 1
          });
        }
      }
      
      // Update totals
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      
      // Update totals
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      
      if (item) {
        item.quantity = Math.max(1, quantity); // Ensure quantity is at least 1
      }
      
      // Update totals
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;
    }
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer; 