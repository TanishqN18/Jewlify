'use client';

import { useMemo } from 'react';

export function useOrderCalculations(cart, discount) {
  return useMemo(() => {
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const discountAmount = (subtotal * discount) / 100;
    const shipping = subtotal > 50000 ? 0 : 500; // Free shipping above ₹50,000
    const tax = (subtotal - discountAmount) * 0.18; // 18% GST
    const total = subtotal - discountAmount + shipping + tax;

    return {
      subtotal,
      discountAmount,
      shipping,
      tax,
      total
    };
  }, [cart, discount]);
}