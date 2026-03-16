import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPassword } from "@/api/authApi";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(token, password);
      toast.success("Password reset successfully! Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(error?.userMessage || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Invalid or missing reset token.</p>
          <Link
            to="/forgot-password"
            className="text-cyan-600 font-bold hover:underline"
          >
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="text-3xl font-bold text-[#0f2c59]">
            Tech<span className="text-cyan-400">navyug</span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Reset Password
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            Enter your new password below.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-bold text-gray-700 mb-2 block">
                New Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 bg-gray-50/50 focus:ring-2 focus:ring-cyan-400 outline-none text-sm"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 mb-2 block">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 bg-gray-50/50 focus:ring-2 focus:ring-cyan-400 outline-none text-sm"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0f2c59] text-white font-bold py-3.5 rounded-2xl hover:bg-[#1a4073] transition-all disabled:opacity-70"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
