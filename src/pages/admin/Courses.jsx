import { useQuery, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/admin.services";
import {
  LuSearch,
  LuEye,
  LuTrash,
  LuBookOpen,
  LuCircleCheck,
  LuUsers,
  LuFilter,
  LuPlus,
  LuPencil,
  LuX,
  LuToggleLeft,
  LuToggleRight,
  LuLayers,
} from "react-icons/lu";
import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function AdminCourses() {
  const { user: currentUser } = useAuth();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const queryClient = useQueryClient();

  const isSuperAdmin = currentUser?.role === "Super Admin";

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Form states
  const [createFormData, setCreateFormData] = useState({
    title: "",
    shortDescription: "",
    description: "",
    level: "Beginner",
    price: 0,
    language: "English",
    categoryId: "",
    thumbnail: "",
  });

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const fileInputRef = useRef(null);

  const [editFormData, setEditFormData] = useState({
    title: "",
    shortDescription: "",
    description: "",
    level: "Beginner",
    price: 0,
    language: "English",
    categoryId: "",
    status: "Draft",
    thumbnail: "",
  });

  // Queries
  const { data, isLoading } = useQuery({
    queryKey: ["admin-courses", { search, page, status: statusFilter }],
    queryFn: () =>
      adminService.getAllCourses({
        search: search || undefined,
        status: statusFilter || undefined,
        page,
        limit: 10,
      }),
  });

  // Fetch dashboard analytics for stats
  const { data: analytics } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: adminService.getAnalytics,
  });

  const courses = data?.data || [];
  const pagination = data?.pagination || { totalPages: 1 };
  const courseStats = analytics?.data?.courses;

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      let uploadedThumbnail = createFormData.thumbnail;
      if (thumbnailFile) {
        const formData = new FormData();
        formData.append("image", thumbnailFile);
        const res = await adminService.uploadProductImage(formData); // Using same upload endpoint
        if (res?.data?.url) {
          uploadedThumbnail = res.data.url;
        }
      }

      await adminService.createCourse({
        ...createFormData,
        thumbnail: uploadedThumbnail,
        price: parseFloat(createFormData.price) || 0,
        categoryId: createFormData.categoryId || null,
      });
      toast.success("Course created successfully!");
      setIsCreateModalOpen(false);
      setThumbnailFile(null);
      setThumbnailPreview(null);
      setCreateFormData({
        title: "",
        shortDescription: "",
        description: "",
        level: "Beginner",
        price: 0,
        language: "English",
        categoryId: "",
        thumbnail: "",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create course");
    }
  };

  const handleEditClick = (course) => {
    setSelectedCourse(course);
    setEditFormData({
      title: course.title || "",
      shortDescription: course.shortDescription || "",
      description: course.description || "",
      level: course.level || "Beginner",
      price: parseFloat(course.price) || 0,
      language: course.language || "English",
      categoryId: course.categoryId || "",
      status: course.status || "Draft",
      thumbnail: course.thumbnail || "",
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      let uploadedThumbnail = editFormData.thumbnail;
      if (thumbnailFile) {
        const formData = new FormData();
        formData.append("image", thumbnailFile);
        const res = await adminService.uploadProductImage(formData);
        if (res?.data?.url) {
          uploadedThumbnail = res.data.url;
        }
      }

      await adminService.updateCourse(selectedCourse.id, {
        ...editFormData,
        thumbnail: uploadedThumbnail,
        price: parseFloat(editFormData.price) || 0,
        categoryId: editFormData.categoryId || null,
      });
      toast.success("Course updated successfully!");
      setIsEditModalOpen(false);
      setSelectedCourse(null);
      setThumbnailFile(null);
      setThumbnailPreview(null);
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update course");
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleDeleteClick = async (course) => {
    if (
      window.confirm(
        `Are you absolutely sure you want to permanently delete course "${course.title}"? This action cannot be undone.`,
      )
    ) {
      try {
        await adminService.deleteCourse(course.id);
        toast.success("Course deleted successfully!");
        queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
        queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to delete course",
        );
      }
    }
  };

  const handleToggleStatus = async (course) => {
    const newStatus = course.status === "Published" ? "Draft" : "Published";
    try {
      await adminService.updateCourse(course.id, { status: newStatus });
      toast.success(
        newStatus === "Published" ? "Course published!" : "Course set to draft",
      );
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update status");
    }
  };

  const stats = [
    {
      label: "Total Courses",
      value: courseStats?.total ?? pagination.totalItems ?? courses.length,
      icon: LuBookOpen,
      color: "text-blue-600",
      bg: "bg-blue-50",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      label: "Published",
      value: courseStats?.published ?? 0,
      icon: LuCircleCheck,
      color: "text-green-600",
      bg: "bg-green-50",
      gradient: "from-green-500 to-green-600",
    },
    {
      label: "Total Enrollments",
      value: courseStats?.totalEnrollments ?? 0,
      icon: LuUsers,
      color: "text-cyan-600",
      bg: "bg-cyan-50",
      gradient: "from-cyan-500 to-cyan-600",
    },
  ];

  return (
    <div className="space-y-8 min-h-screen pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">
            Course Management
          </h1>
          <p className="text-gray-500 mt-1">
            Review and manage all courses on the platform
          </p>
        </div>
        {isSuperAdmin && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-[#0f2c59] hover:from-cyan-600 hover:to-[#091b3a] text-white font-semibold rounded-xl shadow-md shadow-cyan-500/10 hover:shadow-lg transition-all duration-200"
          >
            <LuPlus size={20} />
            <span>Add Course</span>
          </button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div
              className={`w-12 h-12 ${s.bg} ${s.color} rounded-xl flex items-center justify-center`}
            >
              <s.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                {s.label}
              </p>
              <p className="text-2xl font-black text-gray-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative w-full md:w-96">
          <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses by title or instructor..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-cyan-400 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <LuFilter size={14} className="text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-cyan-400 outline-none bg-white text-gray-700"
          >
            <option value="">All Status</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Course Info
                </th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Instructor
                </th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Status
                </th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Performance
                </th>
                <th className="text-right text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                      Loading courses...
                    </div>
                  </td>
                </tr>
              ) : courses.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    <LuBookOpen
                      size={32}
                      className="mx-auto mb-2 text-gray-200"
                    />
                    No courses found matching your criteria
                  </td>
                </tr>
              ) : (
                courses.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                          <img
                            src={
                              c.thumbnail ||
                              "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=200"
                            }
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 line-clamp-1">
                            {c.title}
                          </p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                            {parseFloat(c.price) === 0 ? "Free" : `₹${c.price}`}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-cyan-100 flex items-center justify-center text-[10px] font-bold text-cyan-600">
                          {c.instructor?.name?.charAt(0)}
                        </div>
                        <span className="text-sm text-gray-600">
                          {c.instructor?.name || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                          c.status === "Published"
                            ? "text-green-600 bg-green-50"
                            : c.status === "Draft"
                              ? "text-yellow-600 bg-yellow-50"
                              : "text-gray-500 bg-gray-100"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[10px] font-bold text-gray-500 uppercase">
                        <div>
                          Enrolled:{" "}
                          <span className="text-gray-900">
                            {c.totalEnrollments}
                          </span>
                        </div>
                        <div>
                          Lectures:{" "}
                          <span className="text-gray-900">
                            {c.totalLectures}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/courses/${c.slug}`}
                          className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all"
                          title="View Course"
                        >
                          <LuEye size={18} />
                        </Link>
                        {isSuperAdmin ? (
                          <>
                            <button
                              onClick={() => handleEditClick(c)}
                              className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all"
                              title="Edit Course"
                            >
                              <LuPencil size={18} />
                            </button>
                            <Link
                              to={`/instructor/courses/edit/${c.id}`}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="Edit Curriculum"
                            >
                              <LuLayers size={18} />
                            </Link>
                            <button
                              onClick={() => handleToggleStatus(c)}
                              className={`p-2 rounded-lg transition-all ${
                                c.status === "Published"
                                  ? "text-yellow-600 hover:bg-yellow-50"
                                  : "text-green-600 hover:bg-green-50"
                              }`}
                              title={
                                c.status === "Published"
                                  ? "Unpublish"
                                  : "Publish"
                              }
                            >
                              {c.status === "Published" ? (
                                <LuToggleRight size={18} />
                              ) : (
                                <LuToggleLeft size={18} />
                              )}
                            </button>
                            <button
                              onClick={() => handleDeleteClick(c)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="Delete Course"
                            >
                              <LuTrash size={18} />
                            </button>
                          </>
                        ) : (
                          <span className="text-[10px] text-gray-400 italic ml-2">
                            Read Only
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-500 font-medium">
              Page {page} of {pagination.totalPages}
            </p>
            <div className="flex gap-2">
              {[...Array(pagination.totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    page === i + 1
                      ? "bg-gray-900 text-white"
                      : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CREATE COURSE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 transform transition-all duration-300 scale-100 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">
                Add New Course
              </h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LuX size={20} />
              </button>
            </div>

            <form
              onSubmit={handleCreateSubmit}
              className="flex-1 overflow-y-auto p-6 space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                  Course Title *
                </label>
                <input
                  type="text"
                  required
                  value={createFormData.title}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      title: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-400 outline-none"
                  placeholder="Mastering React & Redux"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Difficulty Level *
                  </label>
                  <select
                    value={createFormData.level}
                    onChange={(e) =>
                      setCreateFormData({
                        ...createFormData,
                        level: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-400 outline-none bg-white font-medium"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={createFormData.price}
                    onChange={(e) =>
                      setCreateFormData({
                        ...createFormData,
                        price: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-400 outline-none"
                    placeholder="0 for Free"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Language *
                  </label>
                  <input
                    type="text"
                    required
                    value={createFormData.language}
                    onChange={(e) =>
                      setCreateFormData({
                        ...createFormData,
                        language: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-400 outline-none"
                    placeholder="English"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                  Thumbnail Image
                </label>
                <div className="flex items-center gap-4">
                  {thumbnailPreview ? (
                    <img
                      src={thumbnailPreview}
                      alt="Preview"
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                  <div className="flex flex-col">
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleThumbnailChange}
                      className="text-sm"
                    />
                    <span className="text-[10px] font-bold text-cyan-500 mt-1 uppercase tracking-wider">
                      Recommended size: 1080x1080px
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                  Short Description *
                </label>
                <input
                  type="text"
                  required
                  value={createFormData.shortDescription}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      shortDescription: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-400 outline-none"
                  placeholder="A brief overview of the course..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                  Full Description
                </label>
                <textarea
                  value={createFormData.description}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-400 outline-none resize-none"
                  placeholder="Detailed course description..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-[#0f2c59] text-white font-semibold rounded-lg shadow-md hover:from-cyan-600 hover:to-[#091b3a] transition-all text-sm"
                >
                  Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT COURSE MODAL */}
      {isEditModalOpen && selectedCourse && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 transform transition-all duration-300 scale-100 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Edit Course Details
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Modify parameters for course listings
                </p>
              </div>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedCourse(null);
                }}
                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LuX size={20} />
              </button>
            </div>

            <form
              onSubmit={handleEditSubmit}
              className="flex-1 overflow-y-auto p-6 space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                  Course Title *
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.title}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-400 outline-none"
                  placeholder="Mastering React & Redux"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Difficulty Level *
                  </label>
                  <select
                    value={editFormData.level}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        level: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-400 outline-none bg-white font-medium"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={editFormData.price}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        price: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-400 outline-none"
                    placeholder="0 for Free"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Language *
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.language}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        language: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-400 outline-none"
                    placeholder="English"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Thumbnail Image
                  </label>
                  <div className="flex items-center gap-4 mt-2">
                    {thumbnailPreview || editFormData.thumbnail ? (
                      <img
                        src={thumbnailPreview || editFormData.thumbnail}
                        alt="Preview"
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    )}
                    <div className="flex flex-col">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="text-sm w-full"
                      />
                      <span className="text-[10px] font-bold text-cyan-500 mt-1 uppercase tracking-wider">
                        Recommended size: 1080x1080px
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Status *
                  </label>
                  <select
                    value={editFormData.status}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        status: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-400 outline-none bg-white font-medium"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                  Short Description *
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.shortDescription}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      shortDescription: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-400 outline-none"
                  placeholder="A brief overview of the course..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                  Full Description
                </label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-400 outline-none resize-none"
                  placeholder="Detailed course description..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedCourse(null);
                  }}
                  className="px-4 py-2 border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-[#0f2c59] text-white font-semibold rounded-lg shadow-md hover:from-cyan-600 hover:to-[#091b3a] transition-all text-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
