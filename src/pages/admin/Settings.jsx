import { useAuth } from "@/hooks/useAuth";

export default function AdminSettings() {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Platform and account settings</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-2xl">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Admin Profile</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 block">Name</label>
            <input type="text" defaultValue={user?.name} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-cyan-400" />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 block">Email</label>
            <input type="email" defaultValue={user?.email} disabled className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-500" />
          </div>
          <button className="bg-[#0f2c59] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#1d4e89] transition-all mt-2">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
