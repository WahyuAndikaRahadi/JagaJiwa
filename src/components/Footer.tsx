import { BookHeart, Twitter, Instagram, Github, Heart } from "lucide-react";
import GradientText from "./GradientText"; // Pastikan path ini benar
import { Link } from "react-router-dom"; // Menggunakan Link untuk navigasi
import { motion } from "framer-motion";

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
      className="relative z-10 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm"
    >
      {/* === KODE WAVE DIMASUKKAN DI SINI === */}
      <div className="relative h-32 w-full overflow-hidden">
        <motion.svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="absolute top-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 1, delay: 0.5 },
          }}
        >
          {/* Path 1: Biru terang dengan opacity rendah */}
          <motion.path
            fill="#4079ff" // Mengambil warna biru dari gradien Journal Mood
            fillOpacity="0.1"
            d="M0,120V73.71c47.79-22.2,103.59-32.17,158-28,70.36,5.37,136.33,33.31,206.8,37.5C438.64,87.57,512.34,66.33,583,47.95c69.27-18,138.3-24.88,209.4-13.08,36.15,6,69.85,17.84,104.45,29.34C989.49,95,1113,134.29,1200,67.53V120Z"
            initial={{ pathLength: 0, pathOffset: 1 }}
            animate={{
              pathLength: 1,
              pathOffset: 0,
              transition: {
                duration: 3,
                ease: "linear",
                repeat: Infinity,
                repeatType: "loop",
              },
            }}
          />
          {/* Path 2: Campuran biru-hijau dengan opacity sedang */}
          <motion.path
            fill="#40ffaa" // Mengambil warna hijau muda dari gradien Journal Mood
            fillOpacity="0.2"
            d="M0,120V104.19C13,83.08,27.64,63.14,47.69,47.95,99.41,8.73,165,9,224.58,28.42c31.15,10.15,60.09,26.07,89.67,39.8,40.92,19,84.73,46,130.83,49.67,36.26,2.85,70.9-9.42,98.6-31.56,31.77-25.39,62.32-62,103.63-73,40.44-10.79,81.35,6.69,119.13,24.28s75.16,39,116.92,43.05c59.73,5.85,113.28-22.88,168.9-38.84,30.2-8.66,59-6.17,87.09,7.5,22.43,10.89,48,26.93,60.65,49.24V120Z"
            initial={{ pathLength: 0, pathOffset: 1 }}
            animate={{
              pathLength: 1,
              pathOffset: 0,
              transition: {
                duration: 3.5,
                ease: "linear",
                repeat: Infinity,
                repeatType: "loop",
                delay: 0.2,
              },
            }}
          />
          {/* Path 3: Hijau terang dengan opacity lebih tinggi */}
          <motion.path
            fill="#40ffaa" // Mengambil warna hijau muda dari gradien Journal Mood
            fillOpacity="0.3"
            d="M0,120V114.37C149.93,61,314.09,48.68,475.83,77.43c43,7.64,84.23,20.12,127.61,26.46,59,8.63,112.48-12.24,165.56-35.4C827.93,42.78,886,24.76,951.2,30c86.53,7,172.46,45.71,248.8,84.81V120Z"
            initial={{ pathLength: 0, pathOffset: 1 }}
            animate={{
              pathLength: 1,
              pathOffset: 0,
              transition: {
                duration: 4,
                ease: "linear",
                repeat: Infinity,
                repeatType: "loop",
                delay: 0.4,
              },
            }}
          />
        </motion.svg>
      </div>
      {/* === AKHIR KODE WAVE === */}

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
              © {new Date().getFullYear()} Jaga Jiwa. Dibuat dengan{" "}
              <Heart className="w-4 h-4 inline-block text-rose-500" /> untuk
              kesehatan mental.
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