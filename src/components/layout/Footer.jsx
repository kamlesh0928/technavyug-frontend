import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-white pt-16 pb-8 mt-20 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <h2 className="text-xl font-bold italic mb-4">Tech<span className="text-cyan-400">navyug</span></h2>
          <p className="text-gray-400 text-xs leading-relaxed max-w-xs">
            Empowering tech leaders with industry-vetted skills.
          </p>
          <div className="flex gap-4 mt-5 text-gray-400 text-lg">
            <FaFacebook className="hover:text-cyan-400 cursor-pointer" />
            <FaLinkedin className="hover:text-cyan-400 cursor-pointer" />
            <FaInstagram className="hover:text-cyan-400 cursor-pointer" />
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-cyan-400">Learn</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            {["Web Dev", "Data Science", "UI/UX", "Marketing"].map(item => (
              <li key={item} className="hover:text-white cursor-pointer transition">{item}</li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-cyan-400">Support</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            {["About", "FAQ", "Privacy", "Contact"].map(item => (
              <li key={item} className="hover:text-white cursor-pointer transition">{item}</li>
            ))}
          </ul>
        </div>

        {/* Contact info instead of big newsletter */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-cyan-400">Connect</h3>
          <p className="text-gray-400 text-sm mt-1">technavyug@gmail.com</p>
          <div className="mt-4 flex">
             <input type="text" placeholder="Email" className="bg-gray-800 text-xs px-3 py-2 rounded-l-md w-full outline-none focus:ring-1 focus:ring-cyan-500" />
             <button className="bg-cyan-500 text-xs px-3 py-2 rounded-r-md font-bold">Go</button>
          </div>
        </div>

      </div>

      <div className="max-w-6xl mx-auto px-6 border-t border-white/10 mt-12 pt-6 text-center text-gray-500 text-[10px] uppercase tracking-widest">
        © 2026 Technavyug Education. All Rights Reserved.
      </div>
    </footer>
  );
}