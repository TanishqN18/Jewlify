'use client';
import { useState } from 'react';
import { FaEye, FaEdit, FaDownload, FaSearch, FaFilter, FaShippingFast, FaCheckCircle, FaClock } from 'react-icons/fa';

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  
  const orders = [
    { id: '#ORD001', customer: 'John Doe', email: 'john@email.com', total: 85000, status: 'Completed', date: '2024-01-15', items: 2, paymentMethod: 'Credit Card' },
    { id: '#ORD002', customer: 'Jane Smith', email: 'jane@email.com', total: 45000, status: 'Processing', date: '2024-01-14', items: 1, paymentMethod: 'UPI' },
    { id: '#ORD003', customer: 'Mike Johnson', email: 'mike@email.com', total: 125000, status: 'Shipped', date: '2024-01-13', items: 3, paymentMethod: 'Net Banking' },
    { id: '#ORD004', customer: 'Sarah Wilson', email: 'sarah@email.com', total: 67000, status: 'Pending', date: '2024-01-12', items: 1, paymentMethod: 'Credit Card' },
    { id: '#ORD005', customer: 'David Brown', email: 'david@email.com', total: 92000, status: 'Cancelled', date: '2024-01-11', items: 2, paymentMethod: 'UPI' }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'bg-green-500/20 text-green-400';
      case 'Processing': return 'bg-blue-500/20 text-blue-400';
      case 'Shipped': return 'bg-purple-500/20 text-purple-400';
      case 'Pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'Cancelled': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Completed': return <FaCheckCircle className="text-green-400" />;
      case 'Processing': return <FaClock className="text-blue-400" />;
      case 'Shipped': return <FaShippingFast className="text-purple-400" />;
      case 'Pending': return <FaClock className="text-yellow-400" />;
      case 'Cancelled': return <FaCheckCircle className="text-red-400" />;
      default: return <FaClock className="text-gray-400" />;
    }
  };

  const getTotalRevenue = () => {
    return orders
      .filter(order => order.status !== 'Cancelled')
      .reduce((sum, order) => sum + order.total, 0);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    
    let matchesDate = true;
    if (filterDate !== 'all') {
      const orderDate = new Date(order.date);
      const today = new Date();
      const daysDiff = Math.floor((today - orderDate) / (1000 * 60 * 60 * 24));
      
      switch(filterDate) {
        case 'today': matchesDate = daysDiff === 0; break;
        case 'week': matchesDate = daysDiff <= 7; break;
        case 'month': matchesDate = daysDiff <= 30; break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
      <div className="h-full flex flex-col space-y-4 overflow-hidden">
        {/* Header Section - Fixed */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
          <div>
            <h3 className="text-xl font-bold text-primary">Orders Management</h3>
            <p className="text-secondary text-sm">Track and manage all customer orders</p>
          </div>
          <button className="bg-gradient-to-r from-gold to-yellow-600 text-primary px-4 py-2 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center space-x-2 text-sm">
            <FaDownload />
            <span>Export Orders</span>
          </button>
        </div>

        {/* Stats Cards - Fixed */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 flex-shrink-0">
          <div className="bg-secondary border border-white/10 rounded-lg p-3 hover:shadow-lg hover:scale-105 transition-all duration-300">
            <h4 className="text-xs font-medium text-secondary">Total Orders</h4>
            <p className="text-lg font-bold text-gold">{orders.length}</p>
            <p className="text-xs text-green-400">+8% this month</p>
          </div>
          <div className="bg-secondary border border-white/10 rounded-lg p-3 hover:shadow-lg hover:scale-105 transition-all duration-300">
            <h4 className="text-xs font-medium text-secondary">Total Revenue</h4>
            <p className="text-lg font-bold text-green-400">₹{getTotalRevenue().toLocaleString()}</p>
            <p className="text-xs text-green-400">₹{Math.round(getTotalRevenue() / orders.length).toLocaleString()} avg</p>
          </div>
          <div className="bg-secondary border border-white/10 rounded-lg p-3 hover:shadow-lg hover:scale-105 transition-all duration-300">
            <h4 className="text-xs font-medium text-secondary">Completed Orders</h4>
            <p className="text-lg font-bold text-blue-400">{orders.filter(o => o.status === 'Completed').length}</p>
            <p className="text-xs text-blue-400">{Math.round((orders.filter(o => o.status === 'Completed').length / orders.length) * 100)}% success rate</p>
          </div>
          <div className="bg-secondary border border-white/10 rounded-lg p-3 hover:shadow-lg hover:scale-105 transition-all duration-300">
            <h4 className="text-xs font-medium text-secondary">Pending Orders</h4>
            <p className="text-lg font-bold text-yellow-400">{orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length}</p>
            <p className="text-xs text-yellow-400">Need attention</p>
          </div>
        </div>

        {/* Search and Filter Section - Fixed */}
        <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary text-sm" />
            <input
              type="text"
              placeholder="Search by order ID, customer name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-secondary border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-primary placeholder-secondary focus:outline-none focus:border-gold transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary text-sm" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-secondary border border-white/10 rounded-lg pl-10 pr-8 py-2 text-sm text-primary focus:outline-none focus:border-gold transition-colors"
              >
                <option value="all">All Status</option>
                <option value="Completed">Completed</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="bg-secondary border border-white/10 rounded-lg px-3 py-2 text-sm text-primary focus:outline-none focus:border-gold transition-colors"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>

        {/* Orders Table - Scrollable */}
        <div className="bg-secondary rounded-lg shadow-lg border border-white/10 flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-primary/20 sticky top-0">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-primary">Order ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-primary">Customer</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-primary">Items</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-primary">Total</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-primary">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-primary">Payment</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-primary">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-primary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <tr 
                    key={order.id} 
                    className="border-b border-white/5 hover:bg-primary/10 transition-colors duration-200"
                  >
                    <td className="px-4 py-3">
                      <span className="font-bold text-primary text-sm">{order.id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-yellow-600 flex items-center justify-center mr-3 shadow-md">
                          <span className="text-primary font-bold text-sm">{order.customer.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-primary text-sm">{order.customer}</p>
                          <p className="text-xs text-secondary">{order.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-primary/20 text-primary px-2 py-1 rounded text-xs font-medium">
                        {order.items} item{order.items > 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-gold text-sm">₹{order.total.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-secondary">{order.paymentMethod}</span>
                    </td>
                    <td className="px-4 py-3 text-secondary text-sm">{order.date}</td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-1">
                        <button className="text-blue-400 hover:text-blue-300 hover:scale-110 transition-all duration-200 p-1.5 hover:bg-blue-500/10 rounded-md">
                          <FaEye className="text-sm" />
                        </button>
                        <button className="text-green-400 hover:text-green-300 hover:scale-110 transition-all duration-200 p-1.5 hover:bg-green-500/10 rounded-md">
                          <FaEdit className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaSearch className="text-lg text-gold" />
              </div>
              <h3 className="text-sm font-semibold text-primary mb-1">No orders found</h3>
              <p className="text-xs text-secondary">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </div>
  );
}
