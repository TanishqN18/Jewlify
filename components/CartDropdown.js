'use client';
import  useCartStore  from '../components/store/cartStore';
import Link from 'next/link';

export default function CartDropdown() {
  const { cart } = useCartStore();

  return (
    <div className="absolute right-0 top-full mt-2 w-[90vw] max-w-sm bg-white border rounded-md shadow-lg p-4 z-50">
      <h3 className="text-lg font-semibold mb-3">Your Cart</h3>
      {cart.length === 0 ? (
        <p className="text-sm text-gray-600">Your cart is empty.</p>
      ) : (
        <ul className="divide-y max-h-60 overflow-y-auto">
          {cart.map((item, i) => (
            <li key={i} className="flex justify-between py-2 text-sm">
              <span>{item.name}</span>
              <span>₹{item.price}</span>
            </li>
          ))}
        </ul>
      )}

      <Link
        href="/cart"
        className="block mt-4 bg-yellow-500 hover:bg-yellow-600 text-white text-center py-2 rounded"
      >
        Go to Cart
      </Link>
    </div>
  );
}
