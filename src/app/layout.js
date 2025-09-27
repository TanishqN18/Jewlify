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
      <html lang="en" suppressHydrationWarning>
        <head>
          <Script
            src="https://checkout.razorpay.com/v1/checkout.js"
            strategy="beforeInteractive"
          />
        </head>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem={true}
            disableTransitionOnChange={false}
            storageKey="theme"
          >
            <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
              <SignedIn>
                <SyncUserWithDB />
              </SignedIn>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <Toaster
                theme="system"
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  className:
                    'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 shadow-lg',
                }}
              />
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
