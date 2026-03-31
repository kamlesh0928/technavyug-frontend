import { useAuth } from "@/hooks/useAuth";
import {
  LuUser,
  LuShieldCheck,
  LuTrash2,
  LuSave,
  LuLock,
  LuMail,
} from "react-icons/lu";
import { useState } from "react";
import { toast } from "react-toastify";

export default function AdminSettings() {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      toast.success("Profile updated successfully");
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl space-y-10">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          Account Settings
        </h1>
        <p className="text-gray-500 mt-1">
          Manage your administrative profile and security preferences
        </p>
      </div>

      <div className="grid gap-8">
        {/* Profile Section */}
        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/30 flex items-center gap-3">
            <LuUser className="text-cyan-500" size={20} />
            <h3 className="font-bold text-gray-900">Personal Information</h3>
          </div>
          <form onSubmit={handleSaveProfile} className="p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <LuUser
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="text"
                    defaultValue={user?.name}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-cyan-400 transition-all font-medium text-gray-800"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <LuMail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="email"
                    defaultValue={user?.email}
                    disabled
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 text-sm bg-gray-50 text-gray-400 font-medium cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 bg-[#0f2c59] text-white px-8 py-3 rounded-2xl font-bold text-sm hover:shadow-xl hover:shadow-blue-900/20 active:scale-95 transition-all disabled:opacity-70"
            >
              {isSaving ? (
                "Saving..."
              ) : (
                <>
                  <LuSave size={18} /> Save Changes
                </>
              )}
            </button>
          </form>
        </section>

        {/* Security Section */}
        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/30 flex items-center gap-3">
            <LuShieldCheck className="text-cyan-500" size={20} />
            <h3 className="font-bold text-gray-900">Security & Password</h3>
          </div>
          <div className="p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                  Current Password
                </label>
                <div className="relative">
                  <LuLock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                  New Password
                </label>
                <div className="relative">
                  <LuLock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="password"
                    placeholder="Minimum 8 characters"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                  />
                </div>
              </div>
            </div>
            <button className="text-cyan-600 hover:text-cyan-700 font-bold text-sm underline underline-offset-4">
              Update Password
            </button>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-red-50/30 rounded-3xl border border-red-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-red-100 flex items-center gap-3 text-red-600">
            <LuTrash2 size={24} />
            <h3 className="font-bold">Danger Zone</h3>
          </div>
          <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-bold text-gray-900 mb-1">Delete Account</p>
              <p className="text-sm text-gray-500">
                Permanently remove your account and all associated data. This
                action cannot be undone.
              </p>
            </div>
            <button className="bg-red-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/20 active:scale-95 transition-all whitespace-nowrap">
              Delete Account
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
