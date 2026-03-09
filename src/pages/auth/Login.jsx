import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "@/utils/validation/loginSchema";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useNavigate, Link } from "react-router-dom";
import { useLogin } from "@/hooks/useLogin";
import { toast } from "react-toastify";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: { rememberMe: false },
  });

  const { mutate, isPending } = useLogin();

  const onSubmit = (data) => {
    mutate(data, {
      onSuccess: () => {
        navigate("/");
        reset();
      },
      onError: (err) => {
        toast.error(err?.data?.message || "Login failed");
      },
    });
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* --- LEFT SIDE: Professional Tech Image Section --- */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-16 text-white overflow-hidden bg-[#0f2c59]">
        
        {/* Real High-Quality Image with Professional Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop" 
            alt="Digital Learning Tech" 
            className="w-full h-full object-cover opacity-40 shadow-2xl scale-105"
          />
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f2c59] via-[#0f2c59]/60 to-transparent"></div>
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <Link to="/" className="text-3xl font-bold tracking-tight">
            Tech<span className="text-cyan-400">navyug</span>
          </Link>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-lg">
          <h2 className="text-5xl font-extrabold leading-[1.1] tracking-tight mb-6">
            Unlock Your <br /> 
            <span className="text-cyan-400">Tech Potential.</span>
          </h2>
          <p className="text-lg text-gray-200 font-medium leading-relaxed opacity-90">
            Join the community of modern learners. Access industry-grade courses and build your dream career today.
          </p>
        </div>

        {/* Footer info on left */}
        <div className="relative z-10 text-sm text-gray-400 font-medium">
          © 2026 Technavyug Education • Secure Access
        </div>
      </div>

      {/* --- RIGHT SIDE: Clean Form (No Box, Directly on Page) --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24 bg-white">
        <div className="w-full max-w-md">
          
          {/* Mobile Logo Only */}
          <div className="lg:hidden mb-10">
             <h1 className="text-3xl font-bold text-[#0f2c59] text-center">
              Tech<span className="text-cyan-400">navyug</span>
            </h1>
          </div>

          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Welcome Back</h1>
            <p className="text-gray-500 mt-3 text-lg">Enter your credentials to continue.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Email or Username</label>
              <Input
                placeholder="you@example.com"
                name="email"
                register={register}
                error={errors.email?.message}
                className="w-full px-5 py-4 rounded-2xl border-gray-200 bg-gray-50/50 focus:ring-2 focus:ring-cyan-400 focus:bg-white transition-all outline-none text-base shadow-sm"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-bold text-gray-700">Password</label>
                <button 
                  type="button" 
                  onClick={() => navigate("/forgot-password")}
                  className="text-xs font-bold text-cyan-600 hover:text-cyan-700"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Input
                  placeholder="••••••••"
                  name="password"
                  type={showPass ? "text" : "password"}
                  register={register}
                  error={errors.password?.message}
                  className="w-full px-5 py-4 rounded-2xl border-gray-200 bg-gray-50/50 focus:ring-2 focus:ring-cyan-400 focus:bg-white transition-all outline-none text-base shadow-sm pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0f2c59] transition-colors"
                >
                  {showPass ? <FaEyeSlash size={22} /> : <FaEye size={22} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
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

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#0f2c59] text-white font-bold py-4 rounded-2xl shadow-xl hover:bg-[#1a4073] active:scale-[0.98] transition-all disabled:opacity-70 text-lg mt-4"
            >
              {isPending ? "Authenticating..." : "Sign In"}
            </Button>
          </form>

          {/* Signup Link */}
          <p className="mt-12 text-center text-gray-500 font-medium">
            New to Technavyug?{" "}
            <button
              onClick={() => navigate("/register")}
              className="font-bold text-[#0f2c59] hover:text-cyan-500 transition-colors underline underline-offset-4"
            >
              Join for free
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;