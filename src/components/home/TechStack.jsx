import React from "react";
import { SiPython, SiArduino, SiRaspberrypi } from "react-icons/si";
import { LuCpu, LuBrain, LuNetwork, LuBot, LuLayers } from "react-icons/lu";

export default function TechStack() {
  const techs = [
    {
      name: "Python",
      icon: <SiPython />,
      color: "text-[#3776AB]",
      shadow: "group-hover:shadow-[#3776AB]/20",
    },
    {
      name: "IoT",
      icon: <LuCpu />,
      color: "text-[#06B6D4]",
      shadow: "group-hover:shadow-[#06B6D4]/20",
    },
    {
      name: "Arduino",
      icon: <SiArduino />,
      color: "text-[#00979D]",
      shadow: "group-hover:shadow-[#00979D]/20",
    },
    {
      name: "AI",
      icon: <LuBrain />,
      color: "text-[#8B5CF6]",
      shadow: "group-hover:shadow-[#8B5CF6]/20",
    },
    {
      name: "ML",
      icon: <LuNetwork />,
      color: "text-[#F59E0B]",
      shadow: "group-hover:shadow-[#F59E0B]/20",
    },
    {
      name: "Robotics",
      icon: <LuBot />,
      color: "text-[#10B981]",
      shadow: "group-hover:shadow-[#10B981]/20",
    },
    {
      name: "Deep Learning",
      icon: <LuLayers />,
      color: "text-[#EC4899]",
      shadow: "group-hover:shadow-[#EC4899]/20",
    },
    {
      name: "Raspberry Pi",
      icon: <SiRaspberrypi />,
      color: "text-[#C51A4A]",
      shadow: "group-hover:shadow-[#C51A4A]/20",
    },
  ];

  return (
    <div className="py-16 bg-white relative overflow-hidden">
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
                <div
                  className={`text-4xl ${t.color} transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6`}
                >
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
