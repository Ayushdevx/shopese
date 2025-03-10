import { createSlice } from '@reduxjs/toolkit';

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
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  total: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  paymentMethod?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

interface OrdersState {
  items: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  items: [],
  loading: false,
  error: null
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder: (state, action) => {
      state.items.push(action.payload);
    },
    updateStatus: (state, action) => {
      const { id, status } = action.payload;
      const orderIndex = state.items.findIndex(order => order.id === id);
      
      if (orderIndex !== -1) {
        state.items[orderIndex].status = status;
      }
    },
    updateTrackingInfo: (state, action) => {
      const { id, trackingNumber, estimatedDelivery } = action.payload;
      const orderIndex = state.items.findIndex(order => order.id === id);
      
      if (orderIndex !== -1) {
        if (trackingNumber) {
          state.items[orderIndex].trackingNumber = trackingNumber;
        }
        if (estimatedDelivery) {
          state.items[orderIndex].estimatedDelivery = estimatedDelivery;
        }
      }
    },
    cancelOrder: (state, action) => {
      const id = action.payload;
      const orderIndex = state.items.findIndex(order => order.id === id);
      
      if (orderIndex !== -1) {
        state.items[orderIndex].status = 'cancelled';
      }
    }
  }
});

export const { 
  addOrder, 
  updateStatus, 
  updateTrackingInfo, 
  cancelOrder 
} = ordersSlice.actions;

export default ordersSlice.reducer; 