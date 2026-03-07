function Hero() {
  return (
    <section className="flex justify-between items-center px-28 py-32 min-h-[85vh] relative">

      {/* Left Content */}

      <div className="max-w-xl">

        <h1 className="text-6xl font-bold leading-tight text-[#163b6d]">
          LEARN SKILLS <br />
          BUILD YOUR FUTURE
        </h1>

        <p className="mt-6 text-gray-600 text-lg">
          Unlock your potential with our enterprise-grade learning platform
        </p>

        <div className="mt-10 flex gap-5">

          <button className="bg-[#163b6d] text-white px-8 py-3 rounded-full shadow-lg hover:translate-y-[-2px] transition">
            Explore Courses
          </button>

          <button className="border-2 border-[#163b6d] text-[#163b6d] px-8 py-3 rounded-full hover:bg-[#163b6d] hover:text-white transition">
            Become an Instructor
          </button>

        </div>

      </div>

      {/* Right Glow Effect */}

      <div className="w-[420px] h-[420px] rounded-full bg-gradient-to-br from-cyan-400 to-blue-800 blur-[90px] opacity-60 animate-pulse"></div>

    </section>
  );
}

export default Hero;