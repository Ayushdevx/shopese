import { configureStore } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './wishlistSlice';
import productsReducer from './productsSlice';
import userReducer from './slices/userSlice';
import ordersReducer from './ordersSlice';

// Wishlist Slice
const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: []
  },
  reducers: {
    addItem: (state, action) => {
      if (!state.items.some(item => item.id === action.payload.id)) {
        state.items.push(action.payload);
      }
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    }
  }
});

// Orders Slice
const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    items: []
  },
  reducers: {
    addOrder: (state, action) => {
      state.items.push(action.payload);
    }
  }
});

// Products Slice (with Indian products)
const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [
      {
        id: '1',
        name: 'Banarasi Silk Saree',
        price: 5999.99,
        originalPrice: 7999.99,
        discount: 25,
        image: 'https://images.pexels.com/photos/2600828/pexels-photo-2600828.jpeg',
        description: 'Handwoven Banarasi Silk Saree with intricate zari work. Perfect for special occasions and weddings. This traditional saree features vibrant colors and timeless craftsmanship.',
        category: 'Ethnic Wear',
        rating: 4.8,
        reviews: 245,
        tags: ['saree', 'silk', 'wedding', 'festive'],
        features: ['Pure Silk', 'Handwoven', 'Zari Work']
      },
      {
        id: '2',
        name: 'Men\'s Nehru Jacket',
        price: 2499.99,
        originalPrice: 3499.99,
        discount: 30,
        image: 'https://images.pexels.com/photos/2635315/pexels-photo-2635315.jpeg',
        description: 'Classic Nehru Jacket in rich brocade fabric. Perfect for festivals and celebrations. This elegant jacket combines traditional style with modern comfort.',
        category: 'Ethnic Wear',
        rating: 4.6,
        reviews: 189,
        tags: ['men', 'jacket', 'festive', 'wedding'],
        features: ['Brocade Fabric', 'Traditional Design', 'Premium Buttons']
      },
      {
        id: '3',
        name: 'Designer Anarkali Suit',
        price: 4499.99,
        originalPrice: 5999.99,
        discount: 25,
        image: 'https://images.pexels.com/photos/1162983/pexels-photo-1162983.jpeg',
        description: 'Elegant Anarkali suit with embroidery work. Includes churidar and dupatta. Adorned with intricate embroidery and sequin work, this Anarkali suit is perfect for festive occasions.',
        category: 'Ethnic Wear',
        rating: 4.7,
        reviews: 156,
        tags: ['women', 'suit', 'festive', 'party'],
        features: ['Georgette Fabric', 'Hand Embroidery', 'Stone Work']
      },
      {
        id: '4',
        name: 'Kolhapuri Chappal',
        price: 999.99,
        originalPrice: 1499.99,
        discount: 33,
        image: 'https://images.pexels.com/photos/4997825/pexels-photo-4997825.jpeg',
        description: 'Authentic handcrafted Kolhapuri chappal made from genuine leather. Known for their durability and comfort, these traditional footwear pieces add a touch of elegance to any outfit.',
        category: 'Footwear',
        rating: 4.5,
        reviews: 312,
        tags: ['footwear', 'traditional', 'leather'],
        features: ['Genuine Leather', 'Handcrafted', 'Durable']
      },
      {
        id: '5',
        name: 'Kundan Jewelry Set',
        price: 8999.99,
        originalPrice: 12999.99,
        discount: 30,
        image: 'https://images.pexels.com/photos/10871889/pexels-photo-10871889.jpeg',
        description: 'Exquisite Kundan jewelry set including necklace, earrings, and maang tikka. This stunning set features traditional Kundan work with intricate detailing, perfect for bridal wear and special occasions.',
        category: 'Jewelry',
        rating: 4.9,
        reviews: 89,
        tags: ['jewelry', 'wedding', 'bridal', 'traditional'],
        features: ['Premium Quality', 'Stone Work', 'Gold Plated']
      },
      {
        id: '6',
        name: 'Cotton Kurta Set',
        price: 1499.99,
        originalPrice: 1999.99,
        discount: 25,
        image: 'https://images.pexels.com/photos/5075668/pexels-photo-5075668.jpeg',
        description: 'Comfortable cotton kurta set with block prints. Perfect for daily wear. Made from breathable cotton fabric, this kurta set offers both style and comfort for everyday use.',
        category: 'Casual Wear',
        rating: 4.4,
        reviews: 267,
        tags: ['kurta', 'cotton', 'casual', 'daily'],
        features: ['100% Cotton', 'Block Print', 'Comfortable Fit']
      },
      {
        id: '7',
        name: 'Rajasthani Juttis',
        price: 1299.99,
        originalPrice: 1799.99,
        discount: 28,
        image: 'https://images.pexels.com/photos/4380970/pexels-photo-4380970.jpeg',
        description: 'Traditional Rajasthani juttis with intricate embroidery. Perfect for ethnic wear. These handcrafted juttis feature colorful embroidery and mirror work, adding a touch of elegance to your traditional outfits.',
        category: 'Footwear',
        rating: 4.6,
        reviews: 176,
        tags: ['footwear', 'traditional', 'embroidery'],
        features: ['Genuine Leather', 'Handcrafted', 'Comfortable']
      },
      {
        id: '8',
        name: 'Patola Silk Dupatta',
        price: 3499.99,
        originalPrice: 4999.99,
        discount: 30,
        image: 'https://images.pexels.com/photos/8285047/pexels-photo-8285047.jpeg',
        description: 'Traditional Patola silk dupatta with intricate patterns. Perfect for special occasions. This vibrant dupatta showcases the ancient art of double ikat weaving, making it a treasured accessory for your ethnic wear.',
        category: 'Accessories',
        rating: 4.8,
        reviews: 98,
        tags: ['accessories', 'silk', 'traditional', 'festive'],
        features: ['Pure Silk', 'Double Ikat', 'Handwoven']
      },
      {
        id: '9',
        name: 'Designer Lehenga Choli',
        price: 12999.99,
        originalPrice: 15999.99,
        discount: 18,
        image: 'https://images.pexels.com/photos/2058686/pexels-photo-2058686.jpeg',
        description: 'Luxurious designer lehenga choli with heavy embroidery work. Perfect for weddings and special occasions. This stunning ensemble features intricate zardozi work and embellishments, making it a perfect choice for brides and wedding guests.',
        category: 'Ethnic Wear',
        rating: 4.9,
        reviews: 122,
        tags: ['lehenga', 'bridal', 'wedding', 'festive'],
        features: ['Premium Fabric', 'Hand Embroidery', 'Sequin Work', 'Includes Dupatta']
      },
      {
        id: '10',
        name: 'Handloom Cotton Saree',
        price: 1899.99,
        originalPrice: 2499.99,
        discount: 24,
        image: 'https://images.pexels.com/photos/2422476/pexels-photo-2422476.jpeg',
        description: 'Comfortable handloom cotton saree with traditional design. Perfect for daily wear. This lightweight saree is crafted using natural dyes and traditional weaving techniques, making it both comfortable and eco-friendly.',
        category: 'Ethnic Wear',
        rating: 4.5,
        reviews: 234,
        tags: ['saree', 'cotton', 'handloom', 'daily'],
        features: ['Handwoven', '100% Cotton', 'Natural Dyes']
      },
      {
        id: '11',
        name: 'Silver Oxidized Bangles Set',
        price: 999.99,
        originalPrice: 1299.99,
        discount: 23,
        image: 'https://images.pexels.com/photos/13058116/pexels-photo-13058116.jpeg',
        description: 'Traditional silver oxidized bangles set. Perfect for ethnic wear. This stunning set of bangles features intricate tribal designs and oxidized finish, adding a rustic charm to your traditional outfits.',
        category: 'Jewelry',
        rating: 4.7,
        reviews: 187,
        tags: ['jewelry', 'bangles', 'silver', 'traditional'],
        features: ['Oxidized Silver', 'Adjustable Size', 'Set of 6']
      },
      {
        id: '12',
        name: 'Men\'s Sherwani',
        price: 7999.99,
        originalPrice: 9999.99,
        discount: 20,
        image: 'https://images.pexels.com/photos/2896748/pexels-photo-2896748.jpeg',
        description: 'Royal sherwani with intricate embroidery. Perfect for weddings and special occasions. This regal sherwani combines traditional craftsmanship with modern styling, making it an ideal choice for grooms and special events.',
        category: 'Ethnic Wear',
        rating: 4.8,
        reviews: 98,
        tags: ['men', 'sherwani', 'wedding', 'festive'],
        features: ['Premium Fabric', 'Hand Embroidery', 'Includes Stole']
      },
      {
        id: '13',
        name: 'Pashmina Shawl',
        price: 4299.99,
        originalPrice: 5999.99,
        discount: 28,
        image: 'https://images.pexels.com/photos/3649765/pexels-photo-3649765.jpeg',
        description: 'Luxurious Pashmina shawl with traditional Kashmiri embroidery. This exquisite shawl is crafted from the finest Pashmina wool and features delicate hand embroidery, making it both a fashion statement and a work of art.',
        category: 'Accessories',
        rating: 4.9,
        reviews: 112,
        tags: ['accessories', 'winter', 'kashmiri', 'luxury'],
        features: ['Pure Pashmina', 'Hand Embroidered', 'Soft Texture']
      },
      {
        id: '14',
        name: 'Meenakari Jhumka Earrings',
        price: 1599.99,
        originalPrice: 1999.99,
        discount: 20,
        image: 'https://images.pexels.com/photos/1454173/pexels-photo-1454173.jpeg',
        description: 'Traditional Meenakari jhumka earrings with stunning enamel work. These beautiful earrings showcase the ancient art of Meenakari with vibrant colors and intricate patterns, perfect for adding a touch of tradition to any outfit.',
        category: 'Jewelry',
        rating: 4.7,
        reviews: 143,
        tags: ['jewelry', 'earrings', 'traditional', 'festive'],
        features: ['Meenakari Work', 'Gold Plated', 'Pearl Details']
      },
      {
        id: '15',
        name: 'Phulkari Dupatta',
        price: 1899.99,
        originalPrice: 2499.99,
        discount: 24,
        image: 'https://images.pexels.com/photos/3649765/pexels-photo-3649765.jpeg',
        description: 'Vibrant Phulkari dupatta with traditional Punjabi embroidery. This colorful dupatta features the iconic Phulkari embroidery of Punjab, with geometric patterns meticulously crafted by skilled artisans.',
        category: 'Accessories',
        rating: 4.6,
        reviews: 87,
        tags: ['accessories', 'punjabi', 'embroidery', 'colorful'],
        features: ['Cotton Base', 'Hand Embroidery', 'Traditional Design']
      },
      {
        id: '16',
        name: 'Men\'s Kurta Pajama Set',
        price: 2299.99,
        originalPrice: 2999.99,
        discount: 23,
        image: 'https://images.pexels.com/photos/3998647/pexels-photo-3998647.jpeg',
        description: 'Elegant men\'s kurta pajama set made from premium cotton silk blend. This sophisticated set features subtle embroidery and a comfortable fit, making it perfect for festivals, celebrations, and special occasions.',
        category: 'Ethnic Wear',
        rating: 4.5,
        reviews: 156,
        tags: ['men', 'kurta', 'festive', 'traditional'],
        features: ['Cotton Silk Blend', 'Comfortable Fit', 'Elegant Design']
      },
      {
        id: '17',
        name: 'Zardozi Clutch Bag',
        price: 2499.99,
        originalPrice: 3299.99,
        discount: 24,
        image: 'https://images.pexels.com/photos/10553290/pexels-photo-10553290.jpeg',
        description: 'Luxurious clutch bag with traditional Zardozi embroidery. This elegant clutch features intricate gold thread work and embellishments, making it the perfect accessory for weddings and formal occasions.',
        category: 'Accessories',
        rating: 4.8,
        reviews: 63,
        tags: ['accessories', 'clutch', 'embroidery', 'party'],
        features: ['Zardozi Embroidery', 'Detachable Chain', 'Inner Compartments']
      },
      {
        id: '18',
        name: 'Kalamkari Cotton Saree',
        price: 2799.99,
        originalPrice: 3499.99,
        discount: 20,
        image: 'https://images.pexels.com/photos/2422476/pexels-photo-2422476.jpeg',
        description: 'Traditional Kalamkari hand-painted cotton saree. This artistic saree features hand-painted Kalamkari motifs depicting mythological scenes and natural elements, crafted using natural dyes and traditional techniques.',
        category: 'Ethnic Wear',
        rating: 4.7,
        reviews: 93,
        tags: ['saree', 'kalamkari', 'handpainted', 'cotton'],
        features: ['Hand-painted', 'Natural Dyes', 'Traditional Art']
      },
      {
        id: '19',
        name: 'Peacock Maang Tikka',
        price: 1299.99,
        originalPrice: 1799.99,
        discount: 28,
        image: 'https://images.pexels.com/photos/10871889/pexels-photo-10871889.jpeg',
        description: 'Elegant peacock-inspired maang tikka with kundan and pearl work. This beautiful hair accessory features intricate detailing in the shape of a peacock, embellished with kundan stones and delicate pearl drops.',
        category: 'Jewelry',
        rating: 4.9,
        reviews: 78,
        tags: ['jewelry', 'hair accessory', 'bridal', 'traditional'],
        features: ['Kundan Work', 'Pearl Drops', 'Adjustable Chain']
      },
      {
        id: '20',
        name: 'Men\'s Mojari Shoes',
        price: 1899.99,
        originalPrice: 2499.99,
        discount: 24,
        image: 'https://images.pexels.com/photos/4380970/pexels-photo-4380970.jpeg',
        description: 'Traditional handcrafted Mojari shoes for men. These elegant shoes feature intricate embroidery and a pointed toe design, crafted by skilled artisans using traditional techniques passed down through generations.',
        category: 'Footwear',
        rating: 4.6,
        reviews: 104,
        tags: ['footwear', 'men', 'traditional', 'handcrafted'],
        features: ['Genuine Leather', 'Hand Embroidery', 'Cushioned Insole']
      }
    ],
    categories: [
      { id: 'ethnic-wear', name: 'Ethnic Wear', count: 150, image: 'https://images.pexels.com/photos/2058686/pexels-photo-2058686.jpeg' },
      { id: 'casual-wear', name: 'Casual Wear', count: 200, image: 'https://images.pexels.com/photos/5075668/pexels-photo-5075668.jpeg' },
      { id: 'footwear', name: 'Footwear', count: 100, image: 'https://images.pexels.com/photos/4380970/pexels-photo-4380970.jpeg' },
      { id: 'jewelry', name: 'Jewelry', count: 80, image: 'https://images.pexels.com/photos/10871889/pexels-photo-10871889.jpeg' },
      { id: 'accessories', name: 'Accessories', count: 120, image: 'https://images.pexels.com/photos/8285047/pexels-photo-8285047.jpeg' }
    ],
    featuredCollections: [
      { id: 'wedding', name: 'Wedding Collection', image: 'https://images.pexels.com/photos/2058686/pexels-photo-2058686.jpeg' },
      { id: 'festive', name: 'Festive Wear', image: 'https://images.pexels.com/photos/3649765/pexels-photo-3649765.jpeg' },
      { id: 'summer', name: 'Summer Specials', image: 'https://images.pexels.com/photos/5075668/pexels-photo-5075668.jpeg' }
    ],
    loading: false,
    error: null
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { addItem: addToCart, removeItem: removeFromCart, updateQuantity: updateCartQuantity, clearCart } = cartReducer;
export const { addItem: addToWishlist, removeItem: removeFromWishlist } = wishlistSlice.actions;
export const { addOrder } = ordersSlice.actions;
export const { setLoading, setError } = productsSlice.actions;

// Create the store
const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    products: productsReducer,
    orders: ordersReducer
  }
});

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store; 