import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "@/utils/validation/loginSchema";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
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
    defaultValues: {
      rememberMe: false, // default false rakha hai
    },
  });

  const { mutate, isPending } = useLogin();

  const onSubmit = (data) => {
    console.log("login data", data);
    
    mutate(data, {
      onSuccess: (res) => {
        console.log("Login Success", res);
        navigate("/");
        reset();
      },
      onError: (err) => {
        console.log("Login Failed", err);
        toast.error(err?.data?.message)
        //alert(err.userMessage);
      },
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-105">
        {/* Header Section - Centered Heading + Elegant Badge */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-[32px] font-bold tracking-tight mb-6">
            Login your Account
          </h1>

          {/* Welcome Back Badge - Modern pill style */}
          <div className="mx-auto inline-flex items-center justify-center bg-blue-300 text-white font-semibold text-base px-9 py-3 rounded-3xl shadow-md">
            Welcome Back!
          </div>
        </div>

        {/* Main Card Container - Clean & Premium Look */}
        <div className="bg-white shadow-2xl rounded-3xl p-8 sm:p-10 border border-gray-100">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-7"
          >
            {/* Username or Email */}
            <Input
              label="Username or Email"
              placeholder="Enter your username or email"
              name="email"
              register={register}
              error={errors.email?.message}
              className="text-primary text-base py-3 font-medium bg-gray-100"
            />

            {/* Password Field with Eye Icon */}
            <div className="relative">
              <Input
                label="Password"
                placeholder="Enter your password"
                name="password"
                type={showPass ? "text" : "password"}
                register={register}
                error={errors.password?.message}
                className="text-primary text-base py-3 font-medium bg-gray-100 pr-12"
              />

              {/* Eye Icon - Perfectly positioned & accessible */}
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
                aria-label={showPass ? "Hide password" : "Show password"}
              >
                {showPass ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isPending}
              className="bg-blue-900 hover:bg-blue-950 font-semibold py-3 text-base shadow-lg active:scale-[0.985] transition-all"
            >
              {isPending ? "Logging in..." : "Log in"}
            </Button>

            {/* Remember Me + Forgot Password - Perfect Row */}
            <div className="flex items-center justify-between text-sm -mt-1">
              <label className="flex items-center gap-2 cursor-pointer text-primary font-medium">
                <input
                  type="checkbox"
                  {...register("rememberMe")}
                  className="w-4 h-4 accent-blue-900 border-gray-300 rounded focus:ring-blue-900"
                />
                Remember me
              </label>

              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm font-medium text-blue-400 hover:text-blue-500 transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          </form>
        </div>

        {/* Signup Link - Below Card */}
        <p className="mt-8 text-center text-primary font-medium text-base">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="text-blue-500 font-semibold hover:underline transition-colors"
          >
            Signup
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
