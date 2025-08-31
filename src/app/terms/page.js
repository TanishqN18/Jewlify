export default function TermsPage() {
  const current_year = new Date().getFullYear();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gold mb-6">Terms & Conditions</h1>
      <p className="text-gray-300 mb-4">
        By accessing or using Jewelify, you agree to the following terms and conditions:
      </p>
      <ul className="list-disc pl-6 text-gray-300 space-y-2">
        <li>All content is the property of Jewelify and may not be reused without permission.</li>
        <li>Users must not engage in fraudulent or abusive behavior on the platform.</li>
      </ul>
      <p className="mt-6 text-sm text-gray-500">© {current_year} Jewelify. All rights reserved.</p>
    </div>
  );
}
