import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studentService } from "@/services/student.services";
import {
  LuPlay,
  LuCheck,
  LuBookOpen,
  LuInfo,
  LuChevronDown,
  LuChevronUp,
  LuArrowLeft,
} from "react-icons/lu";
import { toast } from "react-toastify";

export default function StudentLearning() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeLecture, setActiveLecture] = useState(null);
  const [openSections, setOpenSections] = useState({});

  const { data, isLoading, error } = useQuery({
    queryKey: ["course-progress", courseId],
    queryFn: () => studentService.getCourseProgress(courseId),
  });

  const progressData = data?.data;
  const sections = progressData?.sections || [];

  // Set initial active lecture
  useEffect(() => {
    if (sections.length > 0 && !activeLecture) {
      // Find first incomplete lecture or just first lecture
      let found = null;
      for (const section of sections) {
        const incomplete = section.lectures.find((l) => !l.completed);
        if (incomplete) {
          found = incomplete;
          break;
        }
      }
      setActiveLecture(found || sections[0].lectures[0]);

      // Open the section of the active lecture
      const sectionOfActive = sections.find((s) =>
        s.lectures.find(
          (l) => l.lectureId === (found?.lectureId || sections[0].lectures[0].lectureId),
        ),
      );
      if (sectionOfActive) {
        setOpenSections((prev) => ({ ...prev, [sectionOfActive.sectionId]: true }));
      }
    }
  }, [sections, activeLecture]);

  const completeMutation = useMutation({
    mutationFn: (lectureId) => studentService.markLectureComplete(lectureId),
    onSuccess: () => {
      queryClient.invalidateQueries(["course-progress", courseId]);
      toast.success("Lecture marked as complete!");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to update progress");
    },
  });

  const toggleSection = (sectionId) => {
    setOpenSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !progressData) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Failed to load course content. Make sure you are enrolled.</p>
        <button
          onClick={() => navigate("/student/courses")}
          className="mt-4 text-cyan-600 font-bold"
        >
          Back to My Courses
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-160px)]">
      {/* Sidebar - Curriculum */}
      <div className="w-full lg:w-80 lg:order-2 flex flex-col gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full sticky top-8 max-h-[calc(100vh-120px)]">
          <div className="p-5 border-b border-gray-100 bg-gray-50/50">
            <h2 className="font-black text-gray-900 text-lg">Course Content</h2>
            <div className="mt-2 text-xs text-gray-400 font-medium uppercase tracking-wider">
              {progressData.overallProgress}% Completed
            </div>
            <div className="mt-2 w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-500 transition-all duration-1000"
                style={{ width: `${progressData.overallProgress}%` }}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
            {sections.map((section) => (
              <div key={section.sectionId} className="space-y-1">
                <button
                  onClick={() => toggleSection(section.sectionId)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="text-sm font-bold text-gray-800 line-clamp-1">
                    {section.title}
                  </span>
                  {openSections[section.sectionId] ? (
                    <LuChevronUp size={16} className="text-gray-400" />
                  ) : (
                    <LuChevronDown size={16} className="text-gray-400" />
                  )}
                </button>

                {openSections[section.sectionId] && (
                  <div className="space-y-1 px-1 pb-2">
                    {section.lectures.map((lecture) => (
                      <button
                        key={lecture.lectureId}
                        onClick={() => setActiveLecture(lecture)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                          activeLecture?.lectureId === lecture.lectureId
                            ? "bg-cyan-50 text-cyan-700 shadow-sm shadow-cyan-900/5 ring-1 ring-cyan-100"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex-shrink-0">
                          {lecture.completed ? (
                            <LuCheck size={18} className="text-green-500" />
                          ) : (
                            <LuPlay size={18} className="opacity-60" />
                          )}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-xs font-semibold truncate leading-tight">
                            {lecture.title}
                          </p>
                          <p className="text-[10px] opacity-60 mt-0.5">
                            {lecture.type} {lecture.duration ? `• ${Math.floor(lecture.duration / 60)}:${(lecture.duration % 60).toString().padStart(2, "0")}` : ""}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content - Player */}
      <div className="flex-1 lg:order-1 flex flex-col gap-6">
        <button
          onClick={() => navigate("/student/courses")}
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-cyan-600 transition-colors self-start"
        >
          <LuArrowLeft size={16} />
          Back to Courses
        </button>

        {activeLecture ? (
          <>
            <div className="bg-black rounded-3xl overflow-hidden shadow-2xl shadow-black/20 aspect-video relative group">
              {activeLecture.type === "Video" ? (
                activeLecture.videoUrl ? (
                  activeLecture.videoUrl.match(/\.(mp4|webm|ogg|mov)$|^https:\/\/res\.cloudinary\.com/i) ? (
                    <video
                      src={activeLecture.videoUrl}
                      controls
                      className="w-full h-full"
                      controlsList="nodownload"
                    />
                  ) : (
                    <iframe
                      src={activeLecture.videoUrl}
                      title={activeLecture.title}
                      className="w-full h-full border-0"
                      allowFullScreen
                    />
                  )
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 gap-4 bg-gray-900">
                    <LuPlay size={64} className="opacity-20 animate-pulse" />
                    <p className="font-medium">No video content for this lecture</p>
                  </div>
                )
              ) : activeLecture.type === "Document" ? (
                <div className="w-full h-full bg-white p-12 overflow-y-auto">
                    <div className="max-w-2xl mx-auto">
                        <div className="flex items-center gap-3 mb-6 text-cyan-600">
                            <LuBookOpen size={24} />
                            <span className="font-black uppercase tracking-widest text-sm">Study Document</span>
                        </div>
                        <div className="prose prose-cyan max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {activeLecture.content || "No document content available for this lecture."}
                        </div>
                    </div>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 gap-4 bg-gray-900">
                  <LuPlay size={64} className="opacity-20 animate-pulse" />
                  <p className="font-medium">Unsupported lecture type: {activeLecture.type}</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-cyan-500" />
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                    {activeLecture.title}
                  </h1>
                  <p className="text-gray-500 mt-1 font-medium">
                    Current Lecture
                  </p>
                </div>
                <button
                  onClick={() => completeMutation.mutate(activeLecture.lectureId)}
                  disabled={activeLecture.completed || completeMutation.isPending}
                  className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:scale-100 ${
                    activeLecture.completed
                      ? "bg-green-100 text-green-700 shadow-none cursor-default"
                      : "bg-[#0f2c59] text-white hover:bg-[#1a4073] hover:shadow-cyan-900/20"
                  }`}
                >
                  {activeLecture.completed ? (
                    <>
                      <LuCheck size={20} />
                      <span>Completed!</span>
                    </>
                  ) : completeMutation.isPending ? (
                    "Updating..."
                  ) : (
                    "Mark as Complete"
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 mb-6">
               <LuPlay size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Start Learning</h3>
            <p className="text-gray-500 mt-2 max-w-xs mx-auto">
              Select a lecture from the curriculum sidebar to begin watching.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
