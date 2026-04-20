import { api } from "./axiosInstance";

export const authService = {
  login: async (data) => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  register: async (data) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },

  refreshToken: async () => {
    const response = await api.post("/auth/refresh-token");
    return response.data;
  },

  getMe: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put("/auth/profile", data);
    return response.data;
  },

  changePassword: async (data) => {
    const response = await api.put("/auth/change-password", data);
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  resetPassword: async (token, password) => {
    const response = await api.post("/auth/reset-password", {
      token,
      password,
    });
    return response.data;
  },

  deleteAccount: async (password) => {
    const response = await api.delete("/auth/account", {
      data: { password }
    });
    return response.data;
  },

  resendVerification: async (email) => {
    const response = await api.post("/auth/resend-verification", { email });
    return response.data;
  },
};
