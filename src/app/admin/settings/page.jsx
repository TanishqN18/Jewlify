// pages/admin/settings.jsx
'use client';

export default function SettingsPage() {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h3 className="text-3xl font-bold text-primary">System Settings</h3>
        <p className="text-secondary">Configure system preferences and parameters</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="bg-secondary border border-white/20 rounded-xl p-8 shadow-lg transition-shadow duration-300 hover:shadow-xl">
          <h4 className="text-xl font-semibold text-primary mb-4">Website Settings</h4>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Website Title</label>
              <input 
                type="text" 
                defaultValue="AUREZA Jewelry" 
                className="w-full bg-primary border border-white/20 rounded-lg px-4 py-3 text-primary focus:outline-none focus:ring-2 focus:ring-gold transition duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Email Address</label>
              <input 
                type="email" 
                defaultValue="admin@aureza.com" 
                className="w-full bg-primary border border-white/20 rounded-lg px-4 py-3 text-primary focus:outline-none focus:ring-2 focus:ring-gold transition duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Phone Number</label>
              <input 
                type="tel" 
                defaultValue="+91 9876543210" 
                className="w-full bg-primary border border-white/20 rounded-lg px-4 py-3 text-primary focus:outline-none focus:ring-2 focus:ring-gold transition duration-200"
              />
            </div>
          </div>
        </div>

        <div className="bg-secondary border border-white/20 rounded-xl p-8 shadow-lg transition-shadow duration-300 hover:shadow-xl">
          <h4 className="text-xl font-semibold text-primary mb-4">Preferences</h4>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Default Currency</label>
              <select className="w-full bg-primary border border-white/20 rounded-lg px-4 py-3 text-primary focus:outline-none focus:ring-2 focus:ring-gold transition duration-200">
                <option value="INR">Indian Rupee (₹)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Time Zone</label>
              <select className="w-full bg-primary border border-white/20 rounded-lg px-4 py-3 text-primary focus:outline-none focus:ring-2 focus:ring-gold transition duration-200">
                <option value="IST">India Standard Time</option>
                <option value="UTC">UTC</option>
                <option value="EST">Eastern Time</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Language</label>
              <select className="w-full bg-primary border border-white/20 rounded-lg px-4 py-3 text-primary focus:outline-none focus:ring-2 focus:ring-gold transition duration-200">
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="es">Spanish</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="bg-gold text-primary px-6 py-3 rounded-lg hover:opacity-90 transition-opacity shadow-md hover:shadow-lg">
          Save Changes
        </button>
      </div>
    </div>
  );
}
