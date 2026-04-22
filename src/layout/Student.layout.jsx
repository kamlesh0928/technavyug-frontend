import { useState } from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  LuLayoutDashboard,
  LuBookOpen,
  LuPlay,
  LuShoppingCart,
  LuUser,
  LuLogOut,
  LuChevronLeft,
  LuChevronRight,
} from "react-icons/lu";
import logo from "@/assets/image/android-chrome-512x512.png";

const navItems = [
  { label: "Dashboard", path: "/student", icon: LuLayoutDashboard, end: true },
  { label: "My Courses", path: "/student/courses", icon: LuBookOpen },
  { label: "Orders", path: "/student/orders", icon: LuShoppingCart },
  { label: "Profile", path: "/student/profile", icon: LuUser },
];

export default function StudentLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${collapsed ? "w-20" : "w-64"} bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
          {!collapsed && (
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
              <span className="text-lg font-bold text-[#0f2c59]">
                Tech<span className="text-cyan-500">navyug</span>
              </span>
            </button>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            {collapsed ? (
              <LuChevronRight size={18} />
            ) : (
              <LuChevronLeft size={18} />
            )}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#0f2c59] text-white shadow-md shadow-blue-900/20"
                    : "text-gray-600 hover:bg-gray-100"
                } ${collapsed ? "justify-center" : ""}`
              }
            >
              <item.icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="border-t border-gray-100 p-3">
          {!collapsed && (
            <div className="flex items-center gap-3 px-3 py-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || "S"}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {user?.name}
                </p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                  Student
                </p>
              </div>
            </div>
          )}
          <button
            onClick={logout}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 w-full transition-colors ${collapsed ? "justify-center" : ""}`}
          >
            <LuLogOut size={18} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
