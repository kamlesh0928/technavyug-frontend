export default function Stats() {
  return (
    <section className="py-20">

      <div className="max-w-6xl mx-auto grid grid-cols-4 gap-10 text-center">

        <div className="bg-white p-8 rounded-2xl shadow hover:shadow-xl transition">
          <h2 className="text-4xl font-bold text-[#1f3a8a]">12K+</h2>
          <p className="text-gray-600 mt-2">Students</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow hover:shadow-xl transition">
          <h2 className="text-4xl font-bold text-[#1f3a8a]">150+</h2>
          <p className="text-gray-600 mt-2">Courses</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow hover:shadow-xl transition">
          <h2 className="text-4xl font-bold text-[#1f3a8a]">45+</h2>
          <p className="text-gray-600 mt-2">Instructors</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow hover:shadow-xl transition">
          <h2 className="text-4xl font-bold text-[#1f3a8a]">98%</h2>
          <p className="text-gray-600 mt-2">Completion Rate</p>
        </div>

      </div>

    </section>
  );
}