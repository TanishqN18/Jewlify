'use client';
import { useEffect, useState } from 'react';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Mock orders for now (replace with real data later)
    setOrders([
      {
        id: 'order123',
        date: '2025-07-22',
        items: [
          {
            name: 'Gold Necklace',
            price: 6999,
            quantity: 1,
            image: '/images/necklace.jpg',
          },
          {
            name: 'Diamond Ring',
            price: 2999,
            quantity: 1,
            image: '/images/diamond-ring.jpg',
          },
        ],
      },
      {
        id: 'order124',
        date: '2025-07-20',
        items: [
          {
            name: 'Ruby Earrings',
            price: 1599,
            quantity: 2,
            image: '/images/ruby-earrings.jpg',
          },
        ],
      },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <h1 className="text-3xl font-bold text-yellow-600 mb-6 text-center">Your Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders placed yet.</p>
      ) : (
        <div className="space-y-8 max-w-4xl mx-auto">
          {orders.map((order) => {
            const total = order.items.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            );

            return (
              <div
                key={order.id}
                className="bg-white rounded-md shadow p-6 border border-yellow-100"
              >
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-gray-500">Order ID: <strong>{order.id}</strong></p>
                  <p className="text-sm text-gray-500">Placed on: <strong>{order.date}</strong></p>
                </div>

                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex justify-between w-full">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-gray-700">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-right text-yellow-600 font-semibold">
                  Total: ₹{total}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
