import { Link } from "react-router-dom";
import { LuArrowLeft, LuSearch } from "react-icons/lu";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-cyan-50/30 px-6">
      <div className="max-w-md w-full text-center">
        <div className="relative mb-8">
          <h1 className="text-[12rem] font-black text-gray-900/5 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-cyan-500/10 rounded-full flex items-center justify-center animate-pulse">
              <LuSearch className="text-cyan-600 text-4xl" />
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Page Not Found
        </h2>
        <p className="text-gray-500 mb-10 leading-relaxed">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-xl shadow-gray-900/20 hover:bg-gray-800 hover:-translate-y-0.5 transition-all duration-300"
          >
            <LuArrowLeft size={18} />
            Back to Home
          </Link>
          <Link
            to="/courses"
            className="w-full sm:w-auto inline-flex items-center justify-center bg-white text-gray-900 px-8 py-3.5 rounded-2xl font-bold text-sm border border-gray-100 shadow-sm hover:bg-gray-50 transition-all"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    </div>
  );
}
