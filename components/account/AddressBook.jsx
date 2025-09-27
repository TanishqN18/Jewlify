"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function AddressBook() {
  const { user, isLoaded } = useUser();
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [notification, setNotification] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [form, setForm] = useState({
    line1: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
    label: "Home",
    phone: "",
    isDefault: false,
  });
  const [loading, setLoading] = useState(false);

  // Fetch addresses from MongoDB user profile
  useEffect(() => {
    async function fetchAddresses() {
      if (!isLoaded || !user) return;
      try {
        const res = await axios.get("/api/users/get-user");
        setAddresses(res.data.user?.addresses || []);
      } catch {
        setAddresses([]);
      }
    }
    fetchAddresses();
  }, [isLoaded, user]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let newAddresses;

      if (editIndex !== null) {
        // Edit existing address
        newAddresses = [...addresses];
        newAddresses[editIndex] = form;
      } else {
        // Add new address
        newAddresses = [...addresses, form];
      }

      // Debug: Log what we're sending
      console.log("Form data being sent:", form);
      console.log("New addresses array:", newAddresses);

      const response = await axios.post("/api/users/update-user", {
        addresses: newAddresses,
      });

      if (response.status === 200) {
        setAddresses(newAddresses);
        setForm({
          line1: "",
          city: "",
          state: "",
          zip: "",
          country: "India",
          label: "Home",
          phone: "",
          isDefault: false,
        });
        setShowForm(false);
        setEditIndex(null);
        showNotification(
          editIndex !== null
            ? "Address updated successfully! ✏️"
            : "Address saved successfully! 🎉",
          "success"
        );
      }
    } catch (error) {
      console.error("Save address error:", error);
      showNotification(
        `Failed to save address: ${error.response?.data?.error || error.message}`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (index) => {
    const addressToEdit = addresses[index];
    setForm({
      line1: addressToEdit.line1 || "",
      city: addressToEdit.city || "",
      state: addressToEdit.state || "",
      zip: addressToEdit.zip || "",
      country: addressToEdit.country || "India",
      label: addressToEdit.label || "Home",
      phone: addressToEdit.phone || "",
      isDefault: addressToEdit.isDefault || false,
    });
    setEditIndex(index);
    setShowForm(true);
  };

  const handleDelete = async (index) => {
    try {
      const newAddresses = addresses.filter((_, i) => i !== index);
      const response = await axios.post("/api/users/update-user", {
        addresses: newAddresses,
      });

      if (response.status === 200) {
        setAddresses(newAddresses);
        showNotification("Address deleted successfully! 🗑️", "success");
      }
    } catch (error) {
      console.error("Delete address error:", error);
      showNotification(
        `Failed to delete address: ${error.response?.data?.error || error.message}`,
        "error"
      );
    }
  };

  const handleCancel = () => {
    setForm({
      line1: "",
      city: "",
      state: "",
      zip: "",
      country: "India",
      label: "Home",
      phone: "",
      isDefault: false,
    });
    setShowForm(false);
    setEditIndex(null);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Simple Modern Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${
              notification.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {notification.type === "success" ? "✓" : "✕"}
              </span>
              <p className="font-medium text-sm">{notification.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center mb-8">
        <motion.h1
          className="text-3xl font-bold text-primary"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Saved Addresses
        </motion.h1>
        <motion.button
          onClick={() => setShowForm(!showForm)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <motion.span
            initial={{ rotate: 0 }}
            animate={{ rotate: showForm ? 45 : 0 }}
            transition={{ duration: 0.3 }}
            className="inline-block mr-2"
          >
            +
          </motion.span>
          {showForm ? "Cancel" : "Add New Address"}
        </motion.button>
      </div>

      {/* Add/Edit Address Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="bg-secondary rounded-2xl shadow-xl p-6 border border-accent mb-8 overflow-hidden"
          >
            <h3 className="text-lg font-semibold text-primary mb-4">
              {editIndex !== null ? "Edit Address" : "Add New Address"}
            </h3>
            <form
              onSubmit={handleSave}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <motion.div
                className="md:col-span-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <label className="text-sm font-medium text-secondary mb-2 block">
                  Full Address
                </label>
                <textarea
                  name="line1"
                  value={form.line1}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-accent rounded-xl bg-primary text-primary focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300 resize-none"
                  placeholder="e.g., House No. 123, ABC Street, XYZ Colony"
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <label className="text-sm font-medium text-secondary mb-2 block">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-accent rounded-xl bg-primary text-primary focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300"
                  placeholder="e.g., Mumbai"
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <label className="text-sm font-medium text-secondary mb-2 block">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-accent rounded-xl bg-primary text-primary focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300"
                  placeholder="e.g., Maharashtra"
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <label className="text-sm font-medium text-secondary mb-2 block">
                  ZIP Code
                </label>
                <input
                  type="text"
                  name="zip"
                  value={form.zip}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-accent rounded-xl bg-primary text-primary focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300"
                  placeholder="e.g., 400001"
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <label className="text-sm font-medium text-secondary mb-2 block">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-accent rounded-xl bg-primary text-primary focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300"
                  placeholder="e.g., +91 98765 43210"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <label className="text-sm font-medium text-secondary mb-2 block">
                  Address Label
                </label>
                <select
                  name="label"
                  value={form.label}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-accent rounded-xl bg-primary text-primary focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300"
                >
                  <option value="Home">Home</option>
                  <option value="Office">Office</option>
                  <option value="Other">Other</option>
                </select>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.7 }}
                className="flex items-center gap-3"
              >
                <div className="flex items-center">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="isDefault"
                      checked={form.isDefault}
                      onChange={handleChange}
                      className="sr-only"
                      id="isDefault"
                    />
                    <motion.label
                      htmlFor="isDefault"
                      className={`flex items-center justify-center w-5 h-5 rounded-md border-2 cursor-pointer transition-all duration-300 ${
                        form.isDefault
                          ? "bg-yellow-500 border-yellow-500"
                          : "bg-transparent border-accent hover:border-yellow-400"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                          opacity: form.isDefault ? 1 : 0,
                          scale: form.isDefault ? 1 : 0,
                        }}
                        transition={{ duration: 0.2 }}
                        className="text-white text-xs font-bold"
                      >
                        ✓
                      </motion.span>
                    </motion.label>
                  </div>
                  <label
                    htmlFor="isDefault"
                    className="text-sm font-medium text-secondary ml-3 cursor-pointer"
                  >
                    Set as default address
                  </label>
                </div>
              </motion.div>

              <motion.div
                className="md:col-span-2 flex justify-end gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.8 }}
              >
                <motion.button
                  type="button"
                  onClick={handleCancel}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-gray-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">⏳</span>
                      {editIndex !== null ? "Updating..." : "Saving..."}
                    </span>
                  ) : editIndex !== null ? (
                    "Update Address"
                  ) : (
                    "Save Address"
                  )}
                </motion.button>
              </motion.div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Address Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <AnimatePresence>
          {addresses.length === 0 ? (
            <motion.div
              className="bg-secondary rounded-2xl shadow-xl p-6 border border-accent col-span-full text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-secondary">No addresses saved yet.</p>
            </motion.div>
          ) : (
            addresses.map((addr, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-secondary rounded-2xl shadow-xl p-6 border border-accent group hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <motion.div
                    className="w-12 h-12 bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 rounded-xl flex items-center justify-center"
                    whileHover={{ rotate: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="text-white text-lg">
                      {addr.label === "Home"
                        ? "🏠"
                        : addr.label === "Office"
                        ? "🏢"
                        : "📍"}
                    </span>
                  </motion.div>
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <motion.button
                      onClick={() => handleEdit(index)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-8 h-8 bg-blue-500/20 text-blue-700 rounded-lg flex items-center justify-center hover:bg-blue-500/30"
                    >
                      ✏️
                    </motion.button>
                    <motion.button
                      onClick={() => handleDelete(index)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-8 h-8 bg-red-500/20 text-red-700 rounded-lg flex items-center justify-center hover:bg-red-500/30"
                    >
                      🗑️
                    </motion.button>
                  </div>
                </div>
                <motion.h3
                  className="font-semibold text-primary mb-2 flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {addr.label || "Home"}
                  {addr.isDefault && (
                    <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded">
                      Default
                    </span>
                  )}
                </motion.h3>
                <motion.p
                  className="text-secondary text-sm leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {addr.line1 && `${addr.line1}`}
                  {addr.line1 && <br />}
                  {addr.city}, {addr.state}
                  <br />
                  {addr.zip && `${addr.zip}, `}
                  {addr.country}
                  {addr.phone && (
                    <>
                      <br />
                      📞 {addr.phone}
                    </>
                  )}
                </motion.p>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </motion.section>
  );
}
