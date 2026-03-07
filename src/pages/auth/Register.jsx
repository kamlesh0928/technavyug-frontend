import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "@/utils/validation/signupSchema";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import { useRegister } from "@/hooks/useRegister";
import { toast } from "react-toastify";

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

  const onSubmit = (data) => {
    mutate(data, {
      onSuccess: (res) => {
       navigate("/");
       reset()
      },
      onError: (err) => {
        console.log("Register Failed", err);
        toast.error(err.userMessage);
      },
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-105">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-[32px] font-bold tracking-tight mb-6">
            Create your Account
          </h1>

          {/* Modern Badge */}
          <div className="mx-auto inline-flex items-center justify-center bg-blue-300 text-white font-semibold text-base px-9 py-3 rounded-3xl shadow-md">
            Join the Community!
          </div>
        </div>

        {/* Main Card - Same Premium Style as Login */}
        <div className="bg-white shadow-2xl rounded-3xl p-8 sm:p-10 border border-gray-100">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-7"
          >
            {/* Full Name */}
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              name="name"
              register={register}
              error={errors.name?.message}
              className="text-primary text-base py-3 font-medium bg-gray-100"
            />

            {/* Email */}
            <Input
              label="Email Address"
              placeholder="Enter your email"
              name="email"
              type="email"
              register={register}
              error={errors.email?.message}
              className="text-primary text-base py-3 font-medium bg-gray-100"
            />

            {/* Password */}
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

            {/* Confirm Password */}
            <div className="relative">
              <Input
                label="Confirm Password"
                placeholder="Confirm your password"
                name="confirmPassword"
                type={showConfirmPass ? "text" : "password"}
                register={register}
                error={errors.confirmPassword?.message}
                className="text-primary text-base py-3 font-medium bg-gray-100 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute right-4 top-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
                aria-label={showConfirmPass ? "Hide password" : "Show password"}
              >
                {showConfirmPass ? (
                  <FaEyeSlash size={20} />
                ) : (
                  <FaEye size={20} />
                )}
              </button>
            </div>

            {/* Role Selector (Schema ke according - only public roles) */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="role"
                className="text-sm font-medium text-primary"
              >
                Select Role
              </label>

              <select
                id="role"
                {...register("role")}
                className={`w-full  text-primary text-base py-2.5 font-medium 
    bg-white border rounded-xl px-3 outline-none transition-all
    focus:ring-2 focus:ring-blue-500
    ${errors.role ? "border-red-500 focus:ring-red-500" : "border-gray-300"}`}
              >
                <option value="">Select role</option>
                <option value="Student">Student</option>
                <option value="Instructor">Instructor</option>
              </select>

              {errors.role && (
                <p className="text-red-500 text-xs">{errors.role.message}</p>
              )}
            </div>

            {/* Sign Up Button */}
            <Button
              type="submit"
              disabled={isPending}
              className="bg-blue-900 hover:bg-blue-950 font-semibold py-3 text-base shadow-lg active:scale-[0.985] transition-all"
            >
             {isPending ? "Creating..." : "Signup"}
            </Button>
          </form>
        </div>

        {/* Login Link */}
        <p className="mt-8 text-center text-primary font-medium text-base">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-blue-500 font-semibold hover:underline transition-colors"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
