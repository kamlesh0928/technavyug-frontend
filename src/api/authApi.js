import { api } from "@/services/axiosInstance";

export const loginUser = async (data) => {
  const response = await api.post("/auth/login", data);
  return response?.data;
};

export const registerUser = async (data) => {
  const response = await api.post("/auth/register", data);
  return response?.data;
};

export const logoutUser = async () => {
  const response = await api.post("/auth/logout");
  return response?.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response?.data;
};

export const resetPassword = async (token, password) => {
  const response = await api.post("/auth/reset-password", { token, password });
  return response?.data;
};

export const getMe = async () => {
  const response = await api.get("/auth/me");
  return response?.data;
};

export const resendVerification = async (email) => {
  const response = await api.post("/auth/resend-verification", { email });
  return response?.data;
};