import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { instructorService } from "@/services/instructor.services";
import { adminService } from "@/services/admin.services";
import { studentService } from "@/services/student.services";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { LuSave, LuArrowLeft } from "react-icons/lu";

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

export default function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    title: "",
    description: "",
    shortDescription: "",
    price: "0",
    level: "Beginner",
    language: "English",
    categoryId: "",
    status: "Draft",
  });
  const [showCustomLanguage, setShowCustomLanguage] = useState(false);
  const [customLanguage, setCustomLanguage] = useState("");

  // Fetch course data
  const { data: courseData, isLoading } = useQuery({
    queryKey: ["course-edit", id],
    queryFn: () => studentService.getCourseBySlug(id),
    enabled: !!id,
  });

  // Fetch categories
  const { data: catData } = useQuery({
    queryKey: ["categories"],
    queryFn: adminService.getCategories,
  });
  const categories = catData?.data || [];

  // Prefill form when course data loads
  useEffect(() => {
    if (courseData?.data) {
      const c = courseData.data;
      const lang = c.language || "English";
      const isCustomLang = !LANGUAGES.includes(lang);

      setForm((prev) => ({
        ...prev,
        title: c.title || "",
        description: c.description || "",
        shortDescription: c.shortDescription || "",
        price: c.price || "0",
        level: c.level || "Beginner",
        language: isCustomLang ? "" : lang,
        categoryId: c.categoryId || "",
        status: c.status || "Draft",
      }));

      if (isCustomLang) {
        setShowCustomLanguage(true);
        setCustomLanguage(lang);
      }
    }
  }, [courseData]);

  const updateMutation = useMutation({
    mutationFn: (data) => instructorService.updateCourse(id, data),
    onSuccess: () => {
      toast.success("Course updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["instructor-courses"] });
      navigate("/instructor/courses");
    },
    onError: (e) => toast.error(e?.userMessage || "Failed to update course"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const language =
      showCustomLanguage && customLanguage.trim()
        ? customLanguage.trim()
        : form.language;

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <button
          onClick={() => navigate("/instructor/courses")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
        >
          <LuArrowLeft size={16} /> Back to My Courses
        </button>
        <h1 className="text-3xl font-black text-gray-900">Edit Course</h1>
        <p className="text-gray-500 mt-1">Update your course details</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-gray-100 p-8 max-w-2xl space-y-5"
      >
        <div>
          <label className="text-sm font-bold text-gray-700 mb-2 block">
            Course Title *
          </label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>
        <div>
          <label className="text-sm font-bold text-gray-700 mb-2 block">
            Short Description
          </label>
          <input
            value={form.shortDescription}
            onChange={(e) =>
              setForm({ ...form, shortDescription: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>
        <div>
          <label className="text-sm font-bold text-gray-700 mb-2 block">
            Description
          </label>
          <textarea
            rows={5}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 block">
              Price (INR)
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 block">
              Level
            </label>
            <select
              value={form.level}
              onChange={(e) => setForm({ ...form, level: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-cyan-400 bg-white"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 block">
              Language
            </label>
            <select
              value={showCustomLanguage ? "__other__" : form.language}
              onChange={handleLanguageChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-cyan-400 bg-white"
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
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-cyan-400 mt-2"
              />
            )}
          </div>
          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 block">
              Category
            </label>
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-cyan-400 bg-white"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="text-sm font-bold text-gray-700 mb-2 block">
            Status
          </label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-cyan-400 bg-white"
          >
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="bg-[#0f2c59] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#1d4e89] transition-all disabled:opacity-60 mt-2 flex items-center gap-2"
        >
          <LuSave size={16} />
          {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
