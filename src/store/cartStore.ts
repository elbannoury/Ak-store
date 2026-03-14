import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  category: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (isOpen: boolean) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (item: Omit<CartItem, 'quantity'>) => {
        const { items } = get();
        const existingItem = items.find((i: CartItem) => i.id === item.id);
        
        if (existingItem) {
          set({
            items: items.map((i: CartItem) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({
            items: [...items, { ...item, quantity: 1 }],
          });
        }
      },
      
      removeItem: (id: string) => {
        set({
          items: get().items.filter((i: CartItem) => i.id !== id),
        });
      },
      
      updateQuantity: (id: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((i: CartItem) =>
            i.id === id ? { ...i, quantity } : i
          ),
        });
      },
      
      clearCart: () => set({ items: [] }),
      
      toggleCart: () => set((state: CartState) => ({ isOpen: !state.isOpen })),
      
      setCartOpen: (isOpen: boolean) => set({ isOpen }),
      
      getTotalItems: () => {
        return get().items.reduce((total: number, item: CartItem) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().items.reduce(
          (total: number, item: CartItem) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'ak-kids-cart',
      partialize: (state: CartState) => ({ items: state.items }),
    }
  )
);
