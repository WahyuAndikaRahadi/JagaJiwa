import { BookHeart, Twitter, Instagram, Github, Heart } from "lucide-react";
import GradientText from "./GradientText"; // Pastikan path ini benar
import { Link } from "react-router-dom"; // Menggunakan Link untuk navigasi

const Footer = () => {
  const features = [
    { name: "Mood Tracker", path: "/tracker" },
    { name: "Journal Mood", path: "/journal" },
    { name: "Talk Room", path: "/talk" },
  ];

  const company = [
    { name: "Tentang Kami", path: "/about" },
    { name: "Wawasan (Blog)", path: "/blog" },
  ];

  const support = [
    { name: "Bantuan Darurat", path: "/talk" }, // Mengarah ke TalkRoom (Crisis Popup)
    { name: "Kebijakan Privasi", path: "#" },
    { name: "Syarat & Ketentuan", path: "#" },
  ];

  return (
    <footer
      className="relative z-10 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm 
      border-t-2 border-[#72e4f8] dark:border-[#50b7f7]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Bagian Brand */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <div
                className="w-12 h-12 bg-gradient-to-br from-[#1ff498]/20 to-[#50b7f7]/20 
                rounded-xl flex items-center justify-center shadow-lg border-2 border-white/50"
              >
                {/* Menggunakan Heart icon sebagai logo utama 'Jaga Jiwa' */}
                <Heart className="w-6 h-6 text-[#1ff498]" />
              </div>
              <span className="font-extrabold text-3xl">
                <GradientText
                  colors={["#40ffaa", "#4079ff"]}
                  animationSpeed={5}
                  showBorder={false}
                >
                  Jaga Jiwa
                </GradientText>
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
              Platform kesehatan mental berbasis AI untuk membantumu mengelola
              emosi dan meningkatkan kesejahteraan hidup.
            </p>
          </div>

          {/* Bagian Links */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase">
                Fitur
              </h3>
              <ul className="mt-4 space-y-3">
                {features.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className="text-base text-gray-600 dark:text-gray-400 hover:text-[#1ff498] transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase">
                Perusahaan
              </h3>
              <ul className="mt-4 space-y-3">
                {company.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className="text-base text-gray-600 dark:text-gray-400 hover:text-[#1ff498] transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase">
                Bantuan
              </h3>
              <ul className="mt-4 space-y-3">
                {support.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className={`text-base text-gray-600 dark:text-gray-400 hover:text-[#1ff498] transition-colors duration-200 ${
                        item.name === "Bantuan Darurat"
                          ? "font-bold text-rose-600 dark:text-rose-500 hover:text-rose-500"
                          : ""
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} Jaga Jiwa. Dibuat dengan <Heart className="w-4 h-4 inline-block text-rose-500" /> untuk kesehatan mental.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;