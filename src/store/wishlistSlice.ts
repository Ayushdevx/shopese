import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WishlistItem {
  id: string;
  name: string;
  image: string;
  price: number;
  [key: string]: any; // For any additional product properties
}

interface WishlistState {
  items: WishlistItem[];
}

const initialState: WishlistState = {
  items: []
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<WishlistItem>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (!existingItem) {
        state.items.push(action.payload);
      }
    },
    
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    
    clearWishlist: (state) => {
      state.items = [];
    },
    
    moveToCart: (state, action: PayloadAction<string>) => {
      // This reducer doesn't modify the wishlist - it only marks the item
      // for moving to cart (the actual move happens in the component)
      // The item will be removed from wishlist through the removeItem action
    }
  }
});

export const { addItem, removeItem, clearWishlist, moveToCart } = wishlistSlice.actions;

export default wishlistSlice.reducer; 