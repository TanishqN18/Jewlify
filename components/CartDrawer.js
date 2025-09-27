'use client';

import { useEffect } from 'react';
import useCartStore from './store/cartStore';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCartStore();

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Handle escape key and body scroll
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
          
          {/* Drawer - Fixed positioning */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            className="fixed top-0 right-0 h-screen w-full max-w-sm sm:max-w-md bg-primary shadow-2xl z-50 flex flex-col border-l border-gray-200 dark:border-gray-700 transition-all duration-300 overflow-hidden"
          >
            {/* Header - Fixed height */}
            <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300 bg-secondary">
              <div>
                <h2 className="text-xl font-bold text-primary transition-colors duration-300">
                  Shopping Cart
                </h2>
                <p className="text-sm text-secondary transition-colors duration-300">
                  {cart.length} {cart.length === 1 ? 'item' : 'items'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex-shrink-0 p-2 hover:bg-primary rounded-full transition-all duration-300 group"
                aria-label="Close cart"
              >
                <svg 
                  className="w-6 h-6 text-secondary group-hover:text-primary transition-colors duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Cart Content - Scrollable */}
            <div className="flex-1 overflow-y-auto min-h-0 p-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-8">
                  <div className="text-6xl mb-4 opacity-50">🛒</div>
                  <h3 className="text-xl font-semibold text-primary mb-2 transition-colors duration-300">
                    Your cart is empty
                  </h3>
                  <p className="text-base text-secondary transition-colors duration-300 mb-6">
                    Add some beautiful jewelry to get started!
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {cart.map((product, index) => (
                      <motion.div
                        key={product._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="flex gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-secondary hover:shadow-md transition-all duration-300"
                      >
                        {/* Product Image */}
                        <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-primary">
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <Link 
                              href={`/product/${product._id}`}
                              onClick={onClose}
                              className="font-medium text-base text-primary hover:text-yellow-500 transition-colors duration-300 block truncate"
                            >
                              {product.name}
                            </Link>
                            <p className="text-sm text-secondary transition-colors duration-300">
                              ₹{product.price.toLocaleString()} each
                            </p>
                          </div>

                          {/* Quantity and Price */}
                          <div className="flex items-center justify-between mt-2">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-1 border border-gray-300 dark:border-gray-600 rounded bg-primary transition-all duration-300">
                              <button
                                onClick={() => handleQuantityChange(product._id, product.quantity - 1)}
                                className="text-primary hover:text-red-500 transition-colors duration-300 w-8 h-8 flex items-center justify-center text-sm"
                              >
                                −
                              </button>
                              <span className="px-3 text-primary font-medium transition-colors duration-300 min-w-[24px] text-center text-sm">
                                {product.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(product._id, product.quantity + 1)}
                                className="text-primary hover:text-green-500 transition-colors duration-300 w-8 h-8 flex items-center justify-center text-sm"
                              >
                                +
                              </button>
                            </div>

                            {/* Price and Remove */}
                            <div className="text-right">
                              <p className="text-base font-semibold text-yellow-600 dark:text-yellow-400">
                                ₹{(product.price * product.quantity).toLocaleString()}
                              </p>
                              <button
                                onClick={() => removeFromCart(product._id)}
                                className="text-xs text-red-600 hover:text-red-500 transition-colors duration-300 underline"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer - Fixed at bottom */}
            {cart.length > 0 && (
              <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 p-4 bg-secondary transition-all duration-300">
                {/* Total */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-semibold text-primary transition-colors duration-300">
                    Total:
                  </span>
                  <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    ₹{total.toLocaleString()}
                  </span>
                </div>

                <p className="text-sm text-secondary mb-4 transition-colors duration-300">
                  Shipping and taxes calculated at checkout.
                </p>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {/* Main Checkout Button */}
                  <Link
                    href="/checkout"
                    onClick={onClose}
                    className="w-full flex items-center justify-center rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 px-6 py-4 text-white font-semibold text-base transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Proceed to Checkout
                  </Link>

                  {/* Clear Cart Button - Only show if more than 1 item */}
                  {cart.length > 1 && (
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to clear your cart?')) {
                          clearCart();
                        }
                      }}
                      className="w-full flex items-center justify-center rounded-lg border-2 border-red-500 bg-transparent px-6 py-3 text-red-600 hover:bg-red-500 hover:text-white font-medium text-sm transition-all duration-300"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Clear Cart
                    </button>
                  )}
                </div>

                {/* Continue Shopping */}
                <div className="mt-4 text-center">
                  <button
                    onClick={onClose}
                    className="text-sm text-yellow-600 dark:text-yellow-400 hover:text-yellow-500 transition-colors duration-300 font-medium inline-flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
