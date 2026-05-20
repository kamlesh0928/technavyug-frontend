import {
  LuTarget,
  LuHeart,
  LuShield,
  LuTrendingUp,
  LuUsers,
  LuBookOpen,
  LuAward,
  LuGlobe,
  LuLinkedin,
} from "react-icons/lu";

export default function About() {
  const values = [
    {
      icon: LuTarget,
      title: "Mission-Driven",
      description:
        "We are committed to making high-quality tech education accessible across India and beyond.",
    },
    {
      icon: LuHeart,
      title: "Student-First",
      description:
        "Every decision we make is guided by the success and growth of our learners.",
    },
    {
      icon: LuShield,
      title: "Industry Standards",
      description:
        "Our curriculum is designed by engineers from top tech companies to meet real-world demands.",
    },
    {
      icon: LuTrendingUp,
      title: "Continuous Growth",
      description:
        "We constantly update our content to stay aligned with the latest industry trends.",
    },
  ];

  return (
    <div className="pt-[72px]">
      {/* Hero */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-slate-50 via-white to-cyan-50/30">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-bold text-cyan-600 uppercase tracking-widest mb-4">
              About Technavyug Pvt. Ltd.
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
              We don’t just Teach Technology,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">
                We Empower Minds to Build The Future.
              </span>
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
              Technavyug is an innovation-driven EdTech startup on a mission to
              bridge the gap between classroom learning and real-world
              technology. We transform traditional education into hands-on,
              project-based experiences across three powerful domains Artificial
              Intelligence, Internet of Things, and Embedded Systems empowering
              students through expert mentorship, internships, and live industry
              projects. <br></br> Our learners actively participate in Research
              & Development, turning ideas into functional devices and smart
              solutions leading to patents, research publications, and
              industry-ready innovations.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership & Team Combined */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          {/* LEADERSHIP */}
          <div className="mb-20">
            <div className="flex items-center justify-center gap-4 mb-12">
              <div className="h-px bg-gray-200 flex-1 max-w-[100px]"></div>
              <h2 className="text-sm font-bold text-gray-400 tracking-[0.2em] uppercase">
                LEADERSHIP
              </h2>
              <div className="h-px bg-gray-200 flex-1 max-w-[100px]"></div>
            </div>

            <div className="space-y-8 max-w-5xl mx-auto">
              {/* Leader 1: Tushant Kumar */}
              <div className="bg-white rounded-2xl p-8 md:p-12 flex flex-col md:flex-row gap-10 items-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                {/* Left: Avatar & Socials */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="relative w-40 h-40 mb-5">
                    <div className="absolute inset-0 rounded-full border-[3px] border-cyan-500 overflow-hidden">
                      <img
                        src="https://res.cloudinary.com/drhrgs6y5/image/upload/v1779286494/Tushant_Kumar_weusrw.png"
                        alt="Tushant Kumar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Green dot */}
                    <div className="absolute bottom-2 right-4 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <span className="px-4 py-1.5 bg-cyan-50 text-cyan-600 text-[10px] font-bold uppercase tracking-widest rounded-full mb-6 border border-cyan-100">
                    CO-FOUNDER & DIRECTOR
                  </span>
                  <div className="flex items-center gap-3">
                    <a
                      href="https://www.linkedin.com/in/tushant2109/"
                      className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 hover:text-cyan-600 hover:bg-cyan-50 transition-colors"
                    >
                      <LuLinkedin size={18} />
                    </a>
                  </div>
                </div>

                {/* right: Info */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-3xl font-extrabold text-gray-900 mb-1">
                    Tushant Kumar
                  </h3>
                  <p className="text-cyan-600 text-xs font-bold uppercase tracking-widest mb-6">
                    CO-FOUNDER & DIRECTOR
                  </p>
                  <p className="text-gray-500 text-sm leading-relaxed mb-8">
                    Tushant Kumar is a passionate technology innovator
                    specializing in Artificial Intelligence, IoT, and Embedded
                    Systems. As the Co-Founder & Director of Technavyug, he
                    focuses on developing smart and research-driven solutions
                    that bridge the gap between modern technology and real-world
                    applications. His work includes AI-based systems,
                    intelligent IoT devices, and embedded hardware integration
                    aimed at innovation, automation, and impactful product
                    development.
                  </p>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                    {[
                      "Artificial Intelligence",
                      "IoT Systems",
                      "Embedded Technology",
                      "Innovation",
                    ].map((skill, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 rounded-full bg-gray-50 text-gray-600 text-xs font-medium border border-gray-100"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Leader 2: Ashutosh Kumar */}
              <div className="bg-white rounded-2xl p-8 md:p-12 flex flex-col md:flex-row-reverse gap-10 items-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                {/* Right: Avatar & Socials */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="relative w-40 h-40 mb-5">
                    <div className="absolute inset-0 rounded-full border-[3px] border-cyan-500 overflow-hidden">
                      <img
                        src="https://res.cloudinary.com/drhrgs6y5/image/upload/v1779286486/Ashutosh_Kumar_iprasv.png"
                        alt="Ashutosh Kumar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Green dot */}
                    <div className="absolute bottom-2 left-4 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <span className="px-4 py-1.5 bg-cyan-50 text-cyan-600 text-[10px] font-bold uppercase tracking-widest rounded-full mb-6 border border-cyan-100">
                    CO-FOUNDER & DIRECTOR
                  </span>
                  <div className="flex items-center gap-3">
                    <a
                      href="https://www.linkedin.com/in/ashutosh-kumar-a093721a8/"
                      className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 hover:text-cyan-600 hover:bg-cyan-50 transition-colors"
                    >
                      <LuLinkedin size={18} />
                    </a>
                  </div>
                </div>

                {/* Left: Info */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-3xl font-extrabold text-gray-900 mb-1">
                    Ashutosh Kumar
                  </h3>
                  <p className="text-cyan-600 text-xs font-bold uppercase tracking-widest mb-6">
                    CO-FOUNDER & DIRECTOR
                  </p>
                  <p className="text-gray-500 text-sm leading-relaxed mb-8">
                    Ashutosh Kumar is actively involved in the fields of Machine
                    Learning, IoT, and Data Science. As the Co-Founder &
                    Director of Technavyug, he works on creating data-driven and
                    intelligent technology solutions for practical applications.
                    His interests include predictive analytics, smart IoT
                    systems, and machine learning model development, with a
                    vision to build scalable innovations and research-oriented
                    projects.
                  </p>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                    {[
                      "Machine Learning",
                      "Data Science",
                      "IoT Solutions",
                      "Technology Development",
                    ].map((skill, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 rounded-full bg-gray-50 text-gray-600 text-xs font-medium border border-gray-100"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CORE TEAM */}
          <div>
            <div className="flex items-center justify-center gap-4 mb-12">
              <div className="h-px bg-gray-200 flex-1 max-w-[100px]"></div>
              <h2 className="text-sm font-bold text-gray-400 tracking-[0.2em] uppercase">
                CORE TEAM
              </h2>
              <div className="h-px bg-gray-200 flex-1 max-w-[100px]"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg mx-auto">
              {[
                {
                  name: "Kamlesh Prajapati",
                  role: "Software Engineer",
                  image:
                    "https://res.cloudinary.com/drhrgs6y5/image/upload/v1779286473/My_compressed_v0qld3.png",
                  color: "border-cyan-500",
                },
                {
                  name: "Sanjana Kesharwani",
                  role: "Software Engineer",
                  image:
                    "https://res.cloudinary.com/drhrgs6y5/image/upload/v1779286472/sanjana.jpg_ansk38.jpg",
                  color: "border-green-500",
                },
              ].map((member, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-8 flex flex-col items-center text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div
                    className={`w-24 h-24 rounded-full overflow-hidden mb-5 border-[3px] ${member.color}`}
                  >
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-xs font-medium text-gray-500 mb-6">
                    {member.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-bold text-cyan-600 uppercase tracking-widest mb-3">
              Our Values
            </p>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              What drives everything we do
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all group"
              >
                <div className="w-11 h-11 rounded-xl bg-gray-900 flex items-center justify-center mb-5 group-hover:bg-cyan-600 transition-colors">
                  <v.icon className="text-white" size={20} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {v.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-bold text-cyan-600 uppercase tracking-widest mb-3">
                Our Story
              </p>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-6">
                From a vision to a movement
              </h2>
              <div className="space-y-4 text-gray-500 leading-relaxed">
                <p>
                  Technavyug was born from a simple observation: there is a
                  massive gap between what traditional education teaches and
                  what the tech industry actually needs.
                </p>
                <p>
                  We set out to bridge that gap by building a platform where
                  students learn by doing — through real-world projects, live
                  mentorship, and industry-standard workflows.
                </p>
                <p>
                  Today students across India and beyond trust Technavyug to
                  prepare them for successful careers in technology.
                </p>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
                alt="Team collaboration"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
