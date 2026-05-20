import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin.services";
import { useState } from "react";
import { LuSearch, LuShield, LuBan, LuPlus, LuPencil, LuTrash2, LuX } from "react-icons/lu";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/useAuth";

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Form states
  const [createFormData, setCreateFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Student",
    status: "Active",
    phone: "",
    bio: "",
  });

  const [editFormData, setEditFormData] = useState({
    name: "",
    role: "Student",
    status: "Active",
    phone: "",
    bio: "",
  });

  const isSuperAdmin = currentUser?.role === "Super Admin";

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-users", search, page],
    queryFn: () => adminService.getUsers({ search, page, limit: 20 }),
  });

  const users = data?.data || [];

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminService.updateUserRole(userId, { role: newRole });
      toast.success(`Role updated to ${newRole}`);
      await refetch();
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.userMessage || "Failed to update role");
    }
  };

  const handleStatusChange = async (userId, status) => {
    try {
      await adminService.updateUserStatus(userId, status);
      toast.success(`User ${status === "Blocked" ? "blocked" : "activated"}`);
      await refetch();
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.userMessage || "Failed to update user status");
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminService.createUser(createFormData);
      toast.success("User created successfully!");
      setIsCreateModalOpen(false);
      setCreateFormData({
        name: "",
        email: "",
        password: "",
        role: "Student",
        status: "Active",
        phone: "",
        bio: "",
      });
      await refetch();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create user");
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name || "",
      role: user.role || "Student",
      status: user.status || "Active",
      phone: user.phone || "",
      bio: user.bio || "",
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminService.updateUser(selectedUser.id, editFormData);
      toast.success("User updated successfully!");
      setIsEditModalOpen(false);
      setSelectedUser(null);
      await refetch();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update user");
    }
  };

  const handleDeleteClick = async (userId, userName) => {
    if (window.confirm(`Are you absolutely sure you want to permanently delete user "${userName}"? This action cannot be undone.`)) {
      try {
        await adminService.deleteUser(userId);
        toast.success("User deleted successfully!");
        await refetch();
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to delete user");
      }
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Users</h1>
          <p className="text-gray-500 mt-1">Manage all platform users</p>
        </div>
        {isSuperAdmin && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-[#0f2c59] hover:from-cyan-600 hover:to-[#091b3a] text-white font-semibold rounded-xl shadow-md shadow-cyan-500/10 hover:shadow-lg transition-all duration-200"
          >
            <LuPlus size={20} />
            <span>Add User</span>
          </button>
        )}
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-cyan-400 outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">
                  User
                </th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Email
                </th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Role
                </th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Status
                </th>
                <th className="text-right text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#0f2c59] flex items-center justify-center text-white text-xs font-bold">
                          {user.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-gray-800">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      {!isSuperAdmin || user.role === "Super Admin" || (user.role === "Admin" && currentUser?.role !== "Super Admin") ? (
                        <span className={`text-xs font-bold px-2 py-1 rounded ${user.role === "Super Admin" ? "text-red-600 bg-red-50" : "text-purple-600 bg-purple-50"}`}>
                          {user.role}
                        </span>
                      ) : (
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className={`text-xs font-bold px-2 py-1 rounded cursor-pointer outline-none ${user.role === "Super Admin" ? "bg-red-50 text-red-600" : user.role === "Admin" ? "bg-purple-50 text-purple-600" : "bg-cyan-50 text-cyan-600"}`}
                        >
                          <option value="Student">Student</option>
                          <option value="Instructor">Instructor</option>
                          <option value="Sub Admin">Sub Admin</option>
                          <option value="Guest">Guest</option>
                          <option value="Admin">Admin</option>
                          {currentUser?.role === "Super Admin" && <option value="Super Admin">Super Admin</option>}
                        </select>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${user.status === "Active" ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isSuperAdmin ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(user)}
                            className="text-cyan-600 hover:text-cyan-800 p-1 hover:bg-cyan-50 rounded transition-colors"
                            title="Edit user details"
                          >
                            <LuPencil size={16} />
                          </button>
                          
                          {user.status === "Active" ? (
                            <button
                              onClick={() => handleStatusChange(user.id, "Blocked")}
                              className="text-amber-500 hover:text-amber-700 p-1 hover:bg-amber-50 rounded transition-colors"
                              title="Block user"
                            >
                              <LuBan size={16} />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStatusChange(user.id, "Active")}
                              className="text-green-500 hover:text-green-700 p-1 hover:bg-green-50 rounded transition-colors"
                              title="Activate user"
                            >
                              <LuShield size={16} />
                            </button>
                          )}

                          {user.id !== currentUser.id && (
                            <button
                              onClick={() => handleDeleteClick(user.id, user.name)}
                              className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
                              title="Delete user"
                            >
                              <LuTrash2 size={16} />
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">View Only</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE USER MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 transform transition-all duration-300 scale-100 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">Add New User</h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LuX size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={createFormData.name}
                    onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-400 outline-none"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={createFormData.email}
                    onChange={(e) => setCreateFormData({ ...createFormData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-400 outline-none"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    value={createFormData.password}
                    onChange={(e) => setCreateFormData({ ...createFormData, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-400 outline-none"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={createFormData.phone}
                    onChange={(e) => setCreateFormData({ ...createFormData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-400 outline-none"
                    placeholder="+1 555-0199"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Role *</label>
                  <select
                    value={createFormData.role}
                    onChange={(e) => setCreateFormData({ ...createFormData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-400 outline-none bg-white font-medium"
                  >
                    <option value="Student">Student</option>
                    <option value="Instructor">Instructor</option>
                    <option value="Sub Admin">Sub Admin</option>
                    <option value="Guest">Guest</option>
                    <option value="Admin">Admin</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Status *</label>
                  <select
                    value={createFormData.status}
                    onChange={(e) => setCreateFormData({ ...createFormData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-400 outline-none bg-white font-medium"
                  >
                    <option value="Active">Active</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Bio / Profile Notes</label>
                <textarea
                  value={createFormData.bio}
                  onChange={(e) => setCreateFormData({ ...createFormData, bio: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-400 outline-none resize-none"
                  placeholder="Short bio details..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-[#0f2c59] text-white font-semibold rounded-lg shadow-md hover:from-cyan-600 hover:to-[#091b3a] transition-all text-sm"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 transform transition-all duration-300 scale-100 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Edit User Profile</h2>
                <p className="text-xs text-gray-500 mt-0.5">{selectedUser.email}</p>
              </div>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedUser(null);
                }}
                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LuX size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-400 outline-none"
                  placeholder="John Doe"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Role *</label>
                  <select
                    value={editFormData.role}
                    disabled={selectedUser.id === currentUser.id}
                    onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-400 outline-none bg-white font-medium disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="Student">Student</option>
                    <option value="Instructor">Instructor</option>
                    <option value="Sub Admin">Sub Admin</option>
                    <option value="Guest">Guest</option>
                    <option value="Admin">Admin</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Status *</label>
                  <select
                    value={editFormData.status}
                    disabled={selectedUser.id === currentUser.id}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-400 outline-none bg-white font-medium disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="Active">Active</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-400 outline-none"
                  placeholder="+1 555-0199"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Bio / Profile Notes</label>
                <textarea
                  value={editFormData.bio}
                  onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-400 outline-none resize-none"
                  placeholder="Short bio details..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2 border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-[#0f2c59] text-white font-semibold rounded-lg shadow-md hover:from-cyan-600 hover:to-[#091b3a] transition-all text-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
