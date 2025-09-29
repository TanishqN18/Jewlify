'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FaBell, FaChartPie, FaBoxes, FaShoppingCart, FaUsers, FaStar, FaCog, FaBars, FaTimes } from 'react-icons/fa';

function AurezaLogo({ className = 'h-8 w-8 text-gold' }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <rect x="8" y="8" width="48" height="48" rx="12" ry="12" fill="none" stroke="currentColor" strokeWidth="4" />
      <path d="M32 18c8 6 12 12 12 18 0 8-6 12-12 12s-12-4-12-12c0-6 4-12 12-18zm0 10c-4 4-6 7-6 10 0 4 2 6 6 6s6-2 6-6c0-3-2-6-6-10z" fill="currentColor" />
    </svg>
  );
}

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const nav = [
    { id: 'dashboard', label: 'Dashboard', href: '/admin', icon: <FaChartPie /> },
    { id: 'products', label: 'Products', href: '/admin/items', icon: <FaBoxes /> },
    { id: 'orders', label: 'Orders', href: '/admin/orders', icon: <FaShoppingCart /> },
    { id: 'users', label: 'Users', href: '/admin/users', icon: <FaUsers /> },
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
          w-80 bg-secondary/95 backdrop-blur-xl shadow-2xl border-r border-white/10 flex-shrink-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          lg:relative fixed left-0 top-0 h-full z-50 lg:z-auto
          transition-all duration-300 hover:shadow-3xl flex flex-col
        `}>
          {/* Logo Section - Fixed */}
          <div className="p-8 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gold/20 rounded-xl">
                <AurezaLogo className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary">AUREZA</h1>
                <p className="text-sm text-secondary">Admin Portal</p>
              </div>
            </div>
          </div>

          {/* Navigation - Scrollable */}
          <nav className="flex-1 overflow-y-auto">
            <div className="px-8 py-6">
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
                      flex items-center px-6 py-4 mx-2 mb-3 rounded-xl transition-all duration-200
                      ${active 
                        ? 'bg-gradient-to-r from-gold/20 to-yellow-600/20 border-l-4 border-gold text-primary shadow-lg scale-105' 
                        : 'hover:bg-primary/20 text-secondary hover:text-primary hover:translate-x-2 hover:scale-105'
                      }
                    `}>
                      <span className={`w-6 flex-shrink-0 text-lg ${active ? 'text-gold' : ''}`}>{n.icon}</span>
                      <span className="ml-4 font-medium text-base">{n.label}</span>
                      {active && <div className="ml-auto w-3 h-3 bg-gold rounded-full shadow-lg"></div>}
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="px-8 py-4">
              <p className="text-xs font-bold text-secondary uppercase tracking-wider">System</p>
            </div>
            
            <div className="px-4 pb-8">
              <Link 
                href="/admin/settings"
                onClick={() => setSidebarOpen(false)}
              >
                <div className={`
                  flex items-center px-6 py-4 mx-2 mb-3 rounded-xl transition-all duration-200
                  ${isActive('/admin/settings')
                    ? 'bg-gradient-to-r from-gold/20 to-yellow-600/20 border-l-4 border-gold text-primary shadow-lg scale-105' 
                    : 'hover:bg-primary/20 text-secondary hover:text-primary hover:translate-x-2 hover:scale-105'
                  }
                `}>
                  <span className={`w-6 flex-shrink-0 text-lg ${isActive('/admin/settings') ? 'text-gold' : ''}`}><FaCog /></span>
                  <span className="ml-4 font-medium text-base">Settings</span>
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
