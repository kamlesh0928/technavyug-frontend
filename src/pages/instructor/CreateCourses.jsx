import { useState, useRef, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { instructorService } from "@/services/instructor.services";
import { adminService } from "@/services/admin.services";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  LuUpload,
  LuPlus,
  LuTrash,
  LuChevronDown,
  LuChevronUp,
  LuCheck,
  LuFile,
  LuVideo,
  LuImage,
  LuBookOpen,
  LuLayers,
  LuSparkles,
  LuGripVertical,
  LuInfo,
  LuArrowRight,
  LuArrowLeft,
  LuGlobe,
  LuTag,
  LuDollarSign,
  LuTrendingUp,
  LuFileText,
  LuX,
} from "react-icons/lu";

const LANGUAGES = [
  "English",
  "Hindi",
  "Marathi",
  "Tamil",
  "Telugu",
  "Bengali",
  "Kannada",
  "Malayalam",
  "Gujarati",
  "Punjabi",
  "Urdu",
  "Spanish",
  "French",
  "German",
  "Japanese",
  "Chinese",
  "Korean",
  "Arabic",
];

const STEPS = [
  {
    id: 1,
    label: "Course Info",
    icon: LuBookOpen,
    description: "Basic details",
  },
  {
    id: 2,
    label: "Content",
    icon: LuLayers,
    description: "Sections & lectures",
  },
  { id: 3, label: "Review", icon: LuSparkles, description: "Publish" },
];

export default function CreateCourse() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [courseId, setCourseId] = useState(null);
  const [sections, setSections] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    shortDescription: "",
    price: "0",
    level: "Beginner",
    language: "English",
    categoryId: "",
    thumbnail: "",
  });
  const [expandedSection, setExpandedSection] = useState(null);

  // Custom category / language "Other" states
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState("");
  const [showCustomLanguage, setShowCustomLanguage] = useState(false);
  const [customLanguage, setCustomLanguage] = useState("");

  // Inline lecture form state
  const [lectureFormSection, setLectureFormSection] = useState(null);
  const [lectureTitle, setLectureTitle] = useState("");
  const [lectureFile, setLectureFile] = useState(null);
  const [isDraggingLecture, setIsDraggingLecture] = useState(false);
  const fileInputRef = useRef(null);

  // Thumbnail
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [isDraggingThumb, setIsDraggingThumb] = useState(false);
  const thumbnailInputRef = useRef(null);

  // New section input
  const [showSectionInput, setShowSectionInput] = useState(false);
  const [sectionTitle, setSectionTitle] = useState("");

  const { data: catData } = useQuery({
    queryKey: ["categories"],
    queryFn: adminService.getCategories,
  });
  const categories = catData?.data || [];

  // --- Mutations ---
  const createCategoryMutation = useMutation({
    mutationFn: adminService.createCategory,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      return data;
    },
    onError: () => toast.error("Failed to create category"),
  });

  const createCourseMutation = useMutation({
    mutationFn: instructorService.createCourse,
    onSuccess: (data) => {
      setCourseId(data.data.id);
      toast.success("Course created! Now add your content.");
      setStep(2);
    },
    onError: (e) => toast.error(e?.userMessage || "Failed to create course"),
  });

  const createSectionMutation = useMutation({
    mutationFn: ({ courseId, data }) =>
      instructorService.createSection(courseId, data),
    onSuccess: (data) => {
      setSections((prev) => [...prev, { ...data.data, lectures: [] }]);
      toast.success("Section added!");
      setShowSectionInput(false);
      setSectionTitle("");
    },
    onError: (e) => toast.error(e?.userMessage || "Failed to create section"),
  });

  const createLectureMutation = useMutation({
    mutationFn: ({ sectionId, data }) =>
      instructorService.createLecture(sectionId, data),
    onSuccess: (data, variables) => {
      setSections((prev) =>
        prev.map((s) =>
          s.id === variables.sectionId
            ? { ...s, lectures: [...(s.lectures || []), data.data] }
            : s,
        ),
      );
      toast.success("Lecture added!");
      resetLectureForm();
    },
    onError: (e) => toast.error(e?.userMessage || "Failed to create lecture"),
  });

  const publishMutation = useMutation({
    mutationFn: (id) =>
      instructorService.updateCourse(id, { status: "Published" }),
    onSuccess: () => {
      toast.success("Course published! It is now visible to students.");
      navigate("/instructor/courses");
    },
    onError: (e) => toast.error(e?.userMessage || "Failed to publish"),
  });

  // --- Handlers ---
  const resetLectureForm = () => {
    setLectureFormSection(null);
    setLectureTitle("");
    setLectureFile(null);
    setIsDraggingLecture(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleThumbnailChange = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setThumbnailPreview(e.target.result);
      setForm((prev) => ({ ...prev, thumbnail: e.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleThumbDrop = useCallback((e) => {
    e.preventDefault();
    setIsDraggingThumb(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) handleThumbnailChange(file);
  }, []);

  const handleCreateCourse = async (e) => {
    e.preventDefault();

    let categoryId = form.categoryId;

    if (showCustomCategory && customCategoryName.trim()) {
      try {
        const result = await createCategoryMutation.mutateAsync({
          name: customCategoryName.trim(),
        });
        categoryId = result.data.id;
      } catch {
        return;
      }
    }

    const language =
      showCustomLanguage && customLanguage.trim()
        ? customLanguage.trim()
        : form.language;

    createCourseMutation.mutate({
      ...form,
      categoryId: categoryId || undefined,
      language,
    });
  };

  const handleAddSection = () => {
    if (!sectionTitle.trim()) return;
    createSectionMutation.mutate({
      courseId,
      data: { title: sectionTitle.trim() },
    });
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

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === "__other__") {
      setShowCustomCategory(true);
      setForm({ ...form, categoryId: "" });
    } else {
      setShowCustomCategory(false);
      setCustomCategoryName("");
      setForm({ ...form, categoryId: value });
    }
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
      setLectureFile(file);
    }
  }, []);

  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const totalLectures = sections.reduce(
    (acc, s) => acc + (s.lectures?.length || 0),
    0,
  );

  // --- Render ---
  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          Create New Course
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Build an engaging learning experience for your students
        </p>
      </div>

      {/* Step Indicator */}
      <div className="relative mb-10">
        {/* Progress bar background */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 mx-16" />
        {/* Progress bar fill */}
        <div
          className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 mx-16 transition-all duration-500 ease-out"
          style={{
            width: `${((step - 1) / (STEPS.length - 1)) * (100 - 12)}%`,
          }}
        />

        <div className="relative flex justify-between">
          {STEPS.map((s) => {
            const StepIcon = s.icon;
            const isActive = step === s.id;
            const isComplete = step > s.id;

            return (
              <div key={s.id} className="flex flex-col items-center z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 scale-110"
                      : isComplete
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {isComplete ? (
                    <LuCheck size={18} strokeWidth={3} />
                  ) : (
                    <StepIcon size={18} />
                  )}
                </div>
                <p
                  className={`text-xs font-bold mt-2 transition-colors ${
                    isActive
                      ? "text-cyan-600"
                      : isComplete
                        ? "text-green-600"
                        : "text-gray-400"
                  }`}
                >
                  {s.label}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {s.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 1: Course Info */}
      {step === 1 && (
        <form onSubmit={handleCreateCourse} className="space-y-6">
          {/* Thumbnail Upload Area */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <LuImage size={16} className="text-cyan-500" />
              Course Thumbnail
              <span className="text-[10px] font-normal text-gray-400 ml-1">
                (recommended: 1280×720)
              </span>
            </label>
            <div
              className={`relative rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden ${
                isDraggingThumb
                  ? "border-cyan-400 bg-cyan-50/50"
                  : thumbnailPreview
                    ? "border-transparent"
                    : "border-gray-200 hover:border-cyan-300 hover:bg-gray-50/50"
              }`}
              style={{ height: thumbnailPreview ? "auto" : "180px" }}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingThumb(true);
              }}
              onDragLeave={() => setIsDraggingThumb(false)}
              onDrop={handleThumbDrop}
              onClick={() => thumbnailInputRef.current?.click()}
            >
              {thumbnailPreview ? (
                <div className="relative group">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="w-full h-52 object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                    <p className="text-white text-sm font-bold">
                      Click to change
                    </p>
                  </div>
                  <button
                    type="button"
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      setThumbnailPreview(null);
                      setForm({ ...form, thumbnail: "" });
                    }}
                  >
                    <LuX size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <LuImage size={32} className="mb-2 text-gray-300" />
                  <p className="text-sm font-medium">
                    Drag & drop an image or{" "}
                    <span className="text-cyan-500 font-bold">browse</span>
                  </p>
                  <p className="text-[10px] mt-1">PNG, JPG, WebP up to 5 MB</p>
                </div>
              )}
            </div>
            <input
              ref={thumbnailInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(e) => handleThumbnailChange(e.target.files?.[0])}
            />
          </div>

          {/* Main Form Fields */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
            {/* Title */}
            <div>
              <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <LuFileText size={14} className="text-cyan-500" />
                Course Title <span className="text-red-400">*</span>
              </label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all"
                placeholder="e.g. Full-Stack Web Development with React & Node.js"
              />
              <p className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-1">
                <LuInfo size={10} />
                Choose a clear, descriptive title that highlights what students
                will learn
              </p>
            </div>

            {/* Short Description */}
            <div>
              <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                Short Description
              </label>
              <input
                value={form.shortDescription}
                onChange={(e) =>
                  setForm({ ...form, shortDescription: e.target.value })
                }
                maxLength={160}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all"
                placeholder="Brief one-liner that appears in course cards"
              />
              <div className="flex justify-between mt-1">
                <p className="text-[11px] text-gray-400 flex items-center gap-1">
                  <LuInfo size={10} />
                  Shown on course cards and search results
                </p>
                <span
                  className={`text-[11px] font-medium ${
                    form.shortDescription.length > 140
                      ? "text-amber-500"
                      : "text-gray-300"
                  }`}
                >
                  {form.shortDescription.length}/160
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                Full Description
              </label>
              <textarea
                rows={5}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all resize-none leading-relaxed"
                placeholder="Describe what students will learn, prerequisites, and what makes this course unique..."
              />
              <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                <LuInfo size={10} />
                Detailed description shown on the course page
              </p>
            </div>
          </div>

          {/* Settings Grid */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
              <LuTrendingUp size={14} className="text-cyan-500" />
              Course Settings
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Price */}
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1.5 flex items-center gap-1.5">
                  <LuDollarSign size={12} />
                  Price (INR)
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all"
                />
                {form.price === "0" && (
                  <span className="text-[10px] text-green-600 font-bold mt-1 inline-block">
                    ✓ Free course
                  </span>
                )}
              </div>

              {/* Level */}
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1.5 flex items-center gap-1.5">
                  <LuTrendingUp size={12} />
                  Level
                </label>
                <select
                  value={form.level}
                  onChange={(e) => setForm({ ...form, level: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 bg-white transition-all cursor-pointer"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>

              {/* Language */}
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1.5 flex items-center gap-1.5">
                  <LuGlobe size={12} />
                  Language
                </label>
                <select
                  value={showCustomLanguage ? "__other__" : form.language}
                  onChange={handleLanguageChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 bg-white transition-all cursor-pointer"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                  <option value="__other__">Other</option>
                </select>
                {showCustomLanguage && (
                  <input
                    value={customLanguage}
                    onChange={(e) => setCustomLanguage(e.target.value)}
                    placeholder="Enter language name"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 mt-2"
                  />
                )}
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1.5 flex items-center gap-1.5">
                  <LuTag size={12} />
                  Category
                </label>
                <select
                  value={showCustomCategory ? "__other__" : form.categoryId}
                  onChange={handleCategoryChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 bg-white transition-all cursor-pointer"
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                  <option value="__other__">+ Add new category</option>
                </select>
                {showCustomCategory && (
                  <input
                    value={customCategoryName}
                    onChange={(e) => setCustomCategoryName(e.target.value)}
                    placeholder="Enter category name"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 mt-2"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => navigate("/instructor/courses")}
              className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                createCourseMutation.isPending ||
                createCategoryMutation.isPending
              }
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {createCourseMutation.isPending ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  Create & Continue
                  <LuArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Step 2: Content */}
      {step === 2 && (
        <div className="space-y-4">
          {/* Content Stats Bar */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <LuLayers size={14} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-lg font-black text-gray-900">
                    {sections.length}
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium -mt-0.5">
                    Sections
                  </p>
                </div>
              </div>
              <div className="w-px h-8 bg-gray-100" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-cyan-50 rounded-lg flex items-center justify-center">
                  <LuVideo size={14} className="text-cyan-500" />
                </div>
                <div>
                  <p className="text-lg font-black text-gray-900">
                    {totalLectures}
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium -mt-0.5">
                    Lectures
                  </p>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs font-bold text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
            >
              <LuArrowLeft size={12} />
              Back to info
            </button>
          </div>

          {/* Empty state */}
          {sections.length === 0 && !showSectionInput && (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <LuLayers size={28} className="text-cyan-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Start building your curriculum
              </h3>
              <p className="text-sm text-gray-400 mb-6 max-w-sm mx-auto">
                Organize your course into sections and add lectures with video
                content
              </p>
              <button
                type="button"
                onClick={() => setShowSectionInput(true)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
              >
                <LuPlus size={16} />
                Add First Section
              </button>
            </div>
          )}

          {/* Sections List */}
          {sections.map((section, sIndex) => (
            <div
              key={section.id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-shadow hover:shadow-sm"
            >
              <button
                onClick={() =>
                  setExpandedSection(
                    expandedSection === section.id ? null : section.id,
                  )
                }
                className="w-full flex items-center justify-between p-5 hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <LuGripVertical size={14} className="text-gray-300" />
                    <span className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-black text-gray-500">
                      {sIndex + 1}
                    </span>
                  </div>
                  <span className="font-bold text-gray-800">
                    {section.title}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <span className="text-xs font-medium bg-gray-50 px-2.5 py-1 rounded-lg">
                    {section.lectures?.length || 0} lectures
                  </span>
                  {expandedSection === section.id ? (
                    <LuChevronUp size={16} />
                  ) : (
                    <LuChevronDown size={16} />
                  )}
                </div>
              </button>

              {expandedSection === section.id && (
                <div className="border-t border-gray-50 p-4 space-y-2">
                  {/* Lectures */}
                  {section.lectures?.map((l, lIndex) => (
                    <div
                      key={l.id}
                      className="flex items-center justify-between px-4 py-3 bg-gray-50/80 rounded-xl group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-gray-300 w-4">
                          {lIndex + 1}
                        </span>
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                            l.videoUrl
                              ? "bg-cyan-50 text-cyan-500"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {l.videoUrl ? (
                            <LuVideo size={13} />
                          ) : (
                            <LuFileText size={13} />
                          )}
                        </div>
                        <span className="text-sm text-gray-700 font-medium">
                          {l.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        {l.duration > 0 && (
                          <span className="text-[11px] text-gray-400 font-medium">
                            {Math.floor(l.duration / 60)}m {l.duration % 60}s
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            l.videoUrl
                              ? "text-green-600 bg-green-50"
                              : "text-gray-400 bg-gray-100"
                          }`}
                        >
                          {l.videoUrl ? (
                            <span className="flex items-center gap-1">
                              <LuCheck size={10} /> Uploaded
                            </span>
                          ) : (
                            "No video"
                          )}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Inline Lecture Add Form */}
                  {lectureFormSection === section.id ? (
                    <div className="bg-gradient-to-br from-cyan-50/40 to-blue-50/40 border border-cyan-100/60 rounded-xl p-5 mt-3 space-y-4">
                      <input
                        type="text"
                        value={lectureTitle}
                        onChange={(e) => setLectureTitle(e.target.value)}
                        placeholder="Enter lecture title"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 bg-white"
                        autoFocus
                      />

                      {/* Drag & drop video area */}
                      <div>
                        <label className="text-xs font-bold text-gray-500 mb-2 block">
                          Video File (optional)
                        </label>
                        {lectureFile ? (
                          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-cyan-50 rounded-lg flex items-center justify-center">
                                <LuVideo size={14} className="text-cyan-500" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                                  {lectureFile.name}
                                </p>
                                <p className="text-[10px] text-gray-400">
                                  {formatFileSize(lectureFile.size)}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setLectureFile(null);
                                if (fileInputRef.current)
                                  fileInputRef.current.value = "";
                              }}
                              className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <LuX size={14} />
                            </button>
                          </div>
                        ) : (
                          <div
                            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                              isDraggingLecture
                                ? "border-cyan-400 bg-cyan-50/30"
                                : "border-gray-200 hover:border-cyan-300 hover:bg-gray-50/50"
                            }`}
                            onDragOver={(e) => {
                              e.preventDefault();
                              setIsDraggingLecture(true);
                            }}
                            onDragLeave={() => setIsDraggingLecture(false)}
                            onDrop={handleLectureDrop}
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <LuUpload
                              size={20}
                              className="mx-auto mb-1.5 text-gray-300"
                            />
                            <p className="text-xs text-gray-400">
                              Drag & drop or{" "}
                              <span className="text-cyan-500 font-bold">
                                browse
                              </span>
                            </p>
                            <p className="text-[10px] text-gray-300 mt-0.5">
                              MP4, WebM, MOV
                            </p>
                          </div>
                        )}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="video/mp4,video/webm,video/quicktime"
                          onChange={(e) =>
                            setLectureFile(e.target.files[0] || null)
                          }
                          className="hidden"
                        />
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleAddLecture(section.id)}
                          disabled={createLectureMutation.isPending}
                          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:shadow-lg hover:shadow-cyan-500/20 transition-all disabled:opacity-50"
                        >
                          {createLectureMutation.isPending ? (
                            <>
                              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <LuPlus size={14} />
                              Add Lecture
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={resetLectureForm}
                          className="px-4 py-2 rounded-lg text-sm font-bold text-gray-500 hover:bg-white transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        resetLectureForm();
                        setLectureFormSection(section.id);
                        setExpandedSection(section.id);
                      }}
                      className="flex items-center gap-2 text-sm font-bold text-cyan-600 hover:text-cyan-700 mt-2 px-2 py-1.5 rounded-lg hover:bg-cyan-50/50 transition-all"
                    >
                      <LuPlus size={14} /> Add Lecture
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Add Section */}
          {showSectionInput ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
              <label className="text-xs font-bold text-gray-500 block">
                New Section Title
              </label>
              <input
                type="text"
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
                placeholder="e.g. Introduction, Getting Started, Advanced Topics..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSection();
                  }
                }}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleAddSection}
                  disabled={createSectionMutation.isPending}
                  className="flex items-center gap-2 bg-[#0f2c59] text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-[#1d4e89] transition-all disabled:opacity-50"
                >
                  {createSectionMutation.isPending ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <LuPlus size={14} />
                      Add Section
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowSectionInput(false);
                    setSectionTitle("");
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-bold text-gray-500 hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : sections.length > 0 ? (
            <button
              type="button"
              onClick={() => setShowSectionInput(true)}
              className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-600 px-5 py-3 rounded-xl font-bold text-sm transition-all w-full justify-center border border-dashed border-gray-200 hover:border-gray-300"
            >
              <LuPlus size={16} /> Add Section
            </button>
          ) : null}

          {/* Navigation */}
          {sections.length > 0 && (
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
              >
                Review & Publish
                <LuArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Review & Publish */}
      {step === 3 && (
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-br from-[#0f2c59] to-[#1d4e89] p-6 text-white">
              <h2 className="text-xl font-black mb-1">Course Summary</h2>
              <p className="text-white/60 text-sm">
                Review your course before publishing
              </p>
            </div>
            <div className="p-6 space-y-4">
              {/* Title & Description */}
              <div>
                <h3 className="text-xl font-black text-gray-900">
                  {form.title}
                </h3>
                {form.shortDescription && (
                  <p className="text-sm text-gray-500 mt-1">
                    {form.shortDescription}
                  </p>
                )}
              </div>

              <div className="h-px bg-gray-100" />

              {/* Meta Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-black text-gray-900">
                    {parseFloat(form.price) === 0 ? "Free" : `₹${form.price}`}
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium">Price</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-black text-gray-900">
                    {form.level}
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium">Level</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-black text-gray-900">
                    {sections.length}
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium">
                    Sections
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-black text-gray-900">
                    {totalLectures}
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium">
                    Lectures
                  </p>
                </div>
              </div>

              <div className="h-px bg-gray-100" />

              {/* Curriculum Preview */}
              <div>
                <h4 className="text-sm font-bold text-gray-700 mb-3">
                  Curriculum
                </h4>
                <div className="space-y-2">
                  {sections.map((s, i) => (
                    <div key={s.id} className="bg-gray-50 rounded-xl p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-800">
                          {i + 1}. {s.title}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium">
                          {s.lectures?.length || 0} lectures
                        </span>
                      </div>
                      {s.lectures?.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {s.lectures.map((l) => (
                            <div
                              key={l.id}
                              className="flex items-center gap-2 text-xs text-gray-500 pl-4"
                            >
                              <LuVideo size={10} className="text-cyan-400" />
                              {l.title}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
            >
              <LuArrowLeft size={14} />
              Edit Content
            </button>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate("/instructor/courses")}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={() => publishMutation.mutate(courseId)}
                disabled={publishMutation.isPending}
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-green-500/25 transition-all disabled:opacity-60"
              >
                {publishMutation.isPending ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <LuSparkles size={16} />
                    Publish Course
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
