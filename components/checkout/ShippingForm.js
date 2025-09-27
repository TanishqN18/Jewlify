'use client';

import { motion } from 'framer-motion';

export default function ShippingForm({ shippingInfo, setShippingInfo, onBack, onNext }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    const isValid = required.every(field => shippingInfo[field].trim());
    
    if (isValid) {
      onNext();
    } else {
      alert('Please fill in all required fields');
    }
  };

  const inputClasses = "w-full px-4 py-3 border border-white/20 rounded-xl bg-secondary/50 backdrop-blur-sm text-primary placeholder-secondary/60 transition-all duration-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 focus:bg-secondary/70";
  const labelClasses = "block text-sm font-semibold text-primary mb-2 transition-colors duration-300";

  return (
    <motion.div
      key="shipping"
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
            Shipping Information
          </h2>
          <p className="text-secondary transition-colors duration-300">
            Where should we deliver your beautiful jewelry?
          </p>
        </div>
        <div className="text-4xl">📦</div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Personal Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className={labelClasses}>First Name *</label>
            <input
              type="text"
              required
              value={shippingInfo.firstName}
              onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
              className={inputClasses}
              placeholder="Enter your first name"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <label className={labelClasses}>Last Name *</label>
            <input
              type="text"
              required
              value={shippingInfo.lastName}
              onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
              className={inputClasses}
              placeholder="Enter your last name"
            />
          </motion.div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className={labelClasses}>Email Address *</label>
            <input
              type="email"
              required
              value={shippingInfo.email}
              onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
              className={inputClasses}
              placeholder="your.email@example.com"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
          >
            <label className={labelClasses}>Phone Number *</label>
            <input
              type="tel"
              required
              value={shippingInfo.phone}
              onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
              className={inputClasses}
              placeholder="+91 98765 43210"
            />
          </motion.div>
        </div>

        {/* Address Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className={labelClasses}>Street Address *</label>
          <textarea
            required
            rows={3}
            value={shippingInfo.address}
            onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
            className={inputClasses}
            placeholder="Enter your complete address"
          />
        </motion.div>

        {/* Location Details */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <label className={labelClasses}>City *</label>
            <input
              type="text"
              required
              value={shippingInfo.city}
              onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
              className={inputClasses}
              placeholder="City"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className={labelClasses}>State *</label>
            <input
              type="text"
              required
              value={shippingInfo.state}
              onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
              className={inputClasses}
              placeholder="State"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <label className={labelClasses}>ZIP Code *</label>
            <input
              type="text"
              required
              value={shippingInfo.zipCode}
              onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
              className={inputClasses}
              placeholder="123456"
            />
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 pt-6"
        >
          <button
            type="button"
            onClick={onBack}
            className="flex-1 border-2 border-white/20 text-primary py-4 rounded-2xl font-bold hover:bg-primary/10 transition-all duration-300 backdrop-blur-sm"
          >
            ← Back to Cart
          </button>
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-500 hover:from-yellow-600 hover:via-yellow-700 hover:to-yellow-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-yellow-500/25 hover:shadow-yellow-500/40 transition-all duration-300"
          >
            Continue to Payment →
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
}