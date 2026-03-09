import { FaArrowRight, FaPlayCircle, FaStar } from "react-icons/fa";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-white">
      {/* --- Background Decorative Elements --- */}
      <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-slate-50 rounded-l-[100px] z-0 hidden lg:block"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-100/50 rounded-full blur-[100px] z-0"></div>

      <div className="container mx-auto px-6 md:px-16 lg:px-24 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          {/* --- Left Content --- */}
          <div className="w-full lg:w-1/2 space-y-8 text-center lg:text-left">
            <h1 className="text-5xl md:text-7xl font-black text-[#0f2c59] leading-[1.1] tracking-tight">
              Master the <span className="text-cyan-500">Tech</span> <br />
              Skills of Tomorrow.
            </h1>

            <p className="text-lg text-gray-500 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
              Technavyug provides world-class education with real-world
              projects. Start your journey today with industry-grade mentors.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4">
              <button className="group bg-[#0f2c59] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-2xl shadow-blue-900/20 hover:bg-[#1d4e89] hover:-translate-y-1 transition-all duration-300">
                Explore Courses
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button className="flex items-center gap-3 text-[#0f2c59] font-bold hover:text-cyan-600 transition-colors py-4">
                <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center bg-white shadow-sm">
                  <FaPlayCircle className="text-xl" />
                </div>
                Watch Demo
              </button>
            </div>
          </div>

          {/* --- Right Visual Section --- */}
          <div className="w-full lg:w-1/2 relative">
            {/* Main Floating Image */}
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(15,44,89,0.3)] border-[12px] border-white">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
                alt="Learning Together"
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Floating Achievement Card 1 */}
            <div className="absolute -top-6 -right-6 md:-right-10 bg-white p-4 rounded-2xl shadow-xl z-20 flex items-center gap-4 animate-bounce-slow">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-white">
                <FaStar />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">
                  Rating
                </p>
                <p className="text-sm font-black text-[#0f2c59]">
                  4.9/5.0 Stars
                </p>
              </div>
            </div>

            {/* Floating Achievement Card 2 */}
            <div className="absolute -bottom-8 -left-8 md:-left-12 bg-[#0f2c59] p-6 rounded-[2rem] shadow-2xl z-20 text-white animate-float">
              <p className="text-3xl font-black text-cyan-400">95%</p>
              <p className="text-xs font-medium text-gray-300">
                Success Rate in Jobs
              </p>
            </div>

            {/* Decorative Glow behind image */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-cyan-200/30 rounded-full blur-[120px] -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
