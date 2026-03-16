import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { forgotPassword } from "@/api/authApi";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
      toast.success("Reset link sent to your email.");
    } catch (error) {
      toast.error(error?.userMessage || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

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
            Forgot Password
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            Enter your email and we will send you a link to reset your password.
          </p>

          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-gray-600 text-sm">
                Check your email for a password reset link.
              </p>
              <Link
                to="/login"
                className="text-cyan-600 font-bold text-sm mt-4 inline-block hover:underline"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-bold text-gray-700 mb-2 block">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 bg-gray-50/50 focus:ring-2 focus:ring-cyan-400 outline-none text-sm"
                  placeholder="you@example.com"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0f2c59] text-white font-bold py-3.5 rounded-2xl hover:bg-[#1a4073] transition-all disabled:opacity-70"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
              <p className="text-center text-sm text-gray-500">
                <Link
                  to="/login"
                  className="font-bold text-[#0f2c59] hover:underline"
                >
                  Back to Login
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
