import { useMutation } from "@tanstack/react-query";
import { registerUser } from "@/api/authApi";
import { toast } from "react-toastify";

export const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success(
        "We sent a verification link to your email, Please open your inbox and verify your account",
      );
    },
  });
};
