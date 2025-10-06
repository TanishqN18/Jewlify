'use client';
import { useEffect, useMemo, useState } from 'react';
import {
  FaEye, FaEdit, FaDownload, FaSearch, FaFilter, FaShippingFast,
  FaCheckCircle, FaClock, FaTimes, FaSave, FaChevronDown, FaCheck
} from 'react-icons/fa';

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

const dateOptions = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });

  // Modals
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Inline row status dropdown
  const [openStatusFor, setOpenStatusFor] = useState(null);

  const [editForm, setEditForm] = useState({
    paymentMethod: '',
    status: 'pending',
    shippingAddress: {
      name: '', email: '', phone: '',
      address: '', city: '', postalCode: '', country: ''
    }
  });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(pagination.page),
        limit: String(pagination.limit),
      });
      if (filterStatus !== 'all') params.set('status', filterStatus);
      if (filterDate !== 'all') params.set('dateRange', filterDate);
      if (searchTerm) params.set('search', searchTerm);

      const res = await fetch(`/api/admin/orders?${params.toString()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setOrders(data.orders || []);
      setPagination(data.pagination || { page: 1, limit: 20, total: 0, pages: 0 });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, filterStatus, filterDate]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setPagination(p => ({ ...p, page: 1 }));
      fetchOrders();
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-500/20 text-green-400';
      case 'confirmed': return 'bg-blue-500/20 text-blue-400';
      case 'shipped': return 'bg-purple-500/20 text-purple-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'cancelled': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <FaCheckCircle className="text-green-400" />;
      case 'confirmed': return <FaCheckCircle className="text-blue-400" />;
      case 'shipped': return <FaShippingFast className="text-purple-400" />;
      case 'pending': return <FaClock className="text-yellow-400" />;
      case 'cancelled': return <FaCheckCircle className="text-red-400" />;
      default: return <FaClock className="text-gray-400" />;
    }
  };

  const totalRevenue = useMemo(
    () => orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + Number(o.total || 0), 0),
    [orders]
  );

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      const updated = await res.json();
      setOrders(prev => prev.map(o => (o._id === id ? updated : o)));
    } catch (e) {
      console.error(e);
    }
  };

  const formatINR = (n) => `₹${Number(n || 0).toLocaleString()}`;

  // Fetch single order for modals
  const fetchOrderById = async (id) => {
    setModalLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load order');
      const data = await res.json();
      setSelected(data);
      return data;
    } finally {
      setModalLoading(false);
    }
  };

  const openView = async (id) => {
    await fetchOrderById(id);
    setViewOpen(true);
  };

  const openEdit = async (id) => {
    const data = await fetchOrderById(id);
    setEditForm({
      paymentMethod: data.paymentMethod || 'COD',
      status: data.status || 'pending',
      shippingAddress: {
        name: data.shippingAddress?.name || '',
        email: data.shippingAddress?.email || '',
        phone: data.shippingAddress?.phone || '',
        address: data.shippingAddress?.address || '',
        city: data.shippingAddress?.city || '',
        postalCode: data.shippingAddress?.postalCode || '',
        country: data.shippingAddress?.country || ''
      }
    });
    setEditOpen(true);
  };

  const handleEditField = (field, value) => {
    setEditForm((f) => ({ ...f, [field]: value }));
  };
  const handleEditAddressField = (field, value) => {
    setEditForm((f) => ({ ...f, shippingAddress: { ...f.shippingAddress, [field]: value } }));
  };

  const saveEdit = async () => {
    if (!selected?._id) return;
    try {
      setModalLoading(true);
      const res = await fetch(`/api/admin/orders/${selected._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod: editForm.paymentMethod,
          status: editForm.status,
          shippingAddress: editForm.shippingAddress
        })
      });
      if (!res.ok) throw new Error('Failed to save changes');
      const updated = await res.json();
      setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
      setSelected(updated);
      setEditOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setModalLoading(false);
    }
  };

  // Close open inline status menu on global click
  useEffect(() => {
    const closeOnOutside = () => setOpenStatusFor(null);
    window.addEventListener('scroll', closeOnOutside, true);
    window.addEventListener('click', closeOnOutside);
    return () => {
      window.removeEventListener('scroll', closeOnOutside, true);
      window.removeEventListener('click', closeOnOutside);
    };
  }, []);

  return (
    <div className="h-full flex flex-col space-y-4 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
        <div>
          <h3 className="text-xl font-bold text-primary">Orders Management</h3>
          <p className="text-secondary text-sm">Track and manage all customer orders</p>
        </div>
        <button
          onClick={() => window.open(`/api/admin/orders?limit=1000`, '_blank')}
          className="bg-gradient-to-r from-yellow-300 to-yellow-500 text-primary px-4 py-2 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center space-x-2 text-sm"
        >
          <FaDownload />
          <span>Export (JSON)</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 flex-shrink-0">
        <div className="bg-secondary border border-white/10 rounded-lg p-3 hover:shadow-lg hover:scale-105 transition-all duration-300">
          <h4 className="text-xs font-medium text-secondary">Total Orders</h4>
          <p className="text-lg font-bold text-gold">{pagination.total}</p>
          <p className="text-xs text-green-400">Live from DB</p>
        </div>
        <div className="bg-secondary border border-white/10 rounded-lg p-3 hover:shadow-lg hover:scale-105 transition-all duration-300">
          <h4 className="text-xs font-medium text-secondary">Total Revenue</h4>
          <p className="text-lg font-bold text-green-400">{formatINR(totalRevenue)}</p>
          <p className="text-xs text-green-400">Excludes cancelled</p>
        </div>
        <div className="bg-secondary border border-white/10 rounded-lg p-3 hover:shadow-lg hover:scale-105 transition-all duration-300">
          <h4 className="text-xs font-medium text-secondary">Delivered</h4>
          <p className="text-lg font-bold text-blue-400">{orders.filter(o => o.status === 'delivered').length}</p>
          <p className="text-xs text-blue-400">Current page</p>
        </div>
        <div className="bg-secondary border border-white/10 rounded-lg p-3 hover:shadow-lg hover:scale-105 transition-all duration-300">
          <h4 className="text-xs font-medium text-secondary">Pending</h4>
          <p className="text-lg font-bold text-yellow-400">{orders.filter(o => o.status === 'pending').length}</p>
          <p className="text-xs text-yellow-400">Need attention</p>
        </div>
      </div>

      {/* Search + Modern filters */}
      <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-sm" />
          <input
            type="text"
            placeholder="Search by order id, name, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-secondary border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-primary placeholder-secondary focus:outline-none focus:border-gold transition-colors"
          />
        </div>

        <ModernSelect
          icon={<FaFilter className="text-secondary" />}
          value={filterStatus}
          options={[{ value: 'all', label: 'All Status' }, ...statusOptions]}
          onChange={(v) => { setFilterStatus(v); setPagination(p => ({ ...p, page: 1 })); }}
          className="min-w-[170px]"
        />
        <ModernSelect
          value={filterDate}
          options={dateOptions}
          onChange={(v) => { setFilterDate(v); setPagination(p => ({ ...p, page: 1 })); }}
          className="min-w-[150px]"
        />
      </div>

      {/* Orders Table */}
      <div className="bg-secondary rounded-lg shadow-lg border border-white/10 flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex h-full items-center justify-center text-secondary">Loading...</div>
          ) : (
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
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-white/5 hover:bg-primary/10 transition-colors duration-200">
                    <td className="px-4 py-3">
                      <span className="font-bold text-primary text-sm">{order._id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-yellow-600 flex items-center justify-center mr-3 shadow-md">
                          <span className="text-primary font-bold text-sm">
                            {(order.shippingAddress?.name || '?').charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-primary text-sm">{order.shippingAddress?.name || '-'}</p>
                          <p className="text-xs text-secondary">{order.shippingAddress?.email || order.shippingAddress?.phone || '-'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-primary/20 text-primary px-2 py-1 rounded text-xs font-medium">
                        {order.items?.length || 0} item{(order.items?.length || 0) > 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-gold text-sm">{formatINR(order.total)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>

                        {/* Modern inline status menu */}
                        <div
                          className="relative"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => setOpenStatusFor(openStatusFor === order._id ? null : order._id)}
                            className="flex items-center gap-1 bg-primary/10 hover:bg-primary/20 border border-white/10 rounded px-2 py-1 text-xs text-primary transition-colors"
                          >
                            Change <FaChevronDown className="opacity-70" />
                          </button>
                          {openStatusFor === order._id && (
                            <div
                              className="absolute right-0 mt-2 w-40 bg-secondary border border-white/10 rounded-lg shadow-xl p-1 z-50"
                              onMouseLeave={() => setOpenStatusFor(null)}
                            >
                              {statusOptions.map((opt) => (
                                <button
                                  key={opt.value}
                                  onClick={() => { updateStatus(order._id, opt.value); setOpenStatusFor(null); }}
                                  className={`w-full flex items-center justify-between text-left px-3 py-2 rounded-md text-xs hover:bg-primary/15 transition ${
                                    order.status === opt.value ? 'bg-primary/10' : ''
                                  }`}
                                >
                                  <span className="flex items-center gap-2">
                                    {getStatusIcon(opt.value)}
                                    <span className="capitalize">{opt.label}</span>
                                  </span>
                                  {order.status === opt.value && <FaCheck className="text-gold" />}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-secondary">{order.paymentMethod}</span>
                    </td>
                    <td className="px-4 py-3 text-secondary text-sm">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); openView(order._id); }}
                          className="text-blue-400 hover:text-blue-300 hover:scale-110 transition-all duration-200 p-1.5 hover:bg-blue-500/10 rounded-md"
                          title="View"
                        >
                          <FaEye className="text-sm" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); openEdit(order._id); }}
                          className="text-green-400 hover:text-green-300 hover:scale-110 transition-all duration-200 p-1.5 hover:bg-green-500/10 rounded-md"
                          title="Edit"
                        >
                          <FaEdit className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-white/10">
          <span className="text-sm text-secondary">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} orders
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => setPagination(p => ({ ...p, page: Math.max(1, p.page - 1) }))}
              disabled={pagination.page <= 1}
              className="px-3 py-1 bg-primary/20 rounded text-sm text-primary disabled:opacity-50 hover:bg-primary/30 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPagination(p => ({ ...p, page: Math.min(p.pages, p.page + 1) }))}
              disabled={pagination.page >= pagination.pages}
              className="px-3 py-1 bg-primary/20 rounded text-sm text-primary disabled:opacity-50 hover:bg-primary/30 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Render Modals */}
      <ViewModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        order={selected}
        loading={modalLoading}
        formatINR={formatINR}
        getStatusColor={getStatusColor}
        getStatusIcon={getStatusIcon}
      />
      <EditModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        order={selected}
        form={editForm}
        setField={handleEditField}
        setAddrField={handleEditAddressField}
        save={saveEdit}
        loading={modalLoading}
        getStatusColor={getStatusColor}
      />
    </div>
  );
}

/* ------------- Modern Select (filters) ------------- */
function ModernSelect({ value, options, onChange, icon, className = '' }) {
  const [open, setOpen] = useState(false);
  const selected = options.find(o => o.value === value) || options[0];

  return (
    <div className={`relative ${className}`} onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full bg-secondary border border-white/10 rounded-lg px-3 py-2 text-sm text-primary flex items-center justify-between hover:bg-primary/20 transition-colors"
      >
        <span className="flex items-center gap-2">
          {icon}
          <span>{selected?.label}</span>
        </span>
        <FaChevronDown className={`ml-2 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div
          className="absolute z-50 mt-2 w-full bg-secondary border border-white/10 rounded-lg shadow-xl p-1"
          onMouseLeave={() => setOpen(false)}
        >
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-primary/15 transition ${opt.value === value ? 'bg-primary/10' : ''}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------- Modals ------------- */
// View Modal
function ViewModal({ open, onClose, order, loading, formatINR, getStatusColor, getStatusIcon }) {
  useEffect(() => {
    const onEsc = (e) => e.key === 'Escape' && onClose();
    if (open) window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-3xl bg-white dark:bg-secondary border border-gray-200 dark:border-white/10 rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-secondary/80 backdrop-blur border-b border-gray-200 dark:border-white/10">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-primary">Order Details</h3>
            {!loading && order?._id && (
              <p className="text-xs text-gray-600 dark:text-secondary">ID: {order._id}</p>
            )}
          </div>
          <button onClick={onClose} className="text-gray-600 dark:text-secondary hover:text-gray-900 dark:hover:text-primary p-2 rounded-md hover:bg-gray-100 dark:hover:bg-primary/10">
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-auto">
          {loading || !order ? (
            <p className="text-gray-600 dark:text-secondary">Loading...</p>
          ) : (
            <div className="space-y-6">
              {/* Top badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
                <span className="text-xs text-gray-600 dark:text-secondary">
                  {order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}
                </span>
              </div>

              {/* Customer + Shipping */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-primary/10 p-4">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-primary mb-2">Customer</h4>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-900 dark:text-primary">{order.shippingAddress?.name || '-'}</p>
                    <p className="text-gray-600 dark:text-secondary">{order.shippingAddress?.email || '-'}</p>
                    <p className="text-gray-600 dark:text-secondary">{order.shippingAddress?.phone || '-'}</p>
                  </div>
                </div>
                <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-primary/10 p-4">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-primary mb-2">Shipping</h4>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-700 dark:text-secondary">{order.shippingAddress?.address || '-'}</p>
                    <p className="text-gray-600 dark:text-secondary">
                      {[order.shippingAddress?.city, order.shippingAddress?.postalCode, order.shippingAddress?.country].filter(Boolean).join(', ') || '-'}
                    </p>
                    <p className="text-gray-600 dark:text-secondary">Payment: <span className="text-gray-900 dark:text-primary">{order.paymentMethod || '-'}</span></p>
                    <p className="text-gray-600 dark:text-secondary">Total: <span className="text-gray-900 dark:text-primary font-semibold">{formatINR(order.total)}</span></p>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-primary/10 p-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-primary mb-3">Items</h4>
                <div className="space-y-2">
                  {(order.items || []).map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-gray-900 dark:text-primary">{it.name} × {it.quantity}</span>
                      <span className="text-gray-600 dark:text-secondary">{formatINR((it.price || 0) * (it.quantity || 0))}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status History - timeline style */}
              <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-primary/10 p-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-primary mb-3">Status History</h4>
                <div className="space-y-3">
                  {(order.statusHistory || []).map((h, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-0.5">{getStatusIcon(h.status)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(h.status)}`}>{h.status}</span>
                          <span className="text-xs text-gray-600 dark:text-secondary">{h.at ? new Date(h.at).toLocaleString() : ''}</span>
                        </div>
                        {h.note ? <p className="text-xs text-gray-600 dark:text-secondary mt-1">{h.note}</p> : null}
                      </div>
                    </div>
                  ))}
                  {!order.statusHistory?.length && (
                    <p className="text-xs text-gray-600 dark:text-secondary">No history yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Edit Modal
function EditModal({ open, onClose, order, form, setField, setAddrField, save, loading, getStatusColor }) {
  useEffect(() => {
    const onEsc = (e) => e.key === 'Escape' && onClose();
    if (open) window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-2xl bg-white dark:bg-secondary border border-gray-200 dark:border-white/10 rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-secondary/80 backdrop-blur border-b border-gray-200 dark:border-white/10">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-primary">Edit Order</h3>
            {!!order?._id && <p className="text-xs text-gray-600 dark:text-secondary">ID: {order._id}</p>}
          </div>
          <button onClick={onClose} className="text-gray-600 dark:text-secondary hover:text-gray-900 dark:hover:text-primary p-2 rounded-md hover:bg-gray-100 dark:hover:bg-primary/10">
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-auto">
          {!order ? (
            <p className="text-gray-600 dark:text-secondary">Loading...</p>
          ) : (
            <div className="space-y-6">
              {/* Status + Payment */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs text-gray-600 dark:text-secondary">Status</label>
                  <div className="flex items-center gap-2">
                    <select
                      value={form.status}
                      onChange={(e) => setField('status', e.target.value)}
                      className="flex-1 bg-gray-50 dark:bg-primary/10 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-primary focus:outline-none focus:border-gold"
                    >
                      {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(form.status)}`}>{form.status}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-600 dark:text-secondary">Payment Method</label>
                  <select
                    value={form.paymentMethod}
                    onChange={(e) => setField('paymentMethod', e.target.value)}
                    className="bg-gray-50 dark:bg-primary/10 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-primary focus:outline-none focus:border-gold"
                  >
                    <option value="COD">Cash on Delivery</option>
                    <option value="CARD">Card</option>
                    <option value="UPI">UPI</option>
                    <option value="NETBANKING">Net Banking</option>
                  </select>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-primary mb-2">Shipping Address</h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  {['name','email','phone','address','city','postalCode','country'].map((k) => (
                    <div key={k} className={k === 'address' ? 'sm:col-span-2' : ''}>
                      <label className="text-xs text-gray-600 dark:text-secondary capitalize">{k}</label>
                      <input
                        type="text"
                        value={form.shippingAddress[k] || ''}
                        onChange={(e) => setAddrField(k, e.target.value)}
                        className="w-full bg-gray-50 dark:bg-primary/10 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-primary placeholder-gray-400 dark:placeholder-secondary focus:outline-none focus:border-gold"
                        placeholder={k}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer actions */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm rounded-lg bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-primary/10 dark:text-primary dark:hover:bg-primary/20 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={save}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-gold to-yellow-600 text-primary hover:shadow-lg disabled:opacity-60 transition"
                >
                  <FaSave /> Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
