'use client';

import { motion } from 'framer-motion';

const paymentMethods = [
  { 
    id: 'card', 
    label: 'Credit/Debit Card', 
    icon: '💳',
    description: 'Secure payment via card',
    popular: true
  },
  { 
    id: 'upi', 
    label: 'UPI Payment', 
    icon: '📱',
    description: 'Pay using UPI ID',
    popular: false
  },
  { 
    id: 'cod', 
    label: 'Cash on Delivery', 
    icon: '💰',
    description: 'Pay when you receive',
    popular: false
  }
];

export default function PaymentMethods({ paymentInfo, setPaymentInfo, total }) {
  const inputClasses = "w-full px-4 py-3 border border-white/20 dark:border-gray-600/20 rounded-xl bg-secondary/50 backdrop-blur-sm text-primary placeholder-secondary/60 transition-all duration-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 focus:bg-secondary/70 hover:bg-secondary/60";
  const labelClasses = "block text-sm font-semibold text-primary mb-2 transition-colors duration-300";

  return (
    <div className="space-y-6">
      
      {/* Payment Method Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <label className="block text-lg font-bold text-primary mb-4 transition-colors duration-300">
          Choose Payment Method
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {paymentMethods.map((method, index) => (
            <motion.button
              key={method.id}
              type="button"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              onClick={() => setPaymentInfo({...paymentInfo, paymentMethod: method.id})}
              className={`relative p-6 border-2 rounded-2xl text-center transition-all duration-300 group ${
                paymentInfo.paymentMethod === method.id
                  ? 'border-yellow-500 bg-yellow-50/10 dark:bg-yellow-900/20 shadow-xl shadow-yellow-500/20'
                  : 'border-white/20 dark:border-gray-600/20 bg-secondary/30 hover:bg-secondary/50 hover:border-white/30 dark:hover:border-gray-500/30'
              }`}
            >
              {method.popular && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Popular
                  </span>
                </div>
              )}
              
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {method.icon}
              </div>
              <div className="font-bold text-primary mb-1 transition-colors duration-300">
                {method.label}
              </div>
              <div className="text-sm text-secondary transition-colors duration-300">
                {method.description}
              </div>
              
              {paymentInfo.paymentMethod === method.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center"
                >
                  <span className="text-white text-sm font-bold">✓</span>
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Card Payment Form */}
      {paymentInfo.paymentMethod === 'card' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6 overflow-hidden"
        >
          <div className="bg-secondary/30 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-600/20">
            <h3 className="text-lg font-bold text-primary mb-4 transition-colors duration-300">Card Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className={labelClasses}>Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={paymentInfo.cardNumber}
                  onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})}
                  className={inputClasses}
                  maxLength={19}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={paymentInfo.expiryDate}
                    onChange={(e) => setPaymentInfo({...paymentInfo, expiryDate: e.target.value})}
                    className={inputClasses}
                    maxLength={5}
                  />
                </div>
                
                <div>
                  <label className={labelClasses}>CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    value={paymentInfo.cvv}
                    onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
                    className={inputClasses}
                    maxLength={4}
                  />
                </div>
              </div>

              <div>
                <label className={labelClasses}>Cardholder Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={paymentInfo.cardName}
                  onChange={(e) => setPaymentInfo({...paymentInfo, cardName: e.target.value})}
                  className={inputClasses}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* UPI Payment Form */}
      {paymentInfo.paymentMethod === 'upi' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="bg-secondary/30 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-600/20">
            <h3 className="text-lg font-bold text-primary mb-4 transition-colors duration-300">UPI Details</h3>
            <div>
              <label className={labelClasses}>UPI ID</label>
              <input
                type="text"
                placeholder="yourname@paytm"
                value={paymentInfo.upiId}
                onChange={(e) => setPaymentInfo({...paymentInfo, upiId: e.target.value})}
                className={inputClasses}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* COD Message */}
      {paymentInfo.paymentMethod === 'cod' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="bg-gradient-to-r from-yellow-50/10 to-orange-50/10 dark:from-yellow-900/10 dark:to-orange-900/10 backdrop-blur-sm border border-yellow-200/20 dark:border-yellow-600/20 rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💰</span>
              <div>
                <h3 className="font-bold text-primary mb-1 transition-colors duration-300">Cash on Delivery</h3>
                <p className="text-secondary transition-colors duration-300">
                  You will pay <span className="font-bold text-yellow-600 dark:text-yellow-400">₹{total.toLocaleString()}</span> when your order is delivered to your doorstep.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}