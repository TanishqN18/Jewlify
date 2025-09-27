"use client";

import { useEffect, useState } from "react";
import { useUser, UserButton, SignOutButton } from "@clerk/nextjs";
import axios from "axios";
import Image from "next/image";
import { FiUser, FiShoppingBag, FiMapPin, FiHeart, FiLogOut, FiMenu, FiX } from "react-icons/fi";

export default function Sidebar({ activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen }) {
  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);
  
  // Fallback mobile menu state if not provided by parent
  const [internalMobileMenu, setInternalMobileMenu] = useState(false);
  
  // Use parent's mobile menu state if available, otherwise use internal state
  const mobileMenuOpen = isMobileMenuOpen !== undefined ? isMobileMenuOpen : internalMobileMenu;
  const setMobileMenuOpen = setIsMobileMenuOpen || setInternalMobileMenu;

  useEffect(() => {
    async function fetchProfile() {
      if (!isLoaded || !user) return;
      
      // Set Clerk data immediately to prevent loading delay
      const clerkData = {
        name: user?.fullName || user?.firstName || "User",
        email: user?.primaryEmailAddress?.emailAddress || "",
        image: user?.imageUrl || "",
      };
      
      setProfile(clerkData);
      setLoading(false);
      
      // Then try to get enhanced data from DB
      try {
        const res = await axios.get("/api/users/get-user");
        const dbUser = res.data.user;
        if (dbUser) {
          setProfile({
            name: dbUser.name || clerkData.name,
            email: dbUser.email || clerkData.email,
            image: dbUser.profileImage || clerkData.image,
          });
        }
      } catch (error) {
        console.log("Using Clerk data as fallback");
        // Keep Clerk data if DB fetch fails
      }
    }
    
    fetchProfile();
  }, [isLoaded, user]);

  const navItems = [
    { key: "profile", label: "Profile", icon: <FiUser />, emoji: "👤" },
    { key: "orders", label: "Orders", icon: <FiShoppingBag />, emoji: "📦" },
    { key: "addresses", label: "Addresses", icon: <FiMapPin />, emoji: "📍" },
    { key: "wishlist", label: "Wishlist", icon: <FiHeart />, emoji: "❤️" },
  ];

  const handleNavClick = (key) => {
    setActiveTab(key);
    setMobileMenuOpen(false); // Close mobile menu when item is selected
  };

  return (
    <>
      {/* Mobile Menu Button - Show only if not controlled by parent */}
      {isMobileMenuOpen === undefined && (
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden fixed top-20 left-4 z-[60] bg-white p-3 rounded-full shadow-lg border-2 border-yellow-500 hover:bg-yellow-50 transition-colors"
        >
          {mobileMenuOpen ? (
            <FiX size={20} className="text-yellow-600" />
          ) : (
            <FiMenu size={20} className="text-yellow-600" />
          )}
        </button>
      )}

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:relative top-0 left-0 z-50 md:z-auto
        flex flex-col bg-secondary 
        w-72 md:w-56 lg:w-64
        p-4 md:p-6 
        rounded-none md:rounded-2xl 
        shadow-2xl border-r md:border border-accent 
        min-h-screen md:min-h-[75vh] 
        justify-between
        transform transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        
        {/* Mobile Close Button inside sidebar */}
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden self-end mb-2 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FiX size={20} />
        </button>

        {/* Top Profile Section */}
        <div>
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative">
              {loading ? (
                <div className="w-14 h-14 bg-gray-200 rounded-full animate-pulse border-2 border-yellow-500" />
              ) : (
                <Image
                  src={profile.image || "/default-avatar.png"}
                  alt={profile.name}
                  width={56}
                  height={56}
                  className="rounded-full border-2 border-yellow-500 shadow-md object-cover"
                  priority
                  onError={(e) => {
                    e.target.src = "/default-avatar.png";
                  }}
                />
              )}
              <span className="absolute -bottom-1 -right-1 bg-yellow-500 text-white w-5 h-5 rounded-full text-xs font-bold shadow flex items-center justify-center">
                {profile.name?.charAt(0) || "U"}
              </span>
            </div>
            <h2 className="text-base font-bold text-primary mt-2 truncate w-full px-2">
              {loading ? (
                <div className="h-4 bg-gray-200 rounded animate-pulse w-20 mx-auto" />
              ) : (
                profile.name || "User"
              )}
            </h2>
            <p className="text-xs text-secondary truncate w-full px-2">
              {loading ? (
                <div className="h-3 bg-gray-200 rounded animate-pulse w-28 mx-auto mt-1" />
              ) : (
                profile.email
              )}
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.key}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === item.key
                    ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-700 shadow-sm border border-yellow-200"
                    : "text-secondary hover:bg-yellow-500/10 hover:text-yellow-700"
                }`}
                onClick={() => handleNavClick(item.key)}
              >
                <span className="text-lg">{item.emoji}</span>
                <span className="truncate">{item.label}</span>
                {activeTab === item.key && (
                  <span className="ml-auto w-2 h-2 bg-yellow-500 rounded-full" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="space-y-2">
          {/* UserButton Section */}
          <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 px-3 py-2 rounded-lg border border-yellow-200/50">
            <UserButton 
              afterSignOutUrl="/" 
              appearance={{
                elements: {
                  avatarBox: "w-5 h-5"
                }
              }}
            />
            <span className="text-primary font-medium text-xs">Account</span>
          </div>

          {/* Logout Button */}
          <SignOutButton redirectUrl="/">
            <button className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors duration-200 shadow-md hover:shadow-lg">
              <FiLogOut size={14} />
              <span>Logout</span>
            </button>
          </SignOutButton>
        </div>
      </aside>
    </>
  );
}
