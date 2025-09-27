"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function OrdersSection() {
  const { user, isLoaded } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 3;

  useEffect(() => {
    async function fetchOrders() {
      if (!isLoaded || !user) return;
      try {
        const res = await axios.get("/api/orders", {
          params: { clerkId: user.id },
        });
        setOrders(res.data.orders || []);
      } catch (err) {
        setError("Failed to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [isLoaded, user]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center p-8"
      >
        <div className="flex items-center gap-2">
          <div className="animate-spin w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full"></div>
          <span className="text-secondary text-sm font-medium">
            Loading your orders...
          </span>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 border border-red-200 rounded-xl p-4 text-center"
      >
        <div className="text-red-600 text-2xl mb-2">⚠️</div>
        <p className="text-red-700 text-sm font-medium">{error}</p>
      </motion.div>
    );
  }

  if (orders.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-secondary rounded-xl shadow-lg p-8 text-center border border-accent"
      >
        <div className="text-4xl mb-3">📦</div>
        <h3 className="text-lg font-semibold text-primary mb-1">
          No Orders Yet
        </h3>
        <p className="text-secondary text-sm">
          Start shopping to see your orders here!
        </p>
      </motion.div>
    );
  }

  // Pagination calculations
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;
  const currentOrders = orders.slice(startIndex, endIndex);

  const getStatusSteps = (currentStatus) => {
    const steps = [
      { name: "Pending", icon: "⏳", color: "text-yellow-600" },
      { name: "Confirmed", icon: "✅", color: "text-green-600" },
      { name: "Shipped", icon: "🚚", color: "text-blue-600" },
      { name: "Delivered", icon: "📦", color: "text-purple-600" }
    ];

    const currentIndex = steps.findIndex(step => step.name === currentStatus);
    
    return steps.map((step, index) => ({
      ...step,
      isActive: index <= currentIndex,
      isCurrent: index === currentIndex
    }));
  };

  const getProgressPercentage = (status) => {
    const statuses = ["Pending", "Confirmed", "Shipped", "Delivered"];
    const currentIndex = statuses.indexOf(status);
    return ((currentIndex + 1) / statuses.length) * 100;
  };

  const goToPage = (page) => {
    setCurrentPage(page);
    setExpandedOrder(null); // Close any expanded orders when changing pages
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-primary flex items-center gap-2"
        >
          <span className="text-2xl">🛍️</span>
          Your Orders
        </motion.h2>
        <div className="text-xs text-secondary">
          {orders.length} {orders.length === 1 ? "order" : "orders"} total
        </div>
      </div>

      {/* Orders Grid */}
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {currentOrders.map((order, index) => (
            <motion.div
              key={`${order._id}-${currentPage}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -1, scale: 1.005 }}
              className="group bg-secondary rounded-xl shadow-lg border border-accent overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* Header Section */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 px-4 py-3 border-b border-accent">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center shadow-md">
                      <span className="text-white text-sm">📋</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-primary text-sm">
                        Order #{order._id.slice(-6)}
                      </h3>
                      <p className="text-xs text-secondary">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Modern Progress Indicator */}
                  <div className="flex flex-col gap-2">
                    {/* Horizontal Progress with Icons */}
                    <div className="flex items-center justify-center lg:justify-end">
                      {getStatusSteps(order.status).map((step, idx) => (
                        <div key={step.name} className="flex items-center">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: step.isActive ? 1 : 0.7 }}
                            transition={{ duration: 0.3, delay: idx * 0.1 }}
                            className={`relative flex items-center justify-center w-6 h-6 rounded-full ${
                              step.isActive 
                                ? "bg-gradient-to-r from-yellow-400 to-orange-400" 
                                : "bg-gray-200"
                            } ${step.isCurrent ? "animate-pulse" : ""}`}
                          >
                            <span className={`text-xs ${
                              step.isActive ? "text-white" : "text-gray-400"
                            }`}>
                              {step.icon}
                            </span>
                          </motion.div>
                          {idx < 3 && (
                            <div className={`w-4 h-0.5 ${
                              getStatusSteps(order.status)[idx + 1]?.isActive 
                                ? "bg-gradient-to-r from-yellow-400 to-orange-400" 
                                : "bg-gray-300"
                            }`} />
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {/* Progress Bar - Positioned under the 4 steps */}
                    <div className="w-full lg:w-32 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${getProgressPercentage(order.status)}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                      />
                    </div>
                    
                    <span className="text-xs font-medium text-primary text-center lg:text-right">
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-4">
                {/* Items Preview */}
                <div className="mb-4">
                  <h4 className="font-semibold text-primary text-sm mb-2 flex items-center gap-1">
                    <span className="text-sm">📦</span>
                    Items ({order.items.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {order.items.slice(0, 2).map((item, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.01 }}
                        className="bg-primary rounded-lg p-3 border border-accent"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-primary text-xs truncate">
                            {item.name}
                          </span>
                          <span className="text-secondary text-xs font-medium ml-2">
                            ×{item.quantity}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  {order.items.length > 2 && (
                    <p className="text-xs text-secondary mt-1 text-center">
                      +{order.items.length - 2} more items
                    </p>
                  )}
                </div>

                {/* Total and Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💰</span>
                    <div>
                      <p className="text-xs text-secondary">Total Amount</p>
                      <p className="text-xl font-bold text-primary">
                        ₹{order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <motion.button
                    onClick={() =>
                      setExpandedOrder(
                        expandedOrder === order._id ? null : order._id
                      )
                    }
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-1"
                  >
                    <span className="text-sm">
                      {expandedOrder === order._id ? "👆" : "👇"}
                    </span>
                    <span className="hidden sm:inline">
                      {expandedOrder === order._id ? "Hide" : "View"}
                    </span>
                    <span className="sm:hidden">
                      {expandedOrder === order._id ? "Less" : "More"}
                    </span>
                  </motion.button>
                </div>
              </div>

              {/* Expandable Details */}
              <AnimatePresence>
                {expandedOrder === order._id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                    className="overflow-hidden border-t border-accent bg-gradient-to-r from-gray-50 to-gray-100"
                  >
                    <div className="p-4 space-y-3">
                      {/* Detailed Progress Timeline */}
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <h5 className="font-semibold text-primary text-sm mb-3 flex items-center gap-1">
                          <span className="text-sm">📊</span>
                          Order Progress
                        </h5>
                        <div className="space-y-2">
                          {getStatusSteps(order.status).map((step, idx) => (
                            <motion.div
                              key={step.name}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className={`flex items-center gap-2 p-2 rounded-md text-sm ${
                                step.isActive 
                                  ? "bg-green-50 border border-green-200" 
                                  : "bg-gray-50"
                              }`}
                            >
                              <span className={`text-lg ${step.isActive ? step.color : "text-gray-400"}`}>
                                {step.icon}
                              </span>
                              <div className="flex-1">
                                <span className={`font-medium text-sm ${
                                  step.isActive ? "text-green-800" : "text-gray-500"
                                }`}>
                                  {step.name}
                                </span>
                                {step.isCurrent && (
                                  <span className="ml-2 text-xs bg-yellow-500 text-white px-1.5 py-0.5 rounded-full">
                                    Current
                                  </span>
                                )}
                              </div>
                              {step.isActive && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="text-green-600 text-sm"
                                >
                                  ✓
                                </motion.span>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* All Items */}
                      <div>
                        <h5 className="font-semibold text-primary text-sm mb-2 flex items-center gap-1">
                          <span className="text-sm">📋</span>
                          Complete Item List
                        </h5>
                        <div className="grid gap-1.5">
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between items-center bg-white rounded-md p-2 border border-gray-200"
                            >
                              <span className="font-medium text-primary text-sm truncate">{item.name}</span>
                              <div className="flex items-center gap-3 text-sm">
                                <span className="text-secondary">
                                  Qty: {item.quantity}
                                </span>
                                <span className="font-semibold text-primary">
                                  ₹{(item.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Additional Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <h6 className="font-semibold text-primary text-sm mb-1 flex items-center gap-1">
                            <span className="text-sm">💳</span>
                            Payment Method
                          </h6>
                          <p className="text-secondary text-sm">
                            {order.paymentMethod || "Not specified"}
                          </p>
                        </div>

                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <h6 className="font-semibold text-primary text-sm mb-1 flex items-center gap-1">
                            <span className="text-sm">🏠</span>
                            Shipping Address
                          </h6>
                          <p className="text-secondary text-xs leading-relaxed">
                            {order.shippingAddress
                              ? `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}`
                              : "Not specified"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-2 mt-6"
        >
          {/* Previous Button */}
          <motion.button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
            whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-md hover:shadow-lg"
            }`}
          >
            ← Prev
          </motion.button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {[...Array(totalPages)].map((_, index) => {
              const pageNum = index + 1;
              return (
                <motion.button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-300 ${
                    currentPage === pageNum
                      ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-md"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                >
                  {pageNum}
                </motion.button>
              );
            })}
          </div>

          {/* Next Button */}
          <motion.button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
            whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-md hover:shadow-lg"
            }`}
          >
            Next →
          </motion.button>

          {/* Page Info */}
          <div className="ml-4 text-xs text-secondary">
            Page {currentPage} of {totalPages}
          </div>
        </motion.div>
      )}
    </motion.section>
  );
}
