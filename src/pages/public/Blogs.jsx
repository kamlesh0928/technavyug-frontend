import { LuCalendar, LuUser } from "react-icons/lu";

export default function Blogs() {
  const blogs = [
    {
      id: 1,
      title: "Why Full-Stack Development is the Future",
      excerpt: "Explore why full-stack developers are in high demand and how to become one in 2026.",
      author: "Technavyug Team",
      date: "Mar 10, 2026",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=800",
    },
    {
      id: 2,
      title: "Top 10 Programming Languages to Learn",
      excerpt: "A comprehensive guide to the most in-demand programming languages this year.",
      author: "Technavyug Team",
      date: "Mar 5, 2026",
      image: "https://images.unsplash.com/photo-1515879218367-8466d910adbf?q=80&w=800",
    },
    {
      id: 3,
      title: "How to Build a Career in Cloud Computing",
      excerpt: "Cloud computing is transforming industries. Here is how you can get started.",
      author: "Technavyug Team",
      date: "Feb 28, 2026",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800",
    },
  ];

  return (
    <div className="pt-[72px]">
      <section className="py-20 md:py-28 bg-gradient-to-br from-slate-50 via-white to-cyan-50/30">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-xs font-bold text-cyan-600 uppercase tracking-widest mb-4">Insights & Tutorials</p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              Tech Blog
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed">
              Stories, tutorials, and insights from the world of technology.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <article key={blog.id} className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-gray-900/[0.03] hover:-translate-y-0.5 transition-all duration-300">
                <div className="h-48 overflow-hidden">
                  <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-cyan-700 transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{blog.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><LuUser size={12} /> {blog.author}</span>
                    <span className="flex items-center gap-1"><LuCalendar size={12} /> {blog.date}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
