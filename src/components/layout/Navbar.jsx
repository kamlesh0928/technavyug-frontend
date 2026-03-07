import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-24 py-5 bg-gradient-to-r from-[#0f2c59] to-[#1d4e89] text-white rounded-b-2xl sticky top-0 z-50">

      {/* Logo */}

      <Link to="/" className="text-xl font-semibold">
        Technavyug
      </Link>

      {/* Navigation Links */}

      <ul className="flex gap-8">
        <li>
          <Link
            to="/"
            className="cursor-pointer hover:text-cyan-400 transition"
          >
            Home
          </Link>
        </li>

        <li>
          <Link
            to="/courses"
            className="cursor-pointer hover:text-cyan-400 transition"
          >
            Courses
          </Link>
        </li>

        <li>
          <Link
            to="/blog"
            className="cursor-pointer hover:text-cyan-400 transition"
          >
            Blog
          </Link>
        </li>

        <li>
          <Link
            to="/about"
            className="cursor-pointer hover:text-cyan-400 transition"
          >
            About
          </Link>
        </li>
      </ul>

      {/* Auth Buttons */}

      <div className="flex gap-3">

        <Link to="/login">
          <button className="bg-white text-blue-900 px-4 py-2 rounded-full font-medium hover:bg-gray-200 transition">
            Login
          </button>
        </Link>

        <Link to="/register">
          <button className="bg-cyan-400 text-black px-4 py-2 rounded-full font-medium hover:bg-cyan-300 transition">
            Sign Up
          </button>
        </Link>

      </div>

    </nav>
  );
}