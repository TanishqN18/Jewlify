"use client";

export default function VisibilitySettings() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Visibility</h3>
      <div className="space-y-3">
        <label className="flex items-center space-x-3">
          <input type="radio" name="visibility" defaultChecked className="text-gold-500 focus:ring-gold-500" />
          <span className="text-sm text-gray-700">Draft</span>
        </label>
        <label className="flex items-center space-x-3">
          <input type="radio" name="visibility" className="text-gold-500 focus:ring-gold-500" />
          <span className="text-sm text-gray-700">Publish</span>
        </label>
        <label className="flex items-center space-x-3">
          <input type="radio" name="visibility" className="text-gold-500 focus:ring-gold-500" />
          <span className="text-sm text-gray-700">Schedule</span>
        </label>
      </div>
    </div>
  );
}
