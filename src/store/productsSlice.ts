import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  images?: string[];
  category: string;
  categories?: string[];
  rating?: number;
  reviews?: number;
  tags?: string[];
  material?: string;
  featured?: boolean;
  bestSeller?: boolean;
  isNew?: boolean;
  discount?: number;
  createdAt?: string;
  stock?: number;
  specs?: Record<string, string>;
  features?: string[];
}

export interface Category {
  id: string;
  name: string;
  image?: string;
  description?: string;
  featured?: boolean;
}

export interface FeaturedCollection {
  id: string;
  name: string;
  image: string;
  description?: string;
}

interface ProductsState {
  items: Product[];
  categories: Category[];
  featuredCollections: FeaturedCollection[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  items: [
    {
      id: 'p1',
      name: 'Banarasi Silk Saree',
      price: 7999,
      originalPrice: 9999,
      description: 'Traditional Banarasi silk saree with intricate golden zari work, perfect for weddings and special occasions.',
      image: 'https://images.pexels.com/photos/4125082/pexels-photo-4125082.jpeg',
      images: [
        'https://images.pexels.com/photos/4125082/pexels-photo-4125082.jpeg',
        'https://images.pexels.com/photos/4125094/pexels-photo-4125094.jpeg',
        'https://images.pexels.com/photos/4125093/pexels-photo-4125093.jpeg'
      ],
      category: 'sarees',
      rating: 4.8,
      reviews: 128,
      tags: ['silk', 'wedding', 'traditional', 'banarasi'],
      material: 'silk',
      featured: true,
      bestSeller: true,
      stock: 25,
      createdAt: '2023-09-15',
      specs: {
        'Fabric': 'Pure silk',
        'Length': '6.3 meters',
        'Blouse Piece': 'Included (0.8 meters)',
        'Wash Care': 'Dry clean only'
      },
      features: [
        'Pure Banarasi silk with GI tag',
        'Handcrafted zari work',
        'Rich pallu with traditional motifs',
        'Comes with matching blouse piece'
      ]
    },
    {
      id: 'p2',
      name: 'Designer Anarkali Suit',
      price: 5499,
      originalPrice: 7999,
      description: 'Elegant Anarkali suit with embroidered bodice and flared silhouette, perfect for festive occasions.',
      image: 'https://images.pexels.com/photos/13990066/pexels-photo-13990066.jpeg',
      category: 'suits',
      rating: 4.6,
      reviews: 86,
      tags: ['anarkali', 'festive', 'embroidered'],
      material: 'georgette',
      featured: true,
      stock: 18,
      createdAt: '2023-10-02',
      specs: {
        'Top Fabric': 'Embroidered georgette',
        'Bottom Fabric': 'Santoon',
        'Dupatta Fabric': 'Chiffon',
        'Style': 'Anarkali',
        'Stitch Type': 'Semi-stitched'
      }
    },
    {
      id: 'p3',
      name: 'Men\'s Nehru Jacket',
      price: 3499,
      originalPrice: 4999,
      description: 'Classic Nehru collar jacket in rich brocade fabric, perfect for festive and wedding occasions.',
      image: 'https://images.pexels.com/photos/2897530/pexels-photo-2897530.jpeg',
      category: 'mens',
      rating: 4.7,
      reviews: 72,
      tags: ['nehru jacket', 'wedding', 'festive', 'traditional', 'men'],
      material: 'brocade',
      bestSeller: true,
      stock: 30,
      createdAt: '2023-08-20',
      specs: {
        'Fabric': 'Brocade',
        'Style': 'Nehru collar',
        'Occasion': 'Festive, Wedding, Ceremonial',
        'Wash Care': 'Dry clean only'
      }
    },
    {
      id: 'p4',
      name: 'Kundan Bridal Jewelry Set',
      price: 12999,
      originalPrice: 15999,
      description: 'Exquisite Kundan bridal jewelry set including necklace, earrings, and maang tikka.',
      image: 'https://images.pexels.com/photos/12339571/pexels-photo-12339571.jpeg',
      category: 'jewelry',
      rating: 4.9,
      reviews: 56,
      tags: ['kundan', 'bridal', 'jewelry', 'wedding'],
      featured: true,
      bestSeller: true,
      stock: 10,
      createdAt: '2023-07-12',
      specs: {
        'Material': 'High-quality Kundan with gold plating',
        'Set Includes': 'Necklace, Earrings, Maang Tikka',
        'Occasion': 'Wedding, Bridal',
        'Care': 'Store in jewelry box with silica gel'
      }
    },
    {
      id: 'p5',
      name: 'Handloom Cotton Saree',
      price: 2499,
      originalPrice: 2999,
      description: 'Comfortable handloom cotton saree with traditional motifs, perfect for daily and office wear.',
      image: 'https://images.pexels.com/photos/5212698/pexels-photo-5212698.jpeg',
      category: 'sarees',
      rating: 4.5,
      reviews: 112,
      tags: ['cotton', 'handloom', 'daily wear', 'office'],
      material: 'cotton',
      isNew: true,
      stock: 45,
      createdAt: '2023-11-05',
      specs: {
        'Fabric': 'Handloom cotton',
        'Length': '6.3 meters',
        'Blouse Piece': 'Included (0.8 meters)',
        'Wash Care': 'Machine wash'
      }
    },
    {
      id: 'p6',
      name: 'Wedding Lehenga Choli',
      price: 18999,
      originalPrice: 24999,
      description: 'Stunning bridal lehenga with heavy embroidery and mirror work, paired with matching choli and dupatta.',
      image: 'https://images.pexels.com/photos/2383886/pexels-photo-2383886.jpeg',
      category: 'lehengas',
      rating: 4.9,
      reviews: 48,
      tags: ['lehenga', 'bridal', 'wedding', 'embroidered'],
      material: 'velvet',
      featured: true,
      bestSeller: true,
      stock: 8,
      createdAt: '2023-06-18',
      specs: {
        'Lehenga Fabric': 'Velvet with embroidery',
        'Choli Fabric': 'Matching velvet',
        'Dupatta Fabric': 'Net with embroidered border',
        'Style': 'Circular lehenga',
        'Work': 'Zari, sequence, stone, and mirror work',
        'Wash Care': 'Dry clean only'
      }
    },
    {
      id: 'p7',
      name: 'Embroidered Potli Bag',
      price: 1299,
      originalPrice: 1499,
      description: 'Elegant embroidered potli bag with drawstring closure, perfect for weddings and festive occasions.',
      image: 'https://images.pexels.com/photos/1078973/pexels-photo-1078973.jpeg',
      category: 'accessories',
      rating: 4.3,
      reviews: 35,
      tags: ['potli', 'bag', 'accessories', 'wedding'],
      isNew: true,
      stock: 50,
      createdAt: '2023-10-28',
      specs: {
        'Material': 'Silk with embroidery',
        'Closure': 'Drawstring',
        'Occasion': 'Wedding, Festive',
        'Size': 'Medium'
      }
    },
    {
      id: 'p8',
      name: 'Men\'s Kurta Pajama Set',
      price: 2799,
      originalPrice: 3499,
      description: 'Traditional cotton kurta pajama set with elegant embroidery, perfect for festive occasions.',
      image: 'https://images.pexels.com/photos/5705499/pexels-photo-5705499.jpeg',
      category: 'mens',
      rating: 4.4,
      reviews: 62,
      tags: ['kurta', 'pajama', 'cotton', 'festive', 'men'],
      material: 'cotton',
      isNew: true,
      stock: 28,
      createdAt: '2023-09-08',
      specs: {
        'Kurta Fabric': 'Cotton',
        'Pajama Fabric': 'Cotton',
        'Style': 'Straight cut with embroidery',
        'Occasion': 'Festive, Casual',
        'Wash Care': 'Machine wash'
      }
    },
    {
      id: 'p9',
      name: 'Traditional Jhumka Earrings',
      price: 1899,
      originalPrice: 2299,
      description: 'Classic gold-plated jhumka earrings with intricate detailing and pearl drops.',
      image: 'https://images.pexels.com/photos/9157528/pexels-photo-9157528.jpeg',
      category: 'jewelry',
      rating: 4.7,
      reviews: 89,
      tags: ['jhumka', 'earrings', 'traditional', 'jewelry'],
      bestSeller: true,
      stock: 35,
      createdAt: '2023-08-03',
      specs: {
        'Material': 'Gold-plated brass',
        'Stone': 'Faux pearls',
        'Closure': 'Push back',
        'Occasion': 'Festive, Wedding, Traditional'
      }
    },
    {
      id: 'p10',
      name: 'Chiffon Designer Saree',
      price: 3999,
      originalPrice: 4499,
      description: 'Lightweight chiffon saree with modern prints and sequin border, perfect for parties.',
      image: 'https://images.pexels.com/photos/7586288/pexels-photo-7586288.jpeg',
      category: 'sarees',
      rating: 4.3,
      reviews: 56,
      tags: ['chiffon', 'party wear', 'designer', 'saree'],
      material: 'chiffon',
      isNew: true,
      stock: 22,
      createdAt: '2023-11-12',
      specs: {
        'Fabric': 'Chiffon',
        'Length': '6.3 meters',
        'Blouse Piece': 'Included (0.8 meters)',
        'Wash Care': 'Dry clean recommended'
      }
    }
  ],
  categories: [
    { id: 'sarees', name: 'Sarees', image: 'https://images.pexels.com/photos/8733096/pexels-photo-8733096.jpeg' },
    { id: 'lehengas', name: 'Lehengas', image: 'https://images.pexels.com/photos/2383886/pexels-photo-2383886.jpeg' },
    { id: 'suits', name: 'Suits', image: 'https://images.pexels.com/photos/10415738/pexels-photo-10415738.jpeg' },
    { id: 'mens', name: 'Mens', image: 'https://images.pexels.com/photos/2897531/pexels-photo-2897531.jpeg' },
    { id: 'jewelry', name: 'Jewelry', image: 'https://images.pexels.com/photos/12339582/pexels-photo-12339582.jpeg' },
    { id: 'accessories', name: 'Accessories', image: 'https://images.pexels.com/photos/1078958/pexels-photo-1078958.jpeg' },
  ],
  featuredCollections: [
    { 
      id: 'wedding', 
      name: 'Wedding Collection', 
      image: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg',
      description: 'Elegant wedding attire for your special day'
    },
    { 
      id: 'festive', 
      name: 'Festive Collection', 
      image: 'https://images.pexels.com/photos/2249172/pexels-photo-2249172.jpeg',
      description: 'Celebrate festivals with style and tradition'
    },
    { 
      id: 'casual', 
      name: 'Casual Wear', 
      image: 'https://images.pexels.com/photos/10513027/pexels-photo-10513027.jpeg',
      description: 'Comfortable yet stylish everyday wear'
    }
  ],
  loading: false,
  error: null
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Add a single product
    addProduct: (state, action: PayloadAction<Product>) => {
      state.items.push(action.payload);
    },
    
    // Add multiple products
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
    },
    
    // Update a product
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex(product => product.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    
    // Delete a product
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(product => product.id !== action.payload);
    },
    
    // Update categories
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    
    // Update featured collections
    setFeaturedCollections: (state, action: PayloadAction<FeaturedCollection[]>) => {
      state.featuredCollections = action.payload;
    },
    
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const { 
  addProduct, 
  setProducts, 
  updateProduct, 
  deleteProduct, 
  setCategories, 
  setFeaturedCollections,
  setLoading,
  setError
} = productsSlice.actions;

export default productsSlice.reducer; 