'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ThankYouPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Generate a random order number
    setOrderNumber(`JWL${Math.random().toString().slice(2, 8)}`);
  }, []);

  // Optional: Redirect to /shop after 5 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push('/shop');
    }, 5000);
    return () => clearTimeout(timeout);
  }, [router]);

  const nextSteps = [
    {
      step: "1",
      title: "Order Confirmation",
      description: "You'll receive an email with your order details and tracking information",
      icon: "📧",
      time: "Within 5 minutes"
    },
    {
      step: "2",
      title: "Quality Check",
      description: "Our experts carefully inspect and prepare your jewelry for shipping",
      icon: "🔍",
      time: "1-2 business days"
    },
    {
      step: "3",
      title: "Secure Packaging",
      description: "Your jewelry is packaged with premium materials for safe delivery",
      icon: "📦",
      time: "2-3 business days"
    },
    {
      step: "4",
      title: "On the Way",
      description: "Your order ships and you'll receive tracking details via email",
      icon: "🚚",
      time: "3-7 business days"
    }
  ];

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center">
      <motion.div
        className="max-w-4xl mx-auto px-4 py-12"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center">
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 150 }}
            className="mb-12"
          >
            <div className="relative">
              <div className="w-32 h-32 mx-auto bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl">
                <motion.svg
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="w-16 h-16 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <motion.path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </motion.svg>
              </div>
              {/* Celebration particles */}
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute -top-4 -right-4 text-3xl"
              >
                ✨
              </motion.div>
              <motion.div
                animate={{ 
                  rotate: [360, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 2.5, 
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute -bottom-4 -left-4 text-3xl"
              >
                🎉
              </motion.div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-primary border border-accent rounded-3xl p-12 shadow-2xl mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent mb-6">
              Thank You! 🎉
            </h1>
            
            <p className="text-2xl text-primary mb-8">
              Your order has been successfully placed!
            </p>

            {/* Order Details */}
            <div className="bg-secondary rounded-2xl p-8 mb-10 border border-accent">
              <h2 className="text-2xl font-bold text-primary mb-6">Order Confirmation</h2>
              <div className="grid gap-6 md:grid-cols-3 text-left">
                <div className="text-center md:text-left">
                  <div className="text-3xl mb-2">📋</div>
                  <div className="text-sm text-secondary mb-1">Order Number</div>
                  <div className="text-xl font-bold text-primary">#{orderNumber}</div>
                </div>
                <div className="text-center md:text-left">
                  <div className="text-3xl mb-2">🚚</div>
                  <div className="text-sm text-secondary mb-1">Estimated Delivery</div>
                  <div className="text-xl font-bold text-primary">5-7 Business Days</div>
                </div>
                <div className="text-center md:text-left">
                  <div className="text-3xl mb-2">📧</div>
                  <div className="text-sm text-secondary mb-1">Tracking Info</div>
                  <div className="text-xl font-bold text-primary">Via Email</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <span className="text-xl">✨</span>
                  Continue Shopping
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/orders"
                  className="inline-flex items-center gap-3 px-10 py-4 bg-primary border-2 border-yellow-500 text-primary hover:bg-yellow-500 hover:text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <span className="text-xl">📦</span>
                  Track Your Order
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* What Happens Next */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-primary mb-10">What Happens Next?</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {nextSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  className="bg-primary border border-accent rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-4 mx-auto">
                      {step.step}
                    </div>
                    <div className="text-3xl mb-4">{step.icon}</div>
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-3">{step.title}</h3>
                  <p className="text-sm text-secondary mb-3 leading-relaxed">{step.description}</p>
                  <div className="text-xs text-yellow-600 font-semibold bg-yellow-500/10 px-3 py-1 rounded-full">
                    {step.time}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Support and Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="grid gap-6 md:grid-cols-2 mb-12"
          >
            <div className="bg-primary border border-accent rounded-2xl p-8 shadow-lg">
              <div className="text-3xl mb-4">🛠️</div>
              <h3 className="text-xl font-bold text-primary mb-4">Need Help?</h3>
              <p className="text-secondary mb-6">
                Our customer support team is available 24/7 to assist you with any questions or concerns about your order.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-yellow-600 hover:text-yellow-700 font-semibold transition-colors duration-300"
              >
                Get Support →
              </Link>
            </div>

            <div className="bg-primary border border-accent rounded-2xl p-8 shadow-lg">
              <div className="text-3xl mb-4">💎</div>
              <h3 className="text-xl font-bold text-primary mb-4">Quality Promise</h3>
              <p className="text-secondary mb-6">
                Every piece comes with our 30-day satisfaction guarantee. If you're not completely happy, we'll make it right.
              </p>
              <Link
                href="/terms"
                className="inline-flex items-center gap-2 text-yellow-600 hover:text-yellow-700 font-semibold transition-colors duration-300"
              >
                Learn More →
              </Link>
            </div>
          </motion.div>

          {/* Social Share */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="text-center"
          >
            <p className="text-secondary mb-6 text-lg">Share your excitement with friends!</p>
            <div className="flex justify-center gap-4">
              {/*
                { icon: "📘", color: "bg-blue-500 hover:bg-blue-600" },
                { icon: "📷", color: "bg-pink-500 hover:bg-pink-600" },
                { icon: "🐦", color: "bg-blue-400 hover:bg-blue-500" }
              */}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
