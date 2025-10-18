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
// 1. Import Framer Motion
import { motion, useInView } from "framer-motion"; 
import GradientText from "../components/GradientText";

// === Komponen FAQ Item (Tidak Berubah) ===
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

// --- Data Testimoni (Tidak Berubah) ---
const TESTIMONIALS = [
  {
    quote: "Mood Tracker sangat membantu saya memahami pola emosi, dan Talk Room terasa seperti memiliki teman yang selalu ada.",
    name: "Alex K.",
    title: "Mahasiswa | Pengguna 6 Bulan",
    avatar: "https://cdn-icons-png.flaticon.com/128/236/236831.png",
    color: "border-rose-300 dark:bg-rose-900/10 dark:border-rose-700",
  },
  {
    quote: "Desainnya menenangkan dan fitur AI Journal-nya memberikan wawasan yang sangat mendalam tentang kecemasan saya.",
    name: "Bunga P.",
    title: "Karyawan Swasta | Pengguna 4 Bulan",
    avatar: "https://source.unsplash.com/random/100x100?portrait&sig=2",
    color: "border-indigo-300 dark:bg-indigo-900/10 dark:border-indigo-700",
  },
  {
    quote: "Sebagai platform gratis, kualitasnya luar biasa. Rasanya seperti mendapat dukungan mental tanpa perlu khawatir biaya.",
    name: "Chandra W.",
    title: "Freelancer | Pengguna 9 Bulan",
    avatar: "https://source.unsplash.com/random/100x100?portrait&sig=3",
    color: "border-emerald-300 dark:bg-emerald-900/10 dark:border-emerald-700",
  },
];
// --- Akhir Data Testimoni ---

// --- Variasi Animasi Framer Motion ---

// Animasi Fade In Up (untuk Hero, Filosofi)
const fadeInUp: any = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// Animasi Kontainer Stagger (untuk Fitur Grid, Artikel)
const containerVariants: any = {
  animate: {
    transition: {
      staggerChildren: 0.1, // Jeda antar elemen anak
      delayChildren: 0.2, // Jeda sebelum anak mulai bergerak
    },
  },
};

// Animasi Item (untuk anak di Grid)
const itemVariants: any = {
  initial: { opacity: 0, y: 50, scale: 0.8 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } },
};
// --- Akhir Variasi Animasi ---


// === Komponen Utama: Home ===
function Home() {
  // ... (State dan Fungsi Testimonial Slider tidak berubah)
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const totalTestimonials = TESTIMONIALS.length;
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const minSwipeDistance = 50; 
  const sliderRef = useRef<HTMLDivElement>(null); 
  
  // Fungsi untuk pindah ke slide berikutnya
  const nextSlide = () => {
    setActiveTestimonial((prev) => (prev + 1) % totalTestimonials);
  };

  // Fungsi untuk pindah ke slide sebelumnya
  const prevSlide = () => {
    setActiveTestimonial((prev) => (prev - 1 + totalTestimonials) % totalTestimonials);
  };

  // Navigasi manual untuk dot
  const goToSlide = (index: number) => {
    setActiveTestimonial(index);
  };

  // Auto-slide effect
  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 5000);
    return () => clearInterval(slideInterval);
  }, [totalTestimonials]); 

  // === Fungsi untuk Swipe/Drag Gesture ===
  const onTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setTouchStart(clientX);
    setTouchEnd(null);
    setIsSwiping(true);

    if (sliderRef.current) {
      sliderRef.current.style.transition = 'none';
    }
  };

  const onTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (touchStart === null) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setTouchEnd(clientX);

    const currentSlideOffset = activeTestimonial * 100;
    const containerWidth = e.currentTarget.clientWidth;
    const dragDistance = (clientX - touchStart) / containerWidth * 100;
    
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(-${currentSlideOffset - dragDistance}%)`;
    }
  };

  const onTouchEnd = () => {
    if (touchStart === null || touchEnd === null) {
      if (sliderRef.current) {
        sliderRef.current.style.transition = 'transform 0.7s ease-in-out';
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
        sliderRef.current.style.transition = 'transform 0.7s ease-in-out';
        sliderRef.current.style.transform = `translateX(-${activeTestimonial * 100}%)`;
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
            sliderRef.current.style.transition = 'transform 0.7s ease-in-out';
            sliderRef.current.style.transform = `translateX(-${activeTestimonial * 100}%)`;
          }
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [activeTestimonial, isSwiping]);
  // --- Akhir State dan Fungsi Testimonial Slider ---

  // === Ref untuk Mengamati Visibilitas (In View) ===
  const philosophyRef = useRef(null);
  const isPhilosophyInView = useInView(philosophyRef, { once: true, amount: 0.3 }); // Animasi sekali, ketika 30% elemen terlihat

  const featuresRef = useRef(null);
  const isFeaturesInView = useInView(featuresRef, { once: true, amount: 0.2 });

  const articlesRef = useRef(null);
  const isArticlesInView = useInView(articlesRef, { once: true, amount: 0.2 });

  const faqRef = useRef(null);
  const isFaqInView = useInView(faqRef, { once: true, amount: 0.2 });

  const testimonialsRef = useRef(null);
  const isTestimonialsInView = useInView(testimonialsRef, { once: true, amount: 0.2 });


  // Data yang tidak berubah...
  const FEATURES = [
    {
      icon: TrendingUp,
      title: "Mood Tracker",
      description: "Pantau perubahan suasana hatimu setiap hari",
      color: "from-purple-500 to-indigo-600",
    },
    {
      icon: Brain,
      title: "Journal Mood",
      description: "Tulis dan analisis perasaanmu dengan AI",
      color: "from-rose-500 to-pink-600",
    },
    {
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
      summary:
        "Pelajari cara mengenali tanda-tanda burnout dan strategi efektif untuk mengatasinya agar tetap produktif.",
      link: "/artikel/burnout-akademik",
    },
    {
      id: 2,
      title: "Pentingnya Mindfulness dalam Rutinitas Harian",
      summary:
        "Integrasikan praktik mindfulness ke dalam keseharianmu untuk meningkatkan fokus dan mengurangi stres.",
      link: "/artikel/mindfulness",
    },
    {
      id: 3,
      title: "Membangun Resiliensi Mental di Era Digital",
      summary:
        "Kembangkan ketahanan mental untuk menghadapi tantangan di dunia digital yang serba cepat dan penuh tekanan.",
      link: "/artikel/resiliensi-digital",
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

  return (
    <div
      className="min-h-screen relative overflow-hidden transition-colors duration-500 
      bg-gradient-to-br from-indigo-50/70 via-white to-rose-50/70 
      dark:from-gray-900 dark:via-gray-950 dark:to-indigo-950"
    >
      {/* === Background Blobs (Tidak Berubah) === */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob dark:bg-indigo-700 dark:opacity-30" />
      <div className="absolute bottom-1/4 right-0 w-1/3 h-1/3 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000 dark:bg-rose-700 dark:opacity-30" />
      <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 dark:bg-emerald-700 dark:opacity-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-9 lg:mt-14 py-9 md:py-10 relative z-10">
        
        {/* === Hero Section (Diberi Animasi) === */}
        <section className="text-center mb-20 md:mb-36">
          <div className="space-y-8 max-w-4xl mx-auto">
            
            {/* Tag Line */}
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
              {/* Judul Utama */}
              <motion.h1 
                variants={fadeInUp}
                className="text-5xl md:text-7xl font-extrabold tracking-tight"
              >
                <GradientText
                  colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
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

              {/* Paragraf Deskripsi */}
              <motion.p 
                variants={fadeInUp} 
                className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto text-gray-600 dark:text-gray-400"
              >
                Alat kesehatan mental berbasis AI yang dirancang untuk
                membantumu mengelola emosi, meningkatkan kesejahteraan, dan
                mencapai keseimbangan hidup yang optimal.
              </motion.p>

              {/* Tombol CTA */}
              <motion.div 
                variants={fadeInUp}
                className="flex flex-col sm:flex-row justify-center gap-4 pt-4"
              >
                <a
                  href="/tracker"
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

        <hr className="my-10 border-t border-gray-200 dark:border-gray-800" />
        
        {/* === Filosofi Kami (Diberi Animasi) === */}
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
          <p className="text-xl max-w-5xl mx-auto mb-10 leading-relaxed text-gray-700 dark:text-gray-400">
            Kesehatan mental adalah perjalanan, bukan tujuan. Jaga Jiwa
            berkomitmen menjadi pendamping digitalmu yang andal, aman, dan tanpa
            penghakiman. Kami percaya setiap individu berhak mendapatkan
            dukungan terbaik untuk mencapai kesejahteraan jiwa.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-lg font-semibold">
            {PHILOSOPHY_TAGS.map((item, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                initial="initial"
                animate={isPhilosophyInView ? "animate" : "initial"}
                transition={{ delay: 0.1 * i + 0.5 }} // Tambahkan delay untuk efek staggered
                className="flex items-center space-x-3 px-6 py-3 shadow-lg rounded-full border transition-all hover:scale-105
                text-gray-700 bg-white border-gray-100 hover:bg-gray-50
                dark:text-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <div
                  className={`w-3 h-3 bg-${item.color}-500 rounded-full animate-ping`}
                  style={{ animationDelay: `${i * 500}ms`, animationDuration: "1500ms" }}
                ></div>
                <span>{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <hr className="my-10 border-t border-gray-200 dark:border-gray-800" />

        {/* === Mengapa Kami Berbeda (Diberi Animasi Grid) === */}
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
            return (
              <motion.div
                key={index}
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
                  href="#"
                  className="mt-auto inline-flex items-center font-bold text-base transition-colors text-[#1ff498] hover:text-[#50b7f7]"
                >
                  Lihat Fitur <span className="ml-2 text-xl">&rarr;</span>
                </a>
              </motion.div>
            );
          })}
        </motion.div>

        <hr className="my-10 border-t border-gray-200 dark:border-gray-800" />

        {/* === Wawasan Terbaru / Artikel (Diberi Animasi Grid) === */}
        <div className="mb-24 pt-10 border-t border-[#72e4f8] ">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
            <h2 className="text-4xl font-extrabold text-center sm:text-left mb-6 sm:mb-0 text-gray-900 dark:text-gray-100">
              <BookOpen className="inline-block w-9 h-9 mr-3 text-emerald-600 dark:text-emerald-400" />
              Artikel
            </h2>
            <a
              href="/blog"
              className="font-bold text-lg inline-flex items-center text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              Lia Semua Artikel <span className="ml-2 text-xl">&rarr;</span>
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
                className="block rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group transform hover:-translate-y-2 bg-white border-2 dark:bg-gray-800 dark:border-gray-700"
              >
                <div className="w-full h-52 bg-gray-100 overflow-hidden">
                  <img
                    src={`https://source.unsplash.com/random/600x400?mental-health,wellness,nature&sig=${article.id}`}
                    alt={article.title}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-7">
                  <h3 className="text-xl font-bold mb-2 leading-snug text-gray-900 group-hover:text-purple-700 dark:text-gray-100 dark:group-hover:text-indigo-400">
                    {article.title}
                  </h3>
                  <p className="text-sm line-clamp-3 text-gray-600 dark:text-gray-400">
                    {article.summary}
                  </p>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>
        
        <hr className="my-10 border-t border-gray-200 dark:border-gray-800" />


        {/* === FAQ Section (Diberi Animasi) === */}
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
            className="max-w-4xl mx-auto rounded-3xl overflow-hidden border-2 border-gray-800 shadow-xl bg-white dark:bg-gray-800"
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
        
        <hr className="my-10 border-t border-gray-200 dark:border-gray-800" />


        {/* === Testimoni Section (Tidak Berubah Animasi In-View) === */}
        <section ref={testimonialsRef} className="mb-24 pt-10 border-t border-gray-200 dark:border-gray-700">
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
            {/* Carousel Wrapper (Swipe/Drag logic tetap) */}
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
                  transition: isSwiping ? 'none' : 'transform 0.7s ease-in-out',
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
            
            {/* Dot Navigation */}
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
          
          {/* CTA Card */}
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
              Siap Merasa Lebih Baik?
            </h3>
            <p className="mb-6 text-lg text-emerald-700 dark:text-emerald-300">
              Bergabunglah dengan ribuan pengguna yang telah menemukan
              ketenangan dan keseimbangan hidup dengan bantuan Jaga Jiwa.
              Mulai perjalanan kesehatan mentalmu sekarang!
            </p>
            <a
              href="/daftar"
              className="inline-flex items-center px-8 py-4 font-bold text-white bg-emerald-600 rounded-full hover:bg-emerald-700 transition-colors shadow-lg text-lg"
            >
              Daftar Gratis <span className="ml-2 text-xl">&rarr;</span>
            </a>
          </motion.div>
        </section>
      </div>
    </div>
  );
}

export default Home;