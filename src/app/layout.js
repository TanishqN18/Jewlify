import './globals.css';
import { ClerkProvider, SignedIn } from '@clerk/nextjs';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Script from 'next/script';
import SyncUserWithDB from '../../components/SyncUserWithDB'; 

export const metadata = {
  title: 'Jewelify – Elegant Jewellery Store',
  description: 'Explore premium jewellery crafted with love.',
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className="bg-[#fefcf8] text-slate-800 dark:bg-gray-950 dark:text-gray-200"
        suppressHydrationWarning
      >
        <head>
          {/* Razorpay SDK */}
          <Script
            src="https://checkout.razorpay.com/v1/checkout.js"
            strategy="beforeInteractive"
          />
        </head>
        <body className="bg-white text-black dark:bg-zinc-900 dark:text-white transition-colors duration-300 min-h-screen flex flex-col">
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SignedIn>
              <SyncUserWithDB />
            </SignedIn>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
