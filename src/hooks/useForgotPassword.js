import { useMutation } from "@tanstack/react-query";
import { forgotPasswordRequest } from "@/api/authApi";

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPasswordRequest,
  });
};