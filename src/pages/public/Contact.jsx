import { useState } from "react";
import { LuMail, LuPhone, LuMapPin, LuSend } from "react-icons/lu";
import { toast } from "react-toastify";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Message sent successfully! We will get back to you soon.");
    setForm({ name: "", email: "", subject: "", message: "" });
    setLoading(false);
  };

  const contactInfo = [
    { icon: LuMail, title: "Email Us", detail: "support@technavyug.com", desc: "We respond within 24 hours" },
    { icon: LuPhone, title: "Call Us", detail: "+91 9876 543 210", desc: "Monday to Friday, 9 AM - 6 PM" },
    { icon: LuMapPin, title: "Visit Us", detail: "India", desc: "Serving students worldwide" },
  ];

  return (
    <div className="pt-[72px]">
      {/* Header */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-slate-50 via-white to-cyan-50/30">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-xs font-bold text-cyan-600 uppercase tracking-widest mb-4">Get in Touch</p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed">
              Have questions or need support? We are here to help you on your learning journey.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          {/* Contact Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {contactInfo.map((item, i) => (
              <div key={i} className="p-6 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gray-900 flex items-center justify-center">
                  <item.icon className="text-white" size={20} />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm font-semibold text-cyan-600 mb-1">{item.detail}</p>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Send Us a Message</h2>
              <p className="text-gray-500 text-sm">Fill out the form below and we will get back to you shortly.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Full Name</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400 outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400 outline-none transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Subject</label>
                <input
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400 outline-none transition-all"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Message</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400 outline-none resize-none transition-all"
                  placeholder="Tell us more about your query..."
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 transition-all disabled:opacity-60 text-sm"
              >
                <LuSend size={16} />
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
