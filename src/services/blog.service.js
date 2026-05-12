import api from "./api";

const blogService = {
  // Public
  getBlogs: (params) => api.get("/blogs", { params }),
  getBlogBySlug: (slug) => api.get(`/blogs/${slug}`),

  // Admin / Instructor
  createBlog: (data) =>
    api.post("/blogs", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateBlog: (id, data) =>
    api.put(`/blogs/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteBlog: (id) => api.delete(`/blogs/${id}`),

  // For rich text editor image uploads
  uploadBlogImage: (file) => {
    const formData = new FormData();
    formData.append("image", file);
    return api.post("/blogs/upload-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export default blogService;
