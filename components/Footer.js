'use client';

import Link from 'next/link';
import { FaInstagram, FaFacebookF, FaTwitter } from 'react-icons/fa';
import { SiRazorpay, SiStripe, SiPaypal } from 'react-icons/si';
import { motion } from 'framer-motion';
import AnimatedFooter from "../components/AnimatedFooter";

export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-gray-300 px-4 sm:px-6 md:px-12 py-8">
      <AnimatedFooter>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto space-y-8"
        >

          {/* Quick Links */}
          <div>
            <h2 className="text-center text-lg font-semibold text-gold mb-4">Quick Links</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-sm text-center sm:text-left">
              {[
                ["Shop", "/shop"],
                ["Orders", "/orders"],
                ["About", "/about"],
                ["Wishlist", "/wishlist"],
                ["Contact", "/contact"],
                ["Support", "/support"],
                ["Account", "/account"],
                ["FAQ", "/faq"]
              ].map(([label, href]) => (
                <Link key={href} href={href} className="hover:text-gold transition-colors">{label}</Link>
              ))}
            </div>
          </div>

          {/* Newsletter & Social */}
          <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-6 border-t border-zinc-800 pt-6">
            
            {/* Newsletter */}
            <div className="w-full md:w-1/2 text-center md:text-left">
              <p className="text-sm mb-2">Subscribe to our Newsletter</p>
              <div className="flex max-w-md mx-auto md:mx-0">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 rounded-l bg-zinc-800 text-white border border-zinc-700 focus:outline-none"
                />
                <button className="bg-gold text-black px-4 py-2 rounded-r hover:bg-yellow-500 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex justify-center md:justify-end w-full md:w-1/2 space-x-4 text-lg">
              <a href="#" className="text-gold hover:scale-110 transition-transform"><FaInstagram /></a>
              <a href="#" className="text-gold hover:scale-110 transition-transform"><FaFacebookF /></a>
              <a href="#" className="text-gold hover:scale-110 transition-transform"><FaTwitter /></a>
            </div>
          </div>

          {/* Payment Icons */}
          <div className="flex justify-center gap-6 text-2xl text-white">
            <SiStripe />
            <SiRazorpay />
            <SiPaypal />
          </div>

          {/* Terms and Bottom Links */}
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400 border-t border-zinc-800 pt-4">
            <Link href="/terms" className="hover:text-gold transition">Terms</Link>
            <Link href="/privacy" className="hover:text-gold transition">Privacy</Link>
            <Link href="/careers" className="hover:text-gold transition">Careers</Link>
          </div>

          {/* Copyright */}
          <p className="text-center text-xs text-gray-500">
            © {new Date().getFullYear()} Jewelify. All rights reserved.
          </p>
        </motion.div>
      </AnimatedFooter>
    </footer>
  );
}
