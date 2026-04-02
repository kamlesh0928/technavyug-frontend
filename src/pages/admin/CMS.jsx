import { Link } from "react-router-dom";
import {
  LuLayoutDashboard,
  LuFileText,
  LuCircleHelp,
  LuArrowRight,
  LuSettings2,
} from "react-icons/lu";

const cmsModules = [
  {
    title: "Homepage Editor",
    description:
      "Customize hero sections, feature grids, and statistical counters across the home page.",
    icon: LuLayoutDashboard,
    color: "text-blue-600",
    bg: "bg-blue-50",
    path: "/admin/cms/homepage",
  },
  {
    title: "Blog Management",
    description:
      "Write, edit, and publish industry insights or platform updates for your audience.",
    icon: LuFileText,
    color: "text-purple-600",
    bg: "bg-purple-50",
    path: "/admin/cms/blogs",
  },
  {
    title: "FAQ & Support",
    description:
      "Manage frequently asked questions to reduce support tickets and improve user onboarding.",
    icon: LuCircleHelp,
    color: "text-amber-600",
    bg: "bg-amber-50",
    path: "/admin/cms/faqs",
  },
];

export default function AdminCMS() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Content Management
          </h1>
          <p className="text-gray-500 mt-1">
            Control and curate the platform's visual and textual footprint
          </p>
        </div>
        <div className="p-3 bg-white border border-gray-100 rounded-xl shadow-sm text-gray-400 hover:text-cyan-600 transition-colors cursor-pointer">
          <LuSettings2 size={24} />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {cmsModules.map((m, i) => (
          <div
            key={i}
            className="group bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center text-center"
          >
            <div
              className={`w-16 h-16 ${m.bg} ${m.color} rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform`}
            >
              <m.icon size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-cyan-700 transition-colors">
              {m.title}
            </h3>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              {m.description}
            </p>
            <Link
              to={m.path}
              className="mt-auto flex items-center gap-2 text-sm font-black text-cyan-600 hover:text-cyan-700 transition-colors uppercase tracking-widest group-hover:gap-3"
            >
              Launch Module <LuArrowRight size={16} />
            </Link>
          </div>
        ))}
      </div>

      {/* Quick Help Footer */}
      <div className="bg-[#0f172a] rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative border border-white/5 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]" />
        <div className="relative z-10">
          <h4 className="text-2xl font-black mb-2 tracking-tight">
            Need help with content?
          </h4>
          <p className="text-gray-400 text-sm max-w-md leading-relaxed">
            Our documentation provides best practices for SEO-friendly blogs and
            high-converting homepage copy to help you scale faster.
          </p>
        </div>
        <button className="relative z-10 bg-white text-gray-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-cyan-50 hover:text-cyan-700 hover:scale-105 transition-all shadow-xl active:scale-95">
          View Documentation
        </button>
      </div>
    </div>
  );
}
