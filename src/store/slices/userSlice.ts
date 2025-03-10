import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Address {
  id: string;
  type: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  addresses: Address[];
  wishlist: WishlistItem[];
  isAuthenticated: boolean;
}

const initialState: User = {
  id: '',
  name: '',
  email: '',
  phone: '',
  avatar: '',
  addresses: [],
  wishlist: [],
  isAuthenticated: false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ email: string; password: string }>) => {
      // In a real app, this would be an async thunk that calls an API
      // For demo purposes, we'll just set a mock user
      state.id = 'user123';
      state.name = 'J';
      state.email = action.payload.email;
      state.phone = '+91 9876543210';
      state.avatar = 'https://i.pravatar.cc/300';
      state.isAuthenticated = true;
      
      // Add some demo addresses
      state.addresses = [
        {
          id: 'addr1',
          type: 'Home',
          address: '123 Main Street, Apartment 4B',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          isDefault: true
        },
        {
          id: 'addr2',
          type: 'Office',
          address: 'Tech Park, Building C, Floor 5',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560001',
          isDefault: false
        }
      ];
      
      // Add some demo wishlist items
      state.wishlist = [
        {
          id: 'product1',
          name: 'Banarasi Silk Saree',
          price: 5999,
          image: 'https://images.pexels.com/photos/2235071/pexels-photo-2235071.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          rating: 4.8
        },
        {
          id: 'product2',
          name: 'Men\'s Nehru Jacket',
          price: 2499,
          image: 'https://images.pexels.com/photos/2897531/pexels-photo-2897531.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          rating: 4.5
        }
      ];
    },
    
    signup: (state, action: PayloadAction<{ name: string; email: string; password: string }>) => {
      // In a real app, this would be an async thunk that calls an API
      state.id = 'user123';
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.phone = '';
      state.avatar = 'https://i.pravatar.cc/300';
      state.isAuthenticated = true;
      state.addresses = [];
      state.wishlist = [];
    },
    
    logout: (state) => {
      return initialState;
    },
    
    updateProfile: (state, action: PayloadAction<{ name: string; email: string; phone: string }>) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.phone = action.payload.phone;
    },
    
    addAddress: (state, action: PayloadAction<Omit<Address, 'id'>>) => {
      const newAddress = {
        ...action.payload,
        id: `addr${state.addresses.length + 1}`
      };
      
      // If this is the first address or marked as default, set it as default
      if (newAddress.isDefault || state.addresses.length === 0) {
        // Set all other addresses to non-default
        state.addresses = state.addresses.map(addr => ({
          ...addr,
          isDefault: false
        }));
      }
      
      state.addresses.push(newAddress);
    },
    
    removeAddress: (state, action: PayloadAction<string>) => {
      const addressIndex = state.addresses.findIndex(addr => addr.id === action.payload);
      if (addressIndex !== -1) {
        const wasDefault = state.addresses[addressIndex].isDefault;
        state.addresses.splice(addressIndex, 1);
        
        // If the removed address was the default and we have other addresses,
        // set the first one as default
        if (wasDefault && state.addresses.length > 0) {
          state.addresses[0].isDefault = true;
        }
      }
    },
    
    setDefaultAddress: (state, action: PayloadAction<string>) => {
      state.addresses = state.addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === action.payload
      }));
    },
    
    addToWishlist: (state, action: PayloadAction<WishlistItem>) => {
      if (!state.wishlist.some(item => item.id === action.payload.id)) {
        state.wishlist.push(action.payload);
      }
    },
    
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.wishlist = state.wishlist.filter(item => item.id !== action.payload);
    },
    
    createDemoProfile: (state) => {
      state.id = 'demo123';
      state.name = 'Upasana Roy';
      state.email = 'upasana.roy@example.com';
      state.phone = '+91 9876543210';
      state.avatar = 'https://i.pravatar.cc/300';
      state.isAuthenticated = true;
      
      // Add demo addresses
      state.addresses = [
        {
          id: 'addr1',
          type: 'Home',
          address: '123 Main Street, Apartment 4B',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          isDefault: true
        },
        {
          id: 'addr2',
          type: 'Office',
          address: 'Tech Park, Building C, Floor 5',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560001',
          isDefault: false
        }
      ];
      
      // Add demo wishlist items
      state.wishlist = [
        {
          id: 'product1',
          name: 'Banarasi Silk Saree',
          price: 5999,
          image: 'https://images.pexels.com/photos/2235071/pexels-photo-2235071.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          rating: 4.8
        },
        {
          id: 'product2',
          name: 'Men\'s Nehru Jacket',
          price: 2499,
          image: 'https://images.pexels.com/photos/2897531/pexels-photo-2897531.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          rating: 4.5
        }
      ];
    }
  }
});

export const { 
  login, 
  signup, 
  logout, 
  updateProfile, 
  addAddress, 
  removeAddress, 
  setDefaultAddress, 
  addToWishlist, 
  removeFromWishlist,
  createDemoProfile
} = userSlice.actions;

export default userSlice.reducer; 