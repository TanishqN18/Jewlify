'use client';

import { motion } from 'framer-motion';

export default function EmptyCart({ onContinueShopping }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary to-secondary transition-all duration-500">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md mx-auto px-6"
      >
        <div className="bg-secondary/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-8">
          
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="text-8xl mb-6"
          >
            🛒
          </motion.div>
          
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-primary mb-4 transition-colors duration-300"
          >
            Your cart is empty
          </motion.h1>
          
          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-secondary mb-8 transition-colors duration-300"
          >
            Looks like you have not added any beautiful jewelry to your cart yet. 
            Start exploring our collection!
          </motion.p>
          
          {/* Action Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onContinueShopping}
            className="bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-500 hover:from-yellow-600 hover:via-yellow-700 hover:to-yellow-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-yellow-500/25 hover:shadow-yellow-500/40 transition-all duration-300"
          >
            Continue Shopping ✨
          </motion.button>
          
          {/* Decorative Elements */}
          <div className="flex justify-center space-x-4 mt-8 opacity-50">
            <span className="text-2xl">💎</span>
            <span className="text-2xl">👑</span>
            <span className="text-2xl">💍</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}