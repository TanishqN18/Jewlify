'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaSpinner, FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaVenusMars, FaMapMarkerAlt, FaCreditCard, FaSave, FaArrowLeft, FaCrown, FaBriefcase, FaUserShield, FaUserTie, FaTimes, FaEdit } from 'react-icons/fa';

export default function EditUserPage({ params }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    role: 'customer'
  });

  useEffect(() => {
    if (params.id) {
      fetchUser();
    }
  }, [params.id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/users/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch user');
      const data = await response.json();
      
      setUser(data.user);
      setFormData({
        firstName: data.user.firstName || '',
        lastName: data.user.lastName || '',
        email: data.user.email || '',
        phone: data.user.phone || '',
        dob: data.user.dob || '',
        gender: data.user.gender || '',
        role: data.user.role || 'customer'
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      const response = await fetch(`/api/admin/users/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update user');

      const data = await response.json();
      
      // Modern success notification
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-4 right-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50 transform transition-all duration-500 translate-x-full';
      successDiv.innerHTML = `
        <div class="flex items-center space-x-3">
          <div class="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <span class="font-semibold">User updated successfully!</span>
        </div>
      `;
      document.body.appendChild(successDiv);
      
      setTimeout(() => successDiv.classList.remove('translate-x-full'), 100);
      setTimeout(() => {
        successDiv.classList.add('translate-x-full');
        setTimeout(() => document.body.removeChild(successDiv), 500);
      }, 3000);
      
      setTimeout(() => router.push('/admin/users'), 1500);
    } catch (err) {
      // Modern error notification
      const errorDiv = document.createElement('div');
      errorDiv.className = 'fixed top-4 right-4 bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50 transform transition-all duration-500 translate-x-full';
      errorDiv.innerHTML = `
        <div class="flex items-center space-x-3">
          <div class="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <span class="font-semibold">Error: ${err.message}</span>
        </div>
      `;
      document.body.appendChild(errorDiv);
      
      setTimeout(() => errorDiv.classList.remove('translate-x-full'), 100);
      setTimeout(() => {
        errorDiv.classList.add('translate-x-full');
        setTimeout(() => document.body.removeChild(errorDiv), 500);
      }, 5000);
    } finally {
      setSaving(false);
    }
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case 'admin': return FaCrown;
      case 'manager': return FaBriefcase;
      case 'customer': return FaUser;
      default: return FaUser;
    }
  };

  const getRoleColors = (role) => {
    switch(role) {
      case 'admin': return 'from-red-500 via-pink-500 to-rose-600';
      case 'manager': return 'from-blue-500 via-indigo-500 to-purple-600';
      case 'customer': return 'from-emerald-500 via-green-500 to-teal-600';
      default: return 'from-gray-500 via-slate-500 to-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center bg-gradient-to-br from-secondary/80 to-primary/20 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl max-w-md w-full">
          <div className="relative">
            <FaSpinner className="animate-spin text-5xl text-gold mb-6 mx-auto" />
            <div className="absolute inset-0 bg-gradient-to-r from-gold/20 to-yellow-500/20 rounded-full blur-xl"></div>
          </div>
          <p className="text-secondary text-lg font-medium">Loading user...</p>
          <div className="mt-4 w-32 h-1 bg-gradient-to-r from-gold to-yellow-500 rounded-full mx-auto animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center bg-gradient-to-br from-red-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-8 border border-red-400/30 shadow-2xl max-w-md w-full">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaTimes className="text-2xl text-white" />
          </div>
          <h3 className="text-xl font-bold text-red-400 mb-2">Error Loading User</h3>
          <p className="text-red-300 mb-6 text-sm">{error}</p>
          <button 
            onClick={() => router.push('/admin/users')}
            className="bg-gradient-to-r from-gold via-yellow-500 to-amber-600 text-primary px-6 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold w-full"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  const RoleIcon = getRoleIcon(formData.role);
  const roleColors = getRoleColors(formData.role);

  return (
    <div className="h-full flex flex-col">
      {/* Header Section - Scrollable */}
      <div className="mb-6">
        <div className="relative overflow-hidden bg-gradient-to-br from-secondary/90 via-secondary to-primary/10 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/20 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-gold/5 to-transparent"></div>
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center space-x-4 min-w-0">
              <button
                onClick={() => router.push('/admin/users')}
                className="group relative overflow-hidden bg-gradient-to-r from-secondary to-primary/20 p-3 rounded-xl border border-white/20 hover:border-gold/50 hover:shadow-lg hover:shadow-gold/20 hover:scale-110 transition-all duration-300 flex-shrink-0"
              >
                <FaArrowLeft className="text-lg text-secondary group-hover:text-gold transition-colors duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary to-gold bg-clip-text text-secondary truncate">
                  Edit User Profile
                </h1>
                <p className="text-secondary mt-1 flex items-center space-x-2 text-sm">
                  <FaEdit className="text-xs flex-shrink-0" />
                  <span className="truncate">Update user information and settings</span>
                </p>
              </div>
            </div>
            
            {/* User Avatar */}
            <div className="relative flex-shrink-0 self-center lg:self-auto">
              {user?.image ? (
                <div className="relative">
                  <img 
                    src={user.image} 
                    alt={`${formData.firstName} ${formData.lastName}`}
                    className="w-12 h-12 lg:w-14 lg:h-14 rounded-full object-cover ring-4 ring-white/20 shadow-xl"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold/20 to-transparent"></div>
                </div>
              ) : (
                <div className="relative w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-gradient-to-br from-gold via-yellow-500 to-amber-600 flex items-center justify-center shadow-xl ring-4 ring-white/20">
                  <span className="text-primary font-bold text-sm lg:text-base">
                    {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
                  </span>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400/20 to-transparent"></div>
                </div>
              )}
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br ${roleColors} flex items-center justify-center shadow-lg`}>
                <RoleIcon className="text-white text-xs" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content with single scroll */}
      <div className="flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-secondary/90 via-secondary to-primary/10 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <FaUser className="text-white text-sm" />
                </div>
                <h2 className="text-lg font-bold text-primary">Basic Information</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-secondary">
                    First Name
                  </label>
                  <div className="relative group/input">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full bg-gradient-to-r from-primary/20 to-primary/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-gold focus:shadow-lg focus:shadow-gold/20 hover:shadow-md transition-all duration-300 text-sm"
                      placeholder="Enter first name"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-gold/5 to-transparent opacity-0 group-focus-within/input:opacity-100 rounded-xl transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-secondary">
                    Last Name
                  </label>
                  <div className="relative group/input">
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full bg-gradient-to-r from-primary/20 to-primary/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-gold focus:shadow-lg focus:shadow-gold/20 hover:shadow-md transition-all duration-300 text-sm"
                      placeholder="Enter last name"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-gold/5 to-transparent opacity-0 group-focus-within/input:opacity-100 rounded-xl transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-secondary/90 via-secondary to-primary/10 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <FaEnvelope className="text-white text-sm" />
                </div>
                <h2 className="text-lg font-bold text-primary">Contact Information</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-secondary">
                    Email Address
                  </label>
                  <div className="relative group/input">
                    <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary text-sm group-focus-within/input:text-gold transition-colors duration-300" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-gradient-to-r from-primary/20 to-primary/10 backdrop-blur-sm border border-white/20 rounded-xl pl-12 pr-4 py-3 text-primary focus:outline-none focus:border-gold focus:shadow-lg focus:shadow-gold/20 hover:shadow-md transition-all duration-300 text-sm"
                      placeholder="Enter email address"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-gold/5 to-transparent opacity-0 group-focus-within/input:opacity-100 rounded-xl transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-secondary">
                    Phone Number
                  </label>
                  <div className="relative group/input">
                    <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary text-sm group-focus-within/input:text-gold transition-colors duration-300" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-gradient-to-r from-primary/20 to-primary/10 backdrop-blur-sm border border-white/20 rounded-xl pl-12 pr-4 py-3 text-primary focus:outline-none focus:border-gold focus:shadow-lg focus:shadow-gold/20 hover:shadow-md transition-all duration-300 text-sm"
                      placeholder="Enter phone number"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-gold/5 to-transparent opacity-0 group-focus-within/input:opacity-100 rounded-xl transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-secondary/90 via-secondary to-primary/10 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <FaCalendarAlt className="text-white text-sm" />
                </div>
                <h2 className="text-lg font-bold text-primary">Personal Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-secondary">
                    Date of Birth
                  </label>
                  <div className="relative group/input">
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className="w-full bg-gradient-to-r from-primary/20 to-primary/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-gold focus:shadow-lg focus:shadow-gold/20 hover:shadow-md transition-all duration-300 text-sm"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-gold/5 to-transparent opacity-0 group-focus-within/input:opacity-100 rounded-xl transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-secondary">
                    Gender
                  </label>
                  <div className="relative group/input">
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full bg-gradient-to-r from-primary/20 to-primary/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-gold focus:shadow-lg focus:shadow-gold/20 hover:shadow-md transition-all duration-300 cursor-pointer text-sm"
                    >
                      <option value="" className="bg-secondary text-primary">Select Gender</option>
                      <option value="male" className="bg-secondary text-primary">🚹 Male</option>
                      <option value="female" className="bg-secondary text-primary">🚺 Female</option>
                      <option value="other" className="bg-secondary text-primary">⚧ Other</option>
                    </select>
                    <div className="absolute inset-0 bg-gradient-to-r from-gold/5 to-transparent opacity-0 group-focus-within/input:opacity-100 rounded-xl transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-secondary">
                    Role
                  </label>
                  <div className="relative group/input">
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className={`w-full bg-gradient-to-br ${roleColors} text-white border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/50 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer font-semibold text-sm`}
                    >
                      <option value="customer" className="bg-secondary text-primary">👤 Customer</option>
                      <option value="manager" className="bg-secondary text-primary">💼 Manager</option>
                      <option value="admin" className="bg-secondary text-primary">👑 Admin</option>
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <RoleIcon className="text-white/80" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Addresses Section */}
          {user?.addresses && user.addresses.length > 0 && (
            <div className="group relative overflow-hidden bg-gradient-to-br from-secondary/90 via-secondary to-primary/10 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <FaMapMarkerAlt className="text-white text-sm" />
                  </div>
                  <h2 className="text-lg font-bold text-primary">Addresses ({user.addresses.length})</h2>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {user.addresses.map((address, index) => (
                    <div key={index} className="bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:shadow-lg hover:scale-105 transition-all duration-300">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-bold bg-yellow-400 bg-clip-text text-transparent truncate">
                          {address.label || `Address ${index + 1}`}
                        </span>
                        {address.isDefault && (
                          <span className="text-xs bg-gradient-to-r from-emerald-500 to-green-600 text-white px-3 py-1 rounded-full font-semibold shadow-lg flex-shrink-0 ml-2">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-primary font-medium break-words">{address.line1}</p>
                        <p className="text-xs text-secondary break-words">
                          {address.city}, {address.state} {address.zip}
                        </p>
                        {address.phone && (
                          <p className="text-xs text-secondary flex items-center break-all">
                            <FaPhone className="mr-2 flex-shrink-0" />
                            <span className="break-all">{address.phone}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Payment Methods Section */}
          {user?.paymentMethods && user.paymentMethods.length > 0 && (
            <div className="group relative overflow-hidden bg-gradient-to-br from-secondary/90 via-secondary to-primary/10 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <FaCreditCard className="text-white text-sm" />
                  </div>
                  <h2 className="text-lg font-bold text-primary">Payment Methods ({user.paymentMethods.length})</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {user.paymentMethods.map((payment, index) => (
                    <div key={index} className="bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:shadow-lg hover:scale-105 transition-all duration-300">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-bold bg-gradient-to-r from-gold to-yellow-400 bg-clip-text text-transparent truncate">
                          {payment.cardType}
                        </span>
                        {payment.isDefault && (
                          <span className="text-xs bg-gradient-to-r from-emerald-500 to-green-600 text-white px-3 py-1 rounded-full font-semibold shadow-lg flex-shrink-0 ml-2">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-primary font-mono">**** **** **** {payment.last4}</p>
                        <p className="text-xs text-secondary">Expires: {payment.expiry}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Spacer for sticky button */}
          <div className="h-20"></div>
        </form>
      </div>

      {/* Fixed Action Buttons */}
      <div className="flex-shrink-0 sticky bottom-0 bg-gradient-to-t from-secondary/95 via-secondary/90 to-transparent backdrop-blur-sm rounded-xl p-4 border-t border-white/10 mt-4">
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/users')}
            className="group relative overflow-hidden px-6 py-3 border border-white/20 rounded-xl text-secondary hover:text-primary hover:border-white/40 transition-all duration-300 font-semibold backdrop-blur-sm w-full sm:w-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10">Cancel</span>
          </button>
          <button
            type="submit"
            form="editUserForm"
            disabled={saving}
            onClick={handleSubmit}
            className="group relative overflow-hidden bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-600 text-primary px-6 py-3 rounded-xl hover:shadow-2xl hover:shadow-gold/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-3 font-semibold hover:scale-105 w-full sm:w-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            {saving ? (
              <>
                <FaSpinner className="animate-spin relative z-10" />
                <span className="relative z-10">Saving Changes...</span>
              </>
            ) : (
              <>
                <FaSave className="relative z-10" />
                <span className="relative z-10">Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}