'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { FaCamera } from 'react-icons/fa';
import { useUser } from '@clerk/nextjs';

const ProfileForm = ({ userData }) => {
  const { user } = useUser();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    dob: '',
    image: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData) {
      setForm({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        gender: userData.gender || '',
        dob: userData.dob ? userData.dob.substring(0, 10) : '',
        image: userData.image || '',
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put('/api/users/update-user', {
        ...form,
        clerkId: user?.id,
      });
      alert('✅ Profile updated successfully!');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 h-32 relative">
        <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2">
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white dark:border-gray-900 shadow-lg">
            {form.image ? (
              <Image
                src={form.image}
                alt="Profile"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-500">
                <FaCamera size={28} />
              </div>
            )}
            <label className="absolute bottom-1 right-1 bg-pink-600 p-2 rounded-full cursor-pointer hover:bg-pink-700 transition-colors shadow-md">
              <FaCamera className="text-white" size={14} />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="p-8 pt-20">
        <h3 className="text-2xl font-bold mb-8 text-center text-gray-800 dark:text-white">
          Personal Information
        </h3>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none shadow-sm"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              disabled
              className="w-full p-3 rounded-lg border bg-gray-200 dark:bg-gray-700 cursor-not-allowed text-gray-500 dark:text-gray-400"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none shadow-sm"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">
              Gender
            </label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none shadow-sm"
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* DOB */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none shadow-sm"
            />
          </div>
        </form>

        {/* Submit Button */}
        <div className="mt-10 text-center">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:opacity-90 text-white font-semibold rounded-xl shadow-md transition-transform duration-200 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
