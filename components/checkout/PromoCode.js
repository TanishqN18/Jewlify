'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function PromoCode({ promoCode, setPromoCode, discount, setDiscount }) {
  const [isApplying, setIsApplying] = useState(false);

  const applyPromo = async () => {
    setIsApplying(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const validCodes = {
      'JEWEL10': 10,
      'WELCOME15': 15,
      'FIRST20': 20,
      'LUXURY25': 25,
      'VIP30': 30
    };
    
    const code = promoCode.trim().toUpperCase();
    if (validCodes[code]) {
      setDiscount(validCodes[code]);
    } else {
      setDiscount(0);
      alert('Invalid promo code. Try: JEWEL10, WELCOME15, or FIRST20');
    }
    
    setIsApplying(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-6 w-full overflow-hidden"
    >
      <label className="block text-sm font-semibold text-primary mb-3 transition-colors duration-300">
        Promo Code
      </label>
      
      <div className="flex gap-2 w-full">
        <input
          type="text"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
          placeholder="Enter promo code"
          className="flex-1 min-w-0 px-3 py-2.5 text-sm border border-white/20 dark:border-gray-600/20 rounded-xl bg-primary/50 backdrop-blur-sm text-primary placeholder-secondary/60 transition-all duration-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 focus:bg-primary/70"
        />
        <motion.button
          onClick={applyPromo}
          disabled={!promoCode.trim() || isApplying}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-shrink-0 px-3 py-2.5 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl text-sm font-semibold shadow-lg transition-all duration-300 min-w-[70px] flex items-center justify-center"
        >
          {isApplying ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
          ) : (
            'Apply'
          )}
        </motion.button>
      </div>
      
      {discount > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-3 p-3 bg-green-50/10 dark:bg-green-900/10 border border-green-200/20 dark:border-green-600/20 rounded-xl w-full overflow-hidden"
        >
          <div className="flex items-start gap-2">
            <span className="text-green-600 dark:text-green-400 text-base flex-shrink-0">✅</span>
            <span className="text-green-600 dark:text-green-400 font-semibold text-sm leading-tight break-words">
              Promo code applied! You saved {discount}%
            </span>
          </div>
        </motion.div>
      )}

      {/* Popular Promo Codes */}
      <div className="mt-4 w-full overflow-hidden">
        <div className="text-xs text-secondary mb-2 transition-colors duration-300">Popular codes:</div>
        <div className="flex flex-wrap gap-1.5 w-full">
          {['JEWEL10', 'WELCOME15', 'FIRST20'].map((code) => (
            <button
              key={code}
              onClick={() => setPromoCode(code)}
              className="px-2 py-1 text-xs bg-yellow-100/10 hover:bg-yellow-100/20 border border-yellow-200/20 dark:border-yellow-600/20 rounded-lg text-yellow-600 dark:text-yellow-400 hover:text-yellow-500 transition-all duration-300 flex-shrink-0"
            >
              {code}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}