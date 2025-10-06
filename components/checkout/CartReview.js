'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaPenFancy, FaRulerCombined, FaCommentDots } from 'react-icons/fa';

export default function CartReview({ cart, onQuantityChange, onRemove, onNext }) {
  // Helper function to get display price for cart items
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
    <motion.div
      key="cart"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="p-6 sm:p-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2 transition-colors duration-300">
            Review Your Items
          </h2>
          <p className="text-secondary transition-colors duration-300">
            Verify your jewelry selection before proceeding
          </p>
        </div>
        <div className="text-4xl">💎</div>
      </div>
      
      {/* Cart Items */}
      <div className="space-y-4 mb-8">
        {cart.map((product, index) => {
          const displayPrice = getDisplayPrice(product);
          const hasCustomization = product.customization && (
            product.customization.engraving || 
            product.customization.size || 
            product.customization.specialInstructions
          );

          return (
            <motion.div
              key={product.cartKey} // Changed from product._id to product.cartKey
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="group relative bg-primary/50 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6 hover:bg-primary/70 hover:shadow-xl hover:shadow-yellow-500/10 transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                
                {/* Product Image */}
                <div className="relative w-full sm:w-32 h-48 sm:h-32 flex-shrink-0 rounded-xl overflow-hidden group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src={Array.isArray(product.image) ? product.image[0] : product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                {/* Product Details */}
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-primary transition-colors duration-300 group-hover:text-yellow-600">
                      {product.name}
                    </h3>
                    <p className="text-secondary transition-colors duration-300 text-sm sm:text-base">
                      ₹{displayPrice.toLocaleString()} each
                    </p>
                    {product.sku && (
                      <p className="text-xs text-secondary/70 transition-colors duration-300">
                        SKU: {product.sku}
                      </p>
                    )}
                  </div>

                  {/* Show customization details */}
                  {hasCustomization && (
                    <div className="bg-secondary/20 backdrop-blur-sm border border-white/10 rounded-xl p-3 space-y-2">
                      <p className="text-xs font-semibold text-secondary mb-2">Your Customization:</p>
                      <div className="space-y-1">
                        {product.customization.engraving && (
                          <div className="flex items-center gap-2 text-xs text-primary">
                            <FaPenFancy className="text-yellow-500 text-[10px]" />
                            <span>Engraving: <strong>&quot;{product.customization.engraving}&quot;</strong></span>
                          </div>
                        )}
                        {product.customization.size && (
                          <div className="flex items-center gap-2 text-xs text-primary">
                            <FaRulerCombined className="text-yellow-500 text-[10px]" />
                            <span>Size: <strong>{product.customization.size}</strong></span>
                          </div>
                        )}
                        {product.customization.specialInstructions && (
                          <div className="flex items-center gap-2 text-xs text-primary">
                            <FaCommentDots className="text-yellow-500 text-[10px]" />
                            <span>Note: <strong>{product.customization.specialInstructions}</strong></span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Quantity and Price Controls */}
                  <div className="flex items-center justify-between">
                    
                    {/* Quantity Control */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-secondary transition-colors duration-300">Quantity:</span>
                      <div className="flex items-center bg-secondary/50 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden">
                        <button
                          onClick={() => onQuantityChange(product.cartKey, product.quantity - 1)} // Changed to use cartKey
                          className="w-10 h-10 flex items-center justify-center text-primary hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300"
                        >
                          <span className="text-lg font-bold">−</span>
                        </button>
                        <span className="px-4 py-2 text-primary font-bold transition-colors duration-300 min-w-[3rem] text-center">
                          {product.quantity}
                        </span>
                        <button
                          onClick={() => onQuantityChange(product.cartKey, product.quantity + 1)} // Changed to use cartKey
                          className="w-10 h-10 flex items-center justify-center text-primary hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300"
                        >
                          <span className="text-lg font-bold">+</span>
                        </button>
                      </div>
                    </div>

                    {/* Price and Remove */}
                    <div className="text-right space-y-2">
                      <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-400 bg-clip-text text-transparent">
                        ₹{(displayPrice * product.quantity).toLocaleString()}
                      </p>
                      <button
                        onClick={() => onRemove(product.cartKey)} // Changed to use cartKey
                        className="text-sm text-red-500 hover:text-red-400 font-medium underline decoration-dotted underline-offset-2 transition-all duration-300 hover:decoration-solid"
                      >
                        Remove Item
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400/0 via-yellow-400/5 to-yellow-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
          );
        })}
      </div>

      {/* Continue Button */}
      <motion.button
        onClick={onNext}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-500 hover:from-yellow-600 hover:via-yellow-700 hover:to-yellow-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-yellow-500/25 hover:shadow-yellow-500/40 transition-all duration-300 backdrop-blur-sm"
      >
        Continue to Shipping →
      </motion.button>
    </motion.div>
  );
}