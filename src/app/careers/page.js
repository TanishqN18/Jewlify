export default function CareersPage() {
  const current_year = new Date().getFullYear();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gold mb-6">Careers at Jewelify</h1>
      <p className="text-gray-300 mb-4">
        Join a team that's passionate about crafting digital luxury. At Jewelify, we're always looking for innovative minds and dedicated professionals.
      </p>
      <ul className="list-disc pl-6 text-gray-300 space-y-2">
        <li>Open roles include Frontend Developers, UI/UX Designers, and Marketing Specialists.</li>
        <li>Send your resume to <a href="mailto:careers@jewelify.com" className="text-gold underline">careers@jewelify.com</a></li>
      </ul>
      <p className="mt-6 text-sm text-gray-500">© {current_year} Jewelify. All rights reserved.</p>
    </div>
  );
}
