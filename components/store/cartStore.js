import { create } from 'zustand';

const useCartStore = create((set, get) => ({
  cart: [],
  setCart: (cart) => set({ cart }),

  addToCart: (item, customization = {}, quantity = 1) => {
    const cart = get().cart;
    
    // Create unique identifier including customization
    const itemKey = `${item._id}-${JSON.stringify(customization)}`;
    
    // Find existing item with same product AND same customization
    const idx = cart.findIndex((i) => 
      i._id === item._id && 
      JSON.stringify(i.customization || {}) === JSON.stringify(customization)
    );
    
    const cartItem = {
      ...item,
      quantity: Number(quantity || 1),
      customization: {
        engraving: customization.engraving || "",
        size: customization.size || "",
        specialInstructions: customization.specialInstructions || "",
      },
      // Add unique key for rendering
      cartKey: itemKey,
    };

    if (idx > -1) {
      // Update existing item quantity
      const next = cart.slice();
      next[idx] = { 
        ...next[idx], 
        quantity: (next[idx].quantity || 1) + Number(quantity || 1) 
      };
      set({ cart: next });
    } else {
      // Add new item
      set({ cart: [...cart, cartItem] });
    }
  },

  removeFromCart: (cartKey) => set((s) => ({ 
    cart: s.cart.filter((i) => i.cartKey !== cartKey) 
  })),

  updateQuantity: (cartKey, qty) =>
    set((s) => ({
      cart: s.cart
        .map((i) =>
          i.cartKey === cartKey ? { ...i, quantity: Math.max(1, Number(qty || 1)) } : i
        )
        .filter((i) => i.quantity > 0),
    })),

  clearCart: () => set({ cart: [] }),

  // New method to create order from cart
  createOrder: async (shippingAddress, billingAddress, paymentMethod) => {
    try {
      const cart = get().cart;
      
      // Transform cart items to order format
      const orderItems = cart.map(item => ({
        productId: item._id,
        quantity: item.quantity,
        customization: item.customization,
        // Include current rates if needed for weight-based items
        goldRateAtPurchase: 5000, // You'd fetch current rate
        silverRateAtPurchase: 80,  // You'd fetch current rate
      }));

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: orderItems,
          shippingAddress,
          billingAddress,
          paymentMethod,
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Clear cart on successful order
        set({ cart: [] });
        return { success: true, orderId: data.orderId };
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Helper to get cart total
  getCartTotal: () => {
    const cart = get().cart;
    return cart.reduce((total, item) => {
      let price = 0;
      if (item.priceType === "fixed") {
        price = item.fixedPrice || item.price || 0;
      } else if (item.priceType === "weight-based") {
        const goldRate = 5000; // You'd fetch current rate
        price = (item.weight || 0) * goldRate;
      } else {
        price = item.price || 0;
      }
      return total + (price * item.quantity);
    }, 0);
  },

  // Helper to get cart count
  getCartCount: () => {
    const cart = get().cart;
    return cart.reduce((count, item) => count + item.quantity, 0);
  },
}));

export default useCartStore;
