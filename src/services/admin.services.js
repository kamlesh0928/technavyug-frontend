import { api } from "./axiosInstance";

export const adminService = {
  // Users
  getUsers: async (params = {}) => {
    const response = await api.get("/admin/users", { params });
    return response.data;
  },

  updateUserStatus: async (userId, status) => {
    const response = await api.patch(
      `/admin/users/${userId}/${status === "Blocked" ? "block" : "unblock"}`,
    );
    return response.data;
  },

  updateUserRole: async (userId, data) => {
    const response = await api.put(`/admin/users/${userId}`, data);
    return response.data;
  },

  // Analytics
  getAnalytics: async () => {
    const response = await api.get("/admin/analytics/dashboard");
    return response.data;
  },

  getRevenueChart: async (period = "monthly") => {
    const response = await api.get("/admin/analytics/revenue", {
      params: { period },
    });
    return response.data;
  },

  getEnrollmentChart: async () => {
    const response = await api.get("/admin/analytics/enrollments");
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

  uploadProductImage: async (formData) => {
    const response = await api.post("/products/upload-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
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
