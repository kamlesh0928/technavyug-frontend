export default function PlatformHighlights() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-blue-50">

      <h2 className="text-4xl font-bold text-center text-[#163b6d] mb-16">
        Powerful Learning Platform
      </h2>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-6">

        <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition duration-300 text-center">
          <h3 className="text-xl font-semibold text-[#163b6d] mb-3">
            Interactive Courses
          </h3>

          <p className="text-gray-600">
            Structured learning paths with videos, quizzes, and assignments
            to help students master skills faster.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition duration-300 text-center">
          <h3 className="text-xl font-semibold text-[#163b6d] mb-3">
            Instructor Dashboard
          </h3>

          <p className="text-gray-600">
            Instructors can create courses, manage students, and track
            performance through an advanced dashboard.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition duration-300 text-center">
          <h3 className="text-xl font-semibold text-[#163b6d] mb-3">
            Secure Payments
          </h3>

          <p className="text-gray-600">
            Integrated payment system for course purchases with a smooth
            and secure checkout experience.
          </p>
        </div>

      </div>

    </section>
  );
}