import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { studentService } from "@/services/student.services";
import { adminService } from "@/services/admin.services";
import { LuSearch, LuFilter, LuClock, LuUsers, LuStar } from "react-icons/lu";

export default function Courses() {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [priceFilter, setPriceFilter] = useState(""); // "", "free", "paid"
  const [page, setPage] = useState(1);

  // Fetch categories for filter
  const { data: catData } = useQuery({
    queryKey: ["categories"],
    queryFn: adminService.getCategories,
  });
  const categories = catData?.data || [];

  const { data, isLoading } = useQuery({
    queryKey: ["courses", { search, level, categoryId, priceFilter, page }],
    queryFn: () =>
      studentService.getCourses({
        search: search || undefined,
        level: level || undefined,
        categoryId: categoryId || undefined,
        ...(priceFilter === "free" ? { maxPrice: "0" } : {}),
        ...(priceFilter === "paid" ? { minPrice: "1" } : {}),
        page,
        limit: 12,
        status: "Published",
      }),
  });

  const courses = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;

  const resetFilters = () => {
    setSearch("");
    setLevel("");
    setCategoryId("");
    setPriceFilter("");
    setPage(1);
  };

  const hasActiveFilters = search || level || categoryId || priceFilter;

  return (
    <div className="pt-[72px]">
      {/* Header */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-slate-50 via-white to-cyan-50/30">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="max-w-2xl">
            <p className="text-xs font-bold text-cyan-600 uppercase tracking-widest mb-3">
              Explore & Learn
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              Browse Courses
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed">
              Find the perfect course to level up your skills and accelerate
              your career.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          {/* Filters */}
          <div className="flex flex-col gap-4 mb-10">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <LuSearch
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400 outline-none transition-all"
                />
              </div>

              {/* Level Filter */}
              <div className="relative">
                <LuFilter
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <select
                  value={level}
                  onChange={(e) => {
                    setLevel(e.target.value);
                    setPage(1);
                  }}
                  className="pl-11 pr-10 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400 outline-none appearance-none bg-white transition-all cursor-pointer"
                >
                  <option value="">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              {/* Category Filter */}
              <select
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400 outline-none appearance-none bg-white transition-all cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Filter Buttons + Reset */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-gray-500 mr-1">
                Price:
              </span>
              {[
                { label: "All", value: "" },
                { label: "Free", value: "free" },
                { label: "Paid", value: "paid" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setPriceFilter(opt.value);
                    setPage(1);
                  }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    priceFilter === opt.value
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {opt.label}
                </button>
              ))}

              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="ml-auto px-4 py-1.5 rounded-lg text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 transition-all"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-50 rounded-2xl h-80 animate-pulse"
                />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg mb-2">
                No courses found. Try adjusting your filters.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-cyan-600 font-bold text-sm hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((course) => (
                <Link
                  key={course.id}
                  to={`/courses/${course.slug}`}
                  className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-gray-900/[0.04] hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="h-44 bg-gray-50 overflow-hidden">
                    <img
                      src={
                        course.thumbnail ||
                        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800"
                      }
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <span className="text-[10px] font-bold text-cyan-600 uppercase tracking-widest">
                      {course.level}
                    </span>
                    <h3 className="text-[15px] font-bold text-gray-900 mt-2 mb-3 line-clamp-2 group-hover:text-cyan-700 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-2 mb-4">
                      {course.shortDescription}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <LuClock size={12} />{" "}
                          {Math.round((course.totalDuration || 0) / 3600)}h
                        </span>
                        <span className="flex items-center gap-1">
                          <LuUsers size={12} /> {course.totalEnrollments}
                        </span>
                      </div>
                      <span className="flex items-center gap-1 text-amber-500">
                        <LuStar size={12} /> {course.averageRating || "N/A"}
                      </span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                      <span className="text-lg font-extrabold text-gray-900">
                        {parseFloat(course.price) === 0
                          ? "Free"
                          : `₹${course.price}`}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">
                        {course.instructor?.name}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                    page === i + 1
                      ? "bg-gray-900 text-white"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
