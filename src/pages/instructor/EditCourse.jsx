/* eslint-disable */
import { useState, useCallback, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { instructorService } from "@/services/instructor.services";
import { adminService } from "@/services/admin.services";
import { studentService } from "@/services/student.services";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { 
  LuSave, 
  LuArrowLeft,
  LuLayers,
  LuVideo,
  LuPlus,
  LuGripVertical,
  LuChevronUp,
  LuChevronDown,
  LuFileText,
  LuCheck,
  LuTrash,
  LuUpload,
  LuX
} from "react-icons/lu";

const LANGUAGES = [
  "English", "Hindi", "Marathi", "Tamil", "Telugu", "Bengali",
  "Kannada", "Malayalam", "Gujarati", "Punjabi", "Urdu",
  "Spanish", "French", "German", "Japanese", "Chinese",
  "Korean", "Arabic",
];

function CourseForm({ course, categories, id }) {
  const queryClient = useQueryClient();

  const lang = course.language || "English";
  const isCustomLangInitial = !LANGUAGES.includes(lang);

  const [form, setForm] = useState({
    title: course.title || "",
    description: course.description || "",
    shortDescription: course.shortDescription || "",
    price: course.price || "0",
    level: course.level || "Beginner",
    language: isCustomLangInitial ? "" : lang,
    categoryId: course.categoryId || "",
    status: course.status || "Draft",
  });

  const [showCustomLanguage, setShowCustomLanguage] = useState(isCustomLangInitial);
  const [customLanguage, setCustomLanguage] = useState(isCustomLangInitial ? lang : "");

  const updateMutation = useMutation({
    mutationFn: (data) => instructorService.updateCourse(id, data),
    onSuccess: () => {
      toast.success("Course updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["instructor-courses"] });
      queryClient.invalidateQueries({ queryKey: ["course-edit", id] });
    },
    onError: (e) => toast.error(e?.userMessage || "Failed to update course"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const language = showCustomLanguage && customLanguage.trim() ? customLanguage.trim() : form.language;
    updateMutation.mutate({
      ...form,
      language,
      categoryId: form.categoryId || null,
    });
  };

  const handleLanguageChange = (e) => {
    const value = e.target.value;
    if (value === "__other__") {
      setShowCustomLanguage(true);
      setForm({ ...form, language: "" });
    } else {
      setShowCustomLanguage(false);
      setCustomLanguage("");
      setForm({ ...form, language: value });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-8 space-y-5">
      <div>
        <label className="text-sm font-bold text-gray-700 mb-2 block">Course Title *</label>
        <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-cyan-400" />
      </div>
      <div>
        <label className="text-sm font-bold text-gray-700 mb-2 block">Short Description</label>
        <input value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-cyan-400" />
      </div>
      <div>
        <label className="text-sm font-bold text-gray-700 mb-2 block">Description</label>
        <textarea rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-cyan-400 resize-none" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-bold text-gray-700 mb-2 block">Price (INR)</label>
          <input type="number" min="0" step="any" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-cyan-400" />
        </div>
        <div>
          <label className="text-sm font-bold text-gray-700 mb-2 block">Level</label>
          <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-cyan-400 bg-white">
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-bold text-gray-700 mb-2 block">Language</label>
          <select value={showCustomLanguage ? "__other__" : form.language} onChange={handleLanguageChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-cyan-400 bg-white">
            {LANGUAGES.map((lang) => <option key={lang} value={lang}>{lang}</option>)}
            <option value="__other__">Other</option>
          </select>
          {showCustomLanguage && (
            <input value={customLanguage} onChange={(e) => setCustomLanguage(e.target.value)} placeholder="Enter language name" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-cyan-400 mt-2" />
          )}
        </div>
        {categories.length > 0 && (
          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 block">Category</label>
            <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-cyan-400 bg-white">
              <option value="">Select category (Optional)</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        )}
      </div>
      <div>
        <label className="text-sm font-bold text-gray-700 mb-2 block">Status</label>
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-cyan-400 bg-white">
          <option value="Draft">Draft</option>
          <option value="Published">Published</option>
        </select>
      </div>
      <button type="submit" disabled={updateMutation.isPending} className="bg-[#0f2c59] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#1d4e89] transition-all disabled:opacity-60 mt-2 flex items-center gap-2">
        <LuSave size={16} />
        {updateMutation.isPending ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}

function CourseCurriculum({ courseId, initialSections }) {
  const queryClient = useQueryClient();
  const sections = initialSections || [];
  const [expandedSection, setExpandedSection] = useState(null);

  const [showSectionInput, setShowSectionInput] = useState(false);
  const [sectionTitle, setSectionTitle] = useState("");

  const [lectureFormSection, setLectureFormSection] = useState(null);
  const [lectureTitle, setLectureTitle] = useState("");
  const [lectureFile, setLectureFile] = useState(null);
  const [isDraggingLecture, setIsDraggingLecture] = useState(false);
  const fileInputRef = useRef(null);

  const createSectionMutation = useMutation({
    mutationFn: (data) => instructorService.createSection(courseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-edit", courseId] });
      toast.success("Section created!");
      setShowSectionInput(false);
      setSectionTitle("");
    },
    onError: (e) => toast.error(e?.userMessage || "Failed to create section"),
  });

  const createLectureMutation = useMutation({
    mutationFn: ({ sectionId, data }) => instructorService.createLecture(sectionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-edit", courseId] });
      toast.success("Lecture added!");
      resetLectureForm();
    },
    onError: (e) => toast.error(e?.userMessage || "Failed to create lecture"),
  });

  const deleteLectureMutation = useMutation({
    mutationFn: instructorService.deleteLecture,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-edit", courseId] });
      toast.success("Lecture deleted!");
    },
    onError: (e) => toast.error(e?.userMessage || "Failed to delete lecture"),
  });

  const resetLectureForm = () => {
    setLectureFormSection(null);
    setLectureTitle("");
    setLectureFile(null);
    setIsDraggingLecture(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAddSection = () => {
    if (!sectionTitle.trim()) return;
    createSectionMutation.mutate({ title: sectionTitle.trim() });
  };

  const handleAddLecture = (sectionId) => {
    if (!lectureTitle.trim()) {
      toast.error("Please enter a lecture title");
      return;
    }
    const formData = new FormData();
    formData.append("title", lectureTitle.trim());
    formData.append("type", lectureFile ? "Video" : "Text");
    if (lectureFile) {
      formData.append("video", lectureFile);
    }
    createLectureMutation.mutate({ sectionId, data: formData });
  };

  const handleLectureDrop = useCallback((e) => {
    e.preventDefault();
    setIsDraggingLecture(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      const validTypes = ["video/mp4", "video/webm", "video/quicktime"];
      if (!validTypes.includes(file.type)) {
        toast.error("Please drop a video file (MP4, WebM, or MOV)");
        return;
      }
      if (file.size > 100 * 1024 * 1024) {
        toast.error("Video file must be less than 100 MB");
        return;
      }
      setLectureFile(file);
    }
  }, []);

  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const totalLectures = sections.reduce((acc, s) => acc + (s.lectures?.length || 0), 0);

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <LuLayers size={14} className="text-blue-500" />
            </div>
            <div>
              <p className="text-lg font-black text-gray-900">{sections.length}</p>
              <p className="text-[10px] text-gray-400 font-medium -mt-0.5">Sections</p>
            </div>
          </div>
          <div className="w-px h-8 bg-gray-100" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-cyan-50 rounded-lg flex items-center justify-center">
              <LuVideo size={14} className="text-cyan-500" />
            </div>
            <div>
              <p className="text-lg font-black text-gray-900">{totalLectures}</p>
              <p className="text-[10px] text-gray-400 font-medium -mt-0.5">Lectures</p>
            </div>
          </div>
        </div>
      </div>

      {sections.length === 0 && !showSectionInput && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LuLayers size={28} className="text-cyan-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Start building your curriculum</h3>
          <p className="text-sm text-gray-400 mb-6 max-w-sm mx-auto">Organize your course into sections and add lectures with video content</p>
          <button type="button" onClick={() => setShowSectionInput(true)} className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-cyan-500/25 transition-all">
            <LuPlus size={16} /> Add First Section
          </button>
        </div>
      )}

      {sections.map((section, sIndex) => (
        <div key={section.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-shadow hover:shadow-sm">
          <button onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)} className="w-full flex items-center justify-between p-5 hover:bg-gray-50/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <LuGripVertical size={14} className="text-gray-300" />
                <span className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-black text-gray-500">{sIndex + 1}</span>
              </div>
              <span className="font-bold text-gray-800">{section.title}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <span className="text-xs font-medium bg-gray-50 px-2.5 py-1 rounded-lg">{section.lectures?.length || 0} lectures</span>
              {expandedSection === section.id ? <LuChevronUp size={16} /> : <LuChevronDown size={16} />}
            </div>
          </button>

          {expandedSection === section.id && (
            <div className="border-t border-gray-50 p-4 space-y-2">
              {section.lectures?.map((l, lIndex) => (
                <div key={l.id} className="flex items-center justify-between px-4 py-3 bg-gray-50/80 rounded-xl group">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-gray-300 w-4">{lIndex + 1}</span>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${l.videoUrl ? "bg-cyan-50 text-cyan-500" : "bg-gray-100 text-gray-400"}`}>
                      {l.videoUrl ? <LuVideo size={13} /> : <LuFileText size={13} />}
                    </div>
                    <span className="text-sm text-gray-700 font-medium">{l.title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {l.duration > 0 && <span className="text-[11px] text-gray-400 font-medium">{Math.floor(l.duration / 60)}m {l.duration % 60}s</span>}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${l.videoUrl ? "text-green-600 bg-green-50" : "text-gray-400 bg-gray-100"}`}>
                      {l.videoUrl ? <span className="flex items-center gap-1"><LuCheck size={10} /> Uploaded</span> : "No video"}
                    </span>
                    <button type="button" onClick={() => { if (window.confirm("Are you sure you want to delete this lecture?")) deleteLectureMutation.mutate(l.id); }} disabled={deleteLectureMutation.isPending} className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors ml-2 disabled:opacity-50" title="Delete lecture">
                      <LuTrash size={14} />
                    </button>
                  </div>
                </div>
              ))}

              {lectureFormSection === section.id ? (
                <div className="bg-gradient-to-br from-cyan-50/40 to-blue-50/40 border border-cyan-100/60 rounded-xl p-5 mt-3 space-y-4">
                  <input type="text" value={lectureTitle} onChange={(e) => setLectureTitle(e.target.value)} placeholder="Enter lecture title" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 bg-white" autoFocus />
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-2 block">Video File</label>
                    {lectureFile ? (
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-cyan-50 rounded-lg flex items-center justify-center">
                            <LuVideo size={14} className="text-cyan-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700 truncate max-w-[200px]">{lectureFile.name}</p>
                            <p className="text-[10px] text-gray-400">{formatFileSize(lectureFile.size)}</p>
                          </div>
                        </div>
                        <button type="button" onClick={() => { setLectureFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                          <LuX size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${isDraggingLecture ? "border-cyan-400 bg-cyan-50/30" : "border-gray-200 hover:border-cyan-300 hover:bg-gray-50/50"}`} onDragOver={(e) => { e.preventDefault(); setIsDraggingLecture(true); }} onDragLeave={() => setIsDraggingLecture(false)} onDrop={handleLectureDrop} onClick={() => fileInputRef.current?.click()}>
                        <LuUpload size={20} className="mx-auto mb-1.5 text-gray-300" />
                        <p className="text-xs text-gray-400">Drag & drop or <span className="text-cyan-500 font-bold">browse</span></p>
                        <p className="text-[10px] text-gray-300 mt-0.5">MP4, WebM, MOV</p>
                      </div>
                    )}
                    <input ref={fileInputRef} type="file" accept="video/mp4,video/webm,video/quicktime" onChange={(e) => { const file = e.target.files[0]; if (file) { if (file.size > 100 * 1024 * 1024) { toast.error("Video file must be less than 100 MB"); e.target.value = ""; return; } setLectureFile(file); } }} className="hidden" />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button type="button" onClick={() => handleAddLecture(section.id)} disabled={createLectureMutation.isPending} className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:shadow-lg hover:shadow-cyan-500/20 transition-all disabled:opacity-50">
                      {createLectureMutation.isPending ? <> <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Uploading...</> : <><LuPlus size={14} /> Add Lecture</>}
                    </button>
                    <button type="button" onClick={resetLectureForm} className="px-4 py-2 rounded-lg text-sm font-bold text-gray-500 hover:bg-white transition-all">Cancel</button>
                  </div>
                </div>
              ) : (
                <button type="button" disabled={createLectureMutation.isPending} onClick={() => { resetLectureForm(); setLectureFormSection(section.id); setExpandedSection(section.id); }} className="flex items-center gap-2 text-sm font-bold text-cyan-600 hover:text-cyan-700 mt-2 px-2 py-1.5 rounded-lg hover:bg-cyan-50/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  <LuPlus size={14} /> Add Lecture
                </button>
              )}
            </div>
          )}
        </div>
      ))}

      {showSectionInput ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
          <label className="text-xs font-bold text-gray-500 block">New Section Title</label>
          <input type="text" value={sectionTitle} onChange={(e) => setSectionTitle(e.target.value)} placeholder="e.g. Introduction, Getting Started, Advanced Topics..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400" autoFocus onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddSection(); } }} />
          <div className="flex gap-2">
            <button type="button" onClick={handleAddSection} disabled={createSectionMutation.isPending} className="flex items-center gap-2 bg-[#0f2c59] text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-[#1d4e89] transition-all disabled:opacity-50">
              {createSectionMutation.isPending ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Adding...</> : <><LuPlus size={14} /> Add Section</>}
            </button>
            <button type="button" onClick={() => { setShowSectionInput(false); setSectionTitle(""); }} className="px-4 py-2 rounded-lg text-sm font-bold text-gray-500 hover:bg-gray-100 transition-all">Cancel</button>
          </div>
        </div>
      ) : sections.length > 0 ? (
        <button type="button" onClick={() => setShowSectionInput(true)} className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-bold text-gray-500 hover:border-cyan-300 hover:text-cyan-600 hover:bg-cyan-50/30 transition-all flex items-center justify-center gap-2">
          <LuPlus size={18} /> Add New Section
        </button>
      ) : null}
    </div>
  );
}

export default function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("info"); // "info" or "curriculum"

  const { data: courseData, isLoading } = useQuery({
    queryKey: ["course-edit", id],
    queryFn: () => studentService.getCourseBySlug(id),
    enabled: !!id,
  });

  const { data: catData } = useQuery({
    queryKey: ["categories"],
    queryFn: adminService.getCategories,
  });
  const categories = catData?.data || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!courseData?.data) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Course not found.</p>
        <button onClick={() => navigate("/instructor/courses")} className="text-cyan-600 font-bold mt-4">Go Back</button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <button onClick={() => navigate("/instructor/courses")} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors">
          <LuArrowLeft size={16} /> Back to My Courses
        </button>
        <h1 className="text-3xl font-black text-gray-900">Edit Course</h1>
        <p className="text-gray-500 mt-1">Update your course details and curriculum</p>
      </div>

      <div className="flex gap-4 border-b border-gray-200 mb-8 pb-px">
        <button
          onClick={() => setActiveTab("info")}
          className={`px-4 py-2 font-bold text-sm border-b-2 transition-colors ${activeTab === "info" ? "border-cyan-500 text-cyan-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
        >
          Basic Info
        </button>
        <button
          onClick={() => setActiveTab("curriculum")}
          className={`px-4 py-2 font-bold text-sm border-b-2 transition-colors ${activeTab === "curriculum" ? "border-cyan-500 text-cyan-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
        >
          Curriculum
        </button>
      </div>

      <div className="max-w-2xl">
        {activeTab === "info" ? (
          <CourseForm key={courseData.data.id} course={courseData.data} categories={categories} id={id} />
        ) : (
          <CourseCurriculum courseId={courseData.data.id} initialSections={courseData.data.Sections || courseData.data.sections || []} />
        )}
      </div>
    </div>
  );
}
