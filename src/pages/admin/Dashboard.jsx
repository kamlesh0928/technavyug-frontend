import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin.services";
import {
  LuUsers,
  LuBookOpen,
  LuShoppingCart,
  LuDollarSign,
  LuTrendingUp,
  LuStar,
  LuTicket,
  LuPackage,
  LuUserPlus,
  LuActivity,
  LuChartBar,
  LuGraduationCap,
} from "react-icons/lu";

export default function AdminDashboard() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: adminService.getAnalytics,
  });

  const { data: revenueData } = useQuery({
    queryKey: ["admin-revenue-chart"],
    queryFn: () => adminService.getRevenueChart("monthly"),
  });

  const { data: enrollmentData } = useQuery({
    queryKey: ["admin-enrollment-chart"],
    queryFn: adminService.getEnrollmentChart,
  });

  const d = analytics?.data;

  const mainStats = [
    {
      label: "Total Users",
      value: d?.users?.total || 0,
      icon: LuUsers,
      gradient: "from-blue-500 to-blue-600",
      shadow: "shadow-blue-500/20",
    },
    {
      label: "Total Courses",
      value: d?.courses?.total || 0,
      icon: LuBookOpen,
      gradient: "from-emerald-500 to-emerald-600",
      shadow: "shadow-emerald-500/20",
    },
    {
      label: "Total Orders",
      value: d?.orders?.total || 0,
      icon: LuShoppingCart,
      gradient: "from-orange-500 to-orange-600",
      shadow: "shadow-orange-500/20",
    },
    {
      label: "Total Revenue",
      value: `₹${(d?.revenue?.total || 0).toLocaleString("en-IN")}`,
      icon: LuDollarSign,
      gradient: "from-purple-500 to-purple-600",
      shadow: "shadow-purple-500/20",
    },
  ];

  const secondaryStats = [
    {
      label: "Active Users (30d)",
      value: d?.users?.activeLastMonth || 0,
      icon: LuActivity,
      color: "text-cyan-600",
      bg: "bg-cyan-50",
    },
    {
      label: "New Users (30d)",
      value: d?.users?.newThisMonth || 0,
      icon: LuUserPlus,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Published Courses",
      value: d?.courses?.published || 0,
      icon: LuGraduationCap,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Total Enrollments",
      value: d?.courses?.totalEnrollments || 0,
      icon: LuBookOpen,
      color: "text-teal-600",
      bg: "bg-teal-50",
    },
    {
      label: "Monthly Revenue",
      value: `₹${(d?.revenue?.lastMonth || 0).toLocaleString("en-IN")}`,
      icon: LuTrendingUp,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Pending Orders",
      value: d?.orders?.pending || 0,
      icon: LuShoppingCart,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Active Products",
      value: `${d?.products?.active || 0} / ${d?.products?.total || 0}`,
      icon: LuPackage,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
    {
      label: "Avg Rating",
      value: d?.reviews?.averageRating ? `${d.reviews.averageRating} ★` : "N/A",
      icon: LuStar,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
  ];

  // Compute max for chart bars
  const revenueChartData = revenueData?.data || [];
  const maxRevenue = Math.max(
    ...revenueChartData.map((r) => parseFloat(r.revenue) || 0),
    1,
  );

  const enrollChartData = enrollmentData?.data || [];
  const maxEnroll = Math.max(
    ...enrollChartData.map((e) => parseInt(e.enrollments) || 0),
    1,
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Platform overview and real-time analytics
          </p>
        </div>
        {d?.tickets?.open > 0 && (
          <a
            href="/admin/tickets"
            className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-bold border border-red-100 hover:bg-red-100 transition-colors"
          >
            <LuTicket size={16} />
            {d.tickets.open} Open Ticket{d.tickets.open !== 1 ? "s" : ""}
          </a>
        )}
      </div>

      {/* Main Stats — Gradient Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat, i) => (
          <div
            key={i}
            className={`bg-gradient-to-br ${stat.gradient} rounded-2xl p-6 text-white relative overflow-hidden shadow-lg ${stat.shadow} hover:scale-[1.02] transition-transform`}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-xl" />
            <div className="flex items-center justify-between mb-4 relative">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <stat.icon size={20} />
              </div>
              <LuTrendingUp className="opacity-60" size={16} />
            </div>
            <p className="text-2xl font-black relative">
              {isLoading ? "..." : stat.value}
            </p>
            <p className="text-xs font-medium mt-1 opacity-80">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Secondary Stats — Compact Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {secondaryStats.map((s, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3 hover:shadow-md transition-shadow"
          >
            <div
              className={`w-10 h-10 ${s.bg} ${s.color} rounded-xl flex items-center justify-center flex-shrink-0`}
            >
              <s.icon size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-lg font-black text-gray-900 truncate">
                {isLoading ? "..." : s.value}
              </p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">
                {s.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <LuChartBar className="text-purple-500" size={20} />
              Revenue Trend
            </h3>
            <span className="text-xs text-gray-400 font-medium">Monthly</span>
          </div>
          {revenueChartData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-300 text-sm">
              No revenue data yet
            </div>
          ) : (
            <div className="flex items-end gap-2 h-48">
              {revenueChartData.slice(-12).map((item, i) => {
                const height =
                  (parseFloat(item.revenue) / maxRevenue) * 100 || 0;
                return (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center justify-end gap-1 group"
                  >
                    <span className="text-[9px] font-bold text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      ₹{parseFloat(item.revenue).toLocaleString("en-IN")}
                    </span>
                    <div
                      className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-lg transition-all duration-700 hover:from-purple-600 hover:to-purple-500 min-h-[4px]"
                      style={{ height: `${Math.max(height, 3)}%` }}
                    />
                    <span className="text-[8px] text-gray-400 font-medium mt-1">
                      {item.period?.split("-")[1] || ""}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Enrollment Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <LuGraduationCap className="text-cyan-500" size={20} />
              Enrollment Trend
            </h3>
            <span className="text-xs text-gray-400 font-medium">Monthly</span>
          </div>
          {enrollChartData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-300 text-sm">
              No enrollment data yet
            </div>
          ) : (
            <div className="flex items-end gap-2 h-48">
              {enrollChartData.slice(-12).map((item, i) => {
                const height =
                  (parseInt(item.enrollments) / maxEnroll) * 100 || 0;
                return (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center justify-end gap-1 group"
                  >
                    <span className="text-[9px] font-bold text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.enrollments}
                    </span>
                    <div
                      className="w-full bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t-lg transition-all duration-700 hover:from-cyan-600 hover:to-cyan-500 min-h-[4px]"
                      style={{ height: `${Math.max(height, 3)}%` }}
                    />
                    <span className="text-[8px] text-gray-400 font-medium mt-1">
                      {item.month?.split("-")[1] || ""}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row: Top Courses + Users Breakdown + Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top Courses */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <LuStar className="text-yellow-500" size={18} />
            Top Rated Courses
          </h3>
          {d?.topCourses?.length > 0 ? (
            <div className="space-y-3">
              {d.topCourses.map((course, i) => (
                <div
                  key={course.id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-7 h-7 bg-gray-900 text-white rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {course.title}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      by {course.instructor?.name || "Unknown"}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-black text-yellow-600">
                      {parseFloat(course.averageRating).toFixed(1)} ★
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {course.totalReviews} reviews
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-300 text-center py-8">
              No rated courses yet
            </p>
          )}
        </div>

        {/* Users by Role */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <LuUsers className="text-blue-500" size={18} />
            Users by Role
          </h3>
          {d?.users?.byRole?.length > 0 ? (
            <div className="space-y-3">
              {d.users.byRole.map((r) => {
                const pct =
                  d.users.total > 0
                    ? Math.round((r.count / d.users.total) * 100)
                    : 0;
                const colors = {
                  Student: "bg-blue-500",
                  Instructor: "bg-emerald-500",
                  Admin: "bg-red-500",
                  "Sub Admin": "bg-orange-500",
                  Guest: "bg-gray-400",
                };
                return (
                  <div key={r.role} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        {r.role}
                      </span>
                      <span className="text-xs font-bold text-gray-500">
                        {r.count} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${colors[r.role] || "bg-gray-400"} rounded-full transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-300 text-center py-8">
              No user data
            </p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-2">
            {[
              {
                href: "/admin/users",
                icon: LuUsers,
                label: "Manage Users",
                color: "text-blue-500",
              },
              {
                href: "/admin/courses",
                icon: LuBookOpen,
                label: "Manage Courses",
                color: "text-emerald-500",
              },
              {
                href: "/admin/orders",
                icon: LuShoppingCart,
                label: "View Orders",
                color: "text-orange-500",
              },
              {
                href: "/admin/products",
                icon: LuPackage,
                label: "Manage Products",
                color: "text-purple-500",
              },
              {
                href: "/admin/blogs",
                icon: LuBookOpen,
                label: "Manage Blogs",
                color: "text-cyan-500",
              },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <item.icon
                  className={`${item.color} flex-shrink-0`}
                  size={18}
                />
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                  {item.label}
                </span>
              </a>
            ))}
          </div>

          {/* Orders by Status */}
          {d?.orders?.byStatus?.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                Order Status
              </p>
              <div className="flex flex-wrap gap-2">
                {d.orders.byStatus.map((o) => {
                  const statusColors = {
                    Completed: "text-green-600 bg-green-50",
                    Pending: "text-amber-600 bg-amber-50",
                    Cancelled: "text-red-600 bg-red-50",
                    Processing: "text-blue-600 bg-blue-50",
                  };
                  return (
                    <span
                      key={o.status}
                      className={`text-[10px] font-black px-2.5 py-1 rounded-full ${statusColors[o.status] || "text-gray-600 bg-gray-50"}`}
                    >
                      {o.status}: {o.count}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
