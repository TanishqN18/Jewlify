'use client';

import { useEffect, useRef } from 'react';
import useCartStore from '../components/store/cartStore';
import { XMarkIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';

const CartDrawer = ({ isOpen, onClose }) => {
  const drawerRef = useRef();
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    applyPromo,
    clearCart,
    promoCode,
    discount,
  } = useCartStore();

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const discountAmount = subtotal * discount;
  const total = subtotal - discountAmount;

  // Close drawer on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div className={`fixed inset-0 z-40 ${isOpen ? '' : 'pointer-events-none'}`}>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed right-0 top-0 h-full w-[90vw] sm:w-[400px] bg-white dark:bg-zinc-900 shadow-xl transition-transform duration-300 ease-in-out z-50 transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b dark:border-zinc-800">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <button onClick={onClose}>
            <XMarkIcon className="w-6 h-6 text-gray-600 dark:text-white" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto max-h-[55vh] px-4 py-2 space-y-4">
          {cart.length === 0 ? (
            <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-4">
              Your cart is empty.
            </p>
          ) : (
            cart.map((item) => (
              <div key={item._id} className="flex items-center gap-4 border-b pb-3 dark:border-zinc-800">
                <Image
                  src={(item.image || '/Images/fallback.png').trim()}
                  alt={item.name}
                  width={64}
                  height={64}
                  className="object-cover rounded w-16 h-16"
                />
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{item.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">₹{item.price}</p>
                  <div className="flex items-center mt-2 gap-2">
                    <button
                      onClick={() => decreaseQuantity(item._id)}
                      className="px-2 py-1 rounded bg-gray-200 dark:bg-zinc-700"
                    >
                      −
                    </button>
                    <span className="text-sm">{item.quantity}</span>
                    <button
                      onClick={() => increaseQuantity(item._id)}
                      className="px-2 py-1 rounded bg-gray-200 dark:bg-zinc-700"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item._id)}>
                  <XMarkIcon className="w-4 h-4 text-red-500" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-gray-200 dark:border-zinc-800 space-y-3">
            <input
              type="text"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => applyPromo(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded bg-gray-100 dark:bg-zinc-800 dark:text-white outline-none"
            />

            <div className="space-y-1 text-sm">
              <p className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </p>
              {discount > 0 && (
                <p className="flex justify-between text-green-500">
                  <span>Discount (10%):</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </p>
              )}
              <p className="flex justify-between font-semibold text-lg mt-1">
                <span>Total:</span>
                <span>₹{total.toFixed(2)}</span>
              </p>
            </div>

            <button
              onClick={() => clearCart()}
              className="w-full text-sm text-red-500 hover:text-red-700"
            >
              Clear Cart
            </button>

            <Link
              href="/checkout"
              onClick={onClose}
              className="block w-full text-center bg-black text-white dark:bg-white dark:text-black py-2 mt-2 rounded hover:opacity-90 transition"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
