// pages/admin/settings.jsx
'use client';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-primary">System Settings</h3>
        <p className="text-secondary">Configure system preferences and parameters</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-secondary border border-white/10 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-primary mb-4">Website Settings</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Website Title</label>
              <input 
                type="text" 
                defaultValue="AUREZA Jewelry" 
                className="w-full bg-primary border border-white/10 rounded-lg px-3 py-2 text-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Email Address</label>
              <input 
                type="email" 
                defaultValue="admin@aureza.com" 
                className="w-full bg-primary border border-white/10 rounded-lg px-3 py-2 text-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Phone Number</label>
              <input 
                type="tel" 
                defaultValue="+91 9876543210" 
                className="w-full bg-primary border border-white/10 rounded-lg px-3 py-2 text-primary"
              />
            </div>
          </div>
        </div>

        <div className="bg-secondary border border-white/10 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-primary mb-4">Preferences</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Default Currency</label>
              <select className="w-full bg-primary border border-white/10 rounded-lg px-3 py-2 text-primary">
                <option value="INR">Indian Rupee (₹)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Time Zone</label>
              <select className="w-full bg-primary border border-white/10 rounded-lg px-3 py-2 text-primary">
                <option value="IST">India Standard Time</option>
                <option value="UTC">UTC</option>
                <option value="EST">Eastern Time</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Language</label>
              <select className="w-full bg-primary border border-white/10 rounded-lg px-3 py-2 text-primary">
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="es">Spanish</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="bg-gold text-primary px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
          Save Changes
        </button>
      </div>
    </div>
  );
}
