import api from "./axiosInstance";

export const publicService = {
  submitContactForm: async (data) => {
    try {
      const response = await api.post("/contact", data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Can add other public services in future here later, like getCourses, getBlogs etc.
};
