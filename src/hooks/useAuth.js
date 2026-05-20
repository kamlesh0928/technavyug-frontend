import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import {
  logoutUser as logoutAction,
  setUser as setUserAction,
} from "@/store/Slices/authSlice";

import { logoutUser as logoutApi } from "@/api/authApi";

import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const { user, isAuthenticated, loading } =
    useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const logout = useCallback(() => {
    logoutApi().catch(() => {});

    dispatch(logoutAction());

    navigate("/login");
  }, [dispatch, navigate]);

  // SET USER
  const setUser = useCallback(
    (userData) => {
      dispatch(setUserAction(userData));
    },
    [dispatch]
  );

  return {
    user,
    setUser,
    isAuthenticated,
    loading,
    logout,

    isAdmin:
      user?.role === "Super Admin" ||
      user?.role === "Admin" ||
      user?.role === "Sub Admin",

    isInstructor: user?.role === "Instructor",

    isStudent: user?.role === "Student",
  };
};