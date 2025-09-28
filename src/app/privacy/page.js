export default function PrivacyPage() {
  const current_year = new Date().getFullYear(); // ✅ define the variable

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gold mb-6">Privacy Policy</h1>
      <p className="text-gray-300 mb-4">
        Your privacy is important to us. This Privacy Policy outlines how Auraza collects, uses, and protects your personal information.
      </p>
      <ul className="list-disc pl-6 text-gray-300 space-y-2">
        <li>We only collect data essential for providing and improving our services.</li>
        <li>All payment information is securely processed using trusted providers.</li>
      </ul>
      <p className="mt-6 text-sm text-gray-500">© {current_year} Auraza. All rights reserved.</p>
    </div>
  );
}
