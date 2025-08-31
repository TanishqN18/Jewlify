'use client';

import { Toaster } from 'sonner';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PageWrapper from '../../components/PageWrapper';

export default function ClientShell({ children }) {
  return (
    <div className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <Toaster position="top-center" />
      <Navbar />
      <PageWrapper>{children}</PageWrapper>
      <Footer />
    </div>
  );
}
