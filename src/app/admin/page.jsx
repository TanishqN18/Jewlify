'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import AdminLayout from './layout';
import { FaChartLine, FaShoppingCart, FaBoxes, FaUsers, FaPlus, FaEye, FaCog, FaArrowUp, FaArrowDown } from 'react-icons/fa';

// dynamic import Highcharts (client only)
const HighchartsReact = dynamic(() => import('highcharts-react-official'), { ssr: false });
const Highcharts = typeof window !== 'undefined' ? require('highcharts') : null;

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState('month');

  const stats = [
    { 
      title: 'Total Sales', 
      value: '₹2,45,000', 
      change: '+12%', 
      trend: 'up', 
      icon: <FaChartLine />,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    },
    { 
      title: 'Orders', 
      value: '156', 
      change: '+8%', 
      trend: 'up', 
      icon: <FaShoppingCart />,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    { 
      title: 'Products', 
      value: '89', 
      change: '0%', 
      trend: 'stable', 
      icon: <FaBoxes />,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    },
    { 
      title: 'Users', 
      value: '1,234', 
      change: '+15%', 
      trend: 'up', 
      icon: <FaUsers />,
      color: 'text-gold',
      bgColor: 'bg-gold/10'
    }
  ];

  const recentOrders = [
    { id: '#ORD001', customer: 'John Doe', amount: 85000, status: 'Completed', time: '2 min ago' },
    { id: '#ORD002', customer: 'Jane Smith', amount: 45000, status: 'Processing', time: '5 min ago' },
    { id: '#ORD003', customer: 'Mike Johnson', amount: 125000, status: 'Shipped', time: '10 min ago' },
    { id: '#ORD004', customer: 'Sarah Wilson', amount: 67000, status: 'Completed', time: '15 min ago' },
    { id: '#ORD005', customer: 'David Brown', amount: 92000, status: 'Pending', time: '20 min ago' }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'bg-green-500/20 text-green-400';
      case 'Processing': return 'bg-blue-500/20 text-blue-400';
      case 'Shipped': return 'bg-purple-500/20 text-purple-400';
      case 'Pending': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const quickActions = [
    { label: 'Add New Product', icon: <FaPlus />, href: '/admin/items', primary: true },
    { label: 'View All Orders', icon: <FaEye />, href: '/admin/orders' },
    { label: 'Manage Users', icon: <FaUsers />, href: '/admin/users' },
    { label: 'System Settings', icon: <FaCog />, href: '/admin/settings' }
  ];

  return (
    <div className="h-full flex flex-col space-y-4 overflow-hidden">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
        <div>
          <h3 className="text-xl font-bold text-primary">Dashboard Overview</h3>
          <p className="text-secondary text-sm">Welcome back! Here's what's happening with your store.</p>
        </div>
        <div className="flex gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-secondary border border-white/10 rounded-lg px-3 py-2 text-sm text-primary focus:outline-none focus:border-gold transition-colors"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 flex-shrink-0">
        {stats.map((stat, index) => (
          <div key={index} className="bg-secondary border border-white/10 rounded-xl p-4 hover:shadow-lg hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <span className={`${stat.color} text-lg`}>{stat.icon}</span>
              </div>
              <div className={`flex items-center space-x-1 text-xs ${
                stat.trend === 'up' ? 'text-green-400' : stat.trend === 'down' ? 'text-red-400' : 'text-gray-400'
              }`}>
                {stat.trend === 'up' && <FaArrowUp />}
                {stat.trend === 'down' && <FaArrowDown />}
                <span>{stat.change}</span>
              </div>
            </div>
            <h4 className="text-sm font-medium text-secondary mb-1">{stat.title}</h4>
            <p className="text-2xl font-bold text-primary">{stat.value}</p>
            <p className="text-xs text-secondary mt-1">vs last {timeRange}</p>
          </div>
        ))}
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-auto space-y-6">
        {/* Charts and Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Revenue Chart */}
          <div className="bg-secondary border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary">Revenue Trend</h3>
              <div className="flex items-center space-x-2 text-sm text-secondary">
                <div className="w-3 h-3 bg-gold rounded-full"></div>
                <span>Sales Revenue</span>
              </div>
            </div>
            <div className="h-64 bg-primary/10 rounded-lg flex items-center justify-center relative overflow-hidden">
              {/* Simulated Chart Area */}
              <div className="absolute inset-0 flex items-end justify-center space-x-2 p-4">
                {[40, 65, 45, 80, 55, 70, 85, 60, 75, 90, 65, 95].map((height, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-t from-gold to-yellow-400 rounded-t opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                    style={{ height: `${height}%`, width: '20px' }}
                  />
                ))}
              </div>
              <div className="relative z-10 text-center">
                <p className="text-secondary text-sm">Interactive Chart</p>
                <p className="text-xs text-secondary">Revenue visualization</p>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-secondary border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary">Recent Orders</h3>
              <button className="text-gold hover:text-yellow-400 text-sm font-medium transition-colors">
                View All
              </button>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {recentOrders.map((order, index) => (
                <div key={order.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 hover:bg-primary/10 rounded-lg px-2 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-yellow-600 flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">{order.customer.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-primary text-sm">{order.id}</p>
                      <p className="text-xs text-secondary">{order.customer}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gold text-sm">₹{order.amount.toLocaleString()}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-secondary mt-1">{order.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-secondary border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-primary mb-4">Quick Actions</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className={`flex items-center space-x-3 p-4 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                  action.primary
                    ? 'bg-gradient-to-r from-gold to-yellow-600 text-primary hover:shadow-lg'
                    : 'bg-primary/20 text-primary border border-white/10 hover:bg-primary/30'
                }`}
              >
                <span className="text-lg">{action.icon}</span>
                <span className="text-sm">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Additional Analytics */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Top Products */}
          <div className="bg-secondary border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-primary mb-4">Top Products</h3>
            <div className="space-y-3">
              {['Diamond Ring', 'Gold Necklace', 'Pearl Earrings'].map((product, index) => (
                <div key={product} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gold/20 rounded-lg flex items-center justify-center">
                      <span className="text-gold font-bold text-sm">{index + 1}</span>
                    </div>
                    <span className="text-primary text-sm">{product}</span>
                  </div>
                  <span className="text-secondary text-xs">{45 - index * 10} sold</span>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Activity */}
          <div className="bg-secondary border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-primary mb-4">Customer Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-secondary text-sm">New Customers</span>
                <span className="text-green-400 font-semibold">+24</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary text-sm">Returning Customers</span>
                <span className="text-blue-400 font-semibold">156</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary text-sm">Active Sessions</span>
                <span className="text-purple-400 font-semibold">89</span>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-secondary border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-primary mb-4">System Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-secondary text-sm">Server Status</span>
                <span className="text-green-400 font-semibold">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary text-sm">Database</span>
                <span className="text-green-400 font-semibold">Healthy</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary text-sm">Last Backup</span>
                <span className="text-secondary text-sm">2 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
