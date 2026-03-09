import { useState } from "react";

export default function FAQ() {
  const faqs = [
    { q: "Kya mujhe course completion certificate milega?", a: "Haan, har course ke sath aapko industry-recognized certificate milega." },
    { q: "Kya main offline videos dekh sakta hoon?", a: "Ji haan, aap hamari app par videos download karke offline dekh sakte hain." },
    { q: "Refund policy kya hai?", a: "Hum 7-day money-back guarantee dete hain agar aap satisfied nahi hain." }
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-[#163b6d] mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details key={i} className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer">
              <summary className="font-semibold text-[#163b6d] list-none flex justify-between items-center text-lg">
                {faq.q}
                <span className="transition group-open:rotate-180">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}