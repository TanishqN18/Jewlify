'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import useCartStore from '../components/store/cartStore';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import CartDrawer from './CartDrawer';
import {
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaMoon,
  FaSun,
  FaUser,
  FaChartLine,
} from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LiveMarketPrices from '../components/LiveMarketPrice';

export default function Navbar() {
  const { cart } = useCartStore();
  const { theme, setTheme } = useTheme();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [showMarketDropdown, setShowMarketDropdown] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const toggleMarketDropdown = () => setShowMarketDropdown(!showMarketDropdown);

  return (
    <nav className="w-full sticky top-0 z-50 backdrop-blur-md bg-gradient-to-br from-yellow-50 via-white to-yellow-100 dark:from-[#111111] dark:via-[#0f0f0f] dark:to-[#1c1c1c] transition-colors duration-500 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-extrabold text-yellow-500 hover:scale-105 transition-transform">
          Jewelify
        </Link>

        {/* Desktop + Mobile Common Nav */}
        <div className="hidden md:flex items-center gap-6 text-gray-800 dark:text-gray-200 relative">
          <Link href="/shop" className="hover:text-yellow-500 transition">Shop</Link>
          <Link href="/about" className="hover:text-yellow-500 transition">About</Link>
          <Link href="/contact" className="hover:text-yellow-500 transition">Contact</Link>

          {/* Live Market Prices Toggle */}
          <button
            onClick={toggleMarketDropdown}
            className="hover:text-yellow-500 transition text-xl"
            aria-label="Toggle Market Prices"
          >
            <FaChartLine />
          </button>

          {/* Dropdown for Live Market Prices */}
          <AnimatePresence>
          {showMarketDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="absolute top-14 right-0 w-72 rounded-lg shadow-xl z-50 backdrop-blur-lg bg-white/70 dark:bg-black/50 border dark:border-gray-700 p-4"
            >
              <LiveMarketPrices />
            </motion.div>
          )}
          </AnimatePresence>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-xl hover:text-yellow-500 transition"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <FaSun /> : <FaMoon />}
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative hover:text-yellow-500 transition"
            aria-label="Open Cart"
          >
            <FaShoppingCart className="text-xl" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full animate-bounce">
                {cart.length}
              </span>
            )}
          </button>

          <SignedIn>
          <div className="flex items-center gap-2">
            <UserButton afterSignOutUrl="/" />
            <Link href="/account" className="hover:text-yellow-500 transition">Account</Link>
          </div>
        </SignedIn>

        <SignedOut>
          <Link href="/sign-in" className="flex items-center gap-1 hover:text-yellow-500 transition">
            <FaUser />
            Login
          </Link>
        </SignedOut>
        </div>

        {/* Mobile Controls */}
        <div className="md:hidden flex items-center gap-4 text-gray-800 dark:text-gray-200">
          {/* Cart */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative hover:text-yellow-500 transition"
            aria-label="Open Cart"
          >
            <FaShoppingCart className="text-xl" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full animate-bounce">
                {cart.length}
              </span>
            )}
          </button>
            <button
              onClick={toggleMarketDropdown}
              className="text-left hover:text-yellow-500 transition flex items-center gap-2"
              aria-label="Toggle Market Prices"
            >
              <FaChartLine />
            </button>

          {/* Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-xl hover:text-yellow-500 transition"
            aria-label="Toggle Mobile Menu"
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="md:hidden px-4 py-6 flex flex-col gap-4 rounded-b-lg border-t dark:border-gray-700 text-gray-800 dark:text-gray-200 shadow-md backdrop-blur-lg bg-white/50 dark:bg-black/40 transition-all"
          >
            <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-yellow-500 transition">Shop</Link>
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-yellow-500 transition">About</Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-yellow-500 transition">Contact</Link>
           <SignedIn>
            <Link href="/account" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-yellow-500 transition">
              Account
            </Link>
          </SignedIn>

          <SignedOut>
            <Link href="/sign-in" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-yellow-500 transition">
              Login
            </Link>
          </SignedOut>

            {/* Live Market Toggle */}  
           <AnimatePresence>
            {showMarketDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-4 px-4 py-2 rounded-lg shadow-inner bg-white/70 dark:bg-black/50 border dark:border-gray-700 backdrop-blur-md text-sm text-gray-800 dark:text-gray-200
                  md:static absolute top-20 right-4 md:top-auto md:right-auto z-40 w-[90vw] md:w-auto flex-wrap md:flex-nowrap justify-between md:justify-start"
              >
                <LiveMarketPrices />
              </motion.div>
            )}
          </AnimatePresence>


            {/* Theme Toggle */}
            <button
              onClick={() => {
                setTheme(theme === 'dark' ? 'light' : 'dark');
                setIsMobileMenuOpen(false);
              }}
              className="hover:text-yellow-500 transition"
            >
              Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </nav>
  );
}
