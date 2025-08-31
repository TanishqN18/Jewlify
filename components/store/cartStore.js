import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      promoCode: '',
      discount: 0,

      addToCart: (product) => {
        const safeProduct = {
          _id: product._id,
          name: product.name || product.title || 'Unnamed Product',
          price: product.price || 0,
          image:
            product.image ||
            product.thumbnail ||
            (product.images && product.images[0]) ||
            '/Images/fallback.png',
          quantity: 1,
        };

        set((state) => {
          const existing = state.cart.find((item) => item._id === safeProduct._id);
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item._id === safeProduct._id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          } else {
            return {
              cart: [...state.cart, safeProduct],
            };
          }
        });
      },

      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item._id !== id),
        })),

      increaseQuantity: (id) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item._id === id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        })),

      decreaseQuantity: (id) =>
        set((state) => ({
          cart: state.cart
            .map((item) =>
              item._id === id && item.quantity > 1
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
            .filter((item) => item.quantity > 0),
        })),

      clearCart: () => set({ cart: [], promoCode: '', discount: 0 }),

      applyPromo: (code) =>
        set((state) => {
          if (code.trim().toLowerCase() === 'jewel10') {
            return { promoCode: code, discount: 0.1 };
          } else {
            return { promoCode: code, discount: 0 };
          }
        }),

      getTotalPrice: () => {
        return get().cart.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      handleBuyNow: (product, router) => {
        const safeProduct = {
          _id: product._id,
          name: product.name || product.title || 'Unnamed Product',
          price: product.price || 0,
          image:
            product.image ||
            product.thumbnail ||
            (product.images && product.images[0]) ||
            '/placeholder.jpg',
          quantity: 1,
        };

        set({
          cart: [safeProduct],
          promoCode: '',
          discount: 0,
        });

        if (router) {
          router.push('/checkout');
        }
      },
    }),
    {
      name: 'cart-storage', // key for localStorage
      getStorage: () => localStorage,
    }
  )
);

export default useCartStore;
