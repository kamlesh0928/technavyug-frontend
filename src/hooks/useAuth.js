import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import { logoutUser as logoutAction } from "@/store/Slices/authSlice";
import { logoutUser as logoutApi } from "@/api/authApi";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const { user, isAuthenticated, loading } = useSelector(
    (state) => state.auth,
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = useCallback(() => {
    // Fire and forget logout API call
    logoutApi().catch(() => {});
    
    // Clear state and navigate immediately
    dispatch(logoutAction());
    navigate("/login");
  }, [dispatch, navigate]);

  return {
    user,
    isAuthenticated,
    loading,
    logout,
    isAdmin: user?.role === "Admin" || user?.role === "Sub Admin",
    isInstructor: user?.role === "Instructor",
    isStudent: user?.role === "Student",
  };
};
