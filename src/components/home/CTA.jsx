export default function CTA() {
  return (
    <section className="bg-gradient-to-r from-[#0f2c59] to-[#1d4e89] text-white py-24 mt-24">

      <div className="max-w-6xl mx-auto text-center px-6">

        <h2 className="text-4xl md:text-5xl font-bold">
          Start Learning Today
        </h2>

        <p className="mt-6 text-gray-200 max-w-2xl mx-auto text-lg">
          Join thousands of students already learning new skills and building
          their careers with our platform.
        </p>

        <div className="mt-10 flex justify-center gap-6 flex-wrap">

          <button className="bg-cyan-400 text-black px-8 py-3 rounded-full font-medium hover:bg-cyan-300 transition shadow-lg">
            Browse Courses
          </button>

          <button className="border-2 border-white px-8 py-3 rounded-full font-medium hover:bg-white hover:text-[#1f3a8a] transition">
            Become Instructor
          </button>

        </div>

      </div>

    </section>
  );
}