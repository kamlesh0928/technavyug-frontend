import { useState } from "react";
import { LuChevronDown } from "react-icons/lu";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: "Will I receive a course completion certificate?",
      a: "Yes, every course comes with an industry-recognized certificate that you can share on your portfolio and LinkedIn profile.",
    },
    {
      q: "Can I watch videos offline?",
      a: "Yes, you can download videos through our mobile app and watch them offline at your convenience.",
    },
    {
      q: "What is the refund policy?",
      a: "We offer a 7-day money-back guarantee. If you are not satisfied with the course, you can request a full refund within 7 days of purchase.",
    },
    {
      q: "How are the courses structured?",
      a: "Each course is divided into sections and lectures with hands-on projects. You can learn at your own pace with lifetime access to all materials.",
    },
    {
      q: "Do I need prior experience to enroll?",
      a: "It depends on the course. We offer courses for all levels — from complete beginners to advanced professionals. Check the course level before enrolling.",
    },
  ];

  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <div className="text-center mb-12">
          <p className="text-xs font-bold text-cyan-600 uppercase tracking-widest mb-3">
            Support
          </p>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50/50 transition-colors"
              >
                <span className="font-semibold text-gray-800 text-[15px] pr-4">
                  {faq.q}
                </span>
                <LuChevronDown
                  size={18}
                  className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5">
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}