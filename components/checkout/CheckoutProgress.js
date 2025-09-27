'use client';

import { motion } from 'framer-motion';

const steps = [
  { step: 1, title: 'Cart Review', icon: '🛒', description: 'Review your items' },
  { step: 2, title: 'Shipping', icon: '📦', description: 'Delivery details' },
  { step: 3, title: 'Payment', icon: '💳', description: 'Complete order' }
];

export default function CheckoutProgress({ currentStep }) {
  return (
    <div className="mb-8 w-full">
      {/* Mobile - Centered */}
      <div className="flex items-center justify-center sm:hidden">
        <div className="flex items-center space-x-2 bg-secondary/80 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/10">
          {steps.map((item, index) => (
            <div key={item.step} className="flex items-center">
              
              {/* Step Circle */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="relative"
              >
                <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-2xl border-2 transition-all duration-500 ${
                  currentStep >= item.step 
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 border-yellow-500 text-white shadow-lg shadow-yellow-500/25' 
                    : 'border-gray-300 dark:border-gray-600 text-secondary bg-primary/50 hover:bg-primary/70'
                }`}>
                  <span className="text-base">{item.icon}</span>
                  {currentStep >= item.step && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
                    >
                      <span className="text-white text-xs">✓</span>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
                  className={`w-8 h-1 mx-2 rounded-full transition-all duration-500 ${
                    currentStep > item.step 
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-lg shadow-yellow-500/25' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Desktop - Full Width */}
      <div className="hidden sm:block w-full">
        <div className="bg-secondary/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/10 w-full">
          <div className="flex items-center w-full">
            {steps.map((item, index) => (
              <div key={item.step} className={`flex items-center ${index === 0 ? 'justify-start' : index === steps.length - 1 ? 'justify-end' : 'justify-center'} ${index < steps.length - 1 ? 'flex-1' : ''}`}>
                
                {/* Step Circle */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="relative flex flex-col items-center"
                >
                  <div className={`flex items-center justify-center w-14 h-14 rounded-2xl border-2 transition-all duration-500 ${
                    currentStep >= item.step 
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 border-yellow-500 text-white shadow-lg shadow-yellow-500/25' 
                      : 'border-gray-300 dark:border-gray-600 text-secondary bg-primary/50 hover:bg-primary/70'
                  }`}>
                    <span className="text-lg">{item.icon}</span>
                    {currentStep >= item.step && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
                      >
                        <span className="text-white text-xs">✓</span>
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Step Details */}
                  <div className="mt-3 text-center min-w-0">
                    <div className={`text-sm font-semibold transition-colors duration-300 ${
                      currentStep >= item.step 
                        ? 'text-yellow-600 dark:text-yellow-400' 
                        : 'text-primary'
                    }`}>
                      {item.title}
                    </div>
                    <div className="text-xs text-secondary mt-1 transition-colors duration-300">
                      {item.description}
                    </div>
                  </div>
                </motion.div>

                {/* Connector Line - Full width between steps */}
                {index < steps.length - 1 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
                    className={`flex-1 h-1 mx-6 rounded-full transition-all duration-500 ${
                      currentStep > item.step 
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-lg shadow-yellow-500/25' 
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}