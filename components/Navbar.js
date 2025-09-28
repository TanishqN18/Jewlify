"use client";

import Link from "next/link";
import useCartStore from "../components/store/cartStore";
import { SignedIn, SignedOut, useUser, useClerk } from "@clerk/nextjs";
import CartDrawer from "./CartDrawer";
import {
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaUser,
  FaChartLine,
  FaGem,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LiveMarketPrices from "../components/LiveMarketPrice";
import ThemeToggle from "../components/ThemeToggle";
import Image from "next/image";

// Safe Image Component with fallback
function SafeImage({ src, alt, width, height, className }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  return (
    <>
      {!hasError && imgSrc ? (
        <Image
          src={imgSrc}
          alt={alt}
          width={width}
          height={height}
          className={className}
          onError={() => setHasError(true)}
          priority={false}
        />
      ) : (
        <div className={`${className} bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center`}>
          <FaUser className="text-white text-sm" />
        </div>
      )}
    </>
  );
}

// Profile Dropdown Component
function ProfileDropdown({ open, onClose, user, signOut }) {
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute top-full right-0 mt-2 w-80 bg-primary backdrop-blur-xl shadow-2xl border border-yellow-200 dark:border-yellow-600/30 rounded-2xl overflow-hidden z-50"
        >
          {/* Header */}
          <div className="p-6 bg-gradient-to-br from-yellow-500/10 via-yellow-600/5 to-transparent border-b border-yellow-200 dark:border-yellow-600/30">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-xl overflow-hidden ring-4 ring-yellow-500/30">
                  <SafeImage
                    src={user?.imageUrl}
                    alt="Profile"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-primary flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold text-primary">
                  {user?.fullName || user?.firstName || "User"}
                </h4>
                <p className="text-sm text-secondary">
                  {user?.primaryEmailAddress?.emailAddress || "No email"}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-4 space-y-2">
            <Link
              href="/account"
              className="group flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium text-primary bg-secondary hover:bg-yellow-100 dark:hover:bg-yellow-900/30 hover:text-yellow-600 dark:hover:text-yellow-400 transition-all duration-300 border border-yellow-200 dark:border-yellow-600/30 hover:border-yellow-500/50"
              onClick={onClose}
            >
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:bg-yellow-100 dark:group-hover:bg-yellow-900/30 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-all duration-300">
                <FaCog className="text-sm" />
              </div>
              <div>
                <div className="font-semibold text-sm">Account Settings</div>
                <div className="text-xs text-secondary">
                  Manage your profile
                </div>
              </div>
            </Link>

            <button
              onClick={() => {
                signOut();
                onClose();
              }}
              className="group flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-red-500/25"
            >
              <div className="p-2 rounded-lg bg-white/20 group-hover:bg-white/30 transition-all duration-300">
                <FaSignOutAlt className="text-sm" />
              </div>
              <div>
                <div className="font-semibold text-sm">Sign Out</div>
                <div className="text-xs text-red-100">
                  End your session
                </div>
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-yellow-200 dark:border-yellow-600/30 bg-secondary">
            <div className="text-center">
              <p className="text-xs text-secondary">
                Auraza © 2024
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Navbar() {
  const { cart } = useCartStore();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [showMarketDropdown, setShowMarketDropdown] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) {
    return (
      <nav className="w-full sticky top-0 z-50 backdrop-blur-xl bg-primary shadow-lg transition-all duration-300 border-b border-yellow-200 dark:border-yellow-600/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-500 rounded-xl animate-pulse"></div>
            <div className="text-2xl font-extrabold text-yellow-500">Auraza</div>
          </div>
          <div className="w-6 h-6 bg-secondary rounded animate-pulse"></div>
        </div>
      </nav>
    );
  }

  const toggleMarketDropdown = () => setShowMarketDropdown(!showMarketDropdown);

  const navLinkClass =
    "relative px-4 py-2 rounded-xl font-medium text-primary transition-all duration-300 hover:bg-secondary hover:text-yellow-600 dark:hover:text-yellow-400 group";
  const iconButtonClass =
    "relative p-2.5 rounded-xl bg-secondary hover:bg-yellow-100 dark:hover:bg-yellow-900/30 text-primary transition-all duration-300 group";

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-full sticky top-0 z-50 backdrop-blur-xl transition-all duration-500 border-b border-yellow-200 dark:border-yellow-600/30 ${
        scrolled
          ? "bg-primary shadow-2xl py-2"
          : "bg-primary shadow-lg py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/"
              className="flex items-center gap-3 group"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-yellow-500/25 transition-all duration-300">
                  <FaGem className="text-white text-lg" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              </div>
              <span className="text-2xl font-extrabold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent group-hover:from-yellow-300 group-hover:via-yellow-400 group-hover:to-yellow-500 transition-all duration-300">
                Auraza
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 relative">
            {/* Navigation Links */}
            <motion.div
              className="flex items-center gap-1 bg-primary backdrop-blur-sm rounded-2xl p-1 border border-yellow-200 dark:border-yellow-600/30"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Link href="/shop" className={navLinkClass}>
                <span>Shop</span>
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-yellow-500 rounded-full group-hover:w-8 transition-all duration-300" />
              </Link>
              <Link href="/about" className={navLinkClass}>
                <span>About</span>
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-yellow-500 rounded-full group-hover:w-8 transition-all duration-300" />
              </Link>
              <Link href="/contact" className={navLinkClass}>
                <span>Contact</span>
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-yellow-500 rounded-full group-hover:w-8 transition-all duration-300" />
              </Link>
            </motion.div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 ml-4">
              {/* Market Prices Button */}
              <motion.button
                onClick={toggleMarketDropdown}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={iconButtonClass}
                aria-label="Toggle Market Prices"
              >
                <FaChartLine className="text-lg group-hover:text-green-500 transition-colors duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/10 to-green-400/0 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none" />
              </motion.button>

              <ThemeToggle />

              {/* Cart Button */}
              <motion.button
                onClick={() => setCartOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={iconButtonClass}
                aria-label="Open Cart"
              >
                <FaShoppingCart className="text-lg group-hover:text-red-500 transition-colors duration-300" />
                {cart.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg min-w-[1.5rem] h-6 flex items-center justify-center"
                  >
                    {cart.length}
                  </motion.span>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-red-400/0 via-red-400/10 to-red-400/0 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none" />
              </motion.button>

              {/* Profile Dropdown */}
              <SignedIn>
                <div className="relative">
                  <motion.button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="ml-2 relative group"
                    aria-label="Open Profile Menu"
                  >
                    <div className="p-1 rounded-xl bg-secondary hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-all duration-300">
                      <div className="w-8 h-8 rounded-lg overflow-hidden ring-2 ring-yellow-500/20 group-hover:ring-yellow-500/40 transition-all duration-300">
                        <SafeImage
                          src={user?.imageUrl}
                          alt="Profile"
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </motion.button>

                  <ProfileDropdown
                    open={profileDropdownOpen}
                    onClose={() => setProfileDropdownOpen(false)}
                    user={user}
                    signOut={signOut}
                  />
                </div>
              </SignedIn>

              <SignedOut>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/sign-in"
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-500 hover:from-yellow-600 hover:via-yellow-700 hover:to-yellow-600 text-white rounded-xl font-bold shadow-lg hover:shadow-yellow-500/25 transition-all duration-300"
                  >
                    <FaUser />
                    Login
                  </Link>
                </motion.div>
              </SignedOut>
            </div>

            {/* Market Dropdown */}
            <div className="absolute top-full right-0 mt-2 w-80 z-50">
              <LiveMarketPrices
                isOpen={showMarketDropdown}
                onClose={() => setShowMarketDropdown(false)}
              />
            </div>
          </div>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />

            {/* Mobile Cart */}
            <motion.button
              onClick={() => setCartOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 rounded-xl bg-secondary hover:bg-yellow-100 dark:hover:bg-yellow-900/30 text-primary transition-all duration-300"
              aria-label="Open Cart"
            >
              <FaShoppingCart className="text-lg" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold min-w-[1.25rem] h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </motion.button>

            <motion.button
              onClick={toggleMarketDropdown}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-xl bg-secondary hover:bg-yellow-100 dark:hover:bg-yellow-900/30 text-primary transition-all duration-300"
              aria-label="Toggle Market Prices"
            >
              <FaChartLine className="text-lg" />
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-xl bg-secondary hover:bg-yellow-100 dark:hover:bg-yellow-900/30 text-primary transition-all duration-300"
              aria-label="Toggle Mobile Menu"
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaTimes className="text-lg" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaBars className="text-lg" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-4 py-6 mt-4 bg-secondary backdrop-blur-sm rounded-2xl border border-yellow-200 dark:border-yellow-600/30 space-y-4">
                <Link
                  href="/shop"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl font-medium text-primary hover:bg-yellow-100 dark:hover:bg-yellow-900/30 hover:text-yellow-600 dark:hover:text-yellow-400 transition-all duration-300"
                >
                  Shop
                </Link>
                <Link
                  href="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl font-medium text-primary hover:bg-yellow-100 dark:hover:bg-yellow-900/30 hover:text-yellow-600 dark:hover:text-yellow-400 transition-all duration-300"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl font-medium text-primary hover:bg-yellow-100 dark:hover:bg-yellow-900/30 hover:text-yellow-600 dark:hover:text-yellow-400 transition-all duration-300"
                >
                  Contact
                </Link>

                <SignedIn>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 px-4 py-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-600/30">
                      <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-yellow-500/20">
                        <SafeImage
                          src={user?.imageUrl}
                          alt="Profile"
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-primary text-sm">
                          {user?.fullName || user?.firstName || "User"}
                        </div>
                        <div className="text-xs text-secondary">
                          {user?.primaryEmailAddress?.emailAddress || "No email"}
                        </div>
                      </div>
                    </div>

                    <Link
                      href="/account"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-primary hover:bg-yellow-100 dark:hover:bg-yellow-900/30 hover:text-yellow-600 dark:hover:text-yellow-400 transition-all duration-300"
                    >
                      <FaCog className="text-sm" />
                      Account Settings
                    </Link>

                    <button
                      onClick={() => {
                        signOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300"
                    >
                      <FaSignOutAlt className="text-sm" />
                      Sign Out
                    </button>
                  </div>
                </SignedIn>

                <SignedOut>
                  <Link
                    href="/sign-in"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center px-4 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl font-bold shadow-lg hover:shadow-yellow-500/25 transition-all duration-300"
                  >
                    Login
                  </Link>
                </SignedOut>

                {/* Mobile Market Prices */}
                <div className="w-full">
                  <LiveMarketPrices
                    isOpen={showMarketDropdown}
                    onClose={() => setShowMarketDropdown(false)}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </motion.nav>
  );
}