import { create } from 'zustand';

const useCartStore = create((set, get) => ({
  cart: [],
  setCart: (cart) => set({ cart }),

  addToCart: (item) => {
    const cart = get().cart;
    const idx = cart.findIndex((i) => i._id === item._id);
    if (idx > -1) {
      const next = cart.slice();
      next[idx] = { ...next[idx], quantity: (next[idx].quantity || 1) + 1 };
      set({ cart: next });
    } else {
      set({ cart: [...cart, { ...item, quantity: Number(item.quantity || 1) }] });
    }
  },

  removeFromCart: (id) => set((s) => ({ cart: s.cart.filter((i) => i._id !== id) })),

  updateQuantity: (id, qty) =>
    set((s) => ({
      cart: s.cart
        .map((i) =>
          i._id === id ? { ...i, quantity: Math.max(1, Number(qty || 1)) } : i
        )
        .filter((i) => i.quantity > 0),
    })),

  clearCart: () => set({ cart: [] }),
}));

export default useCartStore;
