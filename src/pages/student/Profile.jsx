import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/auth.services";
import { toast } from "react-toastify";
import { LuTrash2, LuLock, LuShield, LuEye, LuEyeOff } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

export default function StudentProfile() {
  const { user, setUser } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);

  const [showDelete, setShowDelete] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // ADD PASSWORD STATES
  const [showAddPassword, setShowAddPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [addingPassword, setAddingPassword] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  //console.log("StudentProfile - User:", user);

  // SHOW ADD PASSWORD CONDITION
  const shouldShowAddPassword = !user?.passwordSet;

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

  // ADD PASSWORD HANDLER
  const handleAddPassword = async () => {
    if (!newPassword || !confirmNewPassword) {
      return toast.error("Please fill all password fields");
    }

    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    if (newPassword !== confirmNewPassword) {
      return toast.error("Passwords do not match");
    }

    setAddingPassword(true);

    try {
      const response = await authService.addPassword({
        password: newPassword,
      });

      setUser(response.user);

      toast.success("Password added successfully");

      setShowAddPassword(false);

      setNewPassword("");
      setConfirmNewPassword("");

      // OPTIONAL REFRESH
      // window.location.reload();
    } catch (error) {
      toast.error(error?.userMessage || "Failed to add password");
    } finally {
      setAddingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirmPassword) return toast.error("Password is required");

    setIsDeleting(true);

    try {
      await authService.deleteAccount(confirmPassword);

      toast.success("Account deleted successfully");

      navigate("/login");
    } catch (error) {
      toast.error(error?.userMessage || "Failed to delete account");

      setIsDeleting(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">Profile</h1>

        <p className="text-gray-500 mt-1">Manage your account</p>
      </div>

      {/* PROFILE CARD */}
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
            <label className="text-sm font-bold text-gray-700 mb-2 block">
              Name
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 block">
              Email
            </label>

            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-500"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 block">
              Role
            </label>

            <input
              value={user?.role || ""}
              disabled
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#0f2c59] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#1d4e89] transition-all disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* ADD PASSWORD SECTION */}
      {shouldShowAddPassword && (
        <div className="bg-blue-50/40 rounded-2xl border border-blue-100 overflow-hidden max-w-lg mt-8">
          <div className="px-8 py-6 border-b border-blue-100 flex items-center gap-3 text-[#0f2c59]">
            <LuShield size={22} />

            <h3 className="font-bold">Add Password</h3>
          </div>

          <div className="p-8">
            <p className="font-bold text-gray-900 mb-1">Secure Your Account</p>

            <p className="text-sm text-gray-500 mb-6">
              Your account was created using Google Sign-In. Add a password to
              also login using email and password.
            </p>

            {showAddPassword ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
                {/* PASSWORD */}
                <div className="relative">
                  <LuLock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 rounded-xl border border-blue-200 text-sm outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? (
                      <LuEyeOff size={18} />
                    ) : (
                      <LuEye size={18} />
                    )}
                  </button>
                </div>

                {/* CONFIRM PASSWORD */}
                <div className="relative">
                  <LuLock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                  />

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 rounded-xl border border-blue-200 text-sm outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showConfirmPassword ? (
                      <LuEyeOff size={18} />
                    ) : (
                      <LuEye size={18} />
                    )}
                  </button>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAddPassword(false)}
                    className="flex-1 bg-white border border-gray-200 text-gray-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleAddPassword}
                    disabled={addingPassword}
                    className="flex-1 bg-[#0f2c59] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#1d4e89] transition-all disabled:opacity-50"
                  >
                    {addingPassword ? "Adding..." : "Add Password"}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddPassword(true)}
                className="bg-[#0f2c59] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#1d4e89] transition-all w-full md:w-auto"
              >
                Add Password
              </button>
            )}
          </div>
        </div>
      )}

      {/* DANGER ZONE */}
      <div className="bg-red-50/30 rounded-2xl border border-red-100 overflow-hidden max-w-lg mt-8 mb-8">
        <div className="px-8 py-6 border-b border-red-100 flex items-center gap-3 text-red-600">
          <LuTrash2 size={24} />

          <h3 className="font-bold">Danger Zone</h3>
        </div>

        <div className="p-8">
          <p className="font-bold text-gray-900 mb-1">Delete Account</p>

          <p className="text-sm text-gray-500 mb-6">
            Permanently remove your account and all associated data. This action
            cannot be undone.
          </p>

          {showDelete ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
              <div className="relative">
                <LuLock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />

                <input
                  type="password"
                  placeholder="Confirm password to delete"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-red-200 text-sm outline-none focus:ring-2 focus:ring-red-400 transition-all font-medium text-gray-800"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDelete(false)}
                  className="flex-1 bg-white border border-gray-200 text-gray-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting || !confirmPassword}
                  className="flex-1 bg-red-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-red-700 transition-all disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Confirm Delete"}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowDelete(true)}
              className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-red-700 transition-all w-full md:w-auto"
            >
              Delete Account
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
