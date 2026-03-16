import {
  LuTarget,
  LuHeart,
  LuShield,
  LuTrendingUp,
  LuUsers,
  LuBookOpen,
  LuAward,
  LuGlobe,
} from "react-icons/lu";

export default function About() {
  const values = [
    { icon: LuTarget, title: "Mission-Driven", description: "We are committed to making high-quality tech education accessible across India and beyond." },
    { icon: LuHeart, title: "Student-First", description: "Every decision we make is guided by the success and growth of our learners." },
    { icon: LuShield, title: "Industry Standards", description: "Our curriculum is designed by engineers from top tech companies to meet real-world demands." },
    { icon: LuTrendingUp, title: "Continuous Growth", description: "We constantly update our content to stay aligned with the latest industry trends." },
  ];

  const stats = [
    { icon: LuUsers, value: "10,000+", label: "Active Students" },
    { icon: LuBookOpen, value: "200+", label: "Expert Courses" },
    { icon: LuAward, value: "95%", label: "Placement Rate" },
    { icon: LuGlobe, value: "50+", label: "Countries Reached" },
  ];

  return (
    <div className="pt-[72px]">
      {/* Hero */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-slate-50 via-white to-cyan-50/30">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-bold text-cyan-600 uppercase tracking-widest mb-4">About Technavyug</p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
              Building the Future of{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">
                Tech Education
              </span>
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
              Technavyug is a premium education platform that bridges the gap between theoretical
              knowledge and industry-ready skills. We prepare students to thrive in the modern tech landscape.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-gray-50/50 border border-gray-100">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-cyan-50 flex items-center justify-center">
                  <stat.icon className="text-cyan-600" size={22} />
                </div>
                <p className="text-3xl font-extrabold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-400 font-medium mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-bold text-cyan-600 uppercase tracking-widest mb-3">Our Values</p>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              What drives everything we do
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <div key={i} className="p-8 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all group">
                <div className="w-11 h-11 rounded-xl bg-gray-900 flex items-center justify-center mb-5 group-hover:bg-cyan-600 transition-colors">
                  <v.icon className="text-white" size={20} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-bold text-cyan-600 uppercase tracking-widest mb-3">Our Story</p>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-6">
                From a vision to a movement
              </h2>
              <div className="space-y-4 text-gray-500 leading-relaxed">
                <p>
                  Technavyug was born from a simple observation: there is a massive gap between
                  what traditional education teaches and what the tech industry actually needs.
                </p>
                <p>
                  We set out to bridge that gap by building a platform where students learn by
                  doing — through real-world projects, live mentorship, and industry-standard
                  workflows.
                </p>
                <p>
                  Today, thousands of students across India and beyond trust Technavyug to
                  prepare them for successful careers in technology.
                </p>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
                alt="Team collaboration"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
