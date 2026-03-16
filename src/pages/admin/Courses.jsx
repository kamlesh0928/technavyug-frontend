import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin.services";
import { LuSearch } from "react-icons/lu";
import { useState } from "react";

export default function AdminCourses() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["admin-courses", search],
    queryFn: () => adminService.getAllCourses({ search: search || undefined }),
  });
  const courses = data?.data || [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">Courses</h1>
        <p className="text-gray-500 mt-1">Manage all platform courses</p>
      </div>
      <div className="mb-6 relative max-w-md">
        <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search courses..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-cyan-400 outline-none" />
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left text-xs font-bold text-gray-500 uppercase px-6 py-4">Title</th>
              <th className="text-left text-xs font-bold text-gray-500 uppercase px-6 py-4">Instructor</th>
              <th className="text-left text-xs font-bold text-gray-500 uppercase px-6 py-4">Status</th>
              <th className="text-left text-xs font-bold text-gray-500 uppercase px-6 py-4">Price</th>
              <th className="text-left text-xs font-bold text-gray-500 uppercase px-6 py-4">Enrolled</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">Loading...</td></tr>
            ) : courses.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">No courses found</td></tr>
            ) : courses.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 text-sm font-medium text-gray-800">{c.title}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{c.instructor?.name || "N/A"}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${c.status === "Published" ? "text-green-600 bg-green-50" : c.status === "Draft" ? "text-yellow-600 bg-yellow-50" : "text-gray-600 bg-gray-100"}`}>{c.status}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{parseFloat(c.price) === 0 ? "Free" : `₹${c.price}`}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{c.totalEnrollments}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
