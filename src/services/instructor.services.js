import { api } from "./axiosInstance";

export const instructorService = {
  // Courses
  getMyCourses: async (params = {}) => {
    const response = await api.get("/courses", {
      params: { ...params, instructorId: "me" },
    });
    return response.data;
  },

  createCourse: async (data) => {
    const response = await api.post("/courses", data);
    return response.data;
  },

  updateCourse: async (id, data) => {
    const response = await api.put(`/courses/${id}`, data);
    return response.data;
  },

  deleteCourse: async (id) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  },

  // Sections
  createSection: async (courseId, data) => {
    const response = await api.post(`/courses/${courseId}/sections`, data);
    return response.data;
  },

  updateSection: async (sectionId, data) => {
    const response = await api.put(`/courses/sections/${sectionId}`, data);
    return response.data;
  },

  deleteSection: async (sectionId) => {
    const response = await api.delete(`/courses/sections/${sectionId}`);
    return response.data;
  },

  reorderSections: async (courseId, orderedIds) => {
    const response = await api.put(`/courses/${courseId}/sections/reorder`, {
      orderedIds,
    });
    return response.data;
  },

  // Lectures (supports video upload via FormData)
  createLecture: async (sectionId, data) => {
    const isFormData = data instanceof FormData;
    const response = await api.post(
      `/courses/sections/${sectionId}/lectures`,
      data,
      isFormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : undefined,
    );
    return response.data;
  },

  updateLecture: async (lectureId, data) => {
    const response = await api.put(`/courses/lectures/${lectureId}`, data);
    return response.data;
  },

  deleteLecture: async (lectureId) => {
    const response = await api.delete(`/courses/lectures/${lectureId}`);
    return response.data;
  },

  getLecture: async (lectureId) => {
    const response = await api.get(`/courses/lectures/${lectureId}`);
    return response.data;
  },
};
