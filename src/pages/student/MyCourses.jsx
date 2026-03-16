import { useQuery } from "@tanstack/react-query";
import { studentService } from "@/services/student.services";
import { Link } from "react-router-dom";

export default function StudentMyCourses() {
  const { data, isLoading } = useQuery({
    queryKey: ["student-enrollments"],
    queryFn: () => studentService.getMyEnrollments(),
  });
  const enrollments = data?.data || [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">My Courses</h1>
        <p className="text-gray-500 mt-1">Courses you are enrolled in</p>
      </div>
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <div key={i} className="bg-gray-100 rounded-2xl h-56 animate-pulse" />)}
        </div>
      ) : enrollments.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg mb-4">No enrolled courses.</p>
          <Link to="/courses" className="text-cyan-600 font-bold hover:underline">Browse Courses &rarr;</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((e) => (
            <div key={e.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-gray-900 mb-3">{e.Course?.title}</h3>
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{e.completionPercentage || 0}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full transition-all" style={{ width: `${e.completionPercentage || 0}%` }} />
                </div>
              </div>
              <Link to="/student/learning" className="text-sm font-bold text-cyan-600 hover:text-cyan-700">
                Continue Learning &rarr;
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
