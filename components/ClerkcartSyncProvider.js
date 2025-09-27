'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import useCartStore from './store/cartStore';

const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const useDebounceFn = (fn, delay = 600) => {
  const t = useRef(null);
  const saved = useRef(fn);
  saved.current = fn;
  return (...args) => {
    if (t.current) clearTimeout(t.current);
    t.current = setTimeout(() => saved.current(...args), delay);
  };
};

export default function ClerkCartSyncProvider({ children }) {
  const { user, isLoaded, isSignedIn } = useUser();
  const cart = useCartStore((s) => s.cart);
  const setCart = useCartStore((s) => s.setCart);

  const toPublicCart = useCallback(
    (items) =>
      (items || []).map((i) => ({
        _id: i._id,
        name: i.name || '',
        price: Number(i.price || 0),
        image: i.image || '',
        quantity: Number(i.quantity || 1),
      })),
    []
  );

  const saveToClerk = useDebounceFn(async (nextCartRaw) => {
    if (!isSignedIn) return;
    try {
      const nextCart = toPublicCart(nextCartRaw);
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart: nextCart }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error('Cart sync failed:', err);
      } else {
        await user?.reload?.();
      }
    } catch (e) {
      console.error('Failed to save cart to Clerk metadata:', e);
    }
  }, 700);

  // Init + migrate from localStorage
  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && user) {
      const remoteCart = toPublicCart(user.publicMetadata?.cart || []);

      let localCart = [];
      try {
        const raw = localStorage.getItem('cart-storage');
        if (raw) {
          const parsed = JSON.parse(raw);
          localCart = toPublicCart(parsed?.state?.cart || []);
        }
      } catch {}

      const cartToUse =
        (remoteCart.length > 0 && remoteCart) ||
        (localCart.length > 0 && localCart) ||
        [];

      if (!isEqual(cartToUse, useCartStore.getState().cart)) {
        setCart(cartToUse);
      }

      if (localCart.length > 0 && !isEqual(remoteCart, localCart)) {
        saveToClerk(localCart);
      }
      if (localCart.length > 0) {
        try { localStorage.removeItem('cart-storage'); } catch {}
      }
    } else {
      try {
        const raw = localStorage.getItem('cart-storage');
        if (raw) {
          const parsed = JSON.parse(raw);
          const localCart = toPublicCart(parsed?.state?.cart || []);
          if (localCart.length && !isEqual(localCart, useCartStore.getState().cart)) {
            setCart(localCart);
          }
        }
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn, user?.id]);

  useEffect(() => {
    if (!isSignedIn) return;
    saveToClerk(cart);
  }, [cart, isSignedIn]);

  useEffect(() => {
    if (isSignedIn) return;
    try { localStorage.setItem('cart-storage', JSON.stringify({ state: { cart } })); } catch {}
  }, [cart, isSignedIn]);

  return children;
}