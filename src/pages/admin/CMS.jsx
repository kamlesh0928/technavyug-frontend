export default function AdminCMS() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">CMS</h1>
        <p className="text-gray-500 mt-1">Manage homepage content, blogs, and FAQs</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Homepage Content</h3>
          <p className="text-sm text-gray-500 mb-4">Edit hero, stats, and featured sections.</p>
          <button className="text-sm font-bold text-cyan-600 hover:text-cyan-700">Manage &rarr;</button>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Blog Posts</h3>
          <p className="text-sm text-gray-500 mb-4">Create and manage blog articles.</p>
          <button className="text-sm font-bold text-cyan-600 hover:text-cyan-700">Manage &rarr;</button>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-bold text-gray-900 mb-2">FAQs</h3>
          <p className="text-sm text-gray-500 mb-4">Manage frequently asked questions.</p>
          <button className="text-sm font-bold text-cyan-600 hover:text-cyan-700">Manage &rarr;</button>
        </div>
      </div>
    </div>
  );
}
