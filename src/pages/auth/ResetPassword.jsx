import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPasswordSchema } from "@/utils/validation/resetPasswordSchema";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useResetPassword } from "@/hooks/useResetPassword";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const { mutate, isPending } = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  });

  const onSubmit = (data) => {
    if (!token) {
      toast.error("Invalid reset link");
      return;
    }

    mutate(
      { token, password: data.password },
      {
        onSuccess: () => {
          toast.success("Password reset successfully! Please login.");
          navigate("/login");
        },
        onError: (err) => {
          toast.error(err?.response?.data?.message || "Something went wrong");
        },
      }
    );
  };

  if (!token) {
    return <div className="min-h-screen flex items-center justify-center">Invalid or expired link</div>;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-105">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-[32px] font-bold tracking-tight mb-6">
            Reset Your Password
          </h1>
        </div>

        <div className="bg-white shadow-2xl rounded-3xl p-8 sm:p-10 border border-gray-100">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7">
            {/* Password */}
            <div className="relative">
              <Input
                label="New Password"
                placeholder="Enter new password"
                name="password"
                type={showPass ? "text" : "password"}
                register={register}
                error={errors.password?.message}
                className="text-primary text-base py-3 font-medium bg-gray-100 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPass ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Input
                label="Confirm New Password"
                placeholder="Confirm new password"
                name="confirmPassword"
                type={showConfirmPass ? "text" : "password"}
                register={register}
                error={errors.confirmPassword?.message}
                className="text-primary text-base py-3 font-medium bg-gray-100 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute right-4 top-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPass ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="bg-blue-900 hover:bg-blue-950 font-semibold py-3 text-base shadow-lg active:scale-[0.985] transition-all"
            >
              {isPending ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;