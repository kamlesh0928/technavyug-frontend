import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin.services";
import { LuUsers, LuBookOpen, LuShoppingCart, LuDollarSign, LuTrendingUp } from "react-icons/lu";

export default function AdminDashboard() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: adminService.getAnalytics,
  });

  const stats = [
    { label: "Total Users", value: analytics?.data?.totalUsers || 0, icon: LuUsers, color: "bg-blue-500" },
    { label: "Total Courses", value: analytics?.data?.totalCourses || 0, icon: LuBookOpen, color: "bg-green-500" },
    { label: "Total Orders", value: analytics?.data?.totalOrders || 0, icon: LuShoppingCart, color: "bg-orange-500" },
    { label: "Revenue", value: `₹${analytics?.data?.totalRevenue || 0}`, icon: LuDollarSign, color: "bg-purple-500" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Platform overview and analytics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="text-white" size={20} />
              </div>
              <LuTrendingUp className="text-green-500" size={16} />
            </div>
            <p className="text-2xl font-black text-gray-900">{isLoading ? "..." : stat.value}</p>
            <p className="text-xs text-gray-500 font-medium mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Info */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <a href="/admin/users" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <LuUsers className="text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Manage Users</span>
            </a>
            <a href="/admin/courses" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <LuBookOpen className="text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Manage Courses</span>
            </a>
            <a href="/admin/orders" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <LuShoppingCart className="text-gray-400" />
              <span className="text-sm font-medium text-gray-700">View Orders</span>
            </a>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Platform Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Server Status</span>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database</span>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API Version</span>
              <span className="text-xs font-medium text-gray-500">v1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
