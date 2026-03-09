import React from "react";
import { HiOutlineClock, HiOutlineChartBar, HiOutlineArrowRight, HiCheckCircle } from "react-icons/hi";

export default function CoursePreview() {
  const previews = [
    { 
      title: "Frontend Engineering", 
      topics: ["Next.js 15", "TypeScript", "Tailwind"],
      duration: "12 Weeks", 
      level: "Advanced",
      img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800" 
    },
    { 
      title: "Backend Architecture", 
      topics: ["Node.js", "PostgreSQL", "Redis"],
      duration: "10 Weeks", 
      level: "Intermediate",
      img: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=800" 
    },
    { 
      title: "Cloud & DevOps", 
      topics: ["Docker", "K8s", "AWS"],
      duration: "8 Weeks", 
      level: "Professional",
      img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800" 
    },
    { 
      title: "System Design", 
      topics: ["Scaling", "Microservices", "Load Balancing"],
      duration: "6 Weeks", 
      level: "Elite",
      img: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=800" 
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 md:px-16 lg:px-24">
        
        {/* Section Header with Stats */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-xl">
            <h2 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] mb-4">Deep Dive</h2>
            <h3 className="text-4xl font-black text-[#0f2c59] tracking-tighter leading-tight">
              Master the <span className="text-gray-400 italic">Unspoken</span> Rules of Engineering.
            </h3>
          </div>
          <div className="hidden lg:flex gap-10 border-l border-gray-100 pl-10">
              <div>
                  <p className="text-2xl font-black text-[#0f2c59]">240+</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Lessons</p>
              </div>
              <div>
                  <p className="text-2xl font-black text-[#0f2c59]">12+</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Projects</p>
              </div>
          </div>
        </div>

        {/* Dense Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {previews.map((p, i) => (
            <div key={i} className="group flex flex-col bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2">
              
              {/* Image with Glass Overlay */}
              <div className="relative h-44 overflow-hidden">
                <img 
                  src={p.img} 
                  alt={p.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#0f2c59]/90"></div>
                
                {/* Level Tag */}
                <span className="absolute top-4 right-4 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[9px] font-black text-white uppercase tracking-widest">
                  {p.level}
                </span>
              </div>

              {/* Content Area */}
              <div className="p-6 flex-grow flex flex-col">
                <h4 className="text-xl font-bold text-[#0f2c59] mb-4 leading-tight group-hover:text-blue-600 transition-colors">
                  {p.title}
                </h4>
                
                {/* Topics List - Adding 'Density' to the card */}
                <div className="space-y-2 mb-6 flex-grow">
                    {p.topics.map((topic, index) => (
                        <div key={index} className="flex items-center gap-2 text-gray-500">
                            <HiCheckCircle className="text-blue-500 text-sm flex-shrink-0" />
                            <span className="text-[11px] font-medium tracking-tight">{topic}</span>
                        </div>
                    ))}
                </div>

                {/* Footer of the Card */}
                <div className="pt-4 border-t border-gray-50 mt-auto">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-1.5">
                            <HiOutlineClock className="text-gray-400 text-sm" />
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{p.duration}</span>
                        </div>
                        <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded">Available Soon</span>
                    </div>
                    
                    <button className="w-full py-3 bg-[#0f2c59] text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-900/20 hover:bg-blue-600 transition-all active:scale-95">
                      Notify Me
                    </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}