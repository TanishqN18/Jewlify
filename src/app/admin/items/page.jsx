'use client';
import { useState } from 'react';
import Image from 'next/image';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaFilter, FaEye, FaBoxes } from 'react-icons/fa';

export default function ItemsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Enhanced items data with more properties
  const items = [
    { id: 'DR001', name: 'Diamond Solitaire Ring', price: 85000, stock: 12, category: 'Rings', img: '/Images/product1.png', status: 'Available', sales: 45, lastUpdated: '2024-01-15' },
    { id: 'GN002', name: 'Gold Necklace', price: 45000, stock: 8, category: 'Necklaces', img: '/Images/product2.png', status: 'Low Stock', sales: 32, lastUpdated: '2024-01-14' },
    { id: 'PE003', name: 'Pearl Earrings', price: 25000, stock: 25, category: 'Earrings', img: '/Images/product3.png', status: 'Available', sales: 67, lastUpdated: '2024-01-13' },
    { id: 'SB004', name: 'Silver Bracelet', price: 35000, stock: 0, category: 'Bracelets', img: '/Images/product4.png', status: 'Out of Stock', sales: 23, lastUpdated: '2024-01-12' },
    { id: 'RR005', name: 'Ruby Ring', price: 95000, stock: 15, category: 'Rings', img: '/Images/product1.png', status: 'Available', sales: 18, lastUpdated: '2024-01-11' }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Available': return 'bg-green-500/20 text-green-400';
      case 'Low Stock': return 'bg-yellow-500/20 text-yellow-400';
      case 'Out of Stock': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getTotalValue = () => {
    return items.reduce((sum, item) => sum + (item.price * item.stock), 0);
  };

  const getTotalSales = () => {
    return items.reduce((sum, item) => sum + item.sales, 0);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="h-full flex flex-col space-y-4 overflow-hidden">
      {/* Header Section - Fixed */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
        <div>
          <h3 className="text-xl font-bold text-primary">Products Management</h3>
          <p className="text-secondary text-sm">Manage your jewelry inventory and catalog</p>
        </div>
        <button className="bg-gradient-to-r from-gold to-yellow-600 text-primary px-4 py-2 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center space-x-2 text-sm">
          <FaPlus />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Stats Cards - Fixed */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 flex-shrink-0">
        <div className="bg-secondary border border-white/10 rounded-lg p-3 hover:shadow-lg hover:scale-105 transition-all duration-300">
          <h4 className="text-xs font-medium text-secondary">Total Products</h4>
          <p className="text-lg font-bold text-gold">{items.length}</p>
          <p className="text-xs text-green-400">Active inventory</p>
        </div>
        <div className="bg-secondary border border-white/10 rounded-lg p-3 hover:shadow-lg hover:scale-105 transition-all duration-300">
          <h4 className="text-xs font-medium text-secondary">Inventory Value</h4>
          <p className="text-lg font-bold text-green-400">₹{getTotalValue().toLocaleString()}</p>
          <p className="text-xs text-green-400">Total worth</p>
        </div>
        <div className="bg-secondary border border-white/10 rounded-lg p-3 hover:shadow-lg hover:scale-105 transition-all duration-300">
          <h4 className="text-xs font-medium text-secondary">Total Sales</h4>
          <p className="text-lg font-bold text-blue-400">{getTotalSales()}</p>
          <p className="text-xs text-blue-400">Units sold</p>
        </div>
        <div className="bg-secondary border border-white/10 rounded-lg p-3 hover:shadow-lg hover:scale-105 transition-all duration-300">
          <h4 className="text-xs font-medium text-secondary">Low Stock Items</h4>
          <p className="text-lg font-bold text-yellow-400">{items.filter(i => i.status === 'Low Stock' || i.status === 'Out of Stock').length}</p>
          <p className="text-xs text-yellow-400">Need attention</p>
        </div>
      </div>

      {/* Search and Filter Section - Fixed */}
      <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary text-sm" />
          <input
            type="text"
            placeholder="Search by product name, SKU, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-secondary border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-primary placeholder-secondary focus:outline-none focus:border-gold transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary text-sm" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-secondary border border-white/10 rounded-lg pl-10 pr-8 py-2 text-sm text-primary focus:outline-none focus:border-gold transition-colors"
            >
              <option value="all">All Categories</option>
              <option value="Rings">Rings</option>
              <option value="Necklaces">Necklaces</option>
              <option value="Earrings">Earrings</option>
              <option value="Bracelets">Bracelets</option>
            </select>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-secondary border border-white/10 rounded-lg px-3 py-2 text-sm text-primary focus:outline-none focus:border-gold transition-colors"
          >
            <option value="all">All Status</option>
            <option value="Available">Available</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Products Table - Scrollable */}
      <div className="bg-secondary rounded-lg shadow-lg border border-white/10 flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-primary/20 sticky top-0">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-primary">Product</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-primary">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-primary">Price</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-primary">Stock</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-primary">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-primary">Sales</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-primary">Last Updated</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, index) => (
                <tr 
                  key={item.id} 
                  className="border-b border-white/5 hover:bg-primary/10 transition-colors duration-200"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-lg overflow-hidden mr-3 bg-primary/20">
                        <Image 
                          src={item.img} 
                          width={48} 
                          height={48} 
                          alt={item.name} 
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-200" 
                          unoptimized 
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-primary text-sm hover:text-gold transition-colors cursor-pointer">{item.name}</p>
                        <p className="text-xs text-secondary">SKU: {item.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-primary/20 text-primary px-2 py-1 rounded text-xs font-medium">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-gold text-sm">₹{item.price.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <FaBoxes className="text-secondary text-xs" />
                      <span className="text-primary text-sm font-medium">{item.stock}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-blue-400 font-medium text-sm">{item.sales} sold</span>
                  </td>
                  <td className="px-4 py-3 text-secondary text-sm">{item.lastUpdated}</td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-1">
                      <button className="text-blue-400 hover:text-blue-300 hover:scale-110 transition-all duration-200 p-1.5 hover:bg-blue-500/10 rounded-md">
                        <FaEye className="text-sm" />
                      </button>
                      <button className="text-green-400 hover:text-green-300 hover:scale-110 transition-all duration-200 p-1.5 hover:bg-green-500/10 rounded-md">
                        <FaEdit className="text-sm" />
                      </button>
                      <button className="text-red-400 hover:text-red-300 hover:scale-110 transition-all duration-200 p-1.5 hover:bg-red-500/10 rounded-md">
                        <FaTrash className="text-sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaSearch className="text-lg text-gold" />
            </div>
            <h3 className="text-sm font-semibold text-primary mb-1">No products found</h3>
            <p className="text-xs text-secondary">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}