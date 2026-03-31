import React from "react";
import {
  LuPresentation,
  LuMessageSquare,
  LuGithub,
  LuCodeXml,
  LuZap,
  LuCircleCheck,
  LuArrowRight,
} from "react-icons/lu";
import { Link } from "react-router-dom";

export default function BentoGrid() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 md:px-24">
        {/* Compact Header: Aligned Left-Right */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-gray-50 pb-8">
          <div>
            <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mb-2 block">
              Premium Learning
            </span>
            <h3 className="text-3xl font-black text-[#0f2c59] tracking-tighter">
              Technavyug Ecosystem
            </h3>
          </div>
          <p className="text-gray-400 text-xs font-medium max-w-[250px] md:text-right leading-relaxed">
            A high-performance environment built for serious engineers.
          </p>
        </div>

        {/* The Grid: 4-Column Balanced Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[160px]">
          {/* 1. Main Feature: Mentorship (Spans 2x2) */}
          <div className="md:col-span-2 md:row-span-2 bg-[#0f2c59] rounded-3xl p-8 text-white relative overflow-hidden flex flex-col justify-between group">
            {/* IMAGE ADDED: Subtle Background Tech Texture */}
            <img
              src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800"
              className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-overlay pointer-events-none"
              alt="Code background"
            />

            <div className="relative z-10">
              <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center border border-white/10 mb-6">
                <LuPresentation className="text-cyan-400 text-xl" />
              </div>
              <h4 className="text-3xl font-bold tracking-tight">
                Live Sprints
              </h4>
              <p className="text-blue-100/40 text-[11px] mt-2 max-w-[200px]">
                System design and PR reviews with industry veterans.
              </p>
            </div>

            {/* Status Bar UI */}
            <div className="relative z-10 bg-white/5 border border-white/10 p-3 rounded-2xl flex justify-between items-center backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[9px] font-black uppercase tracking-widest">
                  Active Now
                </span>
              </div>
              <LuArrowRight className="text-white/20 group-hover:text-white transition-colors" />
            </div>
          </div>

          {/* 2. Projects (Spans 1x1) */}
          <div className="bg-slate-50 border border-gray-100 rounded-3xl p-6 flex flex-col justify-between group hover:bg-white hover:shadow-xl transition-all relative overflow-hidden">
            {/* IMAGE ADDED: Subtle Dashboard Blur Overlay */}
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=500"
              className="absolute inset-0 w-full h-full object-cover opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none"
              alt="Dashboard"
            />
            <LuCodeXml className="text-2xl text-blue-600 relative z-10" />
            <h4 className="text-sm font-black text-[#0f2c59] uppercase tracking-tighter leading-none relative z-10">
              12+ Projects
            </h4>
          </div>

          {/* 3. Community (Spans 1x1) */}
          <div className="bg-[#5865F2] rounded-3xl p-6 text-white flex flex-col justify-between group hover:scale-[0.98] transition-all shadow-lg shadow-blue-500/10 relative overflow-hidden">
            {/* IMAGE ADDED: Abstract Networking Mesh */}
            <img
              src="https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=500"
              className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none"
              alt="Networking"
            />
            <LuMessageSquare className="text-3xl relative z-10" />
            <h4 className="text-sm font-black uppercase tracking-tighter relative z-10">
              Discord
            </h4>
          </div>

          {/* 4. Git Mastery (Spans 2x1) */}
          <div className="md:col-span-2 bg-slate-900 rounded-3xl p-6 flex items-center justify-between text-white group relative overflow-hidden">
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <LuGithub className="text-xl" />
              </div>
              <div>
                <h4 className="text-sm font-black uppercase">Git Workflow</h4>
                <p className="text-[10px] text-gray-500">
                  Master production-grade PRs
                </p>
              </div>
            </div>
            <div className="h-6 w-[1px] bg-white/10 mx-4 relative z-10"></div>
            <LuCircleCheck className="text-cyan-400 relative z-10" />
          </div>

          {/* 5. Compact Stats Bar (Horizontal - Spans 4x1) */}
          <div className="md:col-span-4 bg-gray-50 border border-gray-100 rounded-full p-2 pl-6 flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <LuZap className="text-blue-600 animate-pulse" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Pre-launch:{" "}
                <span className="text-[#0f2c59]">
                  Join 2,400+ students already on the waitlist
                </span>
              </span>
            </div>
            <Link
              to="/register"
              className="h-10 px-6 bg-[#0f2c59] text-white rounded-full font-black text-[9px] uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 flex items-center"
            >
              Join Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
