'use client';

import { motion } from 'framer-motion';
import PromoCode from './PromoCode';

export default function OrderSummary({ 
  cart, 
  subtotal, 
  discount, 
  discountAmount, 
  shipping, 
  tax, 
  total, 
  promoCode, 
  setPromoCode, 
  setDiscount 
}) {
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
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-8 w-full"
    >
      <div className="bg-secondary/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-4 sm:p-6 transition-all duration-300 w-full overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-primary transition-colors duration-300">
            Order Summary
          </h3>
          <div className="text-xl sm:text-2xl flex-shrink-0 ml-2">📊</div>
        </div>

        {/* Cart Items Preview */}
        <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
          {cart.map((item) => {
            const displayPrice = getDisplayPrice(item);
            return (
              <div key={item.cartKey} className="flex justify-between items-center text-xs">
                <div className="flex-1 pr-2">
                  <p className="text-primary font-medium truncate">{item.name}</p>
                  <div className="flex items-center gap-2 text-secondary">
                    <span>Qty: {item.quantity}</span>
                    <span>₹{displayPrice.toLocaleString()}</span>
                  </div>
                  {/* Show customization summary */}
                  {(item.customization?.engraving || item.customization?.size) && (
                    <div className="text-[10px] text-secondary mt-1">
                      {item.customization.engraving && (
                        <span>Engraving: &quot;{item.customization.engraving}&quot; </span>
                      )}
                      {item.customization.size && (
                        <span>Size: {item.customization.size}</span>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-gold font-semibold text-xs">
                  ₹{(displayPrice * item.quantity).toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>

        {/* Promo Code */}
        <PromoCode
          promoCode={promoCode}
          setPromoCode={setPromoCode}
          discount={discount}
          setDiscount={setDiscount}
        />

        {/* Price Breakdown */}
        <div className="space-y-3 text-sm w-full">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex justify-between items-center text-primary transition-colors duration-300"
          >
            <span className="text-left">Subtotal ({cart.length} items):</span>
            <span className="font-semibold ml-2">₹{subtotal.toLocaleString()}</span>
          </motion.div>
          
          {discount > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between items-center text-green-600"
            >
              <span className="text-left">Discount ({discount}%):</span>
              <span className="font-semibold ml-2">-₹{discountAmount.toLocaleString()}</span>
            </motion.div>
          )}
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-between items-center text-primary transition-colors duration-300"
          >
            <span className="text-left">Shipping:</span>
            <span className="font-semibold ml-2">
              {shipping === 0 ? (
                <span className="text-green-600 font-bold">FREE</span>
              ) : (
                `₹${shipping.toLocaleString()}`
              )}
            </span>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-between items-center text-primary transition-colors duration-300"
          >
            <span className="text-left">Tax (GST 18%):</span>
            <span className="font-semibold ml-2">₹{tax.toLocaleString()}</span>
          </motion.div>
          
          <div className="border-t border-white/20 pt-3 mt-3 transition-colors duration-300">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex justify-between items-center text-base sm:text-lg font-bold text-primary transition-colors duration-300"
            >
              <span className="text-left">Total Amount:</span>
              <span className="text-lg sm:text-xl bg-gradient-to-r from-yellow-600 to-yellow-400 bg-clip-text text-transparent font-bold ml-2">
                ₹{total.toLocaleString()}
              </span>
            </motion.div>
          </div>
        </div>

        {/* Security & Guarantees */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 pt-4 border-t border-white/20 transition-colors duration-300"
        >
          <div className="grid grid-cols-2 gap-2 sm:gap-3 text-center">
            <div className="bg-primary/30 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 border border-white/10">
              <div className="text-base sm:text-lg mb-1">🔒</div>
              <div className="text-xs font-medium text-primary transition-colors duration-300 leading-tight">Secure Payment</div>
            </div>
            <div className="bg-primary/30 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 border border-white/10">
              <div className="text-base sm:text-lg mb-1">📦</div>
              <div className="text-xs font-medium text-primary transition-colors duration-300 leading-tight">Free Returns</div>
            </div>
            <div className="bg-primary/30 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 border border-white/10">
              <div className="text-base sm:text-lg mb-1">💎</div>
              <div className="text-xs font-medium text-primary transition-colors duration-300 leading-tight">Certified Quality</div>
            </div>
            <div className="bg-primary/30 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 border border-white/10">
              <div className="text-base sm:text-lg mb-1">🚚</div>
              <div className="text-xs font-medium text-primary transition-colors duration-300 leading-tight">Fast Delivery</div>
            </div>
          </div>
        </motion.div>

        {/* Free Shipping Progress */}
        {shipping > 0 && subtotal < 50000 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-4 p-3 sm:p-4 bg-gradient-to-r from-yellow-50/10 to-orange-50/10 rounded-xl border border-yellow-200/20"
          >
            <div className="text-xs sm:text-sm text-primary mb-2 transition-colors duration-300 leading-tight">
              Add <span className="font-bold">₹{(50000 - subtotal).toLocaleString()}</span> more for FREE shipping! 🚚
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full transition-all duration-500"
                style={{width: `${Math.min((subtotal / 50000) * 100, 100)}%`}}
              />
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}