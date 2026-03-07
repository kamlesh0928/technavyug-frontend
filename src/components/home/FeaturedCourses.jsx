function FeaturedCourses() {
  return (
    <section className="py-24">

      <h2 className="text-4xl font-bold text-center text-[#163b6d] mb-16">
        Featured Courses
      </h2>

      <div className="max-w-6xl mx-auto grid grid-cols-3 gap-10">

        {/* Course 1 */}

        <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition text-center">

          <h3 className="text-xl font-semibold text-[#163b6d]">
            Full Stack Web Development
          </h3>

          <p className="mt-2 text-gray-600 font-medium">
            ₹499
          </p>

          <button className="mt-5 bg-[#163b6d] text-white px-6 py-2 rounded-full hover:bg-[#1d4e89] transition">
            Enroll Now
          </button>

        </div>

        {/* Course 2 */}

        <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition text-center">

          <h3 className="text-xl font-semibold text-[#163b6d]">
            UI / UX Design
          </h3>

          <p className="mt-2 text-gray-600 font-medium">
            ₹399
          </p>

          <button className="mt-5 bg-[#163b6d] text-white px-6 py-2 rounded-full hover:bg-[#1d4e89] transition">
            Enroll Now
          </button>

        </div>

        {/* Course 3 */}

        <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition text-center">

          <h3 className="text-xl font-semibold text-[#163b6d]">
            Data Science
          </h3>

          <p className="mt-2 text-gray-600 font-medium">
            ₹699
          </p>

          <button className="mt-5 bg-[#163b6d] text-white px-6 py-2 rounded-full hover:bg-[#1d4e89] transition">
            Enroll Now
          </button>

        </div>

      </div>

    </section>
  );
}

export default FeaturedCourses;