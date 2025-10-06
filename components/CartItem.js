'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { FaPenFancy, FaRulerCombined, FaCommentDots } from 'react-icons/fa';
import useCartStore from './store/cartStore';

export default function CartItems() {
  const { cart, removeFromCart, updateQuantity } = useCartStore();

  const handleQtyChange = (cartKey, qty) => {
    if (qty < 1) return;
    updateQuantity(cartKey, qty);
  };

  const getDisplayPrice = (item) => {
    if (item.priceType === "fixed") {
      return item.fixedPrice || item.price || 0;
    } else if (item.priceType === "weight-based") {
      const goldRate = 5000; // You'd fetch current rate
      return (item.weight || 0) * goldRate;
    }
    return item.price || 0;
  };

  return (
    <div className="space-y-4">
      {cart.map((item) => {
        const displayPrice = getDisplayPrice(item);
        const hasCustomization = item.customization && (
          item.customization.engraving || 
          item.customization.size || 
          item.customization.specialInstructions
        );

        return (
          <motion.div
            key={item.cartKey} // Use cartKey instead of id
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md bg-primary backdrop-blur-md transition-all duration-300"
          >
            {/* Product Image */}
            <div className="w-24 h-24 relative">
              <Image
                src={Array.isArray(item.image) ? item.image[0] : item.image}
                alt={item.name}
                fill
                className="object-cover rounded"
              />
            </div>

            {/* Product Info */}
            <div className="flex-1 space-y-1 text-center sm:text-left">
              <h3 className="text-lg font-semibold text-primary transition-colors duration-300">
                {item.name}
              </h3>
              <p className="text-sm text-secondary transition-colors duration-300">
                ₹{displayPrice.toFixed(2)}
              </p>
              <p className="text-xs text-secondary">
                SKU: {item.sku}
              </p>
              
              {/* Show customization details */}
              {hasCustomization && (
                <div className="mt-2 p-2 bg-secondary/20 rounded-lg border border-white/10">
                  <p className="text-xs font-semibold text-secondary mb-1">Customization:</p>
                  <div className="space-y-1">
                    {item.customization.engraving && (
                      <div className="flex items-center gap-1 text-xs text-secondary">
                        <FaPenFancy className="text-[10px]" />
                        <span>Engraving: &quot;{item.customization.engraving}&quot;</span>
                      </div>
                    )}
                    {item.customization.size && (
                      <div className="flex items-center gap-1 text-xs text-secondary">
                        <FaRulerCombined className="text-[10px]" />
                        <span>Size: {item.customization.size}</span>
                      </div>
                    )}
                    {item.customization.specialInstructions && (
                      <div className="flex items-center gap-1 text-xs text-secondary">
                        <FaCommentDots className="text-[10px]" />
                        <span>Note: {item.customization.specialInstructions}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <p className={`text-xs ${item.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {item.stock > 0 ? `In Stock (${item.stock} available)` : 'Out of Stock'}
              </p>
            </div>

            {/* Quantity + Remove */}
            <div className="flex items-center gap-3">
              {/* Quantity Control */}
              <div className="flex items-center gap-2 border border-gray-300 dark:border-gray-700 rounded px-2 py-1 bg-primary transition-all duration-300">
                <button
                  onClick={() => handleQtyChange(item.cartKey, item.quantity - 1)}
                  className="text-primary hover:text-red-500 transition-colors duration-300"
                >
                  <MinusIcon className="w-4 h-4" />
                </button>
                <span className="px-2 font-medium text-primary transition-colors duration-300">
                  {item.quantity}
                </span>
                <button
                  onClick={() => handleQtyChange(item.cartKey, item.quantity + 1)}
                  className="text-primary hover:text-green-500 transition-colors duration-300"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Total Price for this item */}
              <div className="text-right">
                <p className="text-sm font-semibold text-gold">
                  ₹{(displayPrice * item.quantity).toLocaleString()}
                </p>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeFromCart(item.cartKey)}
                className="text-red-600 hover:text-red-800 transition-colors duration-300"
                title="Remove item"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
