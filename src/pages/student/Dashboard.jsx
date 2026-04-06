import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studentService } from "@/services/student.services";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  LuBookOpen,
  LuTrophy,
  LuClock,
  LuPlay,
  LuSparkles,
  LuFlame,
  LuTarget,
  LuArrowRight,
  LuZap,
  LuCalendar,
  LuCheck,
  LuX,
  LuPackage,
} from "react-icons/lu";
import ProductCard from "@/components/ui/ProductCard";
import ProductDetailModal from "@/components/ui/ProductDetailModal";

export default function StudentDashboard() {
  const { user } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [goalForm, setGoalForm] = useState({
    targetLectures: 10,
    goalName: "",
  });

  // Enrollments
  const { data, isLoading } = useQuery({
    queryKey: ["student-enrollments"],
    queryFn: () => studentService.getMyEnrollments(),
  });
  const enrollments = data?.data || [];

  // Dashboard data (streak, stats, goal)
  const { data: dashData } = useQuery({
    queryKey: ["student-dashboard"],
    queryFn: () => studentService.getStudentDashboard(),
  });
  const dash = dashData?.data;

  // Products
  const { data: productsData, isLoading: isProductsLoading } = useQuery({
    queryKey: ["public-products"],
    queryFn: () => studentService.getProducts(),
  });
  const products = productsData?.data || [];

  // Set monthly goal mutation
  const goalMutation = useMutation({
    mutationFn: (data) => studentService.setMonthlyGoal(data),
    onSuccess: () => {
      toast.success("Monthly goal set! Let's crush it! 🎯");
      queryClient.invalidateQueries({ queryKey: ["student-dashboard"] });
      setShowGoalModal(false);
    },
    onError: (e) => toast.error(e?.userMessage || "Failed to set goal"),
  });

  const handleSetGoal = (e) => {
    e.preventDefault();
    if (goalForm.targetLectures < 1) {
      toast.error("Target must be at least 1 lecture");
      return;
    }
    goalMutation.mutate(goalForm);
  };

  const streak = dash?.streak;
  const weekActivity = dash?.weekActivity || [];
  const monthlyGoal = dash?.monthlyGoal;
  const stats = dash?.stats;

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const statCards = [
    {
      label: "Enrolled",
      value: enrollments.length,
      icon: LuBookOpen,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Completed",
      value: stats?.completedCourses || 0,
      icon: LuTrophy,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Learning Hours",
      value: stats?.learningHours || "0h",
      icon: LuClock,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
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

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((s, i) => (
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

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Continue Learning */}
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
                            alt=""
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

        {/* Right Sidebar: Streak + Goals */}
        <div className="space-y-6">
          {/* Daily Study Streak — Competitive Design */}
          <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl shadow-orange-900/20">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -translate-x-1/2 translate-y-1/2 blur-xl" />

            <div className="relative">
              {/* Streak Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <LuFlame size={24} className="text-yellow-300" />
                  <span className="text-sm font-bold text-white/80">
                    Daily Streak
                  </span>
                </div>
                {streak?.status === "at_risk" && (
                  <span className="text-[10px] font-black bg-yellow-400/20 text-yellow-200 px-2.5 py-1 rounded-full border border-yellow-400/30 animate-pulse">
                    ⚠ AT RISK
                  </span>
                )}
                {streak?.status === "broken" && streak?.current > 0 && (
                  <span className="text-[10px] font-black bg-red-400/20 text-red-200 px-2.5 py-1 rounded-full border border-red-400/30">
                    BROKEN
                  </span>
                )}
              </div>

              {/* Big Streak Number */}
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-6xl font-black tabular-nums leading-none">
                  {streak?.current || 0}
                </span>
                <span className="text-lg font-bold text-white/60">
                  day{(streak?.current || 0) !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Best Streak */}
              <div className="flex items-center gap-1.5 mb-5">
                <LuTrophy size={12} className="text-yellow-300" />
                <span className="text-xs font-medium text-white/60">
                  Best: {streak?.longest || 0} days
                </span>
              </div>

              {/* Week Activity Heatmap */}
              <div className="flex gap-1.5">
                {weekActivity.map((day, i) => {
                  const dateObj = new Date(day.date + "T12:00:00");
                  const dayName = dayNames[dateObj.getDay()];
                  return (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center gap-1"
                    >
                      <span className="text-[9px] font-bold text-white/40">
                        {dayName}
                      </span>
                      <div
                        className={`w-full aspect-square rounded-lg flex items-center justify-center transition-all ${
                          day.studied
                            ? "bg-yellow-400/30 border border-yellow-400/50"
                            : "bg-white/10 border border-white/10"
                        }`}
                      >
                        {day.studied ? (
                          <LuFlame size={12} className="text-yellow-300" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Motivational Message */}
              {streak?.status === "at_risk" && (
                <div className="mt-4 bg-white/10 rounded-xl p-3 border border-white/10">
                  <p className="text-xs font-bold text-yellow-200">
                    <LuZap size={12} className="inline mr-1" />
                    Complete a lecture today to keep your streak alive!
                  </p>
                </div>
              )}
              {streak?.status === "active" && (streak?.current || 0) > 0 && (
                <div className="mt-4 bg-white/10 rounded-xl p-3 border border-white/10">
                  <p className="text-xs font-bold text-green-200">
                    🎉 You&apos;re on fire! Keep the momentum going!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Monthly Goal */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h4 className="font-bold text-gray-900 flex items-center gap-2">
                <LuTarget className="text-blue-500" size={18} />
                Monthly Goal
              </h4>
              {monthlyGoal && (
                <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                  <LuCalendar size={10} />
                  {monthlyGoal.daysRemaining}d left
                </span>
              )}
            </div>

            {monthlyGoal ? (
              <div className="space-y-4">
                {/* Goal Name */}
                {monthlyGoal.goalName && (
                  <p className="text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                    &quot;{monthlyGoal.goalName}&quot;
                  </p>
                )}

                {/* Progress Ring / Circle */}
                <div className="flex items-center gap-5">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <svg
                      className="w-full h-full -rotate-90"
                      viewBox="0 0 80 80"
                    >
                      <circle
                        cx="40"
                        cy="40"
                        r="35"
                        stroke="#f1f5f9"
                        strokeWidth="6"
                        fill="none"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="35"
                        stroke={
                          monthlyGoal.status === "Completed"
                            ? "#10b981"
                            : "#3b82f6"
                        }
                        strokeWidth="6"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 35}`}
                        strokeDashoffset={`${2 * Math.PI * 35 * (1 - Math.min(monthlyGoal.progressPercent, 100) / 100)}`}
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-black text-gray-900">
                        {monthlyGoal.progressPercent}%
                      </span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">
                      {monthlyGoal.completedLectures} /{" "}
                      {monthlyGoal.targetLectures}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      lectures completed
                    </p>
                    {monthlyGoal.status === "Completed" ? (
                      <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        <LuCheck size={10} /> GOAL ACHIEVED!
                      </span>
                    ) : (
                      <p className="text-[10px] text-gray-400 mt-2">
                        {monthlyGoal.targetLectures -
                          monthlyGoal.completedLectures}{" "}
                        more to go
                      </p>
                    )}
                  </div>
                </div>

                {/* Update Goal Button */}
                <button
                  onClick={() => {
                    setGoalForm({
                      targetLectures: monthlyGoal.targetLectures,
                      goalName: monthlyGoal.goalName || "",
                    });
                    setShowGoalModal(true);
                  }}
                  className="w-full text-xs font-bold text-gray-400 hover:text-blue-600 transition-colors py-2"
                >
                  Update Goal
                </button>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <LuTarget size={24} className="text-blue-400" />
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Set a goal to track your monthly progress
                </p>
                <button
                  onClick={() => setShowGoalModal(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-sm hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 transition-all"
                >
                  Set Monthly Goal <LuArrowRight size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Skill Points */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl shadow-blue-900/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl" />
            <LuTrophy className="text-blue-200 mb-4" size={28} />
            <h4 className="text-lg font-bold mb-1">Skill Points</h4>
            <p className="text-blue-100 text-sm leading-relaxed mb-4">
              Complete lectures to earn points and climb the leaderboard.
            </p>
            <div className="flex items-center gap-2 text-xs font-black text-white bg-blue-500/30 w-fit px-3 py-1.5 rounded-lg border border-blue-400/20">
              <LuZap size={12} />
              {stats?.totalCompletedLectures || 0} lectures completed
            </div>
          </div>
        </div>
      </div>

      {/* Products Showcase */}
      <div className="mt-12 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <LuPackage className="text-blue-500" /> Digital Store
            </h3>
            <p className="text-gray-500 text-sm mt-1">Explore our collection of digital assets and products</p>
          </div>
          <Link to="#" className="text-sm font-bold text-blue-600 hover:text-blue-700">View All Products</Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isProductsLoading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 space-y-4 animate-pulse">
                <div className="bg-gray-100 aspect-[4/3] rounded-xl" />
                <div className="h-4 bg-gray-100 rounded w-2/3" />
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-8 bg-gray-100 rounded w-full mt-2" />
              </div>
            ))
          ) : products.length === 0 ? (
            <div className="col-span-full bg-white rounded-3xl border border-dashed border-gray-200 py-12 flex flex-col items-center justify-center text-gray-400">
              <LuPackage size={40} className="mb-3 opacity-20" />
              <p className="text-md font-bold">No products available</p>
            </div>
          ) : (
            products.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} onDetailClick={setSelectedProduct} />
            ))
          )}
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}

      {/* Goal Setting Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative">
            <button
              onClick={() => setShowGoalModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-50 transition-all"
            >
              <LuX size={18} />
            </button>

            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
                <LuTarget size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-black text-gray-900">
                Set Monthly Goal
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                How many lectures will you complete this month?
              </p>
            </div>

            <form onSubmit={handleSetGoal} className="space-y-5">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">
                  Goal Name (optional)
                </label>
                <input
                  type="text"
                  placeholder='e.g. "Master React Basics"'
                  value={goalForm.goalName}
                  onChange={(e) =>
                    setGoalForm({ ...goalForm, goalName: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">
                  Target Lectures
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={goalForm.targetLectures}
                  onChange={(e) =>
                    setGoalForm({
                      ...goalForm,
                      targetLectures: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-400 outline-none transition-all text-center text-2xl font-black"
                />
                <p className="text-[10px] text-gray-400 mt-1.5 text-center">
                  That&apos;s ~
                  {Math.ceil(
                    (goalForm.targetLectures || 1) /
                      (new Date(
                        new Date().getFullYear(),
                        new Date().getMonth() + 1,
                        0,
                      ).getDate() -
                        new Date().getDate() +
                        1),
                  )}{" "}
                  lectures per day
                </p>
              </div>

              <button
                type="submit"
                disabled={goalMutation.isPending}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-sm hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50"
              >
                {goalMutation.isPending ? "Saving..." : "Set Goal 🎯"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
