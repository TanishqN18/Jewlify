"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";

export default function OrdersSection() {
  const { getToken } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const token = await getToken();
        if (!token) throw new Error("No authentication token found");

        const res = await fetch("/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();
        setOrders(Array.isArray(data) ? data : data.orders || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [getToken]);

  if (loading)
    return <div className="p-6 text-gray-500 dark:text-gray-400">Loading your orders...</div>;

  if (error) return <div className="p-6 text-red-500">{error}</div>;

  if (orders.length === 0)
    return <div className="p-6 text-gray-500 dark:text-gray-400">You have no orders yet.</div>;

  // Status steps
  const steps = ["pending", "processing", "shipped", "completed"];

  const visibleOrders = showAll ? orders : orders.slice(0, 4);

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Your Orders</h3>

      <div className="space-y-6">
        {visibleOrders.map((order) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl border border-gray-200 dark:border-gray-700 
                       bg-white dark:bg-gray-900 shadow-md p-6 hover:shadow-lg transition"
          >
            {/* Top Row */}
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                Order #{order._id.slice(-6)}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  order.status === "pending"
                    ? "bg-yellow-200 text-yellow-900"
                    : order.status === "processing"
                    ? "bg-blue-200 text-blue-900"
                    : order.status === "shipped"
                    ? "bg-indigo-200 text-indigo-900"
                    : order.status === "completed"
                    ? "bg-green-200 text-green-900"
                    : "bg-gray-300 text-gray-800"
                }`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>

            {/* Date */}
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>

            {/* Items */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
              <strong className="block mb-2 text-gray-700 dark:text-gray-300">Items</strong>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                {order.items.map((item, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>{item.name}</span>
                    <span>x {item.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center mb-4">
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Total: ${order.total.toFixed(2)}
              </div>
              <button
                onClick={() =>
                  setExpandedOrder(expandedOrder === order._id ? null : order._id)
                }
                className="text-sm px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                {expandedOrder === order._id ? "Hide Details" : "View Details"}
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <h4 className="font-medium">Order Status</h4>
              <div className="flex items-center justify-between mt-2 relative">
                {["Pending", "Processing", "Shipped", "Completed"].map((step, index) => {
                  const isActive = index <= ["Pending", "Processing", "Shipped", "Completed"].indexOf(order.status);
                  const icons = ["🛒", "⚙️", "🚚", "✅"];

                  return (
                    <div key={step} className="flex-1 flex flex-col items-center relative">
                      {/* Connecting line */}
                      {index > 0 && (
                        <div
                          className={`absolute top-5 left-0 w-full h-1 ${
                            isActive ? "bg-gradient-to-r from-indigo-500 to-purple-500" : "bg-gray-300 dark:bg-gray-600"
                          }`}
                        />
                      )}

                      {/* Circle with icon */}
                      <div
                        className={`w-10 h-10 flex items-center justify-center rounded-full z-10 text-lg shadow-md ${
                          isActive
                            ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                            : "bg-gray-300 dark:bg-gray-600 text-gray-500"
                        }`}
                      >
                        {icons[index]}
                      </div>
                      {/* Step label */}
                      <span
                        className={`mt-2 text-sm font-medium ${
                          isActive ? "text-indigo-600 dark:text-purple-400" : "text-gray-500"
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>


            {/* Expandable Details */}
            <AnimatePresence>
              {expandedOrder === order._id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mt-4 border-t border-gray-200 dark:border-gray-700 pt-4"
                >
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <strong>Payment Method:</strong> {order.paymentMethod || "N/A"}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Shipping Address:</strong>{" "}
                    {order.shippingAddress
                      ? `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.zip}`
                      : "N/A"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Show More Button */}
      {orders.length > 4 && (
        <div className="text-center mt-6">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow-md hover:bg-indigo-700 transition"
          >
            {showAll ? "Show Less" : "Show More"}
          </button>
        </div>
      )}
    </div>
  );
}
