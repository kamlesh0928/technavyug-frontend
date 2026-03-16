import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/auth.services";
import { toast } from "react-toastify";

export default function StudentProfile() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.updateProfile({ name });
      toast.success("Profile updated!");
    } catch (error) {
      toast.error(error?.userMessage || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">Profile</h1>
        <p className="text-gray-500 mt-1">Manage your account</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-8 max-w-lg">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-cyan-500 flex items-center justify-center text-white text-2xl font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || "S"}
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 block">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-cyan-400" />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 block">Email</label>
            <input type="email" value={user?.email || ""} disabled
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-500" />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 block">Role</label>
            <input value={user?.role || ""} disabled
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-500" />
          </div>
          <button type="submit" disabled={loading}
            className="bg-[#0f2c59] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#1d4e89] transition-all disabled:opacity-60">
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
