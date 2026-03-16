import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { studentService } from "@/services/student.services";
import { LuBookOpen, LuUsers, LuDollarSign, LuTrendingUp } from "react-icons/lu";

export default function InstructorDashboard() {
  const { user } = useSelector((state) => state.auth);

  const { data } = useQuery({
    queryKey: ["instructor-courses", user?.id],
    queryFn: () => studentService.getCourses({ instructorId: user?.id }),
    enabled: !!user?.id,
  });

  const courses = data?.data || [];
  const totalStudents = courses.reduce((acc, c) => acc + (c.totalEnrollments || 0), 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">Welcome back, {user?.name?.split(" ")[0]}</h1>
        <p className="text-gray-500 mt-1">Here is your teaching overview</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <LuBookOpen className="text-white" size={20} />
            </div>
            <LuTrendingUp className="text-green-500" size={16} />
          </div>
          <p className="text-2xl font-black text-gray-900">{courses.length}</p>
          <p className="text-xs text-gray-500 font-medium mt-1">Total Courses</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <LuUsers className="text-white" size={20} />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-900">{totalStudents}</p>
          <p className="text-xs text-gray-500 font-medium mt-1">Total Students</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
              <LuDollarSign className="text-white" size={20} />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-900">₹0</p>
          <p className="text-xs text-gray-500 font-medium mt-1">Total Revenue</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Courses</h3>
        {courses.length === 0 ? (
          <p className="text-gray-400 text-sm py-8 text-center">No courses yet. Create your first course!</p>
        ) : (
          <div className="space-y-3">
            {courses.slice(0, 5).map((c) => (
              <div key={c.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-800">{c.title}</p>
                  <p className="text-xs text-gray-400">{c.totalLectures} lectures, {c.totalEnrollments} students</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded ${c.status === "Published" ? "text-green-600 bg-green-50" : "text-yellow-600 bg-yellow-50"}`}>{c.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
