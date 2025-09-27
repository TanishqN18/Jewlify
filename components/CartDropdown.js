'use client';
import useCartStore from '../components/store/cartStore';
import Link from 'next/link';

export default function CartDropdown() {
  const { cart } = useCartStore();

  return (
    <div className="absolute right-0 top-full mt-2 w-[90vw] max-w-sm bg-primary border border-gray-200 dark:border-gray-700 rounded-md shadow-lg p-4 z-50 transition-all duration-300">
      <h3 className="text-lg font-semibold mb-3 text-primary transition-colors duration-300">Your Cart</h3>
      {cart.length === 0 ? (
        <p className="text-sm text-secondary transition-colors duration-300">Your cart is empty.</p>
      ) : (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700 max-h-60 overflow-y-auto transition-colors duration-300">
          {cart.map((item, i) => (
            <li key={i} className="flex justify-between py-2 text-sm">
              <span className="text-primary transition-colors duration-300">{item.name}</span>
              <span className="text-secondary transition-colors duration-300">₹{item.price}</span>
            </li>
          ))}
        </ul>
      )}

      <Link
        href="/cart"
        className="block mt-4 bg-yellow-500 hover:bg-yellow-600 text-white text-center py-2 rounded transition-colors duration-300"
      >
        Go to Cart
      </Link>
    </div>
  );
}
