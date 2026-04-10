import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "@/store/Slices/authSlice";
import { logoutUser as logoutApi } from "@/api/authApi";
import {
  LuMenu,
  LuX,
  LuLayoutDashboard,
  LuLogOut,
  LuChevronDown,
  LuShoppingCart,
} from "react-icons/lu";
import logo from "@/assets/image/Technavyug Logo.png";
import { toggleCart, selectCartCount } from "@/store/Slices/cartSlice";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Courses", path: "/courses" },
  { label: "Products", path: "/products" },
  { label: "About", path: "/about" },
  { label: "Blog", path: "/blog" },
  { label: "Contact", path: "/contact" },
];

const getRoleDashboard = (role) => {
  switch (role) {
    case "Admin":
    case "Sub Admin":
      return "/admin";
    case "Instructor":
      return "/instructor";
    default:
      return "/student";
  }
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const cartCount = useSelector(selectCartCount);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch {
      // ignore
    }
    dispatch(logoutUser());
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] border-b border-gray-100/80"
            : "bg-white"
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <img src={logo} alt="Technavyug" className="h-9 w-auto" />
              <span className="text-xl font-extrabold tracking-tight text-gray-900">
                Tech<span className="text-cyan-600">navyug</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === "/"}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-[13px] font-semibold transition-all duration-200 ${
                      isActive
                        ? "text-cyan-700 bg-cyan-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Cart Icon */}
            <button
              onClick={() => dispatch(toggleCart())}
              className="relative p-2.5 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              aria-label="Open cart"
            >
              <LuShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#0f2c59] text-white text-[10px] font-black flex items-center justify-center shadow-md">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </button>

            {/* Auth / User */}
            <div className="hidden lg:flex items-center gap-2">
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {user.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-gray-700">
                      {user.name?.split(" ")[0]}
                    </span>
                    <LuChevronDown
                      size={14}
                      className={`text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {dropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setDropdownOpen(false)}
                      />
                      <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl shadow-black/[0.08] border border-gray-100 py-1.5 z-50">
                        <div className="px-4 py-2.5 border-b border-gray-50">
                          <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                        <Link
                          to={getRoleDashboard(user.role)}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        >
                          <LuLayoutDashboard size={16} />
                          Dashboard
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <LuLogOut size={16} />
                          Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-semibold px-5 py-2.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm font-bold px-5 py-2.5 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition-all shadow-sm"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
            >
              {mobileOpen ? <LuX size={22} /> : <LuMenu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-2xl lg:hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <img src={logo} alt="Technavyug" className="h-7 w-auto" />
                <span className="text-lg font-extrabold text-gray-900">
                  Tech<span className="text-cyan-600">navyug</span>
                </span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-500"
              >
                <LuX size={20} />
              </button>
            </div>
            <nav className="p-4 space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === "/"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-cyan-50 text-cyan-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
            <div className="p-4 border-t border-gray-100 mt-2">
              {isAuthenticated && user ? (
                <div className="space-y-1">
                  <Link
                    to={getRoleDashboard(user.role)}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    <LuLayoutDashboard size={16} />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50"
                  >
                    <LuLogOut size={16} />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block w-full text-center px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="block w-full text-center px-4 py-3 rounded-xl text-sm font-bold bg-gray-900 text-white hover:bg-gray-800"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;