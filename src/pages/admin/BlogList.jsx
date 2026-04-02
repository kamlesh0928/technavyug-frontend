import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LuPlus,
  LuSearch,
  LuFilter,
  LuPencil,
  LuTrash,
  LuEye,
  LuLayoutGrid,
  LuList,
  LuCircleCheck,
  LuFilePenLine,
} from "react-icons/lu";
import cmsApi from "@/api/cmsApi";
import { toast } from "react-toastify";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("table");

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await cmsApi.getBlogs({ search, limit: 50 });

      // Debug: log full response
      console.log("API Response:", response);

      // Handle paginated response structure - response is the full body from axios
      // It should have { data: [], pagination: {...} } structure
      let blogsData = [];

      if (response && typeof response === "object") {
        // If response has 'data' property containing the blogs
        if (response.data && Array.isArray(response.data)) {
          blogsData = response.data;
          console.log("Blogs found (from response.data):", blogsData.length);
        }
        // If response is directly the array
        else if (Array.isArray(response)) {
          blogsData = response;
          console.log("Blogs found (direct array):", blogsData.length);
        }
        // If nothing found
        else {
          console.log("Response structure:", Object.keys(response));
          console.warn("Unexpected response structure");
        }
      }

      setBlogs(blogsData);
      console.log("Blogs state updated, count:", blogsData.length);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      console.error("Error details:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      toast.error(
        "Failed to load blogs: " +
          (error.response?.data?.message || error.message),
      );
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBlogs();
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this blog? This action cannot be undone.",
      )
    )
      return;
    try {
      await cmsApi.deleteBlog(id);
      toast.success("Blog deleted successfully");
      fetchBlogs();
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("Failed to delete blog");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Blog Management
          </h1>
          <p className="text-gray-500 mt-1">
            Create, edit, and curate your platform's articles
          </p>
        </div>
        <Link
          to="/admin/cms/blogs/new"
          className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-cyan-600 transition-all shadow-lg hover:shadow-cyan-500/20 active:scale-95"
        >
          <LuPlus size={20} /> Write New Article
        </Link>
      </div>

      {/* Filters & Actions */}
      <div className="bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96 group">
          <LuSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-600 transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Search articles by title..."
            className="w-full bg-slate-50 border-none rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-cyan-500/20 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setView("table")}
              className={`p-2 rounded-lg transition-all ${view === "table" ? "bg-white text-cyan-600 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
            >
              <LuList size={20} />
            </button>
            <button
              onClick={() => setView("grid")}
              className={`p-2 rounded-lg transition-all ${view === "grid" ? "bg-white text-cyan-600 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
            >
              <LuLayoutGrid size={20} />
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-600 hover:bg-white hover:shadow-sm transition-all">
            <LuFilter size={16} /> Filters
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-gray-100 border-dashed">
          <div className="w-12 h-12 border-4 border-cyan-100 border-t-cyan-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium italic">
            Scanning archives...
          </p>
        </div>
      ) : blogs.length > 0 ? (
        view === "table" ? (
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-gray-100">
                    <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">
                      Article
                    </th>
                    <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">
                      Author
                    </th>
                    <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">
                      Status
                    </th>
                    <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {blogs.map((blog) => (
                    <tr
                      key={blog.id}
                      className="hover:bg-slate-50/30 transition-colors group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-gray-100">
                            <img
                              src={
                                blog.coverImage ||
                                "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=200"
                              }
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 line-clamp-1 group-hover:text-cyan-600 transition-colors">
                              {blog.title}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(blog.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-cyan-100 flex items-center justify-center text-[10px] font-black text-cyan-700 uppercase">
                            {blog.author?.name?.charAt(0) || "T"}
                          </div>
                          <span className="text-sm font-medium text-gray-600">
                            {blog.author?.name || "Technavyug"}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            blog.status === "Published"
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : "bg-amber-100 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {blog.status === "Published" ? (
                            <LuCircleCheck size={10} />
                          ) : (
                            <LuFilePenLine size={10} />
                          )}
                          {blog.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/blog/${blog.slug}`}
                            target="_blank"
                            className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all"
                            title="View Public"
                          >
                            <LuEye size={18} />
                          </Link>
                          <Link
                            to={`/admin/cms/blogs/edit/${blog.id}`}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Edit"
                          >
                            <LuPencil size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(blog.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete"
                          >
                            <LuTrash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className="aspect-video relative">
                  <img
                    src={
                      blog.coverImage ||
                      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800"
                    }
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 ring-4 ring-white/10 rounded-full">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-sm border ${
                        blog.status === "Published"
                          ? "bg-green-500/90 text-white border-green-400"
                          : "bg-amber-500/90 text-white border-amber-400"
                      }`}
                    >
                      {blog.status}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-cyan-600 transition-colors h-12 leading-tight">
                    {blog.title}
                  </h3>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-[8px] font-black text-gray-400 uppercase tracking-tighter">
                        {blog.author?.name?.charAt(0) || "T"}
                      </div>
                      <span className="text-[11px] font-bold text-gray-500 truncate max-w-[100px] uppercase tracking-wider">
                        {blog.author?.name || "Technavyug"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Link
                        to={`/admin/cms/blogs/edit/${blog.id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <LuPencil size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <LuTrash size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-dashed border-gray-200">
          <div className="w-20 h-20 bg-slate-50 flex items-center justify-center rounded-[1.5rem] mb-6 mb-8">
            <LuFilePenLine className="text-gray-300" size={40} />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-2">
            No articles found
          </h3>
          <p className="text-gray-500 max-w-sm text-center mb-8">
            {search
              ? "No matches for your search. Try different keywords."
              : "You haven't written any articles yet. Let's start sharing your knowledge!"}
          </p>
          {search ? (
            <button
              onClick={() => setSearch("")}
              className="text-cyan-600 font-black uppercase tracking-widest text-sm hover:underline"
            >
              Clear Search
            </button>
          ) : (
            <Link
              to="/admin/cms/blogs/new"
              className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-cyan-600 transition-all shadow-lg active:scale-95 flex items-center gap-2"
            >
              <LuPlus size={20} /> Create Your First Blog
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
