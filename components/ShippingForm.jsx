"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ShippingForm({ onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    pincode: "",
    city: "",
    state: "",
    street: "",
    landmark: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Auto fetch city/state from pincode
  const handlePincodeBlur = async () => {
    if (formData.pincode.length === 6) {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.postalpincode.in/pincode/${formData.pincode}`
        );
        const data = await res.json();
        if (data[0].Status === "Success") {
          const { District, State } = data[0].PostOffice[0];
          setFormData((prev) => ({
            ...prev,
            city: District,
            state: State,
          }));
        }
      } catch (error) {
        console.error("Pincode lookup failed:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.div
      className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
        Shipping Information
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>

        {/* Pincode */}
        <div>
          <label className="block text-sm font-medium">Pincode</label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            onBlur={handlePincodeBlur}
            className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
            required
          />
          {loading && <p className="text-xs text-blue-500">Fetching city/state…</p>}
        </div>

        {/* City + State */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>
        </div>

        {/* Street */}
        <div>
          <label className="block text-sm font-medium">Street Address</label>
          <input
            type="text"
            name="street"
            value={formData.street}
            onChange={handleChange}
            className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>

        {/* Landmark */}
        <div>
          <label className="block text-sm font-medium">Landmark (Optional)</label>
          <input
            type="text"
            name="landmark"
            value={formData.landmark}
            onChange={handleChange}
            className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          whileTap={{ scale: 0.95 }}
          className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
        >
          Save Address
        </motion.button>
      </form>
    </motion.div>
  );
}
