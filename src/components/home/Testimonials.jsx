export default function PlatformFeatures() {
  return (
    <section className="py-24 bg-gray-50">

      <h2 className="text-4xl font-bold text-center text-[#163b6d] mb-16">
        Platform Features
      </h2>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-6">

        <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition duration-300 text-center">
          
          <h3 className="text-xl font-semibold text-[#163b6d] mb-3">
            Course Marketplace
          </h3>

          <p className="text-gray-600">
            Browse and purchase courses across different categories with a
            simple and intuitive interface.
          </p>

        </div>

        <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition duration-300 text-center">
          
          <h3 className="text-xl font-semibold text-[#163b6d] mb-3">
            Student Dashboard
          </h3>

          <p className="text-gray-600">
            Students can track their progress, manage enrolled courses, and
            continue learning anytime.
          </p>

        </div>

        <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition duration-300 text-center">
          
          <h3 className="text-xl font-semibold text-[#163b6d] mb-3">
            Instructor Tools
          </h3>

          <p className="text-gray-600">
            Tools for instructors to upload lessons, manage content, and
            interact with students easily.
          </p>

        </div>

      </div>

    </section>
  );
}