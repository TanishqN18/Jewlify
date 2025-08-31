'use client';

import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../../lib/firebase';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Reset email sent!');
      setEmail('');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-yellow-100 dark:from-gray-900 dark:to-black px-4 transition-all duration-500">
      <form
        onSubmit={handleReset}
        className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md space-y-5 animate-fadeIn"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-4xl font-extrabold text-yellow-600 dark:text-yellow-400 mb-2"
          >
            Jewelify
          </motion.div>
          <h1 className="text-xl font-semibold text-gray-700 dark:text-white">
            Reset your password
          </h1>
        </motion.div>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-3 rounded border focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-lg transition"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </motion.button>

        <div className="text-sm text-center mt-4 text-gray-600 dark:text-gray-400">
          <a href="/login" className="text-blue-500 hover:underline">
            Back to login
          </a>
        </div>
      </form>
    </div>
  );
}
