'use client';

import Link from 'next/link';
import { FaInstagram, FaFacebookF, FaTwitter, FaGem, FaEnvelope, FaPhone, FaMapMarkerAlt, FaHeart } from 'react-icons/fa';
import { SiRazorpay, SiVisa, SiMastercard, SiPaypal, SiGooglepay, SiApple } from 'react-icons/si';
import { motion } from 'framer-motion';
import AnimatedFooter from "../components/AnimatedFooter";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <footer className="bg-primary border-t border-yellow-200 dark:border-yellow-600/30 mt-auto transition-all duration-500 text-[15px]">
      <AnimatedFooter>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {/* Brand Section */}
            <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-md">
                    <FaGem className="text-white text-base" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-xl blur-md" />
                </div>
                <h3 className="text-xl font-extrabold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                  Jewelify
                </h3>
              </div>
              <p className="text-secondary text-[15px] leading-relaxed max-w-xs">
                Discover premium jewellery crafted with passion and precision.
              </p>
              {/* Contact Info */}
              <div className="space-y-2 text-secondary">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-secondary">
                    <FaEnvelope className="text-yellow-600 dark:text-yellow-400 text-xs" />
                  </div>
                  <span className="truncate">hello@jewelify.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-secondary">
                    <FaPhone className="text-yellow-600 dark:text-yellow-400 text-xs" />
                  </div>
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-secondary">
                    <FaMapMarkerAlt className="text-yellow-600 dark:text-yellow-400 text-xs" />
                  </div>
                  <span>123 Jewelry District, NY 10001</span>
                </div>
              </div>
              {/* Social Media */}
              <div className="flex space-x-2">
                { [
                  { icon: FaFacebookF, href: '#', color: 'hover:text-blue-500' },
                  { icon: FaInstagram, href: '#', color: 'hover:text-pink-500' },
                  { icon: FaTwitter, href: '#', color: 'hover:text-blue-400' },
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.08, y: -1 }}
                    whileTap={{ scale: 0.96 }}
                    className={`p-2 rounded-lg bg-secondary text-primary ${social.color} transition-all duration-300 group`}
                  >
                    <social.icon className="text-base group-hover:scale-110 transition-transform duration-300" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
            {/* Quick Links */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h4 className="text-base font-bold text-primary">Quick Links</h4>
              <div className="space-y-2">
                { [
                  { name: 'Home', href: '/' },
                  { name: 'Shop', href: '/shop' },
                  { name: 'About Us', href: '/about' },
                  { name: 'Contact', href: '/contact' },
                  { name: 'Size Guide', href: '/size-guide' },
                  { name: 'Care Instructions', href: '/care' },
                ].map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="block text-secondary hover:text-yellow-600 dark:hover:text-yellow-400 transition-all duration-300 group"
                  >
                    <span className="relative">
                      {link.name}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </Link>
                ))}
              </div>
            </motion.div>
            {/* Customer Service */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h4 className="text-base font-bold text-primary">Customer Care</h4>
              <div className="space-y-2">
                { [
                  { name: 'Help Center', href: '/help' },
                  { name: 'Shipping Info', href: '/shipping' },
                  { name: 'Returns & Exchanges', href: '/returns' },
                  { name: 'Warranty', href: '/warranty' },
                  { name: 'Track Your Order', href: '/track' },
                  { name: 'Live Support', href: '/support' },
                ].map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="block text-secondary hover:text-yellow-600 dark:hover:text-yellow-400 transition-all duration-300 group"
                  >
                    <span className="relative">
                      {link.name}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
          {/* Payment Methods */}
          <motion.div variants={itemVariants} className="mt-8">
            <div className="text-center mb-4">
              <h5 className="text-base font-semibold text-primary mb-2">Secure Payment Methods</h5>
              <div className="flex justify-center items-center gap-2 flex-wrap">
                { [
                  { icon: SiVisa, name: 'Visa' },
                  { icon: SiMastercard, name: 'Mastercard' },
                  { icon: SiPaypal, name: 'PayPal' },
                  { icon: SiRazorpay, name: 'Razorpay' },
                  { icon: SiGooglepay, name: 'Google Pay' },
                  { icon: SiApple, name: 'Apple Pay' },
                ].map((payment, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.08, y: -1 }}
                    className="p-2 rounded-md bg-secondary text-primary hover:text-yellow-600 dark:hover:text-yellow-400 transition-all duration-300"
                  >
                    <payment.icon className="text-xl" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="border-t border-yellow-200 dark:border-yellow-600/30 bg-secondary"
        >
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-3">
            <div className="flex flex-col md:flex-row justify-between items-center gap-2">
              <div className="flex items-center gap-1 text-secondary text-xs">
                <span>© {currentYear} Jewelify. Made with</span>
                <FaHeart className="text-red-500 text-xs animate-pulse" />
                <span>All rights reserved.</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-secondary">
                <Link href="/privacy" className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors duration-300">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors duration-300">
                  Terms of Service
                </Link>
                <Link href="/cookies" className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors duration-300">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatedFooter>
    </footer>
  );
}
