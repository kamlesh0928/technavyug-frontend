import { api } from "@/services/axiosInstance";

export const loginUser = async(data) => {
    const response = await api.post("/auth/login", data);
    return response?.data;
}

export const registerUser = async(data) => {
    const response = await api.post("/auth/register", data);
    return response?.data;
}

export const forgotPasswordRequest = async(data) => {
    await api.post("/auth/forgot-password", data);
}

export const resetPasswordRequest = async({token, password}) => {
    await api.post(`/auth/reset-password?token=${token}`, { password });
}
