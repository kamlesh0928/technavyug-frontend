import { HiCheck, HiX, HiLightningBolt } from "react-icons/hi";

export default function Comparison() {
  const points = [
    "Production-Grade Projects",
    "Live Peer Reviews",
    "Industry Mentor Access",
    "Elite Community Access",
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 md:px-24">
        
        {/* Main Wrapper: Compact Height */}
        <div className="flex flex-col lg:flex-row items-center gap-12 bg-[#0f2c59] rounded-[2.5rem] overflow-hidden shadow-2xl relative">
          
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500/10 blur-[80px]"></div>

          {/* Left Side: Text & Points (Occupies 60%) */}
          <div className="w-full lg:w-[60%] p-10 md:p-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 rounded-full border border-cyan-500/20 mb-6">
              <HiLightningBolt className="text-cyan-400 text-xs" />
              <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Technavyug Edge</span>
            </div>
            
            <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter leading-tight mb-6">
              Why settle for <span className="text-gray-400">Tutorials?</span> <br />
              <span className="text-cyan-400">Master Architecture.</span>
            </h3>
            
            <p className="text-blue-100/50 text-sm font-medium mb-10 max-w-md">
              Most platforms sell you videos. We provide a high-pressure, high-growth environment to build senior-level skills.
            </p>

            {/* Compact Points Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {points.map((p, i) => (
                <div key={i} className="flex items-center gap-3 group">
                  <div className="bg-cyan-500 text-[#0f2c59] p-1 rounded-md group-hover:scale-110 transition-transform">
                    <HiCheck size={14} />
                  </div>
                  <span className="text-[11px] md:text-xs font-black text-white uppercase tracking-tight">{p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: The Visual "Battle Card" (Occupies 40%) */}
          <div className="w-full lg:w-[40%] bg-white/5 border-l border-white/10 p-10 lg:h-full flex items-center justify-center">
            <div className="w-full max-w-[320px] bg-white rounded-3xl p-6 shadow-2xl relative">
              {/* Card Header */}
              <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-4">
                <span className="text-[10px] font-black text-[#0f2c59] uppercase tracking-widest">Comparison</span>
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              </div>

              {/* Rows */}
              <div className="space-y-5">
                <div className="flex justify-between items-center opacity-30 italic">
                  <span className="text-[11px] font-bold text-gray-400">Other Courses</span>
                  <HiX className="text-red-500 text-lg" />
                </div>
                
                <div className="h-[1px] bg-gray-100 w-full relative">
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-white px-2 text-[8px] font-black text-blue-300">VS</span>
                </div>

                <div className="flex justify-between items-center group">
                  <span className="text-[11px] font-black text-[#0f2c59]">Live Execution</span>
                  <HiCheck className="text-green-500 text-xl shadow-lg shadow-green-200" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-black text-[#0f2c59]">Senior Mentorship</span>
                  <HiCheck className="text-green-500 text-xl shadow-lg shadow-green-200" />
                </div>
              </div>

              {/* Decorative Floating Icon */}
              <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-cyan-500 rounded-2xl flex items-center justify-center text-white text-xl shadow-xl rotate-12">
                <HiLightningBolt />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}