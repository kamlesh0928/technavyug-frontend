import { FaChalkboardTeacher, FaBriefcase, FaBookOpen, FaUsers } from "react-icons/fa";

export default function WhyUs() {
  return (
    <section className="py-24 px-6">

      <h2 className="text-4xl font-bold text-center text-[#163b6d] mb-16">
        Why Learn With Technavyug
      </h2>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition duration-300 text-center">

          <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full bg-blue-100 text-[#163b6d] text-2xl">
            <FaChalkboardTeacher />
          </div>

          <h3 className="text-xl font-semibold text-[#163b6d]">
            Expert Instructors
          </h3>

          <p className="text-gray-600 mt-2 text-sm">
            Learn from experienced professionals working in the industry.
          </p>

        </div>

        <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition duration-300 text-center">

          <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full bg-blue-100 text-[#163b6d] text-2xl">
            <FaBriefcase />
          </div>

          <h3 className="text-xl font-semibold text-[#163b6d]">
            Career Focused
          </h3>

          <p className="text-gray-600 mt-2 text-sm">
            Courses designed to help you build real world skills.
          </p>

        </div>

        <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition duration-300 text-center">

          <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full bg-blue-100 text-[#163b6d] text-2xl">
            <FaBookOpen />
          </div>

          <h3 className="text-xl font-semibold text-[#163b6d]">
            Lifetime Access
          </h3>

          <p className="text-gray-600 mt-2 text-sm">
            Access your courses anytime with lifetime updates.
          </p>

        </div>

        <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition duration-300 text-center">

          <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full bg-blue-100 text-[#163b6d] text-2xl">
            <FaUsers />
          </div>

          <h3 className="text-xl font-semibold text-[#163b6d]">
            Community Support
          </h3>

          <p className="text-gray-600 mt-2 text-sm">
            Join a community of learners and instructors.
          </p>

        </div>

      </div>

    </section>
  );
}