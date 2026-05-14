import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  LuEye,
  LuEyeOff,
  LuUser,
  LuGraduationCap,
  LuLayoutDashboard,
} from "react-icons/lu";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { registerUser } from "@/api/authApi";
import { signupSchema } from "@/utils/validation/signupSchema";
import { auth, googleProvider } from "@/config/firebase";
import { signInWithPopup } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setUser, setToken } from "@/store/Slices/authSlice";
import { googleLogin } from "@/api/authApi";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPass, setShowPass] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(signupSchema),
    defaultValues: { role: "Student" },
  });

  const selectedRole = useWatch({ control, name: "role" });

  const { mutate, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success(
        "Registration successful! Check your email to verify your account.",
      );
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error?.userMessage || "Registration failed.");
    },
  });

  const onSubmit = (data) => {
    mutate({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
    });
  };

  const handleGoogleSignUp = async () => {
    try {
      setIsGoogleLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const backendResponse = await googleLogin(idToken);

      dispatch(setUser(backendResponse.user));
      dispatch(setToken(backendResponse.accessToken));
      
      toast.success("Account created successfully with Google!");
      
      const redirectPath = backendResponse.user.role === "Student" 
        ? "/student" 
        : backendResponse.user.role === "Instructor" 
          ? "/instructor" 
          : "/admin";
          
      navigate(redirectPath);
    } catch (error) {
      console.error("Google Sign-Up Error:", error);
      toast.error(error.response?.data?.message || "Failed to sign up with Google.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Left Side - Visual Focus */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-16 text-white overflow-hidden bg-[#0f172a]">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop"
            alt="Collaboration and Learning"
            className="w-full h-full object-cover opacity-30 select-none scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#0f172a]/80 to-transparent" />
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse-slow" />
        </div>

        <div className="relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight hover:opacity-80 transition-opacity"
          >
            <span className="text-white">Tech</span>
            <span className="text-cyan-400">navyug</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg">
          <span className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold tracking-wider uppercase mb-6 border border-cyan-500/20 backdrop-blur-sm">
            Empowering the next generation
          </span>
          <h2 className="text-6xl font-extrabold leading-tight tracking-tight mb-8">
            Start Your <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Learning Journey.
            </span>
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10">
                <LuGraduationCap className="text-cyan-400" size={24} />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white">
                  Expert-Led Courses
                </h4>
                <p className="text-gray-400 leading-relaxed">
                  Learn from industry veterans and gain practical knowledge that
                  matters.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10">
                <LuLayoutDashboard className="text-cyan-400" size={24} />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white">
                  Industry Portfolio
                </h4>
                <p className="text-gray-400 leading-relaxed">
                  Build real-world projects and showcase your skills with an
                  industry portfolio.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <div className="h-px w-full bg-gradient-to-r from-white/20 to-transparent mb-6" />
          <div className="flex justify-between items-center text-sm font-medium text-gray-500">
            <span>&copy; 2026 Technavyug Education</span>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-20 bg-white">
        <div className="w-full max-w-lg">
          {/* Logo - Mobile only */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link to="/" className="text-3xl font-extrabold tracking-tight">
              Tech<span className="text-cyan-500">navyug</span>
            </Link>
          </div>

          <div className="text-center lg:text-left mb-10">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              Create Account
            </h1>
            <p className="text-slate-500 text-lg font-medium">
              Join the future of tech education.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 block ml-1">
                  Full Name
                </label>
                <div className="relative group">
                  <input
                    {...register("name")}
                    placeholder="John Doe"
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/30 focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 focus:bg-white transition-all outline-none text-slate-900 group-hover:border-slate-300"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1.5 ml-1 font-semibold animate-in fade-in slide-in-from-top-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 block ml-1">
                  Email
                </label>
                <div className="relative group">
                  <input
                    {...register("email")}
                    placeholder="you@example.com"
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/30 focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 focus:bg-white transition-all outline-none text-slate-900 group-hover:border-slate-300"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1.5 ml-1 font-semibold animate-in fade-in slide-in-from-top-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 block ml-1">
                Password
              </label>
              <div className="relative group">
                <input
                  {...register("password")}
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/30 focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 focus:bg-white transition-all outline-none text-slate-900 pr-12 group-hover:border-slate-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1 transition-colors"
                >
                  {showPass ? <LuEyeOff size={20} /> : <LuEye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1.5 ml-1 font-semibold animate-in fade-in slide-in-from-top-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 block ml-1">
                Confirm Password
              </label>
              <div className="relative group">
                <input
                  {...register("confirmPassword")}
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/30 focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 focus:bg-white transition-all outline-none text-slate-900 group-hover:border-slate-300"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1.5 ml-1 font-semibold animate-in fade-in slide-in-from-top-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 block ml-1">
                I want to join as
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="relative cursor-pointer group">
                  <input
                    type="radio"
                    value="Student"
                    {...register("role")}
                    className="peer sr-only"
                  />
                  <div
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 bg-slate-50/50 group-hover:bg-slate-50 ${selectedRole === "Student" ? "border-cyan-500 bg-cyan-50/50" : "border-slate-100"}`}
                  >
                    <LuUser
                      className={
                        selectedRole === "Student"
                          ? "text-cyan-500"
                          : "text-slate-400"
                      }
                      size={22}
                    />
                    <span
                      className={`text-sm font-bold ${selectedRole === "Student" ? "text-cyan-700" : "text-slate-600"}`}
                    >
                      Student
                    </span>
                  </div>
                </label>
                <label className="relative cursor-pointer group">
                  <input
                    type="radio"
                    value="Instructor"
                    {...register("role")}
                    className="peer sr-only"
                  />
                  <div
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 bg-slate-50/50 group-hover:bg-slate-50 ${selectedRole === "Instructor" ? "border-cyan-500 bg-cyan-50/50" : "border-slate-100"}`}
                  >
                    <LuGraduationCap
                      className={
                        selectedRole === "Instructor"
                          ? "text-cyan-500"
                          : "text-slate-400"
                      }
                      size={22}
                    />
                    <span
                      className={`text-sm font-bold ${selectedRole === "Instructor" ? "text-cyan-700" : "text-slate-600"}`}
                    >
                      Instructor
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#0f172a] text-white font-extrabold py-4 rounded-2xl shadow-xl shadow-slate-200 hover:bg-[#1e293b] hover:shadow-2xl active:scale-[0.98] transition-all disabled:opacity-70 text-lg mt-4 flex items-center justify-center gap-2 overflow-hidden relative group"
            >
              <span className="relative z-10">
                {isPending ? "Creating Account..." : "Create Account"}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity" />
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500 font-medium">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                disabled={isGoogleLoading}
                onClick={handleGoogleSignUp}
                className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 text-slate-700 font-bold py-3.5 rounded-2xl shadow-sm hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] transition-all disabled:opacity-70"
              >
                {isGoogleLoading ? (
                  <div className="w-6 h-6 border-2 border-slate-300 border-t-cyan-500 rounded-full animate-spin" />
                ) : (
                  <FcGoogle size={24} />
                )}
                <span>{isGoogleLoading ? "Signing up..." : "Sign up with Google"}</span>
              </button>
            </div>
          </div>

          <p className="mt-10 text-center text-slate-500 font-semibold tracking-tight">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-extrabold text-cyan-600 hover:text-cyan-500 transition-colors inline-flex items-center gap-1 group"
            >
              Sign in
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
