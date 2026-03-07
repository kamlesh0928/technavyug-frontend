export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#0f2c59] to-[#1d4e89] text-white text-center py-8 mt-20 rounded-t-3xl">

      <div className="max-w-7xl mx-auto px-10 py-12 grid grid-cols-3 gap-10">

        <div>
          <h2 className="text-xl font-semibold mb-3">Technavyug</h2>
          <p className="text-gray-300 text-sm">
            Learn modern tech skills and build your career with our
            enterprise-grade learning platform.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li className="hover:text-white cursor-pointer">Home</li>
            <li className="hover:text-white cursor-pointer">Courses</li>
            <li className="hover:text-white cursor-pointer">Blog</li>
            <li className="hover:text-white cursor-pointer">About</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Contact</h3>
          <p className="text-gray-300 text-sm">support@technavyug.com</p>
          <p className="text-gray-300 text-sm mt-1">India</p>
        </div>

      </div>

      <div className="border-t border-blue-500 text-center py-4 text-sm text-gray-300">
        © 2026 Technavyug. All rights reserved.
      </div>

    </footer>
  );
}