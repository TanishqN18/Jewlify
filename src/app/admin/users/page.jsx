'use client';
import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaUserPlus, FaSearch, FaFilter, FaSpinner, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCreditCard } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [error, setError] = useState(null);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete user');
      
      setUsers(users.filter(user => user._id !== userId));
    } catch (err) {
      alert('Error deleting user: ' + err.message);
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      if (!response.ok) throw new Error('Failed to update user role');
      
      setUsers(users.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      ));
    } catch (err) {
      alert('Error updating user: ' + err.message);
    }
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'admin': return 'bg-red-500/20 text-red-400';
      case 'manager': return 'bg-blue-500/20 text-blue-400';
      case 'customer': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  // Get full name helper
  const getFullName = (user) => {
    const firstName = user?.firstName || '';
    const lastName = user?.lastName || '';
    return `${firstName} ${lastName}`.trim() || 'Unknown User';
  };

  // Get user initials
  const getUserInitials = (user) => {
    const firstName = user?.firstName || '';
    const lastName = user?.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
  };

  // Fixed filtering with null/undefined checks for new model structure
  const filteredUsers = users.filter(user => {
    const fullName = getFullName(user);
    const userEmail = user?.email || '';
    const userRole = user?.role || '';
    
    const matchesSearch = fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || userRole === filterRole;
    return matchesSearch && matchesRole;
  });

  // Safe stats calculation with null checks
  const stats = {
    total: users.length,
    customers: users.filter(u => u?.role === 'customer').length,
    newThisMonth: users.filter(u => {
      if (!u?.createdAt) return false;
      const joinDate = new Date(u.createdAt);
      const thisMonth = new Date();
      return joinDate.getMonth() === thisMonth.getMonth() && 
             joinDate.getFullYear() === thisMonth.getFullYear();
    }).length,
    admins: users.filter(u => u?.role === 'admin').length
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-gold mb-4 mx-auto" />
          <p className="text-secondary">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <button 
            onClick={fetchUsers}
            className="bg-gold text-primary px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-4 overflow-hidden">
      {/* Header Section - Fixed */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
        <div>
          <h3 className="text-xl font-bold text-primary">User Management</h3>
          <p className="text-secondary text-sm">Manage and monitor all platform users</p>
        </div>
        {/* <button 
          onClick={() => router.push('/admin/users/create')}
          className="bg-gradient-to-r from-gold to-yellow-600 text-primary px-4 py-2 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center space-x-2 text-sm"
        >
          <FaUserPlus />
          <span>Add New User</span>
        </button> */}
      </div>

      {/* Stats Cards - Fixed */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 flex-shrink-0">
        <div className="bg-secondary border border-white/10 rounded-lg p-3 hover:shadow-lg hover:scale-105 transition-all duration-300">
          <h4 className="text-xs font-medium text-secondary">Total Users</h4>
          <p className="text-lg font-bold text-black">{stats.total}</p>
          <p className="text-xs text-green-400">
            +{stats.total > 0 ? ((stats.newThisMonth / stats.total) * 100).toFixed(1) : 0}% this month
          </p>
        </div>
        <div className="bg-secondary border border-white/10 rounded-lg p-3 hover:shadow-lg hover:scale-105 transition-all duration-300">
          <h4 className="text-xs font-medium text-secondary">Customers</h4>
          <p className="text-lg font-bold text-green-400">{stats.customers}</p>
          <p className="text-xs text-green-400">
            {stats.total > 0 ? ((stats.customers / stats.total) * 100).toFixed(1) : 0}% of users
          </p>
        </div>
        <div className="bg-secondary border border-white/10 rounded-lg p-3 hover:shadow-lg hover:scale-105 transition-all duration-300">
          <h4 className="text-xs font-medium text-secondary">New This Month</h4>
          <p className="text-lg font-bold text-blue-400">{stats.newThisMonth}</p>
          <p className="text-xs text-blue-400">Good growth</p>
        </div>
        <div className="bg-secondary border border-white/10 rounded-lg p-3 hover:shadow-lg hover:scale-105 transition-all duration-300">
          <h4 className="text-xs font-medium text-secondary">Admin Users</h4>
          <p className="text-lg font-bold text-red-400">{stats.admins}</p>
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
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="customer">Customer</option>
          </select>
        </div>
      </div>

      {/* Users Table - Scrollable */}
      <div className="bg-secondary rounded-lg shadow-lg border border-white/10 flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-primary/20 sticky top-0">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-primary">User</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-primary">Contact</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-primary">Role</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-primary">Join Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-primary">Info</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr 
                  key={user._id} 
                  className="border-b border-white/5 hover:bg-primary/10 transition-colors duration-200"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      {user?.image ? (
                        <img 
                          src={user.image} 
                          alt={getFullName(user)}
                          className="w-8 h-8 rounded-full mr-3 shadow-md object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-yellow-600 flex items-center justify-center mr-3 shadow-md">
                          <span className="text-primary font-bold text-sm">
                            {getUserInitials(user)}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-primary hover:text-gold transition-colors cursor-pointer text-sm">
                          {getFullName(user)}
                        </p>
                        <p className="text-xs text-secondary">ID: {user?.clerkId || 'No ID'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <FaEnvelope className="w-3 h-3 mr-2 text-secondary" />
                        <span className="text-primary">{user?.email || 'No email'}</span>
                      </div>
                      {user?.phone && (
                        <div className="flex items-center text-sm">
                          <FaPhone className="w-3 h-3 mr-2 text-secondary" />
                          <span className="text-secondary">{user.phone}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <select 
                      value={user?.role || 'customer'}
                      onChange={(e) => handleUpdateUserRole(user._id, e.target.value)}
                      className={`px-2 py-1 rounded-full text-xs font-medium border-none outline-none cursor-pointer ${getRoleColor(user?.role)}`}
                      style={{ backgroundColor: 'transparent' }}
                    >
                      <option value="customer">Customer</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      <p className="text-primary">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                      </p>
                      {user?.dob && (
                        <p className="text-xs text-secondary">
                          Born: {new Date(user.dob).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2 text-xs">
                      {user?.addresses?.length > 0 && (
                        <div className="flex items-center bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                          <FaMapMarkerAlt className="w-3 h-3 mr-1" />
                          <span>{user.addresses.length}</span>
                        </div>
                      )}
                      {user?.paymentMethods?.length > 0 && (
                        <div className="flex items-center bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">
                          <FaCreditCard className="w-3 h-3 mr-1" />
                          <span>{user.paymentMethods.length}</span>
                        </div>
                      )}
                      {user?.gender && (
                        <span className="bg-gray-500/20 text-gray-400 px-2 py-1 rounded-full">
                          {user.gender}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-1">
                      <button 
                        onClick={() => router.push(`/admin/users/${user._id}/edit`)}
                        className="text-blue-400 hover:text-blue-300 hover:scale-110 transition-all duration-200 p-1.5 hover:bg-blue-500/10 rounded-md"
                        title="Edit User"
                      >
                        <FaEdit className="text-sm" />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user._id)}
                        className="text-red-400 hover:text-red-300 hover:scale-110 transition-all duration-200 p-1.5 hover:bg-red-500/10 rounded-md"
                        title="Delete User"
                      >
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
