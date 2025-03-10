import { createSlice } from '@reduxjs/toolkit';

interface UserState {
  profile: {
    name: string;
    email: string;
    phone: string;
    avatar: string;
    addresses: Array<{
      id: string;
      type: string;
      address: string;
      city: string;
      state: string;
      pincode: string;
      isDefault: boolean;
    }>;
  } | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  profile: null,
  isAuthenticated: false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.profile = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.profile = null;
      state.isAuthenticated = false;
    },
    updateProfile: (state, action) => {
      if (state.profile) {
        state.profile = {
          ...state.profile,
          ...action.payload
        };
      }
    },
    addAddress: (state, action) => {
      if (state.profile) {
        // If this is the first address, mark it as default
        const isDefault = state.profile.addresses.length === 0;
        
        state.profile.addresses.push({
          ...action.payload,
          isDefault
        });
      }
    },
    updateAddress: (state, action) => {
      if (state.profile) {
        const { id, ...addressData } = action.payload;
        const addressIndex = state.profile.addresses.findIndex(
          (address) => address.id === id
        );
        
        if (addressIndex !== -1) {
          state.profile.addresses[addressIndex] = {
            ...state.profile.addresses[addressIndex],
            ...addressData
          };
        }
      }
    },
    removeAddress: (state, action) => {
      if (state.profile) {
        const addressId = action.payload;
        const removedAddress = state.profile.addresses.find(
          (address) => address.id === addressId
        );
        
        state.profile.addresses = state.profile.addresses.filter(
          (address) => address.id !== addressId
        );
        
        // If we removed the default address, make another one default
        if (removedAddress?.isDefault && state.profile.addresses.length > 0) {
          state.profile.addresses[0].isDefault = true;
        }
      }
    },
    setDefaultAddress: (state, action) => {
      if (state.profile) {
        const addressId = action.payload;
        
        state.profile.addresses.forEach((address) => {
          address.isDefault = address.id === addressId;
        });
      }
    }
  }
});

export const {
  login,
  logout,
  updateProfile,
  addAddress,
  updateAddress,
  removeAddress,
  setDefaultAddress
} = userSlice.actions;

export default userSlice.reducer; 