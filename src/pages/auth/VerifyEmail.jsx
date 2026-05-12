import { useState, useCallback } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BACKEND_URL;

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const token = searchParams.get("token");

  const [status, setStatus] = useState(() => {
    return token ? "idle" : "error";
  });

  const [message, setMessage] = useState(() => {
    return token ? "" : "Verification token is missing.";
  });

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const redirectToDashboard = useCallback(() => {
    if (isAuthenticated && user) {
      const role = user.role;
      if (role === "Admin" || role === "Sub Admin") navigate("/admin");
      else if (role === "Instructor") navigate("/instructor");
      else navigate("/student");
    } else {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  //  Verify Handler (Button click)
  const handleVerify = async () => {
    if (!token) return;

    try {
      setLoading(true);
      setStatus("verifying");

      const res = await axios.post(`${API_URL}/auth/verify-email`, { token });

      setStatus("success");
      setMessage(res.data?.message || "Email verified successfully!");

      setTimeout(redirectToDashboard, 2000);
    } catch (err) {
      setStatus("error");
      setMessage(
        err.response?.data?.message ||
          "Verification failed. The link may have expired.",
      );
    } finally {
      setLoading(false);
    }
  };

  //  Resend Email Handler
  const handleResend = async () => {
    try {
      setResending(true);

      const email = user?.email; // assuming logged-in user
      if (!email) {
        setMessage("Unable to resend email. Please login again.");
        return;
      }

      await axios.post(`${API_URL}/auth/resend-verification-email`, {
        email,
      });

      setMessage("Verification email sent again. Please check your inbox.");
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Failed to resend verification email.",
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-cyan-50/30 px-6">
      <div className="max-w-md w-full text-center space-y-6">
        {/*  IDLE STATE */}
        {status === "idle" && (
          <div className="space-y-4">
            <h1 className="text-2xl font-extrabold text-gray-900">
              Verify your email
            </h1>
            <p className="text-gray-500 text-sm">
              Click below to verify your email address.
            </p>

            <button
              onClick={handleVerify}
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-cyan-600 text-white font-bold text-sm hover:bg-cyan-700 transition-all disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify Now"}
            </button>
          </div>
        )}

        {/*  VERIFYING */}
        {status === "verifying" && (
          <div className="space-y-4">
            <div className="w-12 h-12 mx-auto border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <h1 className="text-2xl font-extrabold text-gray-900">
              Verifying your email...
            </h1>
            <p className="text-gray-500 text-sm">
              Please wait while we confirm your email address.
            </p>
          </div>
        )}

        {/*  SUCCESS */}
        {status === "success" && (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-extrabold text-gray-900">
              Email Verified!
            </h1>

            <p className="text-gray-500 text-sm">{message}</p>
            <p className="text-gray-400 text-xs">Redirecting you...</p>
          </div>
        )}

        {/* ❌ ERROR */}
        {status === "error" && (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-extrabold text-gray-900">
              Verification Failed
            </h1>

            <p className="text-gray-500 text-sm">{message}</p>

            {/*  Resend */}
            <button
              onClick={handleResend}
              disabled={resending}
              className="px-5 py-2 rounded-lg bg-cyan-600 text-white text-sm font-semibold hover:bg-cyan-700 disabled:opacity-50"
            >
              {resending ? "Sending..." : "Resend Email"}
            </button>

            <Link
              to="/login"
              className="block mt-3 px-6 py-3 rounded-xl bg-gray-900 text-white font-bold text-sm hover:bg-gray-800 transition-all"
            >
              Go to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
