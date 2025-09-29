'use client';
import Image from 'next/image';

function WishlistCard({ item, onAddToCart, onRemove }) {
  return (
    <div className="bg-secondary rounded-2xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all transform hover:scale-105 border border-white/10">
      <div className="relative">
        <Image 
          src={item.img} 
          width={400} 
          height={280} 
          alt={item.name} 
          className="w-full h-48 object-cover" 
          unoptimized
        />
        <button 
          onClick={() => onRemove?.(item.id)}
          className="absolute top-4 right-4 w-10 h-10 bg-red-500/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-all"
        >
          ✕
        </button>
      </div>
      <div className="p-6">
        <h3 className="font-semibold text-primary mb-2">{item.name}</h3>
        <p className="text-2xl font-bold text-gold mb-4">₹{item.price.toLocaleString()}</p>
        <button 
          onClick={() => onAddToCart?.(item)} 
          className="w-full px-4 py-3 bg-gold text-primary rounded-xl font-medium shadow-lg hover:opacity-90 transition-opacity"
        >
          🛒 Add to Cart
        </button>
      </div>
    </div>
  );
}

export default function WishlistPage() {
  // Sample wishlist data - replace with real data from your API
  const wishlistItems = [
    { id: 1, name: 'Diamond Solitaire Ring', price: 85000, img: '/Images/product1.png', category: 'Rings' },
    { id: 2, name: 'Gold Chain Necklace', price: 45000, img: '/Images/product2.png', category: 'Necklaces' },
    { id: 3, name: 'Pearl Drop Earrings', price: 25000, img: '/Images/product3.png', category: 'Earrings' },
    { id: 4, name: 'Ruby Bracelet', price: 65000, img: '/Images/product4.png', category: 'Bracelets' }
  ];

  const handleAddToCart = (item) => {
    console.log('Adding to cart:', item);
    // Add your cart logic here
  };

  const handleRemoveFromWishlist = (itemId) => {
    console.log('Removing from wishlist:', itemId);
    // Add your remove logic here
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-primary">Wishlist Management</h3>
          <p className="text-secondary">Monitor customer wishlists and popular items</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-primary text-primary border border-white/10 px-6 py-3 rounded-xl hover:bg-white/5 transition-colors">
            Export Data
          </button>
          <button className="bg-gold text-primary px-6 py-3 rounded-xl hover:opacity-90 transition-opacity">
            View Analytics
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-secondary border border-white/10 rounded-xl p-4">
          <h4 className="text-sm font-medium text-secondary">Total Wishlisted Items</h4>
          <p className="text-2xl font-bold text-gold">{wishlistItems.length}</p>
        </div>
        <div className="bg-secondary border border-white/10 rounded-xl p-4">
          <h4 className="text-sm font-medium text-secondary">Most Wishlisted</h4>
          <p className="text-lg font-semibold text-primary">Diamond Rings</p>
        </div>
        <div className="bg-secondary border border-white/10 rounded-xl p-4">
          <h4 className="text-sm font-medium text-secondary">Conversion Rate</h4>
          <p className="text-2xl font-bold text-green-400">23%</p>
        </div>
        <div className="bg-secondary border border-white/10 rounded-xl p-4">
          <h4 className="text-sm font-medium text-secondary">Active Users</h4>
          <p className="text-2xl font-bold text-blue-400">1,234</p>
        </div>
      </div>

      {/* Wishlist Items Grid */}
      <div className="bg-secondary border border-white/10 rounded-2xl p-6">
        <h4 className="text-xl font-semibold text-primary mb-6">Popular Wishlist Items</h4>
        
        {wishlistItems.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlistItems.map(item => (
              <WishlistCard 
                key={item.id} 
                item={item} 
                onAddToCart={handleAddToCart}
                onRemove={handleRemoveFromWishlist}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💝</span>
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">No Wishlist Items</h3>
            <p className="text-secondary">Customers haven't added any items to their wishlists yet.</p>
          </div>
        )}
      </div>

      {/* Recent Activity Table */}
      <div className="bg-secondary border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h4 className="text-xl font-semibold text-primary">Recent Wishlist Activity</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-primary/20">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-primary">Customer</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-primary">Item</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-primary">Action</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-primary">Date</th>
              </tr>
            </thead>
            <tbody>
              {[
                { customer: 'Sarah Wilson', item: 'Diamond Ring', action: 'Added', date: '2024-01-15' },
                { customer: 'John Doe', item: 'Gold Necklace', action: 'Removed', date: '2024-01-14' },
                { customer: 'Emma Davis', item: 'Pearl Earrings', action: 'Added', date: '2024-01-13' }
              ].map((activity, i) => (
                <tr key={i} className="border-b border-white/5">
                  <td className="px-6 py-4 text-secondary">{activity.customer}</td>
                  <td className="px-6 py-4 text-primary font-medium">{activity.item}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      activity.action === 'Added' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {activity.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-secondary">{activity.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
