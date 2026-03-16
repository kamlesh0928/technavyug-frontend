import { useState } from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  LuLayoutDashboard,
  LuUsers,
  LuBookOpen,
  LuShoppingCart,
  LuBox,
  LuFileText,
  LuSettings,
  LuLogOut,
  LuChevronLeft,
  LuChevronRight,
  LuShield,
} from "react-icons/lu";

const navItems = [
  { label: "Dashboard", path: "/admin", icon: LuLayoutDashboard, end: true },
  { label: "Users", path: "/admin/users", icon: LuUsers },
  { label: "Courses", path: "/admin/courses", icon: LuBookOpen },
  { label: "Orders", path: "/admin/orders", icon: LuShoppingCart },
  { label: "Products", path: "/admin/products", icon: LuBox },
  { label: "CMS", path: "/admin/cms", icon: LuFileText },
  { label: "Settings", path: "/admin/settings", icon: LuSettings },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${collapsed ? "w-20" : "w-64"} bg-[#0f172a] flex flex-col transition-all duration-300`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
          {!collapsed && (
            <button onClick={() => navigate("/")} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
                <LuShield className="text-white text-sm" />
              </div>
              <span className="text-lg font-bold text-white">
                Tech<span className="text-cyan-400">navyug</span>
              </span>
            </button>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400"
          >
            {collapsed ? <LuChevronRight size={18} /> : <LuChevronLeft size={18} />}
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
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                } ${collapsed ? "justify-center" : ""}`
              }
            >
              <item.icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="border-t border-white/5 p-3">
          {!collapsed && (
            <div className="flex items-center gap-3 px-3 py-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || "A"}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                <p className="text-[10px] text-cyan-400 uppercase tracking-wider">{user?.role}</p>
              </div>
            </div>
          )}
          <button
            onClick={logout}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 w-full transition-colors ${collapsed ? "justify-center" : ""}`}
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
