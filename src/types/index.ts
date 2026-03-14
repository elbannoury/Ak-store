export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: 'baby' | 'boys' | 'girls' | 'accessories';
  sizes?: string[];
  colors?: string[];
  description?: string;
  isNew?: boolean;
  isSale?: boolean;
  rating?: number;
  inStock?: boolean;
  sku?: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  itemCount: number;
}

export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  text: string;
  location: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  notes?: string;
}
