import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LuCalendar,
  LuUser,
  LuArrowRight,
  LuClock,
  LuSearch,
} from "react-icons/lu";
import cmsApi from "@/api/cmsApi";
import { toast } from "react-toastify";
import { parseTags } from "@/utils/helpers";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await cmsApi.getBlogs({
          status: "Published",
          search,
          limit: 50,
        });

        // Debug: log full response
        console.log("Public Blogs API Response:", response);

        // Handle paginated response structure
        let blogsData = [];

        if (response && typeof response === "object") {
          // If response has 'data' property containing the blogs
          if (response.data && Array.isArray(response.data)) {
            blogsData = response.data;
            console.log("Published blogs found:", blogsData.length);
          }
          // If response is directly the array
          else if (Array.isArray(response)) {
            blogsData = response;
            console.log("Published blogs found (direct):", blogsData.length);
          }
        }

        setBlogs(blogsData);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        toast.error("Failed to load blog posts");
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchBlogs();
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="pt-[72px] bg-white min-h-screen">
      {/* Header Section */}
      <section className="py-24 md:py-32 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-50 via-white to-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-100/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        <div className="container mx-auto px-6 md:px-12 lg:px-20 relative z-10">
          <div className="max-w-3xl">
            <p className="text-xs font-black text-cyan-600 uppercase tracking-[0.3em] mb-6">
              Insights & Innovations
            </p>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight mb-8 leading-[0.9]">
              The Technavyug{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 italic">
                Journal
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-500 leading-relaxed max-w-2xl font-medium mb-12">
              Stay ahead with curated insights on full-stack development, cloud
              computing, and the future of engineering.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl group">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-cyan-600 transition-colors">
                <LuSearch size={20} />
              </div>
              <input
                type="text"
                placeholder="Search articles, tutorials, news..."
                className="w-full bg-white border-2 border-gray-100 rounded-2xl py-4 pl-14 pr-6 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/5 transition-all shadow-sm group-hover:shadow-md"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Blogs Grid */}
      <section className="pb-32 bg-white relative">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-100 aspect-video rounded-[2rem] mb-6" />
                  <div className="h-6 bg-gray-100 rounded-full w-3/4 mb-4" />
                  <div className="h-4 bg-gray-100 rounded-full w-full mb-2" />
                  <div className="h-4 bg-gray-100 rounded-full w-2/3" />
                </div>
              ))}
            </div>
          ) : blogs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {blogs.map((blog) => (
                <Link
                  key={blog.id}
                  to={`/blog/${blog.slug}`}
                  className="group flex flex-col h-full bg-white rounded-[2.5rem] border border-gray-50/50 hover:border-gray-100 hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] transition-all duration-500 overflow-hidden"
                >
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img
                      src={
                        blog.coverImage ||
                        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800"
                      }
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-6 left-6 flex gap-2">
                      {parseTags(blog.tags)
                        .slice(0, 2)
                        .map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-cyan-700 shadow-sm"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                      <span className="flex items-center gap-1.5 border-r border-gray-100 pr-4">
                        <LuCalendar size={13} className="text-cyan-500" />{" "}
                        {new Date(
                          blog.publishedAt || blog.createdAt,
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <LuClock size={13} className="text-cyan-500" />{" "}
                        {Math.ceil(blog.content.length / 1000) + 1} min
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-4 group-hover:text-cyan-600 transition-colors leading-[1.3]">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-8 line-clamp-2">
                      {blog.excerpt ||
                        "Dive deep into our latest technical exploration and discover new possibilities..."}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 font-bold text-xs uppercase">
                          {blog.author?.name?.charAt(0) || "T"}
                        </div>
                        <span className="text-xs font-bold text-gray-900">
                          {blog.author?.name || "Technavyug"}
                        </span>
                      </div>
                      <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-cyan-600 group-hover:text-white group-hover:border-cyan-600 transition-all duration-300">
                        <LuArrowRight size={18} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="max-w-xl mx-auto text-center py-32 bg-slate-50/50 rounded-[3rem] border border-dashed border-gray-200 px-10">
              <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-cyan-500/5 transition-transform hover:scale-110">
                <LuSearch className="text-cyan-600 text-3xl" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">
                No articles matches
              </h3>
              <p className="text-gray-500 text-lg leading-relaxed mb-10">
                We couldn't find any articles matching your current search. Try
                different keywords or browse our topics.
              </p>
              <button
                onClick={() => setSearch("")}
                className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-cyan-600 transition-all shadow-lg hover:shadow-cyan-500/20 active:scale-95"
              >
                View all articles
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
