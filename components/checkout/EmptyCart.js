'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function EmptyCart({ onContinueShopping }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary transition-all duration-500">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className="text-center max-w-lg mx-auto px-4 sm:px-6"
      >
        <div className="bg-secondary backdrop-blur-sm rounded-2xl shadow-2xl border-white/10 p-6 sm:p-8 relative overflow-hidden">
          
          {/* Background Decoration */}
          <div className="absolute inset-0 bg-gold/5 pointer-events-none" />
          <div className="absolute top-4 right-4 w-20 h-20 bg-gold/10 rounded-full blur-xl" />
          <div className="absolute bottom-4 left-4 w-16 h-16 bg-gold/10 rounded-full blur-xl" />
          
          {/* Content */}
          <div className="relative z-10">
            {/* Animated Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 150, damping: 12 }}
              className="text-6xl sm:text-8xl mb-6 relative"
            >
              <div className="relative inline-block">
                🛒
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-gold/20 rounded-full blur-2xl"
                />
              </div>
            </motion.div>
            
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-4"
            >
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2 transition-colors duration-300">
                Your Cart is Empty
              </h1>
              <div className="w-16 h-1 bg-gold rounded-full mx-auto" />
            </motion.div>
            
            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-secondary text-base sm:text-lg leading-relaxed mb-8 transition-colors duration-300 max-w-md mx-auto"
            >
              Discover our exquisite collection of handcrafted jewelry. 
              From elegant rings to stunning necklaces, find the perfect piece to complete your look.
            </motion.p>
            
            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="space-y-4"
            >
              <button
                onClick={onContinueShopping}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-gold text-white font-semibold rounded-2xl shadow-lg hover:opacity-90 hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 group"
              >
                <span className="text-lg">✨</span>
                <span>Start Shopping</span>
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </button>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/collections/rings"
                  className="px-6 py-3 border border-white/20 text-secondary hover:text-primary hover:border-gold hover:bg-primary/10 rounded-xl transition-all duration-300 text-sm font-medium"
                >
                  Browse Rings
                </Link>
                <Link
                  href="/collections/necklaces"
                  className="px-6 py-3 border border-white/20 text-secondary hover:text-primary hover:border-gold hover:bg-primary/10 rounded-xl transition-all duration-300 text-sm font-medium"
                >
                  View Necklaces
                </Link>
              </div>
            </motion.div>
            
            {/* Decorative Elements */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="flex justify-center items-center space-x-6 mt-8 pt-6 border-t border-white/10"
            >
              {[
                { icon: "💎", label: "Premium Quality" },
                { icon: "🚚", label: "Free Shipping" },
                { icon: "🔒", label: "Secure Checkout" }
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + (index * 0.1) }}
                  className="text-center group cursor-default"
                >
                  <div className="text-2xl mb-1 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <div className="text-xs text-secondary transition-colors duration-300">
                    {item.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}