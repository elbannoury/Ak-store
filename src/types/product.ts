export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  rating?: number;
  isSale?: boolean;
  isNew?: boolean;
  colors?: string[];
  sizes?: string[];
  inStock?: boolean;
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  icon: any;
  itemCount?: number;
}

export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  content: string;
  role?: string;
  text?: string;
  location?: string;
}
