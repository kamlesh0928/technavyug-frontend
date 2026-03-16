import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BACKEND_URL;

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [status, setStatus] = useState(() => {
    const token = searchParams.get("token");
    return token ? "verifying" : "error";
  });
  const [message, setMessage] = useState(() => {
    const token = searchParams.get("token");
    return token ? "" : "Verification token is missing.";
  });

  const token = searchParams.get("token");

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

  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/auth/verify-email?token=${token}`,
        );
        setStatus("success");
        setMessage(res.data?.message || "Email verified successfully!");
        setTimeout(redirectToDashboard, 2000);
      } catch (err) {
        setStatus("error");
        setMessage(
          err.response?.data?.message ||
            "Verification failed. The link may have expired.",
        );
      }
    };

    verify();
  }, [token, redirectToDashboard]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-cyan-50/30 px-6">
      <div className="max-w-md w-full text-center">
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
            <p className="text-gray-400 text-xs">Redirecting you now...</p>
          </div>
        )}

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
            <Link
              to="/login"
              className="inline-block mt-4 px-6 py-3 rounded-xl bg-gray-900 text-white font-bold text-sm hover:bg-gray-800 transition-all"
            >
              Go to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
