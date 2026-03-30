import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { studentService } from "@/services/student.services";
import { instructorService } from "@/services/instructor.services";
import { Link, useNavigate } from "react-router-dom";
import {
  LuPlus,
  LuPencil,
  LuTrash,
  LuEye,
  LuToggleLeft,
  LuToggleRight,
} from "react-icons/lu";
import { toast } from "react-toastify";
import { useState } from "react";

export default function InstructorMyCourses() {
  const { user } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["instructor-courses", user?.id],
    queryFn: () => studentService.getCourses({ instructorId: user?.id }),
    enabled: !!user?.id,
  });

  const courses = data?.data || [];

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => instructorService.deleteCourse(id),
    onSuccess: () => {
      toast.success("Course deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["instructor-courses", user?.id],
      });
      setDeletingId(null);
    },
    onError: (e) => {
      toast.error(e?.userMessage || "Failed to delete course");
      setDeletingId(null);
    },
  });

  // Publish/Unpublish toggle mutation
  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }) =>
      instructorService.updateCourse(id, { status }),
    onSuccess: (_, variables) => {
      toast.success(
        variables.status === "Published"
          ? "Course published!"
          : "Course set to draft",
      );
      queryClient.invalidateQueries({
        queryKey: ["instructor-courses", user?.id],
      });
    },
    onError: (e) => toast.error(e?.userMessage || "Failed to update status"),
  });

  const handleDelete = (course) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${course.title}"? This action cannot be undone.`,
      )
    ) {
      setDeletingId(course.id);
      deleteMutation.mutate(course.id);
    }
  };

  const handleToggleStatus = (course) => {
    const newStatus = course.status === "Published" ? "Draft" : "Published";
    toggleStatusMutation.mutate({ id: course.id, status: newStatus });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">My Courses</h1>
          <p className="text-gray-500 mt-1">Manage your course catalog</p>
        </div>
        <Link
          to="/instructor/courses/new"
          className="flex items-center gap-2 bg-[#0f2c59] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#1d4e89] transition-all"
        >
          <LuPlus size={16} /> New Course
        </Link>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-100 rounded-2xl h-56 animate-pulse"
            />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg mb-4">
            You have not created any courses yet.
          </p>
          <Link
            to="/instructor/courses/new"
            className="inline-flex items-center gap-2 bg-[#0f2c59] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#1d4e89] transition-all"
          >
            <LuPlus size={16} /> Create Your First Course
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-36 bg-gray-100">
                <img
                  src={
                    c.thumbnail ||
                    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800"
                  }
                  alt={c.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${c.status === "Published" ? "text-green-600 bg-green-50" : "text-yellow-600 bg-yellow-50"}`}
                  >
                    {c.status}
                  </span>
                  <span className="text-sm font-bold text-[#0f2c59]">
                    {parseFloat(c.price) === 0 ? "Free" : `₹${c.price}`}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mb-3 line-clamp-2">
                  {c.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{c.totalLectures} lectures</span>
                  <span>{c.totalEnrollments} students</span>
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
                  {/* View */}
                  <Link
                    to={`/courses/${c.slug}`}
                    className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg text-xs font-bold text-blue-600 hover:bg-blue-50 transition-colors"
                    title="View course"
                  >
                    <LuEye size={14} /> View
                  </Link>
                  {/* Edit */}
                  <button
                    onClick={() => navigate(`/instructor/courses/edit/${c.id}`)}
                    className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                    title="Edit course"
                  >
                    <LuPencil size={14} /> Edit
                  </button>
                  {/* Publish/Unpublish toggle */}
                  <button
                    onClick={() => handleToggleStatus(c)}
                    disabled={toggleStatusMutation.isPending}
                    className={`flex items-center justify-center gap-1 py-2 px-3 rounded-lg text-xs font-bold transition-colors ${
                      c.status === "Published"
                        ? "text-yellow-600 hover:bg-yellow-50"
                        : "text-green-600 hover:bg-green-50"
                    }`}
                    title={c.status === "Published" ? "Unpublish" : "Publish"}
                  >
                    {c.status === "Published" ? (
                      <>
                        <LuToggleRight size={14} /> Unpublish
                      </>
                    ) : (
                      <>
                        <LuToggleLeft size={14} /> Publish
                      </>
                    )}
                  </button>
                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(c)}
                    disabled={deletingId === c.id}
                    className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg text-xs font-bold text-red-500 hover:bg-red-50 transition-colors ml-auto disabled:opacity-50"
                    title="Delete course"
                  >
                    <LuTrash size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
