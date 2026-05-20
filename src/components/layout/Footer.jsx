import { Link } from "react-router-dom";
import { LuMail } from "react-icons/lu";
import {
  FaYoutube,
  FaLinkedin,
  FaInstagram,
  FaFacebook,
  FaXTwitter,
} from "react-icons/fa6";
import logo from "@/assets/image/android-chrome-512x512.png";

const footerLinks = {
  Platform: [
    { label: "Courses", to: "/courses" },
    { label: "Products", to: "/products" },
    { label: "Blog", to: "/blog" },
    { label: "About Us", to: "/about" },
    { label: "Contact", to: "/contact" },
  ],
  Support: [
    { label: "Help Center", to: "/contact" },
    { label: "Terms & Conditions", to: "/policies/terms-and-conditions" },
    { label: "Privacy Policy", to: "/policies/privacy-policy" },
    { label: "Refund Policy", to: "/policies/refund-policy" },
    { label: "All Policies", to: "/policies" },
  ],
};

const socials = [
  {
    icon: FaYoutube,
    href: "https://www.youtube.com/@technavyugofficial",
    color: "text-[#FF0000]",
  },
  {
    icon: FaLinkedin,
    href: "https://www.linkedin.com/company/technavyug/",
    color: "text-[#0A66C2]",
  },
  {
    icon: FaInstagram,
    href: "https://www.instagram.com/technavyug/",
    color: "text-[#E4405F]",
  },
  {
    icon: FaFacebook,
    href: "https://www.facebook.com/technavyug/",
    color: "text-[#1877F2]",
  },
  {
    icon: FaXTwitter,
    href: "https://twitter.com/technavyug",
    color: "text-white",
  },
];

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <img
                src={logo}
                alt="Technavyug"
                className="h-8 w-8 rounded-full object-cover"
              />
              <span className="text-xl font-extrabold text-white tracking-tight">
                Tech<span className="text-cyan-400">navyug</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-sm text-gray-500">
              Building the future of tech education. Learn from industry experts
              and launch your career in technology.
            </p>
            <div className="flex items-center gap-2">
              {socials.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  className={`w-9 h-9 rounded-lg bg-white/[0.05] flex items-center justify-center hover:scale-110 transition-all ${s.color}`}
                >
                  <s.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-5">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-gray-500 hover:text-cyan-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} Technavyug Pvt. Ltd. All rights
            reserved.
          </p>
          <a
            href="mailto:support@technavyug.com"
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-cyan-400 transition-colors"
          >
            <LuMail size={14} /> support@technavyug.com
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
