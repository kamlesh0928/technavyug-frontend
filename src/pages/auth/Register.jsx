import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useRegister } from "@/hooks/useRegister";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "@/utils/validation/signupSchema";

const VITE_API_BACKEND_URL = import.meta.env.VITE_API_BACKEND_URL;

const Register = () => {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      role: "Student",
    },
  });

  const { mutate, isPending } = useRegister();

  const onSubmit = async (data) => {
    try {
      const userData = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      };

      const response = await axios.post(
        `${VITE_API_BACKEND_URL}/auth/register`,
        userData,
      );

      toast.success("Account created successfully!");
      reset();
      navigate("/");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Signup failed. Please try again.",
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* --- LEFT SIDE: Professional Image & Branding --- */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-16 text-white overflow-hidden bg-[#0f2c59]">
        {/* Professional Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
            alt="Students Community"
            className="w-full h-full object-cover opacity-30 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f2c59] via-[#0f2c59]/70 to-[#0f2c59]/40"></div>
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <Link to="/" className="text-3xl font-bold tracking-tight">
            Tech<span className="text-cyan-400">navyug</span>
          </Link>
        </div>

        {/* Content Section */}
        <div className="relative z-10 max-w-lg">
          <h2 className="text-5xl font-extrabold leading-[1.1] mb-8">
            Join the <span className="text-cyan-400">Future</span> of Learning.
          </h2>
          <div className="space-y-5">
            <div className="flex items-start gap-3 text-lg text-gray-200">
              <FaCheckCircle className="text-cyan-400 mt-1" />
              <span>Learn from Top 1% Industry Mentors</span>
            </div>
            <div className="flex items-start gap-3 text-lg text-gray-200">
              <FaCheckCircle className="text-cyan-400 mt-1" />
              <span>Get Certified & Get Hired</span>
            </div>
            <div className="flex items-start gap-3 text-lg text-gray-200">
              <FaCheckCircle className="text-cyan-400 mt-1" />
              <span>Unlimited Access to 500+ Projects</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-gray-400 font-medium border-t border-white/10 pt-8">
          © 2026 Technavyug Education • Join 12,000+ Students
        </div>
      </div>

      {/* --- RIGHT SIDE: Clean Registration Form (No Box) --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 lg:p-20 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-10 text-center">
            <h1 className="text-3xl font-bold text-[#0f2c59]">
              Tech<span className="text-cyan-400">navyug</span>
            </h1>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              Create Account
            </h1>
            <p className="text-gray-500 mt-3 text-lg">
              Start your professional journey today.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 ml-1">
                Full Name
              </label>
              <Input
                placeholder="Enter Your Name"
                name="name"
                register={register}
                error={errors.name?.message}
                className="w-full px-5 py-3.5 rounded-2xl border-gray-200 bg-gray-50/50 focus:ring-2 focus:ring-cyan-400 focus:bg-white transition-all outline-none shadow-sm"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 ml-1">
                Email Address
              </label>
              <Input
                placeholder="you@example.com"
                name="email"
                type="email"
                register={register}
                error={errors.email?.message}
                className="w-full px-5 py-3.5 rounded-2xl border-gray-200 bg-gray-50/50 focus:ring-2 focus:ring-cyan-400 focus:bg-white transition-all outline-none shadow-sm"
              />
            </div>

            {/* Password Fields Row (Side by side on larger screens if needed, but stacked is cleaner for mobile) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password */}
              <div className="relative space-y-1.5">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  Password
                </label>
                <div className="relative">
                  <Input
                    placeholder="••••••••"
                    name="password"
                    type={showPass ? "text" : "password"}
                    register={register}
                    error={errors.password?.message}
                    className="w-full px-5 py-3.5 rounded-2xl border-gray-200 bg-gray-50/50 focus:ring-2 focus:ring-cyan-400 focus:bg-white transition-all outline-none pr-12 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0f2c59]"
                  >
                    {showPass ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="relative space-y-1.5">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    placeholder="••••••••"
                    name="confirmPassword"
                    type={showConfirmPass ? "text" : "password"}
                    register={register}
                    error={errors.confirmPassword?.message}
                    className="w-full px-5 py-3.5 rounded-2xl border-gray-200 bg-gray-50/50 focus:ring-2 focus:ring-cyan-400 focus:bg-white transition-all outline-none pr-12 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0f2c59]"
                  >
                    {showConfirmPass ? (
                      <FaEyeSlash size={18} />
                    ) : (
                      <FaEye size={18} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Role Selector */}
            <div className="space-y-1.5 relative">
              <label className="text-sm font-bold text-gray-700 ml-1">
                Register As
              </label>
              <div className="relative group">
                <select
                  {...register("role")}
                  className={`w-full px-5 py-3.5 rounded-2xl border bg-gray-50/50 outline-none transition-all focus:ring-2 focus:ring-cyan-400 appearance-none shadow-sm cursor-pointer font-medium text-gray-700
                  ${errors.role ? "border-red-500" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <option value="Student">Student (Learner)</option>
                  <option value="Instructor">Instructor (Teacher)</option>
                </select>

                {/* CUSTOM ARROW DOWN ICON */}
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-focus-within:text-cyan-500 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              {errors.role && (
                <p className="text-red-500 text-xs ml-1 font-medium italic">
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#0f2c59] text-white font-bold py-4 rounded-2xl shadow-xl hover:bg-[#1a4073] active:scale-[0.98] transition-all disabled:opacity-70 mt-4 text-lg"
            >
              {isPending ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-10 text-center">
            <p className="text-gray-500 font-medium">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="font-bold text-[#0f2c59] hover:text-cyan-500 transition-colors underline underline-offset-4"
              >
                Log in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
