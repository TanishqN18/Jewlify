"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";

const ProfileForm = () => {
  const { user, isLoaded } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch Clerk user profile and MongoDB user data
  useEffect(() => {
    if (isLoaded && user) {
      setForm({
        name: user.fullName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
        phone: user.phoneNumbers?.[0]?.phoneNumber || "",
        gender: "",
        dob: "",
        image: user.imageUrl || "",
      });
      // Optionally, fetch extended profile from your API
      axios.get("/api/users/get-user").then((res) => {
        const dbUser = res.data.user;
        if (dbUser) {
          setForm((prev) => ({
            ...prev,
            phone: dbUser.phone || prev.phone,
            gender: dbUser.gender || "",
            dob: dbUser.dob ? dbUser.dob.substring(0, 10) : "",
            image: dbUser.profileImage || prev.image,
          }));
        }
      }).catch((error) => {
        console.log("Could not fetch user data from DB:", error);
      });
    }
  }, [isLoaded, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user?.id) {
      alert("User not authenticated");
      return;
    }

    setLoading(true);
    try {
      // Include clerkId in the request
      const updateData = {
        ...form,
        clerkId: user.id, // Add the clerkId from Clerk user
      };

      const response = await axios.put("/api/users/update-user", updateData);
      console.log("Profile updated successfully:", response.data);
      setIsEditing(false);
      
      // Show success message like address section
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Could not update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col relative">
      {/* Simple Success Message */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2"
          >
            <span className="text-lg">✅</span>
            <span className="font-medium">Profile updated successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl md:text-2xl font-bold text-primary flex items-center gap-2"
        >
          <span className="text-xl md:text-2xl">👤</span>
          Profile
        </motion.h1>
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsEditing(!isEditing)}
          className={`px-3 md:px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 text-xs md:text-sm ${
            isEditing ? "from-gray-500 to-gray-600" : ""
          }`}
        >
          <span>{isEditing ? "❌" : "✏️"}</span>
          {isEditing ? "Cancel" : "Edit Profile"}
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {!isEditing ? (
          // Read-only View - Full Width and Height
          <motion.div
            key="view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-secondary rounded-xl shadow-lg border border-accent overflow-hidden flex-1 flex flex-col"
          >
            {/* Top Section - Profile Image & Basic Info */}
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-4 md:p-6 border-b border-accent">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
                {/* Profile Image */}
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="relative flex-shrink-0"
                >
                  <Image
                    src={form.image || "/default-avatar.png"}
                    alt="user avatar"
                    width={100}
                    height={100}
                    className="rounded-full object-cover border-3 border-yellow-500 shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </motion.div>

                {/* Basic Info */}
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-lg md:text-xl font-bold text-primary mb-1">
                    {form.name || "User"}
                  </h2>
                  <p className="text-sm text-secondary mb-3">
                    {form.email}
                  </p>
                  
                  {/* Quick Stats */}
                  <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                      <span className="text-blue-600 text-sm">📦</span>
                      <span className="text-blue-700 font-semibold text-sm">12 Orders</span>
                    </div>
                    <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                      <span className="text-green-600 text-sm">❤️</span>
                      <span className="text-green-700 font-semibold text-sm">5 Wishlist</span>
                    </div>
                    <div className="flex items-center gap-2 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                      <span className="text-purple-600 text-sm">📍</span>
                      <span className="text-purple-700 font-semibold text-sm">3 Addresses</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details Grid - Full Height Remaining */}
            <div className="p-4 md:p-6 flex-1 flex flex-col">
              {/* Main Profile Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
                {/* Full Name Card */}
                <motion.div 
                  whileHover={{ y: -2, scale: 1.02 }}
                  className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200 shadow-sm h-24 flex flex-col justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">👤</span>
                    </div>
                    <label className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                      Full Name
                    </label>
                  </div>
                  <p className="text-base font-bold text-blue-900 mt-2">
                    {form.name || "Not specified"}
                  </p>
                </motion.div>

                {/* Email Card */}
                <motion.div 
                  whileHover={{ y: -2, scale: 1.02 }}
                  className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200 shadow-sm h-24 flex flex-col justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">📧</span>
                    </div>
                    <label className="text-xs font-semibold text-green-700 uppercase tracking-wide">
                      Email Address
                    </label>
                  </div>
                  <p className="text-sm font-medium text-green-900 truncate mt-2">
                    {form.email || "Not specified"}
                  </p>
                </motion.div>

                {/* Phone Card */}
                <motion.div 
                  whileHover={{ y: -2, scale: 1.02 }}
                  className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200 shadow-sm h-24 flex flex-col justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">📱</span>
                    </div>
                    <label className="text-xs font-semibold text-purple-700 uppercase tracking-wide">
                      Phone Number
                    </label>
                  </div>
                  <p className="text-base font-bold text-purple-900 mt-2">
                    {form.phone || "Not specified"}
                  </p>
                </motion.div>

                {/* Gender Card */}
                <motion.div 
                  whileHover={{ y: -2, scale: 1.02 }}
                  className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200 shadow-sm h-24 flex flex-col justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">⚧️</span>
                    </div>
                    <label className="text-xs font-semibold text-orange-700 uppercase tracking-wide">
                      Gender
                    </label>
                  </div>
                  <p className="text-base font-bold text-orange-900 capitalize mt-2">
                    {form.gender || "Not specified"}
                  </p>
                </motion.div>

                {/* Date of Birth Card */}
                <motion.div 
                  whileHover={{ y: -2, scale: 1.02 }}
                  className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-4 border border-pink-200 shadow-sm h-24 flex flex-col justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">🎂</span>
                    </div>
                    <label className="text-xs font-semibold text-pink-700 uppercase tracking-wide">
                      Date of Birth
                    </label>
                  </div>
                  <p className="text-sm font-bold text-pink-900 mt-2">
                    {form.dob ? new Date(form.dob).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    }) : "Not specified"}
                  </p>
                </motion.div>

                {/* Account Status Card */}
                <motion.div 
                  whileHover={{ y: -2, scale: 1.02 }}
                  className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 border border-emerald-200 shadow-sm h-24 flex flex-col justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">🛡️</span>
                    </div>
                    <label className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
                      Account Status
                    </label>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <p className="text-sm font-bold text-emerald-900">
                      Active & Verified
                    </p>
                  </div>
                </motion.div>

                {/* Member Since Card */}
                <motion.div 
                  whileHover={{ y: -2, scale: 1.02 }}
                  className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 border border-indigo-200 shadow-sm h-24 flex flex-col justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">📅</span>
                    </div>
                    <label className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">
                      Member Since
                    </label>
                  </div>
                  <p className="text-base font-bold text-indigo-900 mt-2">
                    January 2024
                  </p>
                </motion.div>

                {/* Profile Completion Card */}
                <motion.div 
                  whileHover={{ y: -2, scale: 1.02 }}
                  className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-4 border border-teal-200 shadow-sm h-24 flex flex-col justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">📊</span>
                    </div>
                    <label className="text-xs font-semibold text-teal-700 uppercase tracking-wide">
                      Profile Complete
                    </label>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 bg-teal-200 rounded-full h-2">
                      <div className="bg-teal-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <span className="text-sm font-bold text-teal-900">85%</span>
                  </div>
                </motion.div>
              </div>

              {/* Additional Info Section - Full Width Bottom */}
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {/* Account Activity */}
                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl p-4 border border-indigo-200 h-full"
                >
                  <h3 className="text-sm font-bold text-indigo-900 mb-3 flex items-center gap-2">
                    <span className="text-lg">📊</span>
                    Account Activity
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-indigo-700">Member since:</span>
                      <span className="font-semibold text-indigo-900">January 2024</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-indigo-700">Last login:</span>
                      <span className="font-semibold text-indigo-900">Today</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-indigo-700">Total orders:</span>
                      <span className="font-semibold text-indigo-900">12</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-indigo-700">Total spent:</span>
                      <span className="font-semibold text-indigo-900">$2,450</span>
                    </div>
                  </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200 h-full"
                >
                  <h3 className="text-sm font-bold text-amber-900 mb-3 flex items-center gap-2">
                    <span className="text-lg">⚡</span>
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    <button className="bg-white hover:bg-amber-50 text-amber-700 text-xs font-medium py-2 px-3 rounded-lg border border-amber-300 transition-colors flex items-center gap-2">
                      <span>🔐</span> Change Password
                    </button>
                    <button className="bg-white hover:bg-amber-50 text-amber-700 text-xs font-medium py-2 px-3 rounded-lg border border-amber-300 transition-colors flex items-center gap-2">
                      <span>🔔</span> Notification Settings
                    </button>
                    <button className="bg-white hover:bg-amber-50 text-amber-700 text-xs font-medium py-2 px-3 rounded-lg border border-amber-300 transition-colors flex items-center gap-2">
                      <span>🎨</span> Theme Preferences
                    </button>
                    <button className="bg-white hover:bg-amber-50 text-amber-700 text-xs font-medium py-2 px-3 rounded-lg border border-amber-300 transition-colors flex items-center gap-2">
                      <span>🗑️</span> Delete Account
                    </button>
                  </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  className="bg-gradient-to-r from-rose-50 to-rose-100 rounded-xl p-4 border border-rose-200 h-full lg:col-span-2 xl:col-span-1"
                >
                  <h3 className="text-sm font-bold text-rose-900 mb-3 flex items-center gap-2">
                    <span className="text-lg">🕒</span>
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-rose-800 font-medium">Profile updated</p>
                        <p className="text-rose-600 text-xs">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-rose-800 font-medium">New order placed</p>
                        <p className="text-rose-600 text-xs">1 day ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-rose-800 font-medium">Address added</p>
                        <p className="text-rose-600 text-xs">3 days ago</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ) : (
          // Enhanced Editable Form - Full Width and Height
          <motion.form
            key="edit"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-secondary rounded-xl shadow-lg border border-accent overflow-hidden flex-1 flex flex-col"
            onSubmit={handleSave}
          >
            {/* Form Header */}
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-4 md:p-6 border-b border-accent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">✏️</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-primary">Edit Profile Information</h2>
                  <p className="text-sm text-secondary">Update your personal details below</p>
                </div>
              </div>
            </div>

            <div className="p-4 md:p-6 flex-1 flex flex-col">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 flex-1">
                {/* Profile Image Section */}
                <div className="lg:col-span-1">
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200 h-full">
                    <h3 className="text-sm font-bold text-yellow-800 mb-4 text-center">Profile Photo</h3>
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="relative">
                        <Image
                          src={form.image || "/default-avatar.png"}
                          alt="user avatar"
                          width={120}
                          height={120}
                          className="rounded-full object-cover border-3 border-yellow-500 shadow-lg"
                        />
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          type="button"
                          className="absolute -bottom-2 -right-2 w-10 h-10 bg-yellow-500 hover:bg-yellow-600 rounded-full border-3 border-white flex items-center justify-center shadow-lg"
                        >
                          <span className="text-white text-sm">📷</span>
                        </motion.button>
                      </div>
                      <p className="text-xs text-yellow-700 mt-3 text-center font-medium">
                        Click camera to upload new photo
                      </p>
                      <div className="mt-3 text-center">
                        <p className="text-xs text-yellow-600">Recommended:</p>
                        <p className="text-xs text-yellow-500">Square image, min 200×200px</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="lg:col-span-4 flex flex-col space-y-6">
                  {/* Personal Information */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200 flex-1">
                    <h3 className="text-sm font-bold text-blue-900 mb-4 flex items-center gap-2">
                      <span className="text-lg">👤</span>
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
                      {/* Full Name */}
                      <div>
                        <label className="text-xs font-bold text-blue-800 uppercase tracking-wide flex items-center gap-1 mb-2">
                          <span>📝</span> Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl bg-white text-blue-900 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-sm font-medium placeholder-blue-400 transition-all"
                          placeholder="Enter your full name"
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="text-xs font-bold text-blue-800 uppercase tracking-wide flex items-center gap-1 mb-2">
                          <span>📱</span> Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl bg-white text-blue-900 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-sm font-medium placeholder-blue-400 transition-all"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>

                      {/* Email (Read-only) */}
                      <div>
                        <label className="text-xs font-bold text-blue-800 uppercase tracking-wide flex items-center gap-1 mb-2">
                          <span>📧</span> Email Address
                        </label>
                        <input
                          type="email"
                          value={form.email}
                          disabled
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-600 text-sm font-medium"
                          placeholder="Email cannot be changed"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200 flex-1">
                    <h3 className="text-sm font-bold text-purple-900 mb-4 flex items-center gap-2">
                      <span className="text-lg">ℹ️</span>
                      Additional Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Gender */}
                      <div>
                        <label className="text-xs font-bold text-purple-800 uppercase tracking-wide flex items-center gap-1 mb-2">
                          <span>⚧️</span> Gender
                        </label>
                        <select
                          name="gender"
                          value={form.gender}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl bg-white text-purple-900 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-sm font-medium transition-all"
                        >
                          <option value="">Select Gender</option>
                          <option value="female">👩 Female</option>
                          <option value="male">👨 Male</option>
                          <option value="other">🏳️‍⚧️ Other</option>
                        </select>
                      </div>

                      {/* Date of Birth */}
                      <div>
                        <label className="text-xs font-bold text-purple-800 uppercase tracking-wide flex items-center gap-1 mb-2">
                          <span>🎂</span> Date of Birth
                        </label>
                        <input
                          type="date"
                          name="dob"
                          value={form.dob}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl bg-white text-purple-900 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-sm font-medium transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                            Saving Changes...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <span>💾</span>
                            Save All Changes
                          </span>
                        )}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-600 rounded-xl font-bold hover:bg-white hover:border-gray-400 transition-all duration-300 text-sm"
                      >
                        <span className="flex items-center justify-center gap-2">
                          <span>❌</span>
                          Cancel Changes
                        </span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileForm;