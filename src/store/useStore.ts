import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, User, Product } from '../types';

interface Store {
  cart: CartItem[];
  user: User | null;
  recentlyViewed: Product[];
  searchQuery: string;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  setUser: (user: User | null) => void;
  clearCart: () => void;
  toggleWishlist: (productId: number) => void;
  addToRecentlyViewed: (product: Product) => void;
  setSearchQuery: (query: string) => void;
  applyCoupon: (code: string) => boolean;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      cart: [],
      user: null,
      recentlyViewed: [],
      searchQuery: '',
      addToCart: (item) =>
        set((state) => {
          const existingItem = state.cart.find(
            (i) => i.id === item.id && 
                  i.selectedSize === item.selectedSize &&
                  i.selectedColor === item.selectedColor
          );
          if (existingItem) {
            return {
              cart: state.cart.map((i) =>
                i.id === item.id && 
                i.selectedSize === item.selectedSize &&
                i.selectedColor === item.selectedColor
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }
          return { cart: [...state.cart, item] };
        }),
      removeFromCart: (itemId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== itemId),
        })),
      updateQuantity: (itemId, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        })),
      setUser: (user) => set({ user }),
      clearCart: () => set({ cart: [] }),
      toggleWishlist: (productId) =>
        set((state) => {
          if (!state.user) return state;
          const wishlist = state.user.wishlist.includes(productId)
            ? state.user.wishlist.filter((id) => id !== productId)
            : [...state.user.wishlist, productId];
          return {
            user: {
              ...state.user,
              wishlist,
            },
          };
        }),
      addToRecentlyViewed: (product) =>
        set((state) => ({
          recentlyViewed: [
            product,
            ...state.recentlyViewed.filter((p) => p.id !== product.id),
          ].slice(0, 4),
        })),
      setSearchQuery: (query) => set({ searchQuery: query }),
      applyCoupon: (code) => {
        // Simple coupon validation
        const validCoupons = ['WELCOME10', 'SUMMER20'];
        return validCoupons.includes(code);
      },
    }),
    {
      name: 'shopease-storage',
    }
  )
);