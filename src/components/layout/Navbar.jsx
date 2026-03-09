import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Scroll effect to change background transparency
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "Blog", path: "/blog" },
    { name: "About", path: "/about" },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 px-6 md:px-16 lg:px-24 py-4 
      ${isScrolled 
        ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100" 
        : "bg-transparent"}`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* --- Logo --- */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-[#0f2c59] rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform">
            <span className="text-white font-black text-xl">T</span>
          </div>
          <span className={`text-2xl font-bold tracking-tighter ${isScrolled ? 'text-[#0f2c59]' : 'text-[#0f2c59]'}`}>
            Tech<span className="text-cyan-500">navyug</span>
          </span>
        </Link>

        {/* --- Navigation Links --- */}
        <ul className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`text-sm font-bold tracking-wide transition-all duration-200 relative group
                ${location.pathname === link.path ? "text-cyan-600" : "text-gray-600 hover:text-[#0f2c59]"}`}
              >
                {link.name}
                {/* Underline Animation */}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-500 transition-all duration-300 group-hover:w-full 
                ${location.pathname === link.path ? "w-full" : ""}`}></span>
              </Link>
            </li>
          ))}
        </ul>

        {/* --- Auth Buttons --- */}
        <div className="flex items-center gap-4">
          <Link to="/login" className="hidden sm:block">
            <button className="text-sm font-bold text-gray-700 hover:text-[#0f2c59] transition-colors px-4 py-2 hover:cursor-pointer">
              Sign In
            </button>
          </Link>

          <Link to="/register">
            <button className="bg-[#0f2c59] text-white text-sm font-bold px-6 py-2.5 rounded-full shadow-lg shadow-blue-900/20 hover:bg-[#1d4e89] hover:-translate-y-0.5 active:scale-95 transition-all hover:cursor-pointer">
              Join Free
            </button>
          </Link>
          
          {/* Mobile Menu Icon Placeholder */}
          <button className="md:hidden text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>

      </div>
    </nav>
  );
}