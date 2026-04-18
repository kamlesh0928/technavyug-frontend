import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/api/authApi";
import { useDispatch } from "react-redux";
import { setUser, setToken } from "@/store/Slices/authSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const getRoleDashboard = (role) => {
  switch (role) {
    case "Admin":
    case "Sub Admin":
      return "/admin";
    case "Instructor":
      return "/instructor";
    case "Student":
    default:
      return "/student";
  }
};

export const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      dispatch(setUser(data.user));
      dispatch(setToken(data.accessToken));
      toast.success("Login successful!");

      // If user was redirected from a page (e.g. /products), go back there
      const from = location.state?.from;
      navigate(from || getRoleDashboard(data.user.role), { replace: true });
    },
    onError: (error) => {
      // If it's a verification error, we handle it in the Login component UI
      if (
        error?.status === 401 &&
        error?.userMessage?.toLowerCase().includes("verify")
      ) {
        return;
      }
      toast.error(error?.userMessage || "Login failed. Please try again.");
    },
  });
};