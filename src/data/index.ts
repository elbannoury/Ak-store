import type { Product, Category, Testimonial } from '@/types';

export const products: Product[] = [
  {
    id: '1',
    name: 'AK Classic Hoodie',
    price: 249,
    originalPrice: 299,
    image: '/product-hoodie.jpg',
    images: [
      '/product-hoodie.jpg',
      '/product-hoodie-2.jpg',
      '/product-hoodie-3.jpg',
    ],
    category: 'boys',
    sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'],
    colors: ['Yellow', 'Blue', 'Red'],
    description: 'Our signature AK Classic Hoodie is made from premium soft cotton blend, perfect for keeping your little ones warm and stylish. Features the iconic AK embroidered logo and a comfortable kangaroo pocket.',
    isSale: true,
    rating: 4.8,
    inStock: true,
    sku: 'AK-HOOD-001',
  },
  {
    id: '2',
    name: 'Dino Adventure Tee',
    price: 129,
    image: '/product-tshirt.jpg',
    images: [
      '/product-tshirt.jpg',
      '/product-tshirt-2.jpg',
    ],
    category: 'boys',
    sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'],
    colors: ['Blue', 'Green', 'White'],
    description: 'Let your little explorer embark on adventures with our Dino Adventure Tee! Made from 100% breathable cotton with a fun dinosaur graphic that kids love.',
    isNew: true,
    rating: 4.9,
    inStock: true,
    sku: 'AK-TSHIRT-001',
  },
  {
    id: '3',
    name: 'Floral Dream Dress',
    price: 189,
    image: '/product-dress.jpg',
    images: [
      '/product-dress.jpg',
      '/product-dress-2.jpg',
    ],
    category: 'girls',
    sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'],
    colors: ['Pink', 'Purple', 'White'],
    description: 'A beautiful floral dress perfect for any occasion! Features a comfortable fit, soft fabric, and a twirl-worthy skirt that your little princess will adore.',
    rating: 4.7,
    inStock: true,
    sku: 'AK-DRESS-001',
  },
  {
    id: '4',
    name: 'Comfy Jogger Pants',
    price: 149,
    image: '/product-pants.jpg',
    images: [
      '/product-pants.jpg',
    ],
    category: 'boys',
    sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'],
    colors: ['Navy', 'Black', 'Grey'],
    description: 'Super comfortable jogger pants for active kids! Elastic waistband with drawstring, soft fleece lining, and cuffed ankles for the perfect fit.',
    rating: 4.6,
    inStock: true,
    sku: 'AK-PANTS-001',
  },
  {
    id: '5',
    name: 'Safari Backpack',
    price: 199,
    image: '/product-backpack.jpg',
    images: [
      '/product-backpack.jpg',
    ],
    category: 'accessories',
    colors: ['Red', 'Blue', 'Yellow'],
    description: 'The perfect backpack for little adventurers! Features cute animal patches, multiple compartments, and adjustable padded straps for comfort.',
    isNew: true,
    rating: 4.9,
    inStock: true,
    sku: 'AK-BAG-001',
  },
  {
    id: '6',
    name: 'Fun Socks Pack',
    price: 79,
    originalPrice: 99,
    image: '/product-socks.jpg',
    images: [
      '/product-socks.jpg',
    ],
    category: 'accessories',
    colors: ['Multi'],
    description: 'A fun pack of 3 pairs of colorful socks with playful patterns! Made from soft, breathable cotton with stretchy cuffs for all-day comfort.',
    isSale: true,
    rating: 4.5,
    inStock: true,
    sku: 'AK-SOCKS-001',
  },
  {
    id: '7',
    name: 'AK Baby Onesie',
    price: 99,
    image: '/hero-baby.png',
    images: [
      '/hero-baby.png',
    ],
    category: 'baby',
    sizes: ['0-3M', '3-6M', '6-9M', '9-12M'],
    colors: ['Blue', 'Pink', 'White', 'Yellow'],
    description: 'Soft and cozy onesie for your little one! Features envelope neckline for easy dressing, snap closures at the bottom, and the cute AK BABY print.',
    isNew: true,
    rating: 4.8,
    inStock: true,
    sku: 'AK-ONESIE-001',
  },
  {
    id: '8',
    name: 'AK Kids Set',
    price: 349,
    image: '/hero-kid.png',
    images: [
      '/hero-kid.png',
    ],
    category: 'boys',
    sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'],
    colors: ['Yellow', 'Blue'],
    description: 'Complete AK Kids set including hoodie and matching pants! The perfect outfit for style and comfort. Made from premium materials.',
    rating: 5.0,
    inStock: true,
    sku: 'AK-SET-001',
  },
  {
    id: '9',
    name: 'Princess Tulle Dress',
    price: 229,
    image: '/category-girls.jpg',
    images: [
      '/category-girls.jpg',
    ],
    category: 'girls',
    sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'],
    colors: ['Pink', 'Lavender', 'Mint'],
    description: 'A magical tulle dress that will make your little girl feel like a princess! Features layers of soft tulle and a comfortable cotton lining.',
    isNew: true,
    rating: 4.8,
    inStock: true,
    sku: 'AK-DRESS-002',
  },
  {
    id: '10',
    name: 'Cozy Baby Blanket',
    price: 159,
    image: '/category-baby.jpg',
    images: [
      '/category-baby.jpg',
    ],
    category: 'baby',
    colors: ['White', 'Pink', 'Blue'],
    description: 'Ultra-soft baby blanket perfect for snuggles! Made from premium fleece material that is gentle on baby\'s sensitive skin.',
    rating: 4.9,
    inStock: true,
    sku: 'AK-BLANKET-001',
  },
  {
    id: '11',
    name: 'Adventure Cap',
    price: 89,
    image: '/category-boys.jpg',
    images: [
      '/category-boys.jpg',
    ],
    category: 'accessories',
    colors: ['Blue', 'Red', 'Green'],
    description: 'Cool cap for little adventurers! Features adjustable strap, breathable fabric, and fun designs that kids love to wear.',
    rating: 4.4,
    inStock: true,
    sku: 'AK-CAP-001',
  },
  {
    id: '12',
    name: 'Cute Hair Accessories Set',
    price: 69,
    image: '/category-accessories.jpg',
    images: [
      '/category-accessories.jpg',
    ],
    category: 'accessories',
    colors: ['Multi'],
    description: 'Adorable hair accessories set including clips, bows, and headbands! Perfect for styling your little girl\'s hair.',
    isSale: true,
    rating: 4.6,
    inStock: true,
    sku: 'AK-HAIR-001',
  },
];

export const categories: Category[] = [
  {
    id: 'baby',
    name: 'Baby',
    image: '/category-baby.jpg',
    itemCount: 45,
  },
  {
    id: 'boys',
    name: 'Boys',
    image: '/category-boys.jpg',
    itemCount: 78,
  },
  {
    id: 'girls',
    name: 'Girls',
    image: '/category-girls.jpg',
    itemCount: 82,
  },
  {
    id: 'accessories',
    name: 'Accessories',
    image: '/category-accessories.jpg',
    itemCount: 36,
  },
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Fatima Alami',
    avatar: '/testimonial-1.jpg',
    rating: 5,
    text: 'AK Kids has become my go-to store for my children\'s clothes. The quality is amazing and the prices are so reasonable. My kids love their new outfits!',
    location: 'Casablanca',
  },
  {
    id: '2',
    name: 'Youssef Benali',
    avatar: '/testimonial-2.jpg',
    rating: 5,
    text: 'Fast delivery and excellent customer service. The clothes are soft, durable, and look even better in person. Highly recommended!',
    location: 'Rabat',
  },
  {
    id: '3',
    name: 'Sara El Amrani',
    avatar: '/testimonial-3.jpg',
    rating: 5,
    text: 'I love how stylish and comfortable the clothes are. My daughter wears her AK dress everywhere! Will definitely be ordering more.',
    location: 'Marrakech',
  },
];

export const features = [
  {
    id: 'quality',
    title: 'Premium Quality',
    description: 'Soft, safe, and durable fabrics that last',
    icon: 'Sparkles',
  },
  {
    id: 'delivery',
    title: 'Fast Delivery',
    description: 'Quick shipping all over Morocco',
    icon: 'Truck',
  },
  {
    id: 'returns',
    title: 'Easy Returns',
    description: '30-day hassle-free return policy',
    icon: 'RefreshCw',
  },
  {
    id: 'support',
    title: '24/7 Support',
    description: 'Always here to help you',
    icon: 'Headphones',
  },
];

// WhatsApp Configuration
export const WHATSAPP_CONFIG = {
  // Replace with your actual phone number (with country code, no + or spaces)
  // Example: 212612345678 for Moroccan number
  phoneNumber: '212612345678',
  // CallMeBot API Key (get from https://www.callmebot.com/blog/free-api-whatsapp-messages/)
  apiKey: '',
};

// Google Sheets Configuration
export const GOOGLE_SHEETS_CONFIG = {
  // Your Google Sheets Script URL
  // Create a Google Apps Script to handle form submissions
  scriptUrl: '',
};
