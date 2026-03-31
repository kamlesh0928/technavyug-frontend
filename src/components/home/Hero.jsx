import { Link } from "react-router-dom";
import {
  LuArrowRight,
  LuCirclePlay,
  LuUsers,
  LuBookOpen,
  LuAward,
} from "react-icons/lu";

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center pt-[72px] overflow-hidden bg-gradient-to-br from-slate-50 via-white to-cyan-50/30">
      {/* Background patterns */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-cyan-100/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-100/30 rounded-full blur-[80px]" />
      </div>

      <div className="container mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-20">
          {/* Left Content */}
          <div className="w-full lg:w-1/2 space-y-8 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[3.5rem] xl:text-6xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
              Master the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">
                Tech Skills
              </span>{" "}
              <br className="hidden sm:block" />
              of Tomorrow.
            </h1>

            <p className="text-lg text-gray-500 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Industry-grade courses designed by expert instructors. Build
              real-world projects, earn certificates, and launch your tech
              career with confidence.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/courses"
                className="group inline-flex items-center gap-2.5 bg-gray-900 text-white px-7 py-4 rounded-2xl font-bold text-sm shadow-lg shadow-gray-900/20 hover:bg-gray-800 hover:-translate-y-0.5 transition-all duration-300"
              >
                Explore Courses
                <LuArrowRight className="text-xs group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-cyan-50 flex items-center justify-center">
                  <LuUsers className="text-cyan-600" size={18} />
                </div>
                <div>
                  <p className="text-lg font-extrabold text-gray-900">10K+</p>
                  <p className="text-[11px] text-gray-400 font-medium">
                    Active Students
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                  <LuBookOpen className="text-blue-600" size={18} />
                </div>
                <div>
                  <p className="text-lg font-extrabold text-gray-900">200+</p>
                  <p className="text-[11px] text-gray-400 font-medium">
                    Expert Courses
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
                  <LuAward className="text-green-600" size={18} />
                </div>
                <div>
                  <p className="text-lg font-extrabold text-gray-900">95%</p>
                  <p className="text-[11px] text-gray-400 font-medium">
                    Placement Rate
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl shadow-gray-900/10 border border-gray-100">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
                alt="Students learning together in a modern tech workspace"
                className="w-full h-auto object-cover"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 via-transparent to-transparent" />
            </div>

            {/* Floating card: Rating */}
            <div className="absolute -top-4 -right-4 md:-right-6 bg-white px-5 py-4 rounded-2xl shadow-xl shadow-black/[0.06] z-20 flex items-center gap-3 border border-gray-100 animate-float">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-white text-sm">
                ★
              </div>
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                  Rating
                </p>
                <p className="text-sm font-extrabold text-gray-900">
                  4.9 / 5.0
                </p>
              </div>
            </div>

            {/* Floating card: Success */}
            <div
              className="absolute -bottom-4 -left-4 md:-left-6 bg-gray-900 px-6 py-5 rounded-2xl shadow-xl z-20 text-white animate-float"
              style={{ animationDelay: "1s" }}
            >
              <p className="text-3xl font-extrabold text-cyan-400">95%</p>
              <p className="text-xs font-medium text-gray-400 mt-0.5">
                Job Placement Rate
              </p>
            </div>

            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-cyan-100/30 rounded-full blur-[80px] -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
