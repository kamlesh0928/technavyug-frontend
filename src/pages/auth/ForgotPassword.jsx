import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { forgotPasswordSchema } from "@/utils/validation/forgotPasswordSchema";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import { useForgotPassword } from "@/hooks/useForgotPassword";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const onSubmit = (data) => {
    mutate(data, {
      onSuccess: () => {
        navigate("/check-email", { state: { type: "reset" } }); // extra state for dynamic message
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || "Something went wrong");
      },
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-105">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-[32px] font-bold tracking-tight mb-6">
            Forgot Password?
          </h1>
          <p className="text-gray-600">No worries! We'll send you reset instructions.</p>
        </div>

        <div className="bg-white shadow-2xl rounded-3xl p-8 sm:p-10 border border-gray-100">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7">
            <Input
              label="Email Address"
              placeholder="Enter your email"
              name="email"
              type="email"
              register={register}
              error={errors.email?.message}
              className="text-primary text-base py-3 font-medium bg-gray-100"
            />

            <Button
              type="submit"
              disabled={isPending}
              className="bg-blue-900 hover:bg-blue-950 font-semibold py-3 text-base shadow-lg active:scale-[0.985] transition-all"
            >
              {isPending ? "Sending..." : "Send Reset Link"}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-blue-500 hover:underline text-sm font-medium"
              >
                ← Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;