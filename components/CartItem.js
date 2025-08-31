'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import useCartStore from './store/cartStore';

export default function CartItems() {
  const { cart, removeFromCart, updateQuantity } = useCartStore();

  const handleQtyChange = (id, qty) => {
    if (qty < 1) return;
    updateQuantity(id, qty);
  };

  return (
    <div className="space-y-4">
      {cart.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 p-4 border rounded-lg shadow-md dark:border-gray-700 bg-white/60 dark:bg-black/40 backdrop-blur-md"
        >
          {/* Product Image */}
          <div className="w-24 h-24 relative">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover rounded"
            />
          </div>

          {/* Product Info */}
          <div className="flex-1 space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">₹{item.price.toFixed(2)}</p>
            <p className={`text-xs ${item.inStock ? 'text-green-600' : 'text-red-500'}`}>
              {item.inStock ? 'In Stock' : 'Out of Stock'}
            </p>
          </div>

          {/* Quantity + Remove */}
          <div className="flex items-center gap-3">
            {/* Quantity Control */}
            <div className="flex items-center gap-2 border rounded px-2 py-1 bg-white dark:bg-black border-gray-300 dark:border-gray-700">
              <button
                onClick={() => handleQtyChange(item.id, item.quantity - 1)}
                className="text-gray-700 dark:text-gray-300 hover:text-red-500 transition"
              >
                <MinusIcon className="w-4 h-4" />
              </button>
              <span className="px-2 font-medium">{item.quantity}</span>
              <button
                onClick={() => handleQtyChange(item.id, item.quantity + 1)}
                className="text-gray-700 dark:text-gray-300 hover:text-green-500 transition"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-600 hover:text-red-800"
              title="Remove item"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
