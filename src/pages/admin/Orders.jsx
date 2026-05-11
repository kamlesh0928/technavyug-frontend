import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin.services";
import { LuSearch, LuShoppingBag, LuClock, LuEye } from "react-icons/lu";
import { useState } from "react";

export default function AdminOrders() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["admin-orders", search],
    queryFn: () => adminService.getAllOrders({ search: search || undefined }),
  });
  const orders = data?.data || [];

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "text-green-600 bg-green-50 border-green-100";
      case "Pending":
        return "text-amber-600 bg-amber-50 border-amber-100";
      case "Cancelled":
        return "text-red-600 bg-red-50 border-red-100";
      default:
        return "text-gray-600 bg-gray-50 border-gray-100";
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Order Management</h1>
        <p className="text-gray-500 mt-1">
          Monitor and process all platform transactions
        </p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative w-full md:w-96">
          <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Order ID or Customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-cyan-400 outline-none transition-all"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Order Details
                </th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Customer
                </th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Amount
                </th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Status
                </th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Date
                </th>
                <th className="text-right text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-400 italic"
                  >
                    Retrieving order records...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-400 italic"
                  >
                    No transactions found
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr
                    key={o.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                          <LuShoppingBag size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            {o.orderNumber ||
                              `#${o.id?.slice(0, 8).toUpperCase()}`}
                          </p>
                          {o.invoiceNumber && (
                            <p className="text-[10px] text-gray-400 font-mono">
                              {o.invoiceNumber}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">
                          {o.User?.name?.charAt(0)}
                        </div>
                        <span className="text-sm text-gray-600 font-medium">
                          {o.User?.name || "Guest"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-black text-gray-900">
                        ₹{parseFloat(o.totalAmount || 0).toFixed(2)}
                      </p>
                      {parseFloat(o.gstAmount || 0) > 0 && (
                        <p className="text-[10px] text-gray-400">
                          GST: ₹{parseFloat(o.gstAmount).toFixed(2)}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${getStatusStyle(o.status)}`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                        <LuClock size={12} />
                        {new Date(o.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all"
                        title="View Details"
                      >
                        <LuEye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
