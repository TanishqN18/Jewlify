'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useCartStore from '../../../components/store/cartStore';
import CartItems from '../../../components/CartItem';

export default function CartPage() {
  const { cart, updateQuantity } = useCartStore();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const router = useRouter();

  // Calculate subtotal
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  useEffect(() => {
    // reset promo on load
    setDiscount(0);
  }, []);

  const applyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'JEWEL10') {
      setDiscount(10);
    } else {
      setDiscount(0);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 md:px-12 lg:px-24 bg-gradient-to-b from-yellow-50 via-white to-yellow-100 dark:from-[#0a0a0a] dark:via-[#111] dark:to-[#1a1a1a] text-gray-800 dark:text-gray-200 transition-colors">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg mb-4">Your cart is empty.</p>
          <button
            onClick={() => router.push('/shop')}
            className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600 transition"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <CartItems />
          </div>

          {/* Summary */}
          <div className="p-6 border rounded-lg shadow-md dark:border-gray-700 bg-white/60 dark:bg-black/40 backdrop-blur-md">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            {/* Promo Code */}
            <div className="mb-4">
              <label htmlFor="promo" className="block mb-2 text-sm font-medium">Promo Code</label>
              <div className="flex items-center gap-2">
                <input
                  id="promo"
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter code"
                  className="flex-1 px-3 py-2 rounded border dark:bg-black dark:border-gray-600"
                />
                <button
                  onClick={applyPromo}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                >
                  Apply
                </button>
              </div>
              {discount > 0 && (
                <p className="text-green-600 mt-1 text-sm">✔ Promo applied! 10% off</p>
              )}
            </div>

            {/* Price Summary */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount:</span>
                <span className={discount > 0 ? 'text-green-600' : 'text-gray-500'}>
                  - ₹{discountAmount.toFixed(2)}
                </span>
              </div>
              <div className="border-t border-gray-300 dark:border-gray-700 pt-2 font-semibold text-lg flex justify-between">
                <span>Total:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="w-full mt-6 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition text-center"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
