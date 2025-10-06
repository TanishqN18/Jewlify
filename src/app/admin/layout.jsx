'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FaBell, FaChartPie, FaBoxes, FaShoppingCart, FaUsers, FaStar, FaCog, FaBars, FaTimes, FaCoins } from 'react-icons/fa';

// Replace this with your actual logo component or image
function NewLogo({ className }) {
  return (
    <img src="/Aureza.png" alt="Aureza Logo" className={className} /> // Update the path to your logo
  );
}

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState('light'); // Add theme state

  const nav = [
    { id: 'dashboard', label: 'Dashboard', href: '/admin', icon: <FaChartPie /> },
    { id: 'products', label: 'Products', href: '/admin/items', icon: <FaBoxes /> },
    { id: 'orders', label: 'Orders', href: '/admin/orders', icon: <FaShoppingCart /> },
    { id: 'users', label: 'Users', href: '/admin/users', icon: <FaUsers /> },
    { id: 'rates', label: 'Rates', href: '/admin/rates', icon: <FaCoins /> },
    { id: 'reviews', label: 'Reviews', href: '/admin/review', icon: <FaStar /> },
    { id: 'wishlist', label: 'Wishlist', href: '/admin/wishlisht', icon: <FaStar /> },
  ];

  const isActive = (href) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-primary">
      {/* Mobile menu button - Fixed position */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 bg-secondary text-primary p-3 rounded-xl shadow-lg border border-white/10 hover:bg-white/5 transition-colors"
      >
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Container - Fixed height for consistency */}
      <div className="flex h-screen overflow-hidden">
        
        {/* Sidebar - Fixed height with proper scrolling */}
        <aside className={`
          w-80 bg-secondary backdrop-blur-xl shadow-2xl border-r border-white/10 flex-shrink-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          lg:relative fixed left-0 top-0 h-full z-50 lg:z-auto
          transition-all duration-300 hover:shadow-3xl flex flex-col
        `}>
          {/* Logo Section - Fixed */}
          <div className="p-4 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl shadow-lg">
                <NewLogo className="h-10 w-10" /> {/* Use the new logo component */}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary transition-transform duration-300 hover:scale-105">AUREZA</h1>
                <p className="text-sm text-secondary">Admin Portal</p>
              </div>
            </div>
          </div>

          {/* Navigation - Scrollable */}
          <nav className="flex-1 overflow-y-auto">
            <div className="px-4 py-4">
              <p className="text-xs font-bold text-secondary uppercase tracking-wider">Main Navigation</p>
            </div>

            <div className="px-4 pb-4">
              {nav.map((n) => {
                const active = isActive(n.href);
                return (
                  <Link 
                    key={n.id} 
                    href={n.href}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <div className={`
                      flex items-center px-6 py-3 mx-2 mb-2 rounded-xl transition-all duration-200
                      ${active 
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-700 border-l-4 border-yellow-500 text-primary shadow-lg scale-105' 
                        : 'hover:bg-primary/20 text-secondary hover:text-primary hover:translate-x-2 hover:scale-105'
                      }
                    `}>
                      <span className={`
                        w-8 flex-shrink-0 text-lg bg-white rounded-full p-2 shadow-md
                        ${active ? 'text-yellow-600' : 'text-gray-600'}
                      `}>
                        {n.icon}
                      </span>
                      <span className="ml-4 font-medium text-sm">{n.label}</span>
                      {active && <div className="ml-auto w-3 h-3 bg-gold rounded-full shadow-lg"></div>}
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="px-4 py-2">
              <p className="text-xs font-bold text-secondary uppercase tracking-wider">System</p>
            </div>
            
            <div className="px-4 pb-4">
              <Link 
                href="/admin/settings"
                onClick={() => setSidebarOpen(false)}
              >
                <div className={`
                  flex items-center px-6 py-3 mx-2 mb-2 rounded-xl transition-all duration-200
                  ${isActive('/admin/settings')
                    ? 'bg-gradient-to-r from-gold/20 to-yellow-600/20 border-l-4 border-gold text-primary shadow-lg scale-105' 
                    : 'hover:bg-primary/20 text-secondary hover:text-primary hover:translate-x-2 hover:scale-105'
                  }
                `}>
                  <span className={`w-6 flex-shrink-0 text-lg ${isActive('/admin/settings') ? 'text-gold' : ''}`}><FaCog /></span>
                  <span className="ml-4 font-medium text-sm">Settings</span>
                  {isActive('/admin/settings') && <div className="ml-auto w-3 h-3 bg-gold rounded-full shadow-lg"></div>}
                </div>
              </Link>
            </div>
          </nav>
        </aside>

        {/* Main Content - Takes full remaining height */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Content Area - Direct content without extra header */}
          <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto h-full">
              <div className="bg-secondary/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/10 p-6 lg:p-8 h-full hover:shadow-2xl transition-shadow duration-300">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
