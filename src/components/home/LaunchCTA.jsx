export default function CTA() {
  return (
    <section className="py-12 px-6">
      {/* Box size chhota rakha hai (max-w-4xl) */}
      <div className="max-w-4xl mx-auto bg-[#0f2c59] rounded-[2rem] p-8 md:p-12 text-center relative overflow-hidden shadow-xl border border-white/5">
        
        {/* Background Image: Subtle aur halke mein */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000" 
            alt="Tech" 
            className="w-full h-full object-cover opacity-10"
          />
        </div>

        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
            Ready to <span className="text-cyan-400">Upgrade</span> Your Career?
          </h2>
          
          <p className="mt-3 text-blue-100/60 max-w-lg mx-auto text-xs md:text-sm font-medium">
            Join 12,000+ students. Get access to professional courses and industry-vetted certifications.
          </p>

          {/* Buttons: Chhote aur clean */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <button className="bg-cyan-400 text-[#0f2c59] px-8 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
              Get Started
            </button>
            <button className="bg-white/5 border border-white/10 text-white px-8 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
              View Courses
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}