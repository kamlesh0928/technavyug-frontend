import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  LuCalendar,
  LuUser,
  LuArrowLeft,
  LuTag,
  LuClock,
} from "react-icons/lu";
import cmsApi from "@/api/cmsApi";
import { toast } from "react-toastify";
import { parseTags } from "@/utils/helpers";

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await cmsApi.getBlog(slug);
        setBlog(response.data);
      } catch (error) {
        console.error("Error fetching blog:", error);
        toast.error(error.userMessage || "Failed to load blog post");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(8,145,178,0.2)]"></div>
        <p className="text-gray-500 font-medium animate-pulse">
          Loading story...
        </p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="pt-32 pb-20 container mx-auto px-6 text-center">
        <h2 className="text-3xl font-black text-gray-900 mb-4">
          Blog not found
        </h2>
        <p className="text-gray-500 mb-8">
          The article you're looking for might have been moved or deleted.
        </p>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-cyan-600 font-bold hover:text-cyan-700 transition-colors uppercase tracking-widest text-sm"
        >
          <LuArrowLeft size={18} /> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-[72px] bg-white">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-white z-0" />
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-br from-cyan-50/50 to-transparent z-0" />

        <div className="container mx-auto px-6 md:px-12 lg:px-20 relative z-10">
          <div className="max-w-4xl mx-auto">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-gray-400 font-bold hover:text-cyan-600 transition-all mb-8 group"
            >
              <span className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center group-hover:border-cyan-200 group-hover:shadow-sm transition-all">
                <LuArrowLeft size={16} />
              </span>
              <span className="text-xs uppercase tracking-widest">
                Back to Blog
              </span>
            </Link>

            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {parseTags(blog.tags).map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-cyan-100/50 text-cyan-700 text-[10px] font-black uppercase tracking-wider rounded-full border border-cyan-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-[1.1] tracking-tight">
                {blog.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-gray-100/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/20">
                    {blog.author?.avatar ? (
                      <img
                        src={blog.author.avatar}
                        alt={blog.author.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      blog.author?.name?.charAt(0) || "T"
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 leading-none">
                      {blog.author?.name || "Technavyug Team"}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
                      Author
                    </p>
                  </div>
                </div>

                <div className="h-8 w-px bg-gray-100 hidden sm:block" />

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <LuCalendar size={14} className="text-cyan-500" />
                    <span>
                      {new Date(
                        blog.publishedAt || blog.createdAt,
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <LuClock size={14} className="text-cyan-500" />
                    <span>
                      {Math.ceil(blog.content.length / 1000) + 2} min read
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {blog.coverImage && (
        <section className="container mx-auto px-6 md:px-12 lg:px-20 -mt-10 mb-20 relative z-20">
          <div className="max-w-5xl mx-auto">
            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-gray-900/10 border-8 border-white aspect-[21/9]">
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
              />
            </div>
          </div>
        </section>
      )}

      {/* Content Section */}
      <section className="pb-32">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="max-w-3xl mx-auto">
            {blog.excerpt && (
              <div className="mb-12">
                <p className="text-xl md:text-2xl font-medium text-gray-600 leading-relaxed italic border-l-4 border-cyan-500 pl-8">
                  "{blog.excerpt}"
                </p>
              </div>
            )}

            <div
              className="prose prose-lg prose-cyan max-w-none 
                prose-headings:text-gray-900 prose-headings:font-black prose-headings:tracking-tight
                prose-p:text-gray-600 prose-p:leading-[1.8] prose-p:text-[1.1rem]
                prose-strong:text-gray-900 prose-strong:font-bold
                prose-a:text-cyan-600 prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-3xl prose-img:shadow-xl
                prose-blockquote:border-cyan-500 prose-blockquote:bg-slate-50 prose-blockquote:py-2 prose-blockquote:px-8 prose-blockquote:rounded-r-2xl
              "
              dangerouslySetInnerHTML={{
                __html: blog.content.replace(/\n/g, "<br />"),
              }}
            />

            {/* Author Bio Footer */}
            <div className="mt-24 p-10 bg-slate-50 rounded-[2rem] border border-gray-100 flex flex-col md:flex-row items-center gap-8 shadow-sm">
              <div className="w-24 h-24 rounded-[1.5rem] bg-white p-1 shadow-md shrink-0">
                <div className="w-full h-full bg-gradient-to-br from-cyan-100 to-blue-100 rounded-[1.2rem] flex items-center justify-center overflow-hidden">
                  {blog.author?.avatar ? (
                    <img
                      src={blog.author.avatar}
                      alt={blog.author.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-black text-cyan-600">
                      {blog.author?.name?.charAt(0) || "T"}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-center md:text-left">
                <h4 className="text-lg font-black text-gray-900 mb-2">
                  Written by {blog.author?.name || "Technavyug Team"}
                </h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {blog.author?.bio ||
                    "Expert developers and educators at Technavyug, dedicated to pushing the boundaries of technology and learning."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
