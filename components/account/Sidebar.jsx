'use client';

import { useEffect, useState } from 'react';
import { useUser, UserButton } from '@clerk/nextjs';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLogOut, FiUser, FiShoppingBag, FiMapPin } from 'react-icons/fi';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function Sidebar({ activeTab, setActiveTab }) {
  const { user, isSignedIn } = useUser();
  const [mongoUser, setMongoUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isSignedIn) {
      axios
        .get('/api/users/get-user')
        .then((res) => setMongoUser(res.data))
        .catch((err) => console.error(err));
    }
  }, [isSignedIn]);

  const displayName = user?.fullName || mongoUser?.name || 'Guest';
  const displayImage =
    user?.imageUrl || mongoUser?.profileImage || '/default-avatar.png';

  const navItems = [
    { key: 'profile', label: 'Profile', icon: <FiUser /> },
    { key: 'orders', label: 'Orders', icon: <FiShoppingBag /> },
    { key: 'addresses', label: 'Addresses', icon: <FiMapPin /> },
  ];

  return (
    <>
      {/* Mobile Top Bar with Hamburger */}
      <div className="md:hidden flex justify-between items-center p-4 bg-gradient-to-r from-pink-400 to-purple-500 text-white">
        <h2 className="text-lg font-bold">Dashboard</h2>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="hidden md:flex bg-gradient-to-b from-purple-600/95 to-purple-900/95 dark:from-gray-900 dark:to-gray-800 w-64 p-6 flex-col justify-between rounded-2xl shadow-xl"
      >
        <div>
          {/* Profile */}
          <div className="flex flex-col items-center text-center mb-10">
            <motion.img
              whileHover={{ scale: 1.05 }}
              src={displayImage}
              alt={displayName}
              className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <h2 className="text-lg font-semibold mt-3 text-white">{displayName}</h2>
            <p className="text-sm text-gray-200">
              {user?.primaryEmailAddress?.emailAddress || mongoUser?.email}
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <button
                key={item.key}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === item.key
                    ? 'bg-white/20 text-white shadow-sm'
                    : 'text-gray-200 hover:bg-white/10 hover:text-white'
                }`}
                onClick={() => setActiveTab(item.key)}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Logout */}
        <div className="flex items-center justify-between mt-8 px-4 py-3 bg-white/10 rounded-xl shadow-sm">
          <UserButton afterSignOutUrl="/" />
          <span className="text-white text-sm flex items-center gap-2">
            <FiLogOut className="text-lg" /> Logout
          </span>
        </div>
      </motion.aside>

      {/* Mobile Sidebar (Animated Drawer) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-sidebar"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-purple-600/95 to-purple-900/95 dark:from-gray-900 dark:to-gray-800 text-white p-6 z-50 flex flex-col justify-between shadow-xl md:hidden"
          >
            <div>
              {/* Close Button */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold">Menu</h2>
                <button onClick={() => setIsOpen(false)}>
                  <FaTimes size={20} />
                </button>
              </div>

              {/* Profile */}
              <div className="flex flex-col items-center text-center mb-10">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  src={displayImage}
                  alt={displayName}
                  className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover"
                />
                <h2 className="text-lg font-semibold mt-3 text-white">{displayName}</h2>
                <p className="text-sm text-gray-200">
                  {user?.primaryEmailAddress?.emailAddress || mongoUser?.email}
                </p>
              </div>

              {/* Navigation */}
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <button
                    key={item.key}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === item.key
                        ? 'bg-white/20 text-white shadow-sm'
                        : 'text-gray-200 hover:bg-white/10 hover:text-white'
                    }`}
                    onClick={() => {
                      setActiveTab(item.key);
                      setIsOpen(false); // auto-close on mobile
                    }}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Logout */}
            <div className="flex items-center justify-between mt-8 px-4 py-3 bg-white/10 rounded-xl shadow-sm">
              <UserButton afterSignOutUrl="/" />
              <span className="text-white text-sm flex items-center gap-2">
                <FiLogOut className="text-lg" /> Logout
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
