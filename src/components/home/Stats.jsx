export default function Stats() {
  return (
    <section className="py-24">

      <div className="max-w-6xl mx-auto grid grid-cols-4 gap-8 px-6">

        <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition transform hover:-translate-y-1 text-center">
          <h2 className="text-4xl font-bold text-[#163b6d]">12K+</h2>
          <p className="text-gray-600 mt-2">Students</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition transform hover:-translate-y-1 text-center">
          <h2 className="text-4xl font-bold text-[#163b6d]">150+</h2>
          <p className="text-gray-600 mt-2">Courses</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition transform hover:-translate-y-1 text-center">
          <h2 className="text-4xl font-bold text-[#163b6d]">45+</h2>
          <p className="text-gray-600 mt-2">Instructors</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition transform hover:-translate-y-1 text-center">
          <h2 className="text-4xl font-bold text-[#163b6d]">98%</h2>
          <p className="text-gray-600 mt-2">Completion Rate</p>
        </div>

      </div>

    </section>
  );
}