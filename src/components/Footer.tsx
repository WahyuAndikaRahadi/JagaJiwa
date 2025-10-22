import { Twitter, Instagram, Github, Heart } from "lucide-react";
import GradientText from "./GradientText";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import React from "react";

// Variasi untuk animasi kontainer (staggered effect)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Jeda antar elemen anak
    },
  },
};

// Variasi untuk setiap item (fade-in dari bawah)
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Komponen kustom untuk link dengan hover animasi (Garis Bawah)
const HoverLink = ({ to, children, className = "" }) => {
  return (
    <motion.li
      // Menggunakan itemVariants untuk staggered effect dari parent
      variants={itemVariants}
      key={to}
    >
      <Link
        to={to}
        className={`relative inline-block text-base text-gray-600 dark:text-gray-400 hover:text-[#1ff498] transition-colors duration-200 group ${className}`}
      >
        {children}
        {/* Garis bawah animasi */}
        <motion.span
          className="absolute left-0 bottom-[-2px] h-[2px] w-full bg-[#1ff498] rounded-full"
          initial={{ scaleX: 0, originX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
      </Link>
    </motion.li>
  );
};


const Footer = () => {
   const features = [
    { name: "Insight", path: "/insight" },
    { name: "Mood Tracker", path: "/tracker" },
    { name: "Journal Mood", path: "/journal" },
    { name: "Talk Room", path: "/talkroom" },
  ];

  // Halaman Utama hanya berisi Home dan About, serta link kebijakan
  const mainPages = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" }
  ];

  return (
    <footer
      className="relative z-10 bg-white/50 dark:bg-gray-900 backdrop-blur-sm"
    >
      {/* Container utama dengan animasi inisial */}
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        initial="hidden"
        whileInView="visible" // Animasi muncul saat masuk viewport
        viewport={{ once: true, amount: 0.1 }} // Hanya sekali saat 10% elemen terlihat
        variants={containerVariants}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Bagian Brand */}
          <motion.div variants={itemVariants} className="lg:col-span-6">
            <Link to="/" className="flex items-center space-x-3 mb-4">
              {/* Logo icon/container TIDAK perlu motion.div lagi karena sudah di-wrap di atas */}
              <div
                className="w-12 h-12 flex justify-center items-center bg-transparent dark:bg-gradient-to-br dark:from-[#1ff498]/20 dark:to-[#50b7f7]/20 rounded-xl border-2 border-gray-200 dark:border-gray-500"
              >
               <img src="/public/img/jagaJiwa.png" alt="Jaga Jiwa Logo" className="p-2"/>
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
            <motion.p variants={itemVariants} className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
              Platform kesehatan mental berbasis AI untuk membantumu mengelola
              emosi dan meningkatkan kesejahteraan hidup.
            </motion.p>
          </motion.div>

          {/* Bagian Links yang Sudah Disederhanakan */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-8">
            
            {/* Kolom 1: Fitur & Kesehatan Mental */}


            {/* Kolom 2: Halaman Utama (Home dan About) */}
            <motion.div variants={itemVariants}>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase">
                Halaman Utama
              </h3>
              <motion.ul 
                className="mt-4 space-y-3"
                initial="hidden"
                animate="visible"
                variants={containerVariants} // Container untuk list item
              >
                {mainPages.map((item) => (
                    <HoverLink key={item.name} to={item.path}>
                        {item.name}
                    </HoverLink>
                ))}
              </motion.ul>
            </motion.div>

                        <motion.div variants={itemVariants}>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase">
                Fitur & Kesehatan Mental
              </h3>
              <motion.ul 
                className="mt-4 space-y-3"
                initial="hidden"
                animate="visible"
                variants={containerVariants} // Container untuk list item
              >
                {features.map((item) => (
                  <HoverLink key={item.name} to={item.path}>
                      {item.name}
                  </HoverLink>
                ))}
              </motion.ul>
            </motion.div>
            
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          variants={itemVariants}
          className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700/50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} Jaga Jiwa. Dibuat dengan{" "}
              <Heart className="w-4 h-4 inline-block text-rose-500" /> untuk
              kesehatan mental.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {/* Icon media sosial dengan animasi hover sederhana */}
              {[ 'Github'].map((social) => {
                const Icon = social === 'Twitter' ? Twitter : social === 'Instagram' ? Instagram : Github;
                return (
                  <motion.a
                    key={social}
                    href="https://github.com/WahyuAndikaRahadi/Mood-IndonesianGold"
                    target="_blank"
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                    aria-label={social}
                    whileHover={{ scale: 1.1, rotate: 5 }} // Efek hover
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;