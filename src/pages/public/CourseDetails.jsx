import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { studentService } from "@/services/student.services";
import { LuClock, LuBookOpen, LuUsers, LuStar, LuPlay, LuChevronDown, LuChevronUp, LuGlobe, LuShield } from "react-icons/lu";
import { useState } from "react";

export default function CourseDetails() {
  const { slug } = useParams();
  const [openSection, setOpenSection] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["course", slug],
    queryFn: () => studentService.getCourseBySlug(slug),
  });

  const course = data?.data;

  if (isLoading) {
    return (
      <div className="pt-[72px] min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="pt-[72px] min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Course not found.</p>
      </div>
    );
  }

  const sections = course.sections || [];

  return (
    <div className="pt-[72px]">
      {/* Hero */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2000')] bg-cover bg-center opacity-[0.07]" />
        <div className="container mx-auto px-6 md:px-12 lg:px-20 relative z-10">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <span className="inline-block text-xs font-bold text-cyan-400 uppercase tracking-widest mb-4">
                {course.Category?.name || course.level}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
                {course.title}
              </h1>
              <p className="text-gray-400 leading-relaxed mb-8 max-w-xl">{course.shortDescription}</p>
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                <span className="flex items-center gap-2"><LuStar className="text-amber-400" /> {course.averageRating || "N/A"} ({course.totalReviews || 0} reviews)</span>
                <span className="flex items-center gap-2"><LuUsers /> {course.totalEnrollments || 0} students</span>
                <span className="flex items-center gap-2"><LuGlobe /> {course.language || "English"}</span>
              </div>
              {course.instructor && (
                <div className="flex items-center gap-3 mt-8">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                    {course.instructor.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{course.instructor.name}</p>
                    <p className="text-xs text-gray-500">Instructor</p>
                  </div>
                </div>
              )}
            </div>
            {/* Price Card */}
            <div className="bg-white rounded-2xl p-8 text-gray-900 shadow-2xl shadow-black/20 self-start">
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-gray-900">
                  {parseFloat(course.price) === 0 ? "Free" : `₹${course.price}`}
                </span>
              </div>
              <button className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-sm hover:bg-gray-800 transition-all shadow-lg mb-4">
                Enroll Now
              </button>
              <div className="space-y-3 text-sm text-gray-500">
                <div className="flex items-center gap-3">
                  <LuClock className="text-gray-400" size={16} />
                  <span>{Math.round((course.totalDuration || 0) / 3600)} hours of content</span>
                </div>
                <div className="flex items-center gap-3">
                  <LuBookOpen className="text-gray-400" size={16} />
                  <span>{course.totalLectures || 0} lectures</span>
                </div>
                <div className="flex items-center gap-3">
                  <LuPlay className="text-gray-400" size={16} />
                  <span>{course.level} level</span>
                </div>
                <div className="flex items-center gap-3">
                  <LuShield className="text-gray-400" size={16} />
                  <span>Lifetime access</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-4xl">
          {course.description && (
            <div className="mb-16">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-6">About this Course</h2>
              <div className="text-gray-500 leading-relaxed whitespace-pre-line">{course.description}</div>
            </div>
          )}

          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-6">
              Curriculum
              <span className="text-sm font-medium text-gray-400 ml-3">
                {sections.length} sections, {course.totalLectures || 0} lectures
              </span>
            </h2>
            <div className="space-y-3">
              {sections.map((section) => (
                <div key={section.id} className="border border-gray-100 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
                    className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-bold text-gray-800 text-sm">{section.title}</span>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <span className="text-xs">{section.lectures?.length || 0} lectures</span>
                      {openSection === section.id ? <LuChevronUp size={16} /> : <LuChevronDown size={16} />}
                    </div>
                  </button>
                  {openSection === section.id && section.lectures && (
                    <div className="border-t border-gray-50 bg-gray-50/50">
                      {section.lectures.map((lecture) => (
                        <div key={lecture.id} className="flex items-center gap-3 px-5 py-3 border-b border-gray-50 last:border-0">
                          <LuPlay className="text-gray-300 flex-shrink-0" size={14} />
                          <span className="text-sm text-gray-700 flex-1">{lecture.title}</span>
                          <span className="text-xs text-gray-400">
                            {lecture.duration ? `${Math.floor(lecture.duration / 60)}m` : ""}
                          </span>
                          {lecture.isFree && (
                            <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">Preview</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
