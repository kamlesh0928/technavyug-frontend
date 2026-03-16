import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin.services";
import { useState } from "react";
import { LuSearch, LuShield, LuBan } from "react-icons/lu";
import { toast } from "react-toastify";

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-users", { search, page }],
    queryFn: () => adminService.getUsers({ search, page, limit: 20 }),
  });

  const users = data?.data || [];

  const handleStatusChange = async (userId, status) => {
    try {
      await adminService.updateUserStatus(userId, { status });
      toast.success(`User ${status === "Blocked" ? "blocked" : "activated"}`);
      refetch();
    } catch (error) {
      toast.error(error?.userMessage || "Failed to update user status");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Users</h1>
          <p className="text-gray-500 mt-1">Manage all platform users</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-cyan-400 outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">User</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">Email</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">Role</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">Status</th>
                <th className="text-right text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">Loading...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">No users found</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#0f2c59] flex items-center justify-center text-white text-xs font-bold">
                          {user.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-gray-800">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-cyan-600 bg-cyan-50 px-2 py-1 rounded">{user.role}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${user.status === "Active" ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {user.status === "Active" ? (
                        <button onClick={() => handleStatusChange(user.id, "Blocked")} className="text-red-500 hover:text-red-700 p-1" title="Block user">
                          <LuBan size={16} />
                        </button>
                      ) : (
                        <button onClick={() => handleStatusChange(user.id, "Active")} className="text-green-500 hover:text-green-700 p-1" title="Activate user">
                          <LuShield size={16} />
                        </button>
                      )}
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
