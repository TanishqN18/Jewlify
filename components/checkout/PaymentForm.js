'use client';

import { motion } from 'framer-motion';
import PaymentMethods from './PaymentMethods';

export default function PaymentForm({ paymentInfo, setPaymentInfo, total, isLoading, onBack, onSubmit }) {
  return (
    <motion.div
      key="payment"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="p-6 sm:p-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2 transition-colors duration-300">
            Payment Method
          </h2>
          <p className="text-secondary transition-colors duration-300">
            Choose your preferred payment option
          </p>
        </div>
        <div className="text-4xl">💳</div>
      </div>

      <form onSubmit={onSubmit} className="space-y-8">
        
        {/* Payment Methods */}
        <PaymentMethods
          paymentInfo={paymentInfo}
          setPaymentInfo={setPaymentInfo}
          total={total}
        />

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 pt-6"
        >
          <button
            type="button"
            onClick={onBack}
            className="flex-1 border-2 border-white/20 dark:border-gray-600/20 text-primary py-4 rounded-2xl font-bold hover:bg-primary/10 hover:border-white/30 dark:hover:border-gray-500/30 transition-all duration-300 backdrop-blur-sm"
          >
            ← Back to Shipping
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-green-500 via-green-600 to-green-500 hover:from-green-600 hover:via-green-700 hover:to-green-600 disabled:from-gray-400 disabled:via-gray-500 disabled:to-gray-400 text-white py-4 rounded-2xl font-bold shadow-xl shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300 flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                Processing Payment...
              </>
            ) : (
              <>
                <span>Complete Order</span>
                <span className="text-lg">₹{total.toLocaleString()}</span>
              </>
            )}
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
}