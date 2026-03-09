import React from "react";
import { SiReact, SiNextdotjs, SiTailwindcss, SiPython, SiNodedotjs, SiFigma, SiJavascript, SiTypescript } from "react-icons/si";

export default function TechStack() {
  const techs = [
    { name: "React", icon: <SiReact />, color: "text-[#61DAFB]", shadow: "group-hover:shadow-[#61DAFB]/20" },
    { name: "Next.js", icon: <SiNextdotjs />, color: "text-black", shadow: "group-hover:shadow-black/10" },
    { name: "Tailwind", icon: <SiTailwindcss />, color: "text-[#06B6D4]", shadow: "group-hover:shadow-[#06B6D4]/20" },
    { name: "Python", icon: <SiPython />, color: "text-[#3776AB]", shadow: "group-hover:shadow-[#3776AB]/20" },
    { name: "Node.js", icon: <SiNodedotjs />, color: "text-[#339933]", shadow: "group-hover:shadow-[#339933]/20" },
    { name: "JS", icon: <SiJavascript />, color: "text-[#F7DF1E]", shadow: "group-hover:shadow-[#F7DF1E]/20" },
    { name: "TS", icon: <SiTypescript />, color: "text-[#3178C6]", shadow: "group-hover:shadow-[#3178C6]/20" },
    { name: "Figma", icon: <SiFigma />, color: "text-[#F24E1E]", shadow: "group-hover:shadow-[#F24E1E]/20" },
  ];

  return (
    <div className="py-16 bg-white relative overflow-hidden">
      {/* Subtle background text for that 'Tech' feel */}
      {/* <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center opacity-[0.02] pointer-events-none select-none">
         <h2 className="text-[15rem] font-black italic">TECHNAVYUG</h2>
      </div> */}

      <div className="container mx-auto px-6 md:px-24 relative z-10">
        <div className="flex flex-col items-center">
          
          <div className="flex items-center gap-4 mb-12">
             <div className="h-[1px] w-12 bg-gray-200"></div>
             <p className="text-xs font-black text-gray-400 uppercase tracking-[0.4em]">
               The Ecosystem You'll Master
             </p>
             <div className="h-[1px] w-12 bg-gray-200"></div>
          </div>

          {/* Logos Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6 w-full">
            {techs.map((t, i) => (
              <div 
                key={i} 
                className={`group flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-50 border border-transparent hover:border-gray-100 hover:bg-white transition-all duration-500 cursor-default ${t.shadow} hover:shadow-2xl`}
              >
                <div className={`text-4xl ${t.color} transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6`}>
                  {t.icon}
                </div>
                <span className="mt-3 text-[10px] font-black text-gray-400 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                   {t.name}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}