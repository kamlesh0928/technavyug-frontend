import { useQuery } from "@tanstack/react-query";
import { studentService } from "@/services/student.services";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  LuBookOpen,
  LuTrophy,
  LuClock,
  LuPlay,
  LuArrowRight,
  LuSparkles,
} from "react-icons/lu";

export default function StudentDashboard() {
  const { user } = useSelector((state) => state.auth);

  const { data, isLoading } = useQuery({
    queryKey: ["student-enrollments"],
    queryFn: () => studentService.getMyEnrollments(),
  });
  const enrollments = data?.data || [];

  const stats = [
    {
      label: "Enrolled",
      value: enrollments.length,
      icon: LuBookOpen,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Completed",
      value: 0,
      icon: LuTrophy,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Learning Hours",
      value: "0h",
      icon: LuClock,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Welcome, {user?.name?.split(" ")[0]}!
          </h1>
          <p className="text-gray-500 mt-1">
            Ready to master a new skill today?
          </p>
        </div>
        <Link
          to="/courses"
          className="flex items-center gap-2 bg-[#0f2c59] text-white px-6 py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-blue-900/20 active:scale-95 transition-all w-fit"
        >
          <LuSparkles size={18} /> Explore Courses
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 transition-all hover:shadow-md"
          >
            <div
              className={`w-12 h-12 ${s.bg} ${s.color} rounded-xl flex items-center justify-center shadow-sm`}
            >
              <s.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                {s.label}
              </p>
              <p className="text-2xl font-black text-gray-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <LuPlay className="text-cyan-500" size={18} />
                Continue Learning
              </h3>
              <Link
                to="/student/courses"
                className="text-sm font-bold text-gray-400 hover:text-cyan-600 transition-colors"
              >
                View All
              </Link>
            </div>

            <div className="p-4">
              {isLoading ? (
                <div className="space-y-3 p-4">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-20 bg-gray-50 rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              ) : enrollments.length === 0 ? (
                <div className="py-16 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <LuBookOpen size={32} className="text-gray-200" />
                  </div>
                  <p className="text-gray-400 font-bold">
                    No active courses found.
                  </p>
                  <Link
                    to="/courses"
                    className="text-cyan-600 text-sm font-bold mt-2 hover:underline"
                  >
                    Browse our catalog
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {enrollments.slice(0, 4).map((e) => (
                    <div
                      key={e.id}
                      className="group flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer border border-transparent hover:border-gray-100"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-16 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                          <img
                            src={
                              e.Course?.thumbnail ||
                              "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=200"
                            }
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 pr-4">
                          <p className="text-sm font-bold text-gray-900 line-clamp-1">
                            {e.Course?.title}
                          </p>
                          <div className="mt-2 w-full max-w-xs h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-cyan-500 transition-all duration-1000"
                              style={{
                                width: `${e.completionPercentage || 0}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          {e.completionPercentage || 0}% Done
                        </span>
                        <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white group-hover:border-transparent transition-all shadow-sm">
                          <LuPlay size={16} fill="currentColor" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-blue-900/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl" />
            <LuTrophy className="text-blue-200 mb-6" size={32} />
            <h4 className="text-xl font-bold mb-2">Skill Points</h4>
            <p className="text-blue-100 text-sm leading-relaxed mb-6">
              Complete lectures to earn points and climb the global leaderboard.
            </p>
            <div className="flex items-center gap-2 text-xs font-black text-white bg-blue-500/30 w-fit px-3 py-1.5 rounded-lg border border-blue-400/20">
              Rank: #1,240
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <h4 className="font-bold text-gray-900 mb-6">Study Goals</h4>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-1 h-10 bg-cyan-500 rounded-full" />
                <div>
                  <p className="text-sm font-bold text-gray-800">
                    Daily Study Streak
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    3 days current streak
                  </p>
                </div>
              </div>
              <button className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-gray-100 text-gray-400 font-bold text-xs hover:border-cyan-400 hover:text-cyan-600 transition-all">
                Set Monthly Goal <LuArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
