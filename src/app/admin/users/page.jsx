'use client';
import { useState } from 'react';
import { FaEdit, FaTrash, FaUserPlus, FaSearch, FaFilter } from 'react-icons/fa';

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  
  const users = [
    { id: 1, name: 'Admin User', email: 'admin@aureza.com', role: 'Admin', status: 'Active', joinDate: '2023-01-15', lastActive: '2 min ago' },
    { id: 2, name: 'Manager User', email: 'manager@aureza.com', role: 'Manager', status: 'Active', joinDate: '2023-02-20', lastActive: '1 hour ago' },
    { id: 3, name: 'Customer User', email: 'customer@aureza.com', role: 'Customer', status: 'Active', joinDate: '2023-03-10', lastActive: '1 day ago' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@email.com', role: 'Customer', status: 'Inactive', joinDate: '2023-03-25', lastActive: '1 week ago' },
    { id: 5, name: 'John Doe', email: 'john@email.com', role: 'Customer', status: 'Active', joinDate: '2023-04-01', lastActive: '3 hours ago' }
  ];

  const getRoleColor = (role) => {
    switch(role) {
      case 'Admin': return 'bg-red-500/20 text-red-400';
      case 'Manager': return 'bg-blue-500/20 text-blue-400';
      case 'Customer': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusColor = (status) => {
    return status === 'Active' 
      ? 'bg-green-500/20 text-green-400' 
      : 'bg-red-500/20 text-red-400';
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="h-full flex flex-col space-y-4 overflow-hidden">
      {/* Header Section - Fixed */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
        <div>
          <h3 className="text-xl font-bold text-primary">User Management</h3>
          <p className="text-secondary text-sm">Manage and monitor all platform users</p>
        </div>
        <button className="bg-gradient-to-r from-gold to-yellow-600 text-primary px-4 py-2 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center space-x-2 text-sm">
          <FaUserPlus />
          <span>Add New User</span>
        </button>
      </div>

      {/* Stats Cards - Fixed */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 flex-shrink-0">
        <div className="bg-secondary border border-white/10 rounded-lg p-3 hover:shadow-lg hover:scale-105 transition-all duration-300">
          <h4 className="text-xs font-medium text-secondary">Total Users</h4>
          <p className="text-lg font-bold text-gold">{users.length}</p>
          <p className="text-xs text-green-400">+12% this month</p>
        </div>
        <div className="bg-secondary border border-white/10 rounded-lg p-3 hover:shadow-lg hover:scale-105 transition-all duration-300">
          <h4 className="text-xs font-medium text-secondary">Active Users</h4>
          <p className="text-lg font-bold text-green-400">{users.filter(u => u.status === 'Active').length}</p>
          <p className="text-xs text-green-400">85% active rate</p>
        </div>
        <div className="bg-secondary border border-white/10 rounded-lg p-3 hover:shadow-lg hover:scale-105 transition-all duration-300">
          <h4 className="text-xs font-medium text-secondary">New This Month</h4>
          <p className="text-lg font-bold text-blue-400">3</p>
          <p className="text-xs text-blue-400">Good growth</p>
        </div>
        <div className="bg-secondary border border-white/10 rounded-lg p-3 hover:shadow-lg hover:scale-105 transition-all duration-300">
          <h4 className="text-xs font-medium text-secondary">Admin Users</h4>
          <p className="text-lg font-bold text-red-400">{users.filter(u => u.role === 'Admin').length}</p>
          <p className="text-xs text-secondary">System admins</p>
        </div>
      </div>

      {/* Search and Filter Section - Fixed */}
      <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary text-sm" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-secondary border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-primary placeholder-secondary focus:outline-none focus:border-gold transition-colors"
          />
        </div>
        <div className="relative">
          <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary text-sm" />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="bg-secondary border border-white/10 rounded-lg pl-10 pr-8 py-2 text-sm text-primary focus:outline-none focus:border-gold transition-colors"
          >
            <option value="all">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Customer">Customer</option>
          </select>
        </div>
      </div>

      {/* Users Table - Scrollable */}
      <div className="bg-secondary rounded-lg shadow-lg border border-white/10 flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-primary/20 sticky top-0">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-primary">User</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-primary">Role</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-primary">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-primary">Join Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-primary">Last Active</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr 
                  key={user.id} 
                  className="border-b border-white/5 hover:bg-primary/10 transition-colors duration-200"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-yellow-600 flex items-center justify-center mr-3 shadow-md">
                        <span className="text-primary font-bold text-sm">{user.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-primary hover:text-gold transition-colors cursor-pointer text-sm">{user.name}</p>
                        <p className="text-xs text-secondary">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-secondary text-sm">{user.joinDate}</td>
                  <td className="px-4 py-3 text-secondary text-sm">{user.lastActive}</td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-1">
                      <button className="text-blue-400 hover:text-blue-300 hover:scale-110 transition-all duration-200 p-1.5 hover:bg-blue-500/10 rounded-md">
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

        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaSearch className="text-lg text-gold" />
            </div>
            <h3 className="text-sm font-semibold text-primary mb-1">No users found</h3>
            <p className="text-xs text-secondary">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
