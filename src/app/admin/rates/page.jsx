'use client';
import { useState, useEffect } from 'react';
import { FaCoins, FaSave, FaHistory, FaSpinner, FaEdit, FaClock } from 'react-icons/fa';

export default function RatesManagementPage() {
  const [currentRates, setCurrentRates] = useState({ goldRate: 0, silverRate: 0 });
  const [formData, setFormData] = useState({
    goldRate: '',
    silverRate: '',
    notes: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetchCurrentRates();
    fetchRateHistory();
  }, []);

  const fetchCurrentRates = async () => {
    try {
      const response = await fetch('/api/admin/rates');
      const data = await response.json();
      
      if (data.success) {
        setCurrentRates(data.rates);
        setFormData({
          goldRate: data.rates.goldRate.toString(),
          silverRate: data.rates.silverRate.toString(),
          notes: ''
        });
      }
    } catch (error) {
      console.error('Error fetching rates:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRateHistory = async () => {
    try {
      const response = await fetch('/api/admin/rates/history?limit=10');
      const data = await response.json();
      
      if (data.success) {
        setHistory(data.rates);
      }
    } catch (error) {
      console.error('Error fetching rate history:', error);
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
    setSaving(true);

    try {
      const response = await fetch('/api/admin/rates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          updatedBy: 'Admin' // You can replace this with actual user info
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCurrentRates(data.rates);
        setFormData(prev => ({ ...prev, notes: '' }));
        fetchRateHistory(); // Refresh history

        // Success notification
        const successDiv = document.createElement('div');
        successDiv.className = 'fixed top-4 right-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50 transform transition-all duration-500 translate-x-full';
        successDiv.innerHTML = `
          <div class="flex items-center space-x-3">
            <div class="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <span class="font-semibold">Rates updated successfully!</span>
          </div>
        `;
        document.body.appendChild(successDiv);
        
        setTimeout(() => successDiv.classList.remove('translate-x-full'), 100);
        setTimeout(() => {
          successDiv.classList.add('translate-x-full');
          setTimeout(() => document.body.removeChild(successDiv), 500);
        }, 3000);
      } else {
        throw new Error(data.error || 'Failed to update rates');
      }
    } catch (error) {
      console.error('Error updating rates:', error);
      
      // Error notification
      const errorDiv = document.createElement('div');
      errorDiv.className = 'fixed top-4 right-4 bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50 transform transition-all duration-500 translate-x-full';
      errorDiv.innerHTML = `
        <div class="flex items-center space-x-3">
          <div class="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <span class="font-semibold">Error: ${error.message}</span>
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

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-gold mb-4 mx-auto" />
          <p className="text-secondary">Loading rates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0">
        <div className="relative overflow-hidden bg-gradient-to-br from-secondary/90 via-secondary to-primary/10 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/20 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-gold/5 to-transparent"></div>
          <div className="relative">
            <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary to-gold bg-clip-text text-primary">
              Rate Management
            </h1>
            <p className="text-secondary mt-1 text-sm">Manage gold and silver rates for price calculations</p>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        {/* Current Rates Display */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-secondary/90 via-secondary to-primary/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl h-full">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                <FaCoins className="text-white text-sm" />
              </div>
              <h2 className="text-lg font-bold text-primary">Current Rates</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-yellow-500/20 to-amber-600/20 rounded-xl p-4 border border-yellow-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-primary">Gold Rate</span>
                  <FaCoins className="text-yellow-400" />
                </div>
                <p className="text-2xl font-bold text-yellow-400 mt-1">₹{currentRates.goldRate}/g</p>
              </div>
              
              <div className="bg-gradient-to-br from-gray-400/20 to-slate-500/20 rounded-xl p-4 border border-gray-400/30">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-secondary">Silver Rate</span>
                  <FaCoins className="text-gray-400" />
                </div>
                <p className="text-2xl font-bold text-gray-400 mt-1">₹{currentRates.silverRate}/g</p>
              </div>

              {currentRates.updatedAt && (
                <div className="text-xs text-secondary">
                  Last updated: {new Date(currentRates.updatedAt).toLocaleString()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Update Rates Form */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-secondary/90 via-secondary to-primary/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl h-full">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <FaEdit className="text-white text-sm" />
              </div>
              <h2 className="text-lg font-bold text-primary">Update Rates</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-secondary">Gold Rate (₹/gram)</label>
                <input
                  type="number"
                  name="goldRate"
                  value={formData.goldRate}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  required
                  className="w-full bg-gradient-to-r from-primary/20 to-primary/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-gold focus:shadow-lg focus:shadow-gold/20 hover:shadow-md transition-all duration-300 text-sm"
                  placeholder="Enter gold rate per gram"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-secondary">Silver Rate (₹/gram)</label>
                <input
                  type="number"
                  name="silverRate"
                  value={formData.silverRate}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  required
                  className="w-full bg-gradient-to-r from-primary/20 to-primary/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-gold focus:shadow-lg focus:shadow-gold/20 hover:shadow-md transition-all duration-300 text-sm"
                  placeholder="Enter silver rate per gram"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-secondary">Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full bg-gradient-to-r from-primary/20 to-primary/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-gold focus:shadow-lg focus:shadow-gold/20 hover:shadow-md transition-all duration-300 text-sm resize-none"
                  placeholder="Add any notes about this rate update..."
                />
              </div>
              
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-600 text-primary px-6 py-3 rounded-xl hover:shadow-2xl hover:shadow-gold/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-3 font-semibold hover:scale-105"
              >
                {saving ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Updating Rates...</span>
                  </>
                ) : (
                  <>
                    <FaSave />
                    <span>Update Rates</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Rate History */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-secondary/90 via-secondary to-primary/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl h-full flex flex-col">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <FaHistory className="text-white text-sm" />
              </div>
              <h2 className="text-lg font-bold text-primary">Recent History</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3">
              {history.map((rate, index) => (
                <div key={rate._id} className="bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-secondary flex items-center">
                      <FaClock className="mr-1" />
                      {new Date(rate.createdAt).toLocaleDateString()}
                    </span>
                    {rate.isActive && (
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">Active</span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-yellow-400">Gold: ₹{rate.goldRate}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Silver: ₹{rate.silverRate}</span>
                    </div>
                  </div>
                  {rate.notes && (
                    <p className="text-xs text-secondary mt-2 truncate">{rate.notes}</p>
                  )}
                  <p className="text-xs text-secondary mt-1">By: {rate.updatedBy}</p>
                </div>
              ))}
              
              {history.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-sm text-secondary">No rate history available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}