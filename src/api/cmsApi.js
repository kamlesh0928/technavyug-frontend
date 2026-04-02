import api from "@/services/axiosInstance";

export const cmsApi = {
  // Blogs
  getBlogs: async (params) => {
    const response = await api.get("/cms/blogs", { params });
    return response.data;
  },

  getBlog: async (identifier) => {
    const response = await api.get(`/cms/blogs/${identifier}`);
    return response.data;
  },

  createBlog: async (blogData) => {
    const response = await api.post("/cms/blogs", blogData);
    return response.data;
  },

  updateBlog: async (id, blogData) => {
    const response = await api.put(`/cms/blogs/${id}`, blogData);
    return response.data;
  },

  deleteBlog: async (id) => {
    const response = await api.delete(`/cms/blogs/${id}`);
    return response.data;
  },

  uploadBlogImage: async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await api.post("/cms/blogs/upload-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // FAQs
  getFaqs: async (params) => {
    const response = await api.get("/cms/faqs", { params });
    return response.data;
  },

  createFaq: async (faqData) => {
    const response = await api.post("/cms/faqs", faqData);
    return response.data;
  },

  updateFaq: async (id, faqData) => {
    const response = await api.put(`/cms/faqs/${id}`, faqData);
    return response.data;
  },

  deleteFaq: async (id) => {
    const response = await api.delete(`/cms/faqs/${id}`);
    return response.data;
  },

  // Homepage Content
  getHomepageContent: async (params) => {
    const response = await api.get("/cms/homepage", { params });
    return response.data;
  },

  createHomepageContent: async (contentData) => {
    const response = await api.post("/cms/homepage", contentData);
    return response.data;
  },

  updateHomepageContent: async (id, contentData) => {
    const response = await api.put(`/cms/homepage/${id}`, contentData);
    return response.data;
  },

  deleteHomepageContent: async (id) => {
    const response = await api.delete(`/cms/homepage/${id}`);
    return response.data;
  },
};

export default cmsApi;
