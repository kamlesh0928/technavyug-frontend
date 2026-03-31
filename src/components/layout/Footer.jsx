import { Link } from "react-router-dom";
import { LuLinkedin, LuInstagram, LuMail, LuYoutube } from "react-icons/lu";
import logo from "@/assets/image/Technavyug Logo.png";

const footerLinks = {
  Platform: [
    { label: "Courses", to: "/courses" },
    { label: "Blog", to: "/blog" },
    { label: "About Us", to: "/about" },
    { label: "Contact", to: "/contact" },
  ],
  Support: [
    { label: "Help Center", to: "/contact" },
    { label: "FAQ", to: "/#faq" },
    { label: "Terms of Service", to: "/about" },
    { label: "Privacy Policy", to: "/about" },
  ],
};

const socials = [
  { icon: LuYoutube, href: "https://www.youtube.com/@technavyugofficial" },
  { icon: LuLinkedin, href: "https://www.linkedin.com/company/technavyug/" },
  { icon: LuInstagram, href: "https://www.instagram.com/technavyug/" },
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
                className="h-8 w-auto brightness-200"
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
                  className="w-9 h-9 rounded-lg bg-white/[0.05] flex items-center justify-center hover:bg-cyan-600 hover:text-white transition-all text-gray-500"
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
            &copy; {new Date().getFullYear()} Technavyug. All rights reserved.
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
