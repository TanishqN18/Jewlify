'use client';

import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import ProfileForm from './ProfileForm';
import AddressBook from './AddressBook';
import OrdersSection from './OrdersSection';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

export default function ClientDashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await axios.get('/api/users/get-user');
        setUserData(res.data.user);
      } catch (err) {
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchUserData();
  }, []);

  if (loading) return <div className="p-8">Loading user data...</div>;

  const sectionVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -30, transition: { duration: 0.2 } },
  };

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} userData={userData} />
      <main className="flex-1 p-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={sectionVariants}
            className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-md p-6"
          >
            {activeTab === 'profile' && <ProfileForm userData={userData} />}
            {activeTab === 'addresses' && <AddressBook userId={userData?._id} />}
            {activeTab === 'orders' && <OrdersSection />}
            {activeTab === 'payment' && (
              <div className="p-6 text-gray-500 dark:text-gray-400">
                Payment Methods section coming soon.
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
