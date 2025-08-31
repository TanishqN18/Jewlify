'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function ContactPage() {
  return (
    <motion.div
      className="max-w-3xl mx-auto px-4 py-12 text-gray-800 dark:text-white"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-4xl font-bold text-yellow-500 mb-6 text-center">Contact Us</h1>

      <p className="text-lg mb-6 text-center text-gray-600 dark:text-gray-300">
        Have questions, feedback, or need help with your order? We are here to help!
      </p>

      <form className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div>
          <label className="block font-medium mb-1">Your Name</label>
          <input
            type="text"
            className="w-full border px-4 py-2 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Your Email</label>
          <input
            type="email"
            className="w-full border px-4 py-2 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="john@example.com"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Message</label>
          <textarea
            rows="4"
            className="w-full border px-4 py-2 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Type your message here..."
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-md transition"
        >
          Send Message
        </button>
      </form>

      <div className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
        ✨ We will get back to you within 24–48 hours.
      </div>
    </motion.div>
  );
}
