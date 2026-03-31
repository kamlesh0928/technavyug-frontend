import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/admin.services";
import { instructorService } from "@/services/instructor.services";
import {
  LuSearch,
  LuEye,
  LuTrash,
  LuBookOpen,
  LuCircleCheck,
  LuFileText,
} from "react-icons/lu";
import { useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function AdminCourses() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-courses", { search, page }],
    queryFn: () =>
      adminService.getAllCourses({
        search: search || undefined,
        page,
        limit: 10,
      }),
  });

  const courses = data?.data || [];
  const pagination = data?.pagination || { totalPages: 1 };

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => instructorService.deleteCourse(id),
    onSuccess: () => {
      toast.success("Course deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
    },
    onError: (e) => toast.error(e?.userMessage || "Failed to delete course"),
  });

  const handleDelete = (course) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${course.title}"? This action cannot be undone.`,
      )
    ) {
      deleteMutation.mutate(course.id);
    }
  };

  const stats = [
    {
      label: "Total Courses",
      value: pagination.totalItems || courses.length,
      icon: LuBookOpen,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Active Courses",
      value: courses.filter((c) => c.status === "Published").length,
      icon: LuCircleCheck,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Drafts",
      value: courses.filter((c) => c.status === "Draft").length,
      icon: LuFileText,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Course Management</h1>
        <p className="text-gray-500 mt-1">
          Review and manage all courses on the platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4"
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
                    Loading courses...
                  </td>
                </tr>
              ) : courses.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-400"
                  >
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
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/courses/${c.slug}`}
                          className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all"
                          title="View Course"
                        >
                          <LuEye size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(c)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete Course"
                        >
                          <LuTrash size={18} />
                        </button>
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
    </div>
  );
}
