import { useQuery } from "@tanstack/react-query";
import { studentService } from "@/services/student.services";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { LuBookOpen, LuTrophy, LuClock } from "react-icons/lu";

export default function StudentDashboard() {
  const { user } = useSelector((state) => state.auth);

  const { data } = useQuery({
    queryKey: ["student-enrollments"],
    queryFn: () => studentService.getMyEnrollments(),
  });
  const enrollments = data?.data || [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">Welcome, {user?.name?.split(" ")[0]}</h1>
        <p className="text-gray-500 mt-1">Continue your learning journey</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mb-4">
            <LuBookOpen className="text-white" size={20} />
          </div>
          <p className="text-2xl font-black text-gray-900">{enrollments.length}</p>
          <p className="text-xs text-gray-500 font-medium mt-1">Enrolled Courses</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center mb-4">
            <LuTrophy className="text-white" size={20} />
          </div>
          <p className="text-2xl font-black text-gray-900">0</p>
          <p className="text-xs text-gray-500 font-medium mt-1">Completed</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center mb-4">
            <LuClock className="text-white" size={20} />
          </div>
          <p className="text-2xl font-black text-gray-900">0h</p>
          <p className="text-xs text-gray-500 font-medium mt-1">Learning Time</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">My Courses</h3>
        {enrollments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm mb-4">You have not enrolled in any courses yet.</p>
            <Link to="/courses" className="text-cyan-600 font-bold text-sm hover:underline">Browse Courses &rarr;</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {enrollments.slice(0, 5).map((e) => (
              <div key={e.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-800">{e.Course?.title}</p>
                  <p className="text-xs text-gray-400">Progress: {e.completionPercentage || 0}%</p>
                </div>
                <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${e.completionPercentage || 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
