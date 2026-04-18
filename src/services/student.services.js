import { api } from "./axiosInstance";

export const studentService = {
  // Enrollments
  getMyEnrollments: async (params = {}) => {
    const response = await api.get("/enrollments/my", { params });
    return response.data;
  },

  enrollInCourse: async (courseId) => {
    const response = await api.post(`/enrollments/courses/${courseId}`);
    return response.data;
  },

  // Lecture Progress
  getLectureProgress: async (lectureId) => {
    const response = await api.get(`/enrollments/progress/${lectureId}`);
    return response.data;
  },

  updateProgress: async (lectureId, data) => {
    const response = await api.put(`/enrollments/progress/${lectureId}`, data);
    return response.data;
  },

  getCourseProgress: async (courseId) => {
    const response = await api.get(`/enrollments/progress/${courseId}`);
    return response.data;
  },

  markLectureComplete: async (lectureId) => {
    const response = await api.post(`/enrollments/progress/${lectureId}/complete`);
    return response.data;
  },

  // Orders
  getMyOrders: async (params = {}) => {
    const response = await api.get("/orders/my", { params });
    return response.data;
  },

  // Courses (public browsing)
  getCourses: async (params = {}) => {
    const response = await api.get("/courses", { params });
    return response.data;
  },

  getCourseBySlug: async (slug) => {
    const response = await api.get(`/courses/${slug}`);
    return response.data;
  },

  // Products
  getProducts: async (params = {}) => {
    const response = await api.get("/products", { params });
    return response.data;
  },

  // Reviews
  submitReview: async (data) => {
    const response = await api.post("/reviews", data);
    return response.data;
  },

  getCourseReviews: async (courseId, params = {}) => {
    const response = await api.get(`/reviews/course/${courseId}`, { params });
    return response.data;
  },

  // Student Dashboard
  getStudentDashboard: async () => {
    const response = await api.get("/student/dashboard");
    return response.data;
  },

  // Monthly Goals
  setMonthlyGoal: async (data) => {
    const response = await api.post("/student/goals/monthly", data);
    return response.data;
  },

  getMonthlyGoal: async () => {
    const response = await api.get("/student/goals/monthly");
    return response.data;
  },
};
