'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-xl bg-secondary/50 backdrop-blur-sm animate-pulse" />
    );
  }

  const toggleTheme = () => {
    if (resolvedTheme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2.5 rounded-xl bg-secondary/80 backdrop-blur-xl hover:bg-secondary/90 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-500/20 shadow-lg hover:shadow-xl group"
      aria-label={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative w-5 h-5">
        {/* Sun Icon */}
        <svg 
          className={`absolute inset-0 w-5 h-5 transition-all duration-500 text-yellow-500 group-hover:text-yellow-400 ${
            resolvedTheme === 'light' 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 rotate-180 scale-0'
          }`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          strokeWidth={2.5}
        >
          <circle cx="12" cy="12" r="5"/>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
        
        {/* Moon Icon */}
        <svg 
          className={`absolute inset-0 w-5 h-5 transition-all duration-500 text-blue-400 group-hover:text-blue-300 ${
            resolvedTheme === 'dark' 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 -rotate-180 scale-0'
          }`}
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
        </svg>
      </div>
      
      {/* Subtle glow effect */}
      <div className={`absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none opacity-0 group-hover:opacity-100 ${
        resolvedTheme === 'light' 
          ? 'bg-gradient-to-r from-yellow-400/10 via-yellow-400/20 to-yellow-400/10'
          : 'bg-gradient-to-r from-blue-400/10 via-blue-400/20 to-blue-400/10'
      }`} />
    </button>
  );
}