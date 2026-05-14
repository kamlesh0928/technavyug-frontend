import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { FcGoogle } from "react-icons/fc";
import { useNavigate, Link } from "react-router-dom";

import { useLogin } from "@/hooks/useLogin";
import { loginSchema } from "@/utils/validation/loginSchema";
import { useMutation } from "@tanstack/react-query";
import { resendVerification, googleLogin } from "@/api/authApi";
import { toast } from "react-toastify";
import { auth, googleProvider } from "@/config/firebase";
import { signInWithPopup } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setUser, setToken } from "@/store/Slices/authSlice";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPass, setShowPass] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: { rememberMe: false },
  });

  const { mutate, isPending } = useLogin();
  const [showResend, setShowResend] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [lastEmail, setLastEmail] = useState("");

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const resendMutation = useMutation({
    mutationFn: resendVerification,
    onSuccess: (data) => {
      toast.success(
        data.message || "Verification email sent! Check your inbox.",
      );
      setCountdown(60); // Start 60s cooldown
    },
    onError: (err) => {
      toast.error(err?.data?.message || "Failed to resend email.");
    },
  });

  const onSubmit = (data) => {
    setLastEmail(data.email);
    mutate(
      {
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      },
      {
        onError: (err) => {
          // Check for unverified error using formatted error object from axiosInstance
          if (
            err?.status === 401 &&
            err?.userMessage?.toLowerCase().includes("verify")
          ) {
            setShowResend(true);
            // Automatically trigger resend on encounter if no cooldown is active
            if (countdown === 0 && !resendMutation.isPending) {
              resendMutation.mutate(data.email);
            }
          }
        },
      },
    );
  };

  const handleResend = () => {
    if (lastEmail) {
      resendMutation.mutate(lastEmail);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const backendResponse = await googleLogin(idToken);

      dispatch(setUser(backendResponse.user));
      dispatch(setToken(backendResponse.accessToken));

      toast.success("Logged in successfully with Google!");

      const redirectPath =
        backendResponse.user.role === "Student"
          ? "/student"
          : backendResponse.user.role === "Instructor"
            ? "/instructor"
            : "/admin";

      navigate(redirectPath);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to sign in with Google.",
      );
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-16 text-white overflow-hidden bg-[#0f2c59]">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop"
            alt="Digital Learning"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f2c59] via-[#0f2c59]/60 to-transparent" />
        </div>
        <div className="relative z-10">
          <Link to="/" className="text-3xl font-bold tracking-tight">
            Tech<span className="text-cyan-400">navyug</span>
          </Link>
        </div>
        <div className="relative z-10 max-w-lg">
          <h2 className="text-5xl font-extrabold leading-[1.1] tracking-tight mb-6">
            Unlock Your <br />
            <span className="text-cyan-400">Tech Potential.</span>
          </h2>
          <p className="text-lg text-gray-200 font-medium leading-relaxed opacity-90">
            Join the community of modern learners. Access industry-grade courses
            and build your dream career today.
          </p>
        </div>
        <div className="relative z-10 text-sm text-gray-400 font-medium">
          &copy; 2026 Technavyug Education
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-10">
            <h1 className="text-3xl font-bold text-[#0f2c59] text-center">
              Tech<span className="text-cyan-400">navyug</span>
            </h1>
          </div>

          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-gray-500 mt-3 text-lg">
              Enter your credentials to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">
                Email
              </label>
              <input
                {...register("email")}
                placeholder="you@example.com"
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50/50 focus:ring-2 focus:ring-cyan-400 focus:bg-white transition-all outline-none text-base"
              />
              {errors.email && (
                <p className="form-error">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-bold text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-xs font-bold text-cyan-600 hover:text-cyan-700"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  {...register("password")}
                  placeholder="••••••••"
                  type={showPass ? "text" : "password"}
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50/50 focus:ring-2 focus:ring-cyan-400 focus:bg-white transition-all outline-none text-base pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0f2c59] transition-colors"
                >
                  {showPass ? <LuEyeOff size={20} /> : <LuEye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="form-error">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center px-1 py-1">
              <label className="flex items-center gap-3 cursor-pointer text-sm font-medium text-gray-600">
                <input
                  type="checkbox"
                  {...register("rememberMe")}
                  className="w-4 h-4 rounded border-gray-300 text-[#0f2c59] focus:ring-[#0f2c59]"
                />
                Keep me logged in
              </label>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#0f2c59] text-white font-bold py-4 rounded-2xl shadow-xl hover:bg-[#1a4073] active:scale-[0.98] transition-all disabled:opacity-70 text-lg mt-4"
            >
              {isPending ? "Authenticating..." : "Sign In"}
            </button>

            {showResend && (
              <div className="mt-6 p-5 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50 animate-in fade-in slide-in-from-top-2 duration-500">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 relative">
                    <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                  </div>

                  <div className="flex-1 text-left">
                    <h4 className="text-base font-bold text-[#0f2c59]">
                      Verify your email
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                      Sent to{" "}
                      <span className="font-semibold text-cyan-600 break-all">
                        {lastEmail}
                      </span>
                      . Please verify to continue.
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-50 space-y-3">
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendMutation.isPending || countdown > 0}
                    className="group relative w-full py-2.5 px-4 bg-[#0f2c59] text-white text-sm font-bold rounded-xl transition-all hover:bg-[#1a4073] active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 overflow-hidden"
                  >
                    {resendMutation.isPending ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <svg
                        className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                      </svg>
                    )}
                    <span>
                      {countdown > 0
                        ? `Resend in ${countdown}s`
                        : "Resend Link"}
                    </span>
                  </button>

                  {countdown > 0 && (
                    <div className="relative w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 bg-cyan-500 transition-all duration-1000 ease-linear"
                        style={{ width: `${(countdown / 60) * 100}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                disabled={isGoogleLoading}
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-100 text-gray-700 font-bold py-3.5 rounded-2xl shadow-sm hover:bg-gray-50 hover:border-gray-200 active:scale-[0.98] transition-all disabled:opacity-70"
              >
                {isGoogleLoading ? (
                  <div className="w-6 h-6 border-2 border-gray-300 border-t-cyan-500 rounded-full animate-spin" />
                ) : (
                  <FcGoogle size={24} />
                )}
                <span>
                  {isGoogleLoading ? "Signing in..." : "Sign in with Google"}
                </span>
              </button>
            </div>
          </div>

          <p className="mt-12 text-center text-gray-500 font-medium">
            New to Technavyug?{" "}
            <Link
              to="/register"
              className="font-bold text-[#0f2c59] hover:text-cyan-500 transition-colors underline underline-offset-4"
            >
              Join for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
