import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { registerUser } from "@/api/authApi";
import { signupSchema } from "@/utils/validation/signupSchema";

export default function Register() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signupSchema),
    defaultValues: { role: "Student" },
  });

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

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-16 text-white overflow-hidden bg-[#0f2c59]">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
            alt="Learning"
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
            Start Your <br />
            <span className="text-cyan-400">Learning Journey.</span>
          </h2>
          <p className="text-lg text-gray-200 font-medium leading-relaxed opacity-90">
            Create your free account and gain access to hundreds of
            industry-grade courses built by experts.
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

          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              Create Account
            </h1>
            <p className="text-gray-500 mt-3 text-lg">
              Join the future of tech education.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">
                Full Name
              </label>
              <input
                {...register("name")}
                placeholder="John Doe"
                className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 bg-gray-50/50 focus:ring-2 focus:ring-cyan-400 focus:bg-white transition-all outline-none text-sm"
              />
              {errors.name && (
                <p className="form-error">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">
                Email
              </label>
              <input
                {...register("email")}
                placeholder="you@example.com"
                className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 bg-gray-50/50 focus:ring-2 focus:ring-cyan-400 focus:bg-white transition-all outline-none text-sm"
              />
              {errors.email && (
                <p className="form-error">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 bg-gray-50/50 focus:ring-2 focus:ring-cyan-400 focus:bg-white transition-all outline-none text-sm pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="form-error">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">
                Confirm Password
              </label>
              <input
                {...register("confirmPassword")}
                type="password"
                placeholder="••••••••"
                className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 bg-gray-50/50 focus:ring-2 focus:ring-cyan-400 focus:bg-white transition-all outline-none text-sm"
              />
              {errors.confirmPassword && (
                <p className="form-error">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">
                I want to
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="relative">
                  <input
                    type="radio"
                    value="Student"
                    {...register("role")}
                    className="peer sr-only"
                  />
                  <div className="px-4 py-3 rounded-xl border-2 border-gray-200 text-center cursor-pointer text-sm font-medium text-gray-600 peer-checked:border-[#0f2c59] peer-checked:bg-[#0f2c59]/5 peer-checked:text-[#0f2c59] transition-all">
                    Student
                  </div>
                </label>
                <label className="relative">
                  <input
                    type="radio"
                    value="Instructor"
                    {...register("role")}
                    className="peer sr-only"
                  />
                  <div className="px-4 py-3 rounded-xl border-2 border-gray-200 text-center cursor-pointer text-sm font-medium text-gray-600 peer-checked:border-[#0f2c59] peer-checked:bg-[#0f2c59]/5 peer-checked:text-[#0f2c59] transition-all">
                    Instructor
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#0f2c59] text-white font-bold py-4 rounded-2xl shadow-xl hover:bg-[#1a4073] active:scale-[0.98] transition-all disabled:opacity-70 text-lg mt-2"
            >
              {isPending ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-10 text-center text-gray-500 font-medium">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-[#0f2c59] hover:text-cyan-500 transition-colors underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
