import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  LuArrowLeft,
  LuSave,
  LuImage,
  LuTag,
  LuTrash,
  LuPlus,
  LuEye,
  LuX,
  LuFileImage,
} from "react-icons/lu";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TipTapLink from "@tiptap/extension-link";
import cmsApi from "@/api/cmsApi";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import { parseTags } from "@/utils/helpers";
import Placeholder from '@tiptap/extension-placeholder';

// TipTap Toolbar Component
// eslint-disable-next-line no-unused-vars
function ToolBar({ editor, _onImageUpload }) {
  if (!editor) return null;

  const handleImageClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          const response = await cmsApi.uploadBlogImage(file);
          editor.chain().focus().setImage({ src: response.data.url }).run();
          // eslint-disable-next-line no-unused-vars
        } catch (_error) {
          toast.error("Failed to upload image");
        }
      }
    };
    input.click();
  };

  return (
    <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-t-2xl border-b border-gray-100 flex flex-wrap gap-2">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`px-3 py-2 rounded-lg font-bold text-sm transition-all ${
          editor.isActive("bold")
            ? "bg-cyan-600 text-white"
            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
        }`}
      >
        B
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`px-3 py-2 rounded-lg font-bold text-sm italic transition-all ${
          editor.isActive("italic")
            ? "bg-cyan-600 text-white"
            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
        }`}
      >
        I
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`px-3 py-2 rounded-lg font-bold text-sm transition-all ${
          editor.isActive("heading", { level: 1 })
            ? "bg-cyan-600 text-white"
            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
        }`}
      >
        H1
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-3 py-2 rounded-lg font-bold text-sm transition-all ${
          editor.isActive("heading", { level: 2 })
            ? "bg-cyan-600 text-white"
            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
        }`}
      >
        H2
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-3 py-2 rounded-lg font-bold text-sm transition-all ${
          editor.isActive("bulletList")
            ? "bg-cyan-600 text-white"
            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
        }`}
      >
        List
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`px-3 py-2 rounded-lg font-bold text-sm transition-all ${
          editor.isActive("orderedList")
            ? "bg-cyan-600 text-white"
            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
        }`}
      >
        Ordered
      </button>

      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`px-3 py-2 rounded-lg font-bold text-sm transition-all ${
          editor.isActive("codeBlock")
            ? "bg-cyan-600 text-white"
            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
        }`}
      >
        Code
      </button>

      <button
        onClick={handleImageClick}
        className="px-3 py-2 rounded-lg font-bold text-sm bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 transition-all flex items-center gap-2"
      >
        <LuImage size={16} /> Image
      </button>

      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="px-3 py-2 rounded-lg font-bold text-sm bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 transition-all"
      >
        HR
      </button>
    </div>
  );
}

// Blog Preview Modal Component
function BlogPreviewModal({ isOpen, onClose, blog }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-cyan-50 to-blue-50 px-8 py-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-2xl font-black text-gray-900">Blog Preview</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200/50 rounded-lg transition-colors"
          >
            <LuX size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {blog.coverImage && (
            <div className="mb-8 rounded-2xl overflow-hidden aspect-video">
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <h1 className="text-4xl font-black text-gray-900 mb-4 leading-[1.2]">
            {blog.title}
          </h1>

          {parseTags(blog.tags).length > 0 && (
            <div className="flex gap-2 mb-6 flex-wrap">
              {parseTags(blog.tags).map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-block bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-xs font-bold"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {blog.excerpt && (
            <p className="text-lg text-gray-600 italic mb-8 leading-relaxed">
              {blog.excerpt}
            </p>
          )}

          <div className="prose prose-lg max-w-none">
            {/* Render markdown content */}
            {/* eslint-disable no-unused-vars */}
            <ReactMarkdown
              components={{
                h1: ({ _node, ...props }) => (
                  <h1
                    className="text-3xl font-black text-gray-900 mt-8 mb-4"
                    {...props}
                  />
                ),
                h2: ({ _node, ...props }) => (
                  <h2
                    className="text-2xl font-bold text-gray-900 mt-6 mb-3"
                    {...props}
                  />
                ),
                h3: ({ _node, ...props }) => (
                  <h3
                    className="text-xl font-bold text-gray-900 mt-4 mb-2"
                    {...props}
                  />
                ),
                p: ({ _node, ...props }) => (
                  <p
                    className="text-gray-700 leading-relaxed mb-4"
                    {...props}
                  />
                ),
                ul: ({ _node, ...props }) => (
                  <ul
                    className="list-disc list-inside mb-4 text-gray-700"
                    {...props}
                  />
                ),
                ol: ({ _node, ...props }) => (
                  <ol
                    className="list-decimal list-inside mb-4 text-gray-700"
                    {...props}
                  />
                ),
                li: ({ _node, ...props }) => (
                  <li className="ml-2 mb-2" {...props} />
                ),
                code: ({ _node, inline, ...props }) =>
                  inline ? (
                    <code
                      className="bg-gray-100 px-2 py-1 rounded text-sm font-mono"
                      {...props}
                    />
                  ) : (
                    <code
                      className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4 font-mono text-sm"
                      {...props}
                    />
                  ),
                a: ({ _node, ...props }) => (
                  <a className="text-cyan-600 hover:underline" {...props} />
                ),
                img: ({ _node, ...props }) => (
                  <img className="rounded-lg my-4 max-w-full" {...props} />
                ),
              }}
            >
              {blog.content}
            </ReactMarkdown>
            {/* eslint-enable no-unused-vars */}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main BlogEditor Component
export default function BlogEditor() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);
  const [coverImageUploading, setCoverImageUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    coverImage: "",
    status: "Draft",
    tags: [],
  });

  const [tagInput, setTagInput] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full rounded-lg",
        },
      }),
      TipTapLink.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
      placeholder: "Start writing your amazing article...",
      showOnlyCurrent: false,  
    }),
    ],
    content: formData.content || "<p></p>",
    onUpdate: ({ editor }) => {
      setFormData({ ...formData, content: editor.getHTML() });
    },
  });

  useEffect(() => {
    if (isEdit) {
      const fetchBlog = async () => {
        try {
          const response = await cmsApi.getBlog(id);
          const blog = response.data;
          setFormData({
            title: blog.title || "",
            excerpt: blog.excerpt || "",
            content: blog.content || "",
            coverImage: blog.coverImage || "",
            status: blog.status || "Draft",
            tags: parseTags(blog.tags),
          });
          if (editor) {
            editor.commands.setContent(blog.content || "");
          }
        } catch (_error) {
          console.error("Error fetching blog:", _error);
          toast.error("Failed to load blog for editing");
          navigate("/admin/cms/blogs");
        } finally {
          setLoading(false);
        }
      };
      fetchBlog();
    }
  }, [id, isEdit, navigate, editor]);

  const handleCoverImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setCoverImageUploading(true);
      const response = await cmsApi.uploadBlogImage(file);
      setFormData({ ...formData, coverImage: response.data.url });
      toast.success("Cover image uploaded successfully");
      // eslint-disable-next-line no-unused-vars
    } catch (_error) {
      toast.error("Failed to upload cover image");
    } finally {
      setCoverImageUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.warning("Title and content are required");
      return;
    }

    try {
      setSaving(true);
      if (isEdit) {
        await cmsApi.updateBlog(id, formData);
        toast.success("Blog updated successfully");
      } else {
        await cmsApi.createBlog(formData);
        toast.success("Blog published successfully");
      }
      navigate("/admin/cms/blogs");
    } catch (error) {
      console.error("Error saving blog:", error);
      toast.error(error.response?.data?.message || "Failed to save blog");
    } finally {
      setSaving(false);
    }
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-cyan-100 border-t-cyan-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 font-medium italic animate-pulse">
          Loading editor...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-in fade-in duration-500">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/cms/blogs"
            className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-cyan-600 hover:border-cyan-100 hover:shadow-sm transition-all"
          >
            <LuArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              {isEdit ? "Edit Article" : "Create Article"}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Craft compelling content for your audience
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-3 rounded-xl font-bold hover:bg-blue-100 transition-all border border-blue-200"
          >
            <LuEye size={18} /> Preview
          </button>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            className={`px-4 py-3 rounded-xl border text-sm font-bold focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all shadow-sm ${
              formData.status === "Published"
                ? "text-green-600 bg-green-50 border-green-200"
                : "text-amber-600 bg-amber-50 border-amber-200"
            }`}
          >
            <option value="Draft">Save as Draft</option>
            <option value="Published">Publish Now</option>
          </select>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-cyan-600 transition-all shadow-xl hover:shadow-cyan-500/20 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <LuSave size={20} />
            )}
            {isEdit ? "Update" : "Publish"}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">
              Article Title
            </label>
            <input
              type="text"
              placeholder="Enter an eye-catching headline..."
              className="w-full text-4xl font-black text-gray-900 placeholder:text-gray-200 border-none bg-transparent p-3 focus:ring-0"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          {/* Excerpt */}
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">
              Excerpt / Summary
            </label>
            <textarea
              placeholder="A brief summary that captures the essence..."
              rows={2}
              className="w-full text-lg text-gray-700 placeholder:text-gray-200 border-none bg-transparent p-3 focus:ring-0 resize-none leading-relaxed"
              value={formData.excerpt}
              onChange={(e) =>
                setFormData({ ...formData, excerpt: e.target.value })
              }
            />
          </div>

          {/* Rich Text Editor */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-slate-50 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-600 rounded-full"></div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Article Content
                </label>
              </div>
              <button
                onClick={() => setShowMarkdownPreview(!showMarkdownPreview)}
                className="text-xs font-bold text-cyan-600 hover:text-cyan-700 uppercase tracking-wider"
              >
                {showMarkdownPreview ? "Hide" : "Show"} Markdown Preview
              </button>
            </div>
            <ToolBar editor={editor} />
            {showMarkdownPreview ? (
              <div className="grid grid-cols-2 gap-4 p-6">
                {/* Editor */}
                <div className="border-r border-gray-100">
                  <EditorContent
                    editor={editor}
                    className="prose prose-sm max-w-none focus:outline-none"
                  />
                </div>
                {/* Preview */}
                <div className="overflow-y-auto max-h-[500px] pr-4">
                  <div className="prose prose-sm max-w-none">
                    <h3 className="font-bold text-gray-900 mb-4">
                      Markdown Preview
                    </h3>
                    {/* eslint-disable no-unused-vars */}
                    <ReactMarkdown
                      components={{
                        h1: ({ _node, ...props }) => (
                          <h1
                            className="text-2xl font-bold mb-2 mt-4"
                            {...props}
                          />
                        ),
                        h2: ({ _node, ...props }) => (
                          <h2
                            className="text-xl font-bold mb-2 mt-3"
                            {...props}
                          />
                        ),
                        p: ({ _node, ...props }) => (
                          <p className="mb-2 text-gray-700" {...props} />
                        ),
                        ul: ({ _node, ...props }) => (
                          <ul
                            className="list-disc list-inside mb-2 ml-4"
                            {...props}
                          />
                        ),
                        ol: ({ _node, ...props }) => (
                          <ol
                            className="list-decimal list-inside mb-2 ml-4"
                            {...props}
                          />
                        ),
                        code: ({ _node, inline, ...props }) =>
                          inline ? (
                            <code
                              className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono"
                              {...props}
                            />
                          ) : (
                            <code
                              className="block bg-gray-900 text-gray-100 p-2 rounded text-xs font-mono overflow-x-auto mb-2"
                              {...props}
                            />
                          ),
                      }}
                    >
                      {formData.content}
                    </ReactMarkdown>
                    {/* eslint-enable no-unused-vars */}
                  </div>
                </div>
              </div>
            ) : (
              <EditorContent
                editor={editor}
                className="prose prose-sm max-w-none p-6 focus:outline-none min-h-[500px]"
              />
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Cover Image */}
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
            <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">
              <LuFileImage size={14} /> Cover Image
            </label>
            <div
              className={`aspect-video rounded-2xl overflow-hidden bg-slate-50 border-2 transition-all cursor-pointer flex items-center justify-center relative group ${
                formData.coverImage
                  ? "border-solid border-cyan-100"
                  : "border-dashed border-gray-200 hover:border-cyan-300 hover:bg-cyan-50/30"
              }`}
            >
              {formData.coverImage ? (
                <>
                  <img
                    src={formData.coverImage}
                    alt="Cover Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex gap-2 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <label className="p-3 bg-cyan-500 text-white rounded-full hover:bg-cyan-600 transition-colors cursor-pointer">
                      <LuImage size={20} />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverImageUpload}
                        disabled={coverImageUploading}
                        className="hidden"
                      />
                    </label>
                    <button
                      onClick={() =>
                        setFormData({ ...formData, coverImage: "" })
                      }
                      className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <LuTrash size={20} />
                    </button>
                  </div>
                </>
              ) : (
                <label className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center cursor-pointer">
                  <LuImage className="text-gray-300 mb-2" size={40} />
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                    {coverImageUploading ? "Uploading..." : "Click to upload"}
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageUpload}
                    disabled={coverImageUploading}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <p className="text-[10px] text-gray-400 mt-3 px-1 leading-tight">
              16:9 aspect ratio recommended • Max 10MB
            </p>
          </div>

          {/* Tags */}
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
            <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">
              <LuTag size={14} /> Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-50 text-cyan-700 text-[10px] font-black uppercase tracking-wider rounded-lg border border-cyan-200 hover:border-cyan-300"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:text-red-500 transition-colors ml-1"
                  >
                    <LuX size={12} />
                  </button>
                </span>
              ))}
              {formData.tags.length === 0 && (
                <p className="text-[10px] text-gray-300 italic py-2 w-full">
                  No tags yet. Add them to improve discoverability.
                </p>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Press Enter to add..."
                className="w-full bg-slate-50 border border-gray-100 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
              />
              <LuPlus
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300"
                size={16}
              />
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-[2rem] text-white shadow-lg">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300 mb-4">
              Article Stats
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase">
                  Word Count
                </span>
                <span className="text-lg font-black text-cyan-300">
                  {
                    formData.content
                      .replace(/<[^>]*>/g, "")
                      .trim()
                      .split(/\s+/)
                      .filter(Boolean).length
                  }
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase">
                  Tags
                </span>
                <span className="text-lg font-black text-cyan-300">
                  {formData.tags.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase">
                  Status
                </span>
                <span
                  className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${
                    formData.status === "Published"
                      ? "bg-green-500/20 text-green-300"
                      : "bg-amber-500/20 text-amber-300"
                  }`}
                >
                  {formData.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <BlogPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        blog={formData}
      />
    </div>
  );
}
