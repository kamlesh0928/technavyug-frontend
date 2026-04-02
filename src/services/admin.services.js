import { api } from "./axiosInstance";

export const adminService = {
  // Users
  getUsers: async (params = {}) => {
    const response = await api.get("/admin/users", { params });
    return response.data;
  },

  updateUserStatus: async (userId, data) => {
    const response = await api.put(`/admin/users/${userId}/status`, data);
    return response.data;
  },

  updateUserRole: async (userId, data) => {
    const response = await api.put(`/admin/users/${userId}/role`, data);
    return response.data;
  },

  // Analytics
  getAnalytics: async () => {
    const response = await api.get("/admin/analytics/dashboard");
    return response.data;
  },

  // Courses (admin can list all)
  getAllCourses: async (params = {}) => {
    const response = await api.get("/courses", { params });
    return response.data;
  },

  // Orders
  getAllOrders: async (params = {}) => {
    const response = await api.get("/orders", { params });
    return response.data;
  },

  // Products
  getProducts: async (params = {}) => {
    const response = await api.get("/products", { params });
    return response.data;
  },

  createProduct: async (data) => {
    const response = await api.post("/products", data);
    return response.data;
  },

  updateProduct: async (id, data) => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // CMS
  getHomepageContent: async () => {
    const response = await api.get("/cms/homepage");
    return response.data;
  },

  updateHomepageContent: async (data) => {
    const response = await api.put("/cms/homepage", data);
    return response.data;
  },

  getBlogs: async (params = {}) => {
    const response = await api.get("/cms/blogs", { params });
    return response.data;
  },

  createBlog: async (data) => {
    const response = await api.post("/cms/blogs", data);
    return response.data;
  },

  getFaqs: async () => {
    const response = await api.get("/cms/faqs");
    return response.data;
  },

  // Categories
  getCategories: async () => {
    const response = await api.get("/categories");
    return response.data;
  },

  createCategory: async (data) => {
    const response = await api.post("/categories", data);
    return response.data;
  },
};
