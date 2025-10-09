'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaFilter, FaEye, FaBoxes, FaSpinner, FaCoins, FaGem, FaTimes, FaExclamationTriangle } from 'react-icons/fa';

// --- Updated Toast Function (copied from AddProduct module) ---
function showToast(message, type = 'success') {
  const isSuccess = type === 'success';
  const toast = document.createElement("div");
  toast.className = `fixed top-4 right-4 bg-gradient-to-r ${
    isSuccess ? 'from-emerald-500 to-green-600' : 'from-red-500 to-pink-600'
  } text-white px-6 py-4 rounded-xl shadow-2xl z-50 transform transition-all duration-500 translate-x-full`;
  
  toast.innerHTML = `
    <div class="flex items-center space-x-3">
      <div class="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          ${isSuccess 
            ? '<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>'
            : '<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>'
          }
        </svg>
      </div>
      <span class="font-semibold">${message}</span>
    </div>`;
  
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.remove("translate-x-full"), 100);
  setTimeout(() => {
    toast.classList.add("translate-x-full");
    setTimeout(() => document.body.removeChild(toast), 500);
  }, isSuccess ? 3000 : 5000);
}
// ------------------------------------------------------------

export default function ItemsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [rates, setRates] = useState({ goldRate: 0, silverRate: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [pagination, setPagination] = useState({});
  
  // Add state for delete confirmation modal
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    productId: null,
    productName: ''
  });

  // Fetch products and rates separately
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        search: searchTerm,
        category: filterCategory,
        status: filterStatus,
        page: 1,
        limit: 50
      });

      const [productsResponse, ratesResponse] = await Promise.all([
        fetch(`/api/admin/products?${params}`),
        fetch('/api/admin/rates')
      ]);

      const productsData = await productsResponse.json();
      const ratesData = await ratesResponse.json();

      if (productsData.success) {
        setProducts(productsData.products);
        setPagination(productsData.pagination);
      }

      if (ratesData.success) {
        setRates(ratesData.rates);
      }
    } catch (error) {
      showToast('Error fetching data. Please try again later.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, filterCategory, filterStatus]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Available': return 'bg-green-500/20 text-green-400';
      case 'Low Stock': return 'bg-yellow-500/20 text-yellow-400';
      case 'Out of Stock': return 'bg-red-500/20 text-red-400';
      case 'Discontinued': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getPriceTypeIcon = (priceType, material) => {
    if (priceType === 'weight-based') {
      return material === 'Gold' ? <FaCoins className="text-yellow-400" /> : <FaCoins className="text-gray-400" />;
    }
    return <FaGem className="text-purple-400" />;
  };

  // Updated delete functions
  const openDeleteModal = (productId, productName) => {
    setDeleteModal({
      isOpen: true,
      productId,
      productName
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      productId: null,
      productName: ''
    });
  };

  // Update confirmDelete function
  const confirmDelete = async () => {
    try {
      showToast('Deleting product...', 'info');

      const response = await fetch(`/api/admin/products/${deleteModal.productId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        showToast('Product deleted successfully!', 'success');
        fetchProducts(); // Refresh the list
        closeDeleteModal(); // Close modal without showing cancel toast
      } else {
        showToast('Failed to delete product. Please try again.', 'error');
      }
    } catch (error) {
      showToast('Error deleting product. Please try again later.', 'error');
    }
  };

  const getTotalValue = () => {
    return products.reduce((sum, item) => sum + (item.currentPrice * item.stock), 0);
  };

  const getTotalSales = () => {
    return products.reduce((sum, item) => sum + (item.salesCount || 0), 0);
  };

  const getLowStockCount = () => {
    return products.filter(item => item.status === 'Low Stock' || item.status === 'Out of Stock').length;
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-gold mb-4 mx-auto" />
          <p className="text-secondary">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-4 overflow-hidden">
      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-gradient-to-br from-secondary via-secondary to-primary/20 rounded-2xl p-6 border border-white/10 shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center border border-red-400/30">
                  <FaExclamationTriangle className="text-red-400 text-xl" />
                </div>
                <h3 className="text-xl font-bold text-primary">Confirm Delete</h3>
              </div>
              <button
                onClick={() => {
                  setDeleteModal({ isOpen: false, productId: null, productName: '' });
                  showToast('Delete action was canceled.', 'info');
                }}
                className="text-secondary hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>
            
            <div className="mb-8">
              <p className="text-secondary mb-4 text-base leading-relaxed">
                Are you sure you want to delete this product?
              </p>
              <div className="bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-400/30 rounded-xl p-4">
                <p className="text-primary font-bold text-lg mb-1">
                  {deleteModal.productName}
                </p>
                <p className="text-red-400 text-sm font-medium">
                  ⚠️ This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => {
                  closeDeleteModal(); // Close modal
                  showToast('Delete action was canceled.', 'info'); // Show cancel toast only when explicitly canceled
                }}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-secondary/80 to-secondary border border-white/20 text-primary hover:text-white hover:border-white/40 transition-all duration-200 text-base font-semibold hover:shadow-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-200 text-base font-semibold shadow-lg hover:shadow-xl hover:shadow-red-500/30 transform hover:scale-105"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
        <div>
          <h3 className="text-xl font-bold text-primary">Products Management</h3>
          <p className="text-secondary text-sm">Manage your jewelry inventory and catalog</p>
          <div className="mt-2 flex items-center space-x-4 text-xs">
            <span className="text-yellow-400">Gold: ₹{rates.goldRate}/g</span>
            <span className="text-gray-400">Silver: ₹{rates.silverRate}/g</span>
          </div>
        </div>
        <button 
          onClick={() => router.push('/admin/AddProduct')}
          className="bg-gradient-to-r from-yellow-300 to-amber-500 text-primary px-4 py-2 rounded-xl border border-amber-500 hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center space-x-2 text-sm"
        >
          <FaPlus />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 flex-shrink-0">
        <div className="bg-secondary border border-white/10 rounded-lg p-3 hover:shadow-lg hover:scale-105 transition-all duration-300">
          <h4 className="text-xs font-medium text-secondary">Total Products</h4>
          <p className="text-lg font-bold text-gold">{products.length}</p>
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
          <p className="text-lg font-bold text-yellow-400">{getLowStockCount()}</p>
          <p className="text-xs text-yellow-400">Need attention</p>
        </div>
      </div>

      {/* Search and Filter Section */}
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
              <option value="Pendants">Pendants</option>
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
            <option value="Discontinued">Discontinued</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-secondary rounded-lg shadow-lg border border-white/10 flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-auto">
          <table className="w-full min-w-[1200px]">
            <thead className="bg-primary/20 top-0">
              <tr>
                <th className="text-center px-4 py-3 text-xs font-semibold text-primary">Product</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-primary">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-primary">Material</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-primary">Weight (gm)</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-primary">Current Price</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-primary">Stock</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-primary">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-primary">Sales</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr 
                  key={item._id} 
                  className="border-b border-white/5 hover:bg-primary/10 transition-colors duration-200"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-lg overflow-hidden mr-3 bg-primary/20">
                        {item.coverImage ? (
                          <Image
                            src={item.coverImage}
                            width={48}
                            height={48}
                            alt={item.name}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-200"
                            unoptimized
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/fallback.png';
                            }}
                          />
                        ) : item.image && item.image[0] ? (
                          <Image
                            src={item.image[0]}
                            width={48}
                            height={48}
                            alt={item.name}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-200"
                            unoptimized
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/fallback.png';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                            <FaBoxes className="text-secondary" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-primary text-sm hover:text-gold transition-colors cursor-pointer">{item.name}</p>
                        <p className="text-xs text-secondary">SKU: {item.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-primary/20 text-primary px-2 py-1 rounded text-xs font-medium">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      {getPriceTypeIcon(item.priceType, item.material)}
                      <span className="text-primary text-sm">{item.material}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                      <span className="text-secondary font-medium text-sm">{item.weight} gm</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-gold text-sm">₹{item.currentPrice?.toLocaleString()}</span>
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
                    <span className="text-blue-400 font-medium text-sm">{item.salesCount || 0} sold</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-1">
                      <button 
                        onClick={() => router.push(`/admin/items/${item._id}`)}
                        className="text-blue-400 hover:text-blue-300 hover:scale-110 transition-all duration-200 p-1.5 hover:bg-blue-500/10 rounded-md flex items-center"
                      >
                        <FaEye className="text-sm mr-1" />
                        <span className="text-xs">View/Edit</span>
                      </button>
                      <button 
                        onClick={() => openDeleteModal(item._id, item.name)}
                        className="text-red-400 hover:text-red-300 hover:scale-110 transition-all duration-200 p-1.5 hover:bg-red-500/10 rounded-md flex items-center"
                      >
                        <FaTrash className="text-sm mr-1" />
                        <span className="text-xs">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && !loading && (
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