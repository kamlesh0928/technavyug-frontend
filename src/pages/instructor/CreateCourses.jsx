import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
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
} from "react-icons/lu";

export default function CreateCourse() {
  const navigate = useNavigate();
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
  });
  const [expandedSection, setExpandedSection] = useState(null);

  const { data: catData } = useQuery({
    queryKey: ["categories"],
    queryFn: adminService.getCategories,
  });
  const categories = catData?.data || [];

  // Create Course
  const createCourseMutation = useMutation({
    mutationFn: instructorService.createCourse,
    onSuccess: (data) => {
      setCourseId(data.data.id);
      toast.success("Course created!");
      setStep(2);
    },
    onError: (e) => toast.error(e?.userMessage || "Failed to create course"),
  });

  // Create Section
  const createSectionMutation = useMutation({
    mutationFn: ({ courseId, data }) =>
      instructorService.createSection(courseId, data),
    onSuccess: (data) => {
      setSections((prev) => [...prev, { ...data.data, lectures: [] }]);
      toast.success("Section added!");
    },
    onError: (e) => toast.error(e?.userMessage || "Failed to create section"),
  });

  // Create Lecture (with video upload)
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
    },
    onError: (e) => toast.error(e?.userMessage || "Failed to create lecture"),
  });

  const handleCreateCourse = (e) => {
    e.preventDefault();
    createCourseMutation.mutate(form);
  };

  const handleAddSection = () => {
    const title = prompt("Enter section title:");
    if (title) createSectionMutation.mutate({ courseId, data: { title } });
  };

  const handleAddLecture = (sectionId) => {
    const title = prompt("Enter lecture title:");
    if (!title) return;

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "video/mp4,video/webm,video/quicktime";
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("type", "Video");
        formData.append("video", file);
        createLectureMutation.mutate({ sectionId, data: formData });
      }
    };
    fileInput.click();
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">Create Course</h1>
        <p className="text-gray-500 mt-1">
          {step === 1
            ? "Fill in course details"
            : "Add sections and lectures with video uploads"}
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-4 mb-8">
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${step === 1 ? "bg-[#0f2c59] text-white" : "bg-gray-100 text-gray-500"}`}
        >
          1. Course Info
        </div>
        <div className="w-8 h-px bg-gray-200" />
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${step === 2 ? "bg-[#0f2c59] text-white" : "bg-gray-100 text-gray-500"}`}
        >
          2. Content
        </div>
      </div>

      {step === 1 ? (
        <form
          onSubmit={handleCreateCourse}
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
              placeholder="e.g. Full-Stack Web Development"
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
              placeholder="Brief one-liner"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 block">
              Description
            </label>
            <textarea
              rows={5}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
              placeholder="Detailed course description..."
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
              <input
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 mb-2 block">
                Category
              </label>
              <select
                value={form.categoryId}
                onChange={(e) =>
                  setForm({ ...form, categoryId: e.target.value })
                }
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
          <button
            type="submit"
            disabled={createCourseMutation.isPending}
            className="bg-[#0f2c59] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#1d4e89] transition-all disabled:opacity-60 mt-2"
          >
            {createCourseMutation.isPending
              ? "Creating..."
              : "Create & Continue"}
          </button>
        </form>
      ) : (
        <div className="max-w-2xl space-y-4">
          {sections.map((section) => (
            <div
              key={section.id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() =>
                  setExpandedSection(
                    expandedSection === section.id ? null : section.id,
                  )
                }
                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
              >
                <span className="font-bold text-gray-800">{section.title}</span>
                <div className="flex items-center gap-2 text-gray-400">
                  <span className="text-xs">
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
                  {section.lectures?.map((l) => (
                    <div
                      key={l.id}
                      className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm text-gray-700">{l.title}</span>
                      <span className="text-xs text-gray-400">
                        {l.videoUrl ? "Video uploaded" : "No video"}
                      </span>
                    </div>
                  ))}
                  <button
                    onClick={() => handleAddLecture(section.id)}
                    disabled={createLectureMutation.isPending}
                    className="flex items-center gap-2 text-sm font-bold text-cyan-600 hover:text-cyan-700 mt-2 disabled:opacity-50"
                  >
                    <LuUpload size={14} />{" "}
                    {createLectureMutation.isPending
                      ? "Uploading..."
                      : "Add Lecture with Video"}
                  </button>
                </div>
              )}
            </div>
          ))}

          <button
            onClick={handleAddSection}
            disabled={createSectionMutation.isPending}
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-5 py-3 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all w-full justify-center disabled:opacity-50"
          >
            <LuPlus size={16} />{" "}
            {createSectionMutation.isPending ? "Adding..." : "Add Section"}
          </button>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => navigate("/instructor/courses")}
              className="bg-[#0f2c59] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#1d4e89] transition-all"
            >
              Finish
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
