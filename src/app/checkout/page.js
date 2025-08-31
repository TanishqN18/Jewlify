/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useCartStore from '../../../components/store/cartStore';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import ShippingForm from '../../../components/ShippingForm';

export default function CheckoutPage() {
  const { cart, getTotalPrice, clearCart } = useCartStore();
  const totalPrice = getTotalPrice();
  const [promoCode, setPromoCode] = useState('');
  const [discountedTotal, setDiscountedTotal] = useState(totalPrice);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Shipping form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: ''
  });

  // TODO: replace with actual logged-in user ID if available
  const userId = "123";

  useEffect(() => {
    if (promoCode.toLowerCase() === 'jewel10') {
      setDiscountedTotal((totalPrice * 0.9).toFixed(2));
    } else {
      setDiscountedTotal(totalPrice.toFixed(2));
    }
  }, [promoCode, totalPrice]);

  // ✅ Simplified Place Order API Call
  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        items: cart.map(item => ({
          productId: item._id,
          name: item.name || item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        totalAmount: parseFloat(discountedTotal),
        shippingAddress: {
          name: formData.name,
          address: `${formData.address1}${formData.address2 ? ', ' + formData.address2 : ''}`,
          city: formData.city,
          postalCode: formData.zip,
          country: "India",
          phone: formData.phone
        },
        paymentMethod: paymentMethod.toUpperCase(),
        status: "Pending"
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to place order");
      } else {
        toast.success("Order placed successfully!");
        clearCart();
        router.push('/thankyou');
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-6xl mx-auto px-4 py-10 space-y-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-3xl font-bold text-center">Checkout</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* LEFT: Shipping Details */}
        <div className="space-y-6">
          {/* ✅ Shipping Form with saved addresses + pincode lookup */}
          <ShippingForm formData={formData} setFormData={setFormData} userId={userId} />

          {/* Shipping Method */}
          <div className="pt-6 space-y-2 ">
            <h4 className="font-semibold">Shipping Method</h4>
            <div className="space-y-3 ">
              {[
                { id: 'standard', label: 'Standard (3-5 days)', price: 'Free' },
                { id: 'express', label: 'Express (1-2 days)', price: 'Free' }
              ].map((option) => (
                <label
                  key={option.id}
                  className={`flex justify-between items-center p-4 rounded-lg border cursor-pointer ${
                    shippingMethod === option.id ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 ">
                    <input
                      type="radio"
                      value={option.id}
                      checked={shippingMethod === option.id}
                      onChange={() => setShippingMethod(option.id)}
                    />
                    <span>{option.label}</span>
                  </div>
                  <span className="font-semibold">{option.price}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="pt-6 space-y-2">
            <h4 className="font-semibold">Payment Method</h4>
            <div className="space-y-3">
              {[
                { id: 'card', label: 'Credit / Debit Card' },
                { id: 'upi', label: 'UPI' },
                { id: 'cod', label: 'Cash on Delivery' }
              ].map((option) => (
                <label
                  key={option.id}
                  className={`flex items-center gap-2 p-4 rounded-lg border cursor-pointer ${
                    paymentMethod === option.id ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    value={option.id}
                    checked={paymentMethod === option.id}
                    onChange={() => setPaymentMethod(option.id)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Order Summary */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl shadow bg-white dark:bg-gray-900">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
            <ul className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {cart.map((item) => (
                <motion.li
                  key={item._id}
                  className="flex items-center justify-between gap-4 border-b pb-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={(item.image || item.thumbnail || (item.images && item.images[0]) || '/Images/fallback.png').trim()}
                      alt={item.title || item.name}
                      unoptimized
                      className="w-16 h-16 object-cover rounded-md border"
                    />
                    <div>
                      <p className="font-medium">{item.title || item.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Qty: {item.quantity} × ₹{item.price}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-sm">₹{(item.price * item.quantity).toFixed(2)}</span>
                </motion.li>
              ))}
            </ul>

            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount:</span>
                <span className="text-green-600">- ₹{(totalPrice - discountedTotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>₹{discountedTotal}</span>
              </div>
            </div>

            {/* Promo Code */}
            <div className="mt-4 space-y-2">
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-black/20 focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              {promoCode && (
                promoCode.toLowerCase() === 'jewel10'
                  ? <p className="text-green-600 text-sm">Promo code applied!</p>
                  : <p className="text-red-600 text-sm">Invalid promo code.</p>
              )}
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            onClick={handlePlaceOrder}
            className="w-full py-3 rounded bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold shadow-md hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
