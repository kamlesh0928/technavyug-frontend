import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BACKEND_URL,
  withCredentials: true,
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = "Something went wrong!!!";

    if (error.response?.data?.message) {
      message = error.response?.data?.message;
    } else if (error.message) {
      message = error.message;
    }

    return Promise.reject({
      status: error.response?.status,
      data: error.response?.data,
      userMessage: message,
    });
  }
);