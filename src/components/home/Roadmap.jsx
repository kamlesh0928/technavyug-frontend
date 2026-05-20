import {
  LuUserPlus,
  LuLayoutGrid,
  LuBadgeCheck,
  LuCode,
  LuFileText,
} from "react-icons/lu";

export default function LearningFlow() {
  const steps = [
    {
      title: "Join Technavyug",
      desc: "Sign up, pick your track, and get instant access to your learning dashboard and community.",
      icon: <LuUserPlus />,
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop",
    },
    {
      title: "Learn from Courses",
      desc: "Deep dive into 50+ hours of high-quality engineering content taught by senior mentors.",
      icon: <LuLayoutGrid />,
      image:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop",
    },
    {
      title: "Real Time Projects",
      desc: "Build and deploy production-grade projects that solve real problems — not just toy apps.",
      icon: <LuCode />,
      image:
        "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=600&auto=format&fit=crop",
    },
    {
      title: "Get Certified",
      desc: "Earn industry-recognised certificates and build a portfolio that recruiters actually want to see.",
      icon: <LuBadgeCheck />,
      image:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop",
    },
    {
      title: "Publications & Patents",
      desc: "Document your innovations. Get your work published and file patents with mentor guidance.",
      icon: <LuFileText />,
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 md:px-24">
        {/* Simple Centered Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#0f2c59] tracking-tight">
            How it Works
          </h2>
          <p className="text-gray-400 text-sm mt-2 font-medium">
            Five simple steps to start your journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {steps.map((s, i) => (
            <div
              key={i}
              className="bg-slate-50 rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="p-8">
                {/* Icon */}
                <div className="w-12 h-12 bg-[#0f2c59] text-white rounded-xl flex items-center justify-center text-xl shadow-lg shadow-blue-900/20 mb-6">
                  {s.icon}
                </div>

                <h4 className="text-lg font-bold text-[#0f2c59] mb-2 leading-tight">
                  {s.title}
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                  {s.desc}
                </p>

                {/* Minimal Step Label */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                    Step 0{i + 1}
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-200"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
