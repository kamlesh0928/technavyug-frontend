import { useMutation } from "@tanstack/react-query";
import { resetPasswordRequest } from "@/api/authApi";

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPasswordRequest,
  });
};