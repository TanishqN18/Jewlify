import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus, FaMapMarkerAlt } from 'react-icons/fa';

const AddressBook = ({ userId }) => {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchAddresses();
    }
  }, [userId]);

  const fetchAddresses = async () => {
    try {
      const res = await axios.get(`/api/users/get-user`);
      setAddresses(res.data.addresses || []);
    } catch (error) {
      console.error('Failed to fetch addresses', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedAddresses = [...addresses];
    if (editingIndex !== null) {
      updatedAddresses[editingIndex] = form;
    } else {
      updatedAddresses.push(form);
    }

    try {
      await axios.put('/api/users/update-user', {
        addresses: updatedAddresses,
      });
      setAddresses(updatedAddresses);
      setForm({ street: '', city: '', state: '', zip: '', country: '' });
      setEditingIndex(null);
    } catch (err) {
      console.error(err);
      alert('Failed to update address.');
    }
  };

  const handleEdit = (index) => {
    setForm(addresses[index]);
    setEditingIndex(index);
  };

  const handleDelete = async (index) => {
    const updatedAddresses = addresses.filter((_, i) => i !== index);
    try {
      await axios.put('/api/users/update-user', {
        addresses: updatedAddresses,
      });
      setAddresses(updatedAddresses);
    } catch (err) {
      console.error(err);
      alert('Failed to delete address.');
    }
  };

  return (
    <div id="address" className="p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
      <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
        <FaMapMarkerAlt className="text-pink-500" /> Address Book
      </h3>

      {loading ? (
        <p className="text-gray-500">Loading addresses...</p>
      ) : addresses.length === 0 ? (
        <p className="text-gray-500 mb-6">No saved addresses yet.</p>
      ) : (
        <div className="space-y-4">
          {addresses.map((addr, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
            >
              <p className="font-medium text-gray-800 dark:text-gray-100">{addr.street}, {addr.city}, {addr.state}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{addr.zip}, {addr.country}</p>
              <div className="flex gap-4 mt-3">
                <button
                  onClick={() => handleEdit(i)}
                  className="text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => handleDelete(i)}
                  className="text-red-600 dark:text-red-400 flex items-center gap-1 hover:underline"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <hr className="my-8 border-gray-200 dark:border-gray-700" />

      <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
        {editingIndex !== null ? 'Edit Address' : 'Add New Address'}
      </h4>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="street"
          placeholder="Street"
          value={form.street}
          onChange={handleChange}
          required
          className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-pink-400 outline-none"
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          required
          className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-pink-400 outline-none"
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          value={form.state}
          onChange={handleChange}
          required
          className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-pink-400 outline-none"
        />
        <input
          type="text"
          name="zip"
          placeholder="PIN Code"
          value={form.zip}
          onChange={handleChange}
          required
          className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-pink-400 outline-none"
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={form.country}
          onChange={handleChange}
          required
          className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-pink-400 outline-none"
        />
        <button
          type="submit"
          className="md:col-span-2 px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105 flex items-center justify-center gap-2"
        >
          {editingIndex !== null ? 'Update Address' : (
            <>
              <FaPlus /> Add Address
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddressBook;
