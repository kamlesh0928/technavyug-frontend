export default function CTA() {
  return (
    <section className="bg-[#1f3a8a] text-white py-20 mt-24">

      <div className="max-w-6xl mx-auto text-center">

        <h2 className="text-4xl font-bold">
          Start Learning Today
        </h2>

        <p className="mt-4 text-gray-200 max-w-xl mx-auto">
          Join thousands of students already learning new skills and building their careers with our platform.
        </p>

        <div className="mt-8 flex justify-center gap-6">

          <button className="bg-cyan-400 text-white px-8 py-3 rounded-full hover:bg-cyan-500 transition">
            Browse Courses
          </button>

          <button className="border-2 border-white px-8 py-3 rounded-full hover:bg-white hover:text-[#1f3a8a] transition">
            Become Instructor
          </button>

        </div>

      </div>

    </section>
  );
}