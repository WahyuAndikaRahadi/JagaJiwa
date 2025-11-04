import {
  Brain,
  MessageCircle,
  TrendingUp,
  BookOpen,
  Zap,
  Smile,
  Sparkles,
  HelpCircle,
  ChevronDown,
  Quote,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import GradientText from "../components/GradientText";
import StyledPathWithLeaves from "../components/StyledPathWithLeaves";

interface FaqItemProps {
  question: string;
  answer: string;
  index: number;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  const id = `faq-${index}`;

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <button
        className="flex justify-between items-center w-full p-5 text-lg font-semibold text-left text-gray-800 dark:text-gray-100 transition-colors duration-300 hover:text-[#1ff498] dark:hover:text-[#50b7f7]"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={id}
      >
        {question}
        <ChevronDown
          className={`w-5 h-5 transition-transform duration-300 ${
            isOpen ? "rotate-180 text-[#1ff498]" : ""
          }`}
        />
      </button>
      <div
        id={id}
        role="region"
        aria-labelledby={id}
        className={`overflow-hidden transition-max-height duration-500 ease-in-out ${
          isOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <div className="p-5 pt-0 text-base leading-relaxed text-gray-600 dark:text-gray-400">
          {answer}
        </div>
      </div>
    </div>
  );
};

const TESTIMONIALS = [
  {
    quote:
      "Mood Tracker sangat membantu saya memahami pola emosi, dan Talk Room terasa seperti memiliki teman yang selalu ada.",
    name: "Rangga Awan",
    title: "Mahasiswa",
    avatar: "/img/avatar.png",
    color: "border-rose-300 dark:bg-rose-900/10 dark:border-rose-700",
  },
  {
    quote:
      "Desainnya menenangkan dan fitur AI Journal-nya memberikan wawasan yang sangat mendalam tentang kecemasan saya.",
    name: "Darren Aurelyo",
    title: "Pelajar",
    avatar: "/img/avatar.png",
    color: "border-indigo-300 dark:bg-indigo-900/10 dark:border-indigo-700",
  },
  {
    quote:
      "Sebagai platform gratis, kualitasnya luar biasa. Rasanya seperti mendapat dukungan mental tanpa perlu khawatir biaya.",
    name: "Wafa Arieb",
    title: "Pelajar",
    avatar: "/img/avatar.png",
    color: "border-emerald-300 dark:bg-emerald-900/10 dark:border-emerald-700",
  },
];

const fadeInUp: any = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const containerVariants: any = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: any = {
  initial: { opacity: 0, y: 50, scale: 0.8 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } },
};
const pulseSlowVariants: any = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.2, 0.4, 0.2],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const floatVariants: any = {
  animate: {
    x: ["-10%", "10%", "-10%"],
    y: ["-10%", "10%", "-10%"],
    transition: {
      duration: 15,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

const floatSlowVariants: any = {
  animate: {
    x: ["0%", "20%", "0%"],
    y: ["0%", "20%", "0%"],
    scale: [1, 1.05, 1],
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const spiralFloat: any = {
  animate: {
    x: ["0%", "20%", "0%", "-20%", "0%"],
    y: ["0%", "10%", "20%", "10%", "0%"],
    rotate: [0, 90, 180, 270, 360],
    scale: [1, 0.9, 1.1, 1],
    transition: {
      duration: 25,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const upAndDown: any = {
  animate: {
    y: ["0%", "-30%", "0%"],
    opacity: [0.5, 0.8, 0.5],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const randomFloat: any = {
  animate: {
    x: () => `${Math.random() * 40 - 20}%`,
    y: () => `${Math.random() * 40 - 20}%`,
    scale: () => [1, 0.8 + Math.random() * 0.4, 1],
    opacity: () => [0.1, 0.3 + Math.random() * 0.2, 0.1],
    transition: {
      duration: () => 10 + Math.random() * 10,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const FEATURES = [
  {
    id: "mood-tracker",
    link: "/tracker",
    icon: TrendingUp,
    title: "Mood Tracker",
    description: "Pantau perubahan suasana hatimu setiap hari",
    color: "from-purple-500 to-indigo-600",
  },
  {
    id: "journal-mood",
    link: "/journal",
    icon: Brain,
    title: "Journal Mood",
    description: "Tulis dan analisis perasaanmu dengan AI",
    color: "from-rose-500 to-pink-600",
  },
  {
    id: "talk-room",
    link: "/talkroom",
    icon: MessageCircle,
    title: "Talk Room",
    description: "Curhat dengan AI yang siap mendengarkan",
    color: "from-emerald-500 to-teal-600",
  },
];

const ARTICLES = [
  {
    id: 1,
    title: "Mengatasi Burnout Akademik: Tips dan Strategi",
    category: "Akademik",
    summary:
      "Pelajari cara mengenali tanda-tanda burnout dan strategi efektif untuk mengatasinya agar tetap produktif.",
    link: "/insight/artikel/1",
  },
  {
    id: 2,
    title: "Pentingnya Mindfulness dalam Rutinitas Harian",
    category: "Teknik",
    summary:
      "Integrasikan praktik mindfulness ke dalam keseharianmu untuk meningkatkan fokus dan mengurangi stres.",
    link: "/insight/artikel/2",
  },
  {
    id: 3,
    title: "Membangun Resiliensi Mental di Era Digital",
    category: "Pengembangan Diri",
    summary:
      "Kembangkan ketahanan mental untuk menghadapi tantangan di dunia digital yang serba cepat dan penuh tekanan.",
    link: "/insight/artikel/3",
  },
];

const FAQ_DATA = [
  {
    question: "Apakah Jaga Jiwa benar-benar gratis?",
    answer:
      "Ya, Jaga Jiwa sepenuhnya gratis untuk fitur Mood Tracker, Journal Mood, dan Talk Room. Kami berkomitmen untuk menyediakan akses kesehatan mental yang bebas hambatan bagi pelajar di Indonesia.",
  },
  {
    question: "Bagaimana cara kerja Talk Room dengan AI?",
    answer:
      "Talk Room menggunakan model bahasa AI canggih yang dilatih untuk memberikan respons yang empatik dan tanpa penghakiman. AI berfungsi sebagai pendengar aktif dan menawarkan teknik coping yang teruji. Penting: AI bukanlah pengganti terapis profesional.",
  },
  {
    question: "Apakah data jurnal dan mood saya aman?",
    answer:
      "Kami menjamin keamanan data. Semua data dienkripsi, disimpan secara anonim, dan tidak pernah dibagikan kepada pihak ketiga. Kami menggunakan enkripsi standar industri untuk melindungi privasi Anda sepenuhnya.",
  },
  {
    question: "Apa perbedaan antara Mood Tracker dan Journal Mood?",
    answer:
      "Mood Tracker memungkinkan Anda mencatat suasana hati dengan cepat menggunakan skala, sedangkan Journal Mood memungkinkan Anda menulis pikiran dan perasaan secara mendalam, kemudian dianalisis oleh AI untuk mendapatkan wawasan tentang pola emosi Anda.",
  },
];

const PHILOSOPHY_TAGS = [
  { text: "100% Anonim & Aman", color: "red" },
  { text: "Teknologi AI Canggih", color: "yellow" },
  { text: "Bebas Biaya", color: "emerald" },
];

function Home() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const totalTestimonials = TESTIMONIALS.length;
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const minSwipeDistance = 50;
  const sliderRef = useRef<HTMLDivElement>(null);

  const nextSlide = () => {
    setActiveTestimonial((prev) => (prev + 1) % totalTestimonials);
  };

  const prevSlide = () => {
    setActiveTestimonial(
      (prev) => (prev - 1 + totalTestimonials) % totalTestimonials
    );
  };

  const goToSlide = (index: number) => {
    setActiveTestimonial(index);
  };

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 5000);
    return () => clearInterval(slideInterval);
  }, [totalTestimonials]);

  // Fungsi Swipe/Drag Gesture
  const onTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setTouchStart(clientX);
    setTouchEnd(null);
    setIsSwiping(true);

    if (sliderRef.current) {
      sliderRef.current.style.transition = "none";
    }
  };

  const onTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (touchStart === null) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setTouchEnd(clientX);

    const currentSlideOffset = activeTestimonial * 100;
    const containerWidth = e.currentTarget.clientWidth;
    const dragDistance = ((clientX - touchStart) / containerWidth) * 100;

    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(-${
        currentSlideOffset - dragDistance
      }%)`;
    }
  };

  const onTouchEnd = () => {
    if (touchStart === null || touchEnd === null) {
      if (sliderRef.current) {
        sliderRef.current.style.transition = "transform 0.7s ease-in-out";
      }
      setIsSwiping(false);
      return;
    }

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    } else {
      if (sliderRef.current) {
        sliderRef.current.style.transition = "transform 0.7s ease-in-out";
        sliderRef.current.style.transform = `translateX(-${
          activeTestimonial * 100
        }%)`;
      }
    }

    setTouchStart(null);
    setTouchEnd(null);
    setIsSwiping(false);
  };

  useEffect(() => {
    if (!isSwiping && sliderRef.current) {
      const timeout = setTimeout(() => {
        if (sliderRef.current) {
          sliderRef.current.style.transition = "transform 0.7s ease-in-out";
          sliderRef.current.style.transform = `translateX(-${
            activeTestimonial * 100
          }%)`;
        }
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [activeTestimonial, isSwiping]);

  const philosophyRef = useRef(null);
  const isPhilosophyInView = useInView(philosophyRef, {
    once: true,
    amount: 0.3,
  });

  const featuresRef = useRef(null);
  const isFeaturesInView = useInView(featuresRef, { once: true, amount: 0.2 });

  const articlesRef = useRef(null);
  const isArticlesInView = useInView(articlesRef, { once: true, amount: 0.2 });

  const faqRef = useRef(null);
  const isFaqInView = useInView(faqRef, { once: true, amount: 0.2 });

  const testimonialsRef = useRef(null);
  const isTestimonialsInView = useInView(testimonialsRef, {
    once: true,
    amount: 0.2,
  });

  return (
    <div
      className="min-h-screen relative overflow-hidden transition-colors duration-500 
      bg-gradient-to-br from-indigo-50/70 via-white to-teal-50/70 
      dark:from-gray-900 dark:via-gray-950 dark:to-indigo-950"
    >
      <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply opacity-20 animate-blob dark:bg-indigo-700 dark:opacity-10" />
      <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply opacity-20 animate-blob animation-delay-2000 dark:bg-emerald-700 dark:opacity-10" />
      <div className="absolute top-1/2 left-1/4 w-52 h-52 bg-teal-300 rounded-full mix-blend-multiply opacity-20 animate-blob animation-delay-4000 dark:bg-teal-700 dark:opacity-10" />

      <div className="absolute inset-0 z-[1] pointer-events-none">
        <motion.div
          className="absolute top-0 left-0 w-40 h-40 bg-[#72e4f8]/20 dark:bg-[#07798d]/20 rounded-full -translate-x-1/3 -translate-y-1/3"
          variants={pulseSlowVariants}
          animate="animate"
        ></motion.div>
        <motion.div
          className="absolute bottom-0 right-0 w-80 h-80 bg-[#1ff498]/10 dark:bg-[#0be084]/10 rounded-full translate-x-1/3 translate-y-1/3"
          variants={floatVariants}
          animate="animate"
        ></motion.div>
        <motion.div
          className="absolute top-1/4 right-10 w-20 h-20 bg-[#50b7f7]/30 dark:bg-[#086faf]/30 rounded-full"
          variants={floatSlowVariants}
          animate="animate"
        ></motion.div>

        <motion.div
          className="absolute top-[10%] left-[10%] w-16 h-16 bg-purple-500/20 dark:bg-purple-700/20 rounded-full"
          variants={randomFloat}
          animate="animate"
        ></motion.div>
        <motion.div
          className="absolute top-[20%] right-[25%] w-12 h-12 bg-emerald-500/15 dark:bg-emerald-700/15 rounded-full"
          variants={pulseSlowVariants}
          animate="animate"
          style={{ transitionDelay: "1s" }}
        ></motion.div>
        <motion.div
          className="absolute top-[5%] left-[40%] w-24 h-24 bg-indigo-500/10 dark:bg-indigo-700/10 rounded-full"
          variants={floatVariants}
          animate="animate"
          style={{ transitionDelay: "0.5s" }}
        ></motion.div>
        <motion.div
          className="absolute bottom-[20%] left-[15%] w-14 h-14 bg-teal-500/25 dark:bg-teal-700/25 rounded-full"
          variants={upAndDown}
          animate="animate"
        ></motion.div>
        <motion.div
          className="absolute bottom-[5%] right-[20%] w-18 h-18 bg-pink-500/18 dark:bg-pink-700/18 rounded-full"
          variants={randomFloat}
          animate="animate"
          style={{ transitionDelay: "2s" }}
        ></motion.div>
        <motion.div
          className="absolute top-[40%] left-[5%] w-10 h-10 bg-rose-500/20 dark:bg-rose-700/20 rounded-full"
          variants={spiralFloat}
          animate="animate"
          style={{ transitionDelay: "1.5s" }}
        ></motion.div>
        <motion.div
          className="absolute top-[60%] right-[10%] w-20 h-20 bg-cyan-500/15 dark:bg-cyan-700/15 rounded-full"
          variants={floatSlowVariants}
          animate="animate"
          style={{ transitionDelay: "2.5s" }}
        ></motion.div>

        <motion.div
          className="absolute top-[30%] left-[5%] w-10 h-10 bg-rose-500/20 dark:bg-rose-700/30 rounded-full"
          variants={floatSlowVariants}
          animate="animate"
          style={{ transitionDelay: "0.8s" }}
        ></motion.div>
        <motion.div
          className="absolute top-[60%] right-[5%] w-24 h-24 bg-purple-500/10 dark:bg-purple-700/20 rounded-full"
          variants={floatVariants}
          animate="animate"
          style={{ transitionDelay: "0.5s" }}
        ></motion.div>
        <motion.div
          className="absolute top-[45%] right-[25%] w-14 h-14 bg-blue-400/20 dark:bg-blue-600/20 rounded-full"
          variants={pulseSlowVariants}
          animate="animate"
          style={{ transitionDelay: "0.3s" }}
        ></motion.div>

        <div
          className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 
            w-96 h-96 opacity-10 dark:opacity-5 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, #1ff498 1px, rgba(0, 0, 0, 0) 1px)`,
            backgroundSize: "20px 20px",
            transform: `rotate(45deg) scale(1.5)`,
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-9 lg:mt-14 py-9 md:py-10 relative z-10">
        <section className="text-center mb-20 md:mb-36">
          <div className="space-y-8 max-w-4xl mx-auto">
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full shadow-xl border-2
              bg-white/80 backdrop-blur-sm border-[#1ff498]
              dark:bg-gray-800/80"
            >
              <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
              <span className="text-sm md:text-base font-semibold text-gray-700 dark:text-gray-300">
                Platform Kesehatan Mental Terbaikmu
              </span>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="initial"
              animate="animate"
              className="space-y-6"
            >
              <motion.h1
                variants={fadeInUp}
                className="text-6xl md:text-7xl font-extrabold tracking-normal"
              >
                <GradientText
                  colors={[
                    "#40ffaa",
                    "#4079ff",
                    "#40ffaa",
                    "#4079ff",
                    "#40ffaa",
                  ]}
                  animationSpeed={10}
                  showBorder={false}
                  className="custom-class leading-tight"
                >
                  Bagaimana Kabarmu ?
                </GradientText>
                <span className="block text-gray-900 mt-2 dark:text-gray-100">
                  Jaga Jiwa
                </span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto text-gray-600 dark:text-gray-400"
              >
                Alat kesehatan mental berbasis AI yang dirancang untuk
                membantumu mengelola emosi, meningkatkan kesejahteraan, dan
                mencapai keseimbangan hidup yang optimal.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row justify-center gap-4 pt-4"
              >
                <a
                  href="/insight"
                  className="group relative inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-white bg-gradient-to-r from-[#1ff498] to-[#50b7f7] rounded-full transform hover:scale-105 transition-all duration-300 overflow-hidden hover:shadow-md hover:shadow-[#1ff498]/50"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  <span>Mulai Sekarang</span>
                </a>

                <a
                  href="/about"
                  className="inline-flex items-center justify-center px-10 py-4 text-lg font-semibold rounded-full transition-all duration-300 
                  text-gray-800 bg-white/90 backdrop-blur-md border-2 border-[#72e4f8] hover:border-[#1ff498] hover:scale-105
                  dark:text-gray-200 dark:bg-gray-800/90"
                >
                  Pelajari Lebih Lanjut
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>

      <StyledPathWithLeaves className="my-20 w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-9 relative z-10">
        <motion.div
          ref={philosophyRef}
          variants={fadeInUp}
          initial="initial"
          animate={isPhilosophyInView ? "animate" : "initial"}
          className="rounded-3xl mt-20 mb-20 p-8 md:p-14 text-center border-2 
          border-[#50b7f7] hover:border-[#1ff498] transition-all duration-500
          bg-white/50 backdrop-blur-sm dark:bg-gray-900/50"
        >
          <h2 className="text-4xl font-extrabold mb-6 text-gray-900 dark:text-gray-100">
            Filosofi Kami
          </h2>

          <motion.div
            variants={itemVariants}
            className="relative max-w-3xl mx-auto my-10 p-4 md:p-6 rounded-2xl bg-gradient-to-r from-[#1ff498]/10 to-[#50b7f7]/10 dark:from-[#0be084]/10 dark:to-[#086faf]/10 border-2 border-[#72e4f8]/30 dark:border-[#07798d]/30 hover:border-[#1ff498] dark:hover:border-[#0be084] transition-all duration-300"
          >
            <div className="absolute -left-3 -top-3 w-12 h-12 rounded-full bg-[#1ff498]/20 dark:bg-[#0be084]/20"></div>
            <div className="absolute -right-3 -bottom-3 w-12 h-12 rounded-full bg-[#50b7f7]/20 dark:bg-[#086faf]/20"></div>

            <div className="absolute left-4 top-4 text-5xl md:text-6xl font-serif text-[#1ff498]/30 dark:text-[#0be084]/30">
              "
            </div>

            <div className="relative z-10">
              <p className="text-xl md:text-2xl lg:text-3xl font-medium px-6 md:px-10 leading-relaxed">
                <span className="bg-gradient-to-r from-[#1ff498] to-[#50b7f7] dark:from-[#0be084] dark:to-[#086faf] bg-clip-text text-transparent font-bold">
                  Kesehatan mental
                </span>{" "}
                <span className="text-gray-900 dark:text-gray-100">
                  {" "}
                  adalah perjalanan, bukan tujuan. Jaga Jiwa berkomitmen menjadi
                  pendamping digitalmu yang andal, aman, dan tanpa penghakiman.
                  Kami percaya setiap individu berhak mendapatkan dukungan
                  terbaik untuk mencapai{" "}
                </span>
                <span className="bg-gradient-to-r from-[#50b7f7] to-[#1ff498] dark:from-[#086faf] dark:to-[#0be084] bg-clip-text text-transparent font-bold">
                  kesejahteraan jiwa
                </span>
                .
              </p>
            </div>

            <div className="absolute right-4 bottom-4 text-5xl md:text-6xl font-serif text-[#1ff498]/30 dark:text-[#0be084]/30">
              "
            </div>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-6 text-lg font-semibold mt-10">
            {PHILOSOPHY_TAGS.map((item, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                initial="initial"
                animate={isPhilosophyInView ? "animate" : "initial"}
                transition={{ delay: 0.1 * i + 0.5 }}
                className="flex items-center space-x-3 px-6 py-3 shadow-lg rounded-full border transition-all hover:scale-105
                text-gray-700 bg-white border-gray-100 hover:bg-gray-50
                dark:text-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <div
                  className={`w-3 h-3 bg-${item.color}-500 rounded-full animate-ping`}
                  style={{
                    animationDelay: `${i * 500}ms`,
                    animationDuration: "1500ms",
                  }}
                ></div>
                <span>{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <h2 className="pt-16 text-4xl font-extrabold mb-12 text-center text-gray-900 dark:text-gray-100">
          Mengapa Kami Berbeda?
        </h2>

        <motion.div
          ref={featuresRef}
          variants={containerVariants}
          initial="initial"
          animate={isFeaturesInView ? "animate" : "initial"}
          className="grid md:grid-cols-3 gap-10 mb-24"
        >
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;

            const featureId = feature.id || `feature-${index}`;

            return (
              <motion.div
                key={index}
                id={featureId}
                variants={itemVariants}
                className="rounded-3xl p-8 border-2 backdrop-blur-sm transition-all duration-500 transform group flex flex-col items-center text-center
                border-[#72e4f8] hover:border-[#1ff498] dark:bg-gray-900/50"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 dark:bg-indigo-500/20">
                  <Icon className="w-10 h-10 text-[#1ff498] transition-transform group-hover:scale-110" />
                </div>
                <h3 className="text-2xl font-extrabold mb-3 text-gray-900 dark:text-gray-100">
                  {feature.title}
                </h3>
                <p className="leading-relaxed mb-4 text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
                <a
                  href={feature.link}
                  className="mt-auto inline-flex items-center font-bold text-base transition-colors text-[#1ff498] hover:text-[#50b7f7]"
                >
                  Lihat Fitur <span className="ml-2 text-xl">&rarr;</span>
                </a>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    
      <StyledPathWithLeaves className="w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-9 relative z-10">
        <div className="mb-24 pt-10 ">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
            <h2 className="text-4xl font-extrabold text-center sm:text-left mb-6 sm:mb-0 text-gray-900 dark:text-gray-100">
              <BookOpen className="inline-block w-9 h-9 mr-3 text-emerald-600 dark:text-emerald-400" />
              Artikel
            </h2>
            <a
              href="/insight#artikel"
              className="font-bold text-lg inline-flex items-center text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              Lihat Semua Artikel <span className="ml-2 text-xl">&rarr;</span>
            </a>
          </div>

          <motion.div
            ref={articlesRef}
            variants={containerVariants}
            initial="initial"
            animate={isArticlesInView ? "animate" : "initial"}
            className="grid md:grid-cols-3 gap-10"
          >
            {ARTICLES.map((article, index) => (
              <motion.a
                key={article.id}
                variants={itemVariants}
                href={article.link}
                className="block rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 group transform hover:-translate-y-2 
                                bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 
                                border-2 dark:border-gray-700"
              >

                <div className="p-7">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2 block">
                    {article.category || "Kesehatan Mental"}
                  </span>
                  <h3 className="text-xl font-bold mb-3 leading-snug text-gray-900 group-hover:text-emerald-700 dark:text-gray-100 dark:group-hover:text-emerald-400">
                    {article.title}
                  </h3>
                  <p className="text-base line-clamp-3 text-gray-600 dark:text-gray-400">
                    {article.summary}
                  </p>
                  <div className="mt-5 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 group-hover:underline">
                      Baca Selengkapnya &rarr;
                    </span>
                  </div>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>

        <section ref={faqRef} className="mb-24 pt-10">
          <motion.h2
            variants={fadeInUp}
            initial="initial"
            animate={isFaqInView ? "animate" : "initial"}
            className="text-4xl font-extrabold mb-12 text-center text-gray-900 dark:text-gray-100"
          >
            <HelpCircle className="inline-block w-9 h-9 mr-3 text-[#50b7f7] dark:text-[#72e4f8]" />
            Pertanyaan yang Sering Diajukan (FAQ)
          </motion.h2>

          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate={isFaqInView ? "animate" : "initial"}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto rounded-3xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-xl bg-white dark:bg-gray-900"
          >
            {FAQ_DATA.map((item, index) => (
              <FaqItem
                key={index}
                question={item.question}
                answer={item.answer}
                index={index}
              />
            ))}
          </motion.div>
        </section>
      </div>
    
      <StyledPathWithLeaves className="w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-9 relative z-10">
        <section ref={testimonialsRef} className="mb-24 pt-10">
          <motion.h2
            variants={fadeInUp}
            initial="initial"
            animate={isTestimonialsInView ? "animate" : "initial"}
            className="text-4xl font-extrabold mb-12 text-center text-gray-900 dark:text-gray-100"
          >
            <Smile className="inline-block w-9 h-9 mr-3 text-rose-600 dark:text-rose-400" />
            Dengarkan Kata Mereka
          </motion.h2>

          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate={isTestimonialsInView ? "animate" : "initial"}
            transition={{ delay: 0.2 }}
            className="relative max-w-3xl mx-auto"
          >
            <div
              className="overflow-hidden rounded-3xl shadow-xl cursor-grab"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onMouseDown={onTouchStart}
              onMouseMove={onTouchMove}
              onMouseUp={onTouchEnd}
              onMouseLeave={isSwiping ? onTouchEnd : undefined}
            >
              <div
                ref={sliderRef}
                className="flex"
                style={{
                  transform: `translateX(-${activeTestimonial * 100}%)`,
                  transition: isSwiping ? "none" : "transform 0.7s ease-in-out",
                }}
              >
                {TESTIMONIALS.map((testimonial, index) => (
                  <div
                    key={index}
                    className={`flex-shrink-0 w-full p-6 md:p-8 rounded-3xl border-2 
                      bg-white dark:bg-gray-800 ${testimonial.color}`}
                  >
                    <Quote className="w-8 h-8 text-indigo-400 mb-4 opacity-70" />
                    <p className="text-lg italic leading-relaxed text-gray-700 dark:text-gray-300 mb-6 min-h-[100px] flex items-center">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex items-center space-x-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <img
                        className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-800"
                        src={testimonial.avatar}
                        alt={`Avatar ${testimonial.name}`}
                      />
                      <div>
                        <p className="font-bold text-gray-900 dark:text-gray-100">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {testimonial.title}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center space-x-3 mt-8">
              {TESTIMONIALS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none ${
                    index === activeTestimonial
                      ? "bg-[#1ff498] w-8 shadow-md"
                      : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate={isTestimonialsInView ? "animate" : "initial"}
            transition={{ delay: 0.4 }}
            className="max-w-4xl mx-auto p-8 rounded-3xl border shadow-lg text-center mt-16 
            bg-gradient-to-br from-emerald-100 to-teal-100 
            border-emerald-300
            dark:from-emerald-900/50 dark:to-teal-900/50 dark:border-emerald-700"
          >
            <h3 className="text-3xl font-bold mb-4 text-emerald-800 dark:text-emerald-400">
              Siap Menjadi Lebih Baik?
            </h3>
            <p className="mb-6 text-lg text-emerald-700 dark:text-emerald-300">
              Ingin tahu bagaimana Jaga Jiwa membantu ratusan orang menemukan
              ketenangan? Kunjungi bagian Tentang Kami dan kenali lebih dalam
              perjalanan ini.
            </p>
            <a
              href="/about"
              className="inline-flex items-center px-8 py-4 font-bold text-white bg-emerald-600 rounded-full hover:bg-emerald-700 transition-colors shadow-lg text-lg"
            >
              Kunjungi Sekarang <span className="ml-2 text-xl">&rarr;</span>
            </a>
          </motion.div>
        </section>
      </div>
      <div className="relative h-32 w-full overflow-hidden ">
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
          <motion.path
            fill="#4079ff" 
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
          <motion.path
            fill="#40ffaa" 
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
          <motion.path
            fill="#40ffaa" 
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
    </div>
  );
}

export default Home;
