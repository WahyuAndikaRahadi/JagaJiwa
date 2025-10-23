import {
  BookHeart,
  Target,
  Users,
  Heart,
  Shield,
  Sparkles,
  Award,
  Lightbulb,
  BarChart,
  TrendingUp,
  Activity,
  Github,
  Instagram,
  Flower,
} from "lucide-react";
import type { ChartOptions, ChartData } from "chart.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js";
import { Line } from "react-chartjs-2";
import GradientText from "../components/GradientText";
import { motion } from "framer-motion"; // <-- DITAMBAHKAN
import CountUp from "../components/CountUp";


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface StatItem {
  number: string;
  label: string;
  icon: React.ElementType;
}

interface FeatureItem {
  icon: React.ElementType;
  title: string;
  description: string;
}

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  github?: string;
  instagram?: string;
}

// ===============================================
// --- VARIANT ANIMASI FRAMER MOTION ---
// ===============================================

const containerVariants: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

const textVariants: any = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const About: React.FC = () => {
  const features: (FeatureItem & { color: string })[] = [
    {
      icon: Heart,
      title: "Kesehatan Mental Prioritas",
      description:
        "Kami percaya kesehatan mental sama pentingnya dengan kesehatan fisik. Jaga Jiwa hadir sebagai ruang aman untuk menjaga kesejahteraan emosional Anda.",
      color: "from-red-500 to-pink-500",
    },
    {
      icon: Shield,
      title: "Privasi Terjamin",
      description:
        "Data dan cerita Anda adalah milik Anda. Kami menggunakan enkripsi tingkat lanjut untuk memastikan privasi dan keamanan informasi pribadi Anda.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Sparkles,
      title: "AI yang Empatik",
      description:
        "Teknologi AI kami dirancang untuk mendengarkan dengan empati, memberikan dukungan yang konstruktif, dan membantu Anda memahami emosi dengan lebih baik.",
      color: "from-teal-500 to-emerald-500",
    },
    {
      icon: Award,
      title: "Berbasis Riset",
      description:
        "Setiap fitur dikembangkan berdasarkan penelitian psikologi modern dan praktik terbaik dalam dukungan kesehatan mental.",
      color: "from-amber-500 to-orange-500",
    },
  ];

  const statistics: StatItem[] = [
    { number: "10K+", label: "Pengguna Aktif", icon: Users },
    { number: "50K+", label: "Sesi Curhat", icon: Heart },
    { number: "95%", label: "Kepuasan Pengguna", icon: Sparkles },
    { number: "24/7", label: "Dukungan Tersedia", icon: Shield },
  ];

  const jjFiturUnggulan: FeatureItem[] = [
    {
      icon: TrendingUp,
      title: "Mood Tracker",
      description:
        "Pantau perubahan suasana hatimu setiap hari dan lihat polanya secara visual di kalender dan grafik.",
    },
    {
      icon: BookHeart,
      title: "Journal Mood (AI)",
      description:
        "Tulis dan analisis perasaanmu. Dapatkan rangkuman AI yang empatik untuk membantumu berefleksi.",
    },
    {
      icon: Sparkles,
      title: "Latihan Interaktif",
      description:
        "Latih pikiranmu dengan worksheet CBT, Worry Vault, dan Gratitude Garden untuk membangun resiliensi.",
    },
    {
      icon: Activity,
      title: "Panduan Audio Fokus",
      description:
        "Dengarkan panduan audio singkat seperti pernapasan 4-7-8 dan body scan untuk relaksasi instan.",
    },
    {
      icon: Lightbulb,
      title: "Manajemen Emosi Sehat",
      description:
        "Edukasi pengelolaan emosi dan kebiasaan positif untuk mendukung kesejahteraan mental.",
    },
    {
      icon: BarChart,
      title: "Statistik Kesehatan Mood",
      description:
        "Pantau progres kesejahteraan mental melalui statistik sederhana dan rekomendasi personal.",
    },
    // --- FITUR BARU 1 ---
    {
      icon: Sparkles, // Menggunakan 'Sparkles' lagi untuk merepresentasikan AI
      title: "Jiwaku",
      description:
        "Teman virtual yang siap mendengarkan curahan hati Anda kapan saja, tanpa menghakimi, dan memberikan respon empatik.",
    },
    // --- FITUR BARU 2 ---
    {
      icon: Flower, // Menggunakan 'BookHeart' yang sudah diimpor
      title: "The Gratitude Garden",
      description:
        "Tuliskan satu hal yang kamu syukuri setiap hari, dan lihat bunga indah bermekaran sebagai simbol kebahagiaan dan ketenangan batinmu.",
    },
    {
      icon: Lightbulb, // Dari Insight.tsx & ArticleDetail.tsx
      title: "Artikel & Wawasan",
      description:
        "Dapatkan edukasi berbasis psikologi untuk mengatasi burnout, cemas, dan stres dari artikel pilihan.",
    },
  ];

  // --- DATA DIPERBARUI ---
  const teamMembers: TeamMember[] = [
    {
      name: "Muhammad Bintang",
      role: "Front-end",
      bio: "Seorang psikolog klinis dengan pengalaman lebih dari 10 tahun dalam terapi kognitif-perilaku dan kesehatan mental digital.",
      avatar: "/img/Bintang.jpeg",
      github: "https://github.com/Ktune-kpop",
      instagram: "https://instagram.com/bintanggg_20",
    },
    {
      name: "Wahyu Andika Rahadi",
      role: "Team Lead",
      bio: "Ahli dalam machine learning dan NLP yang bersemangat membangun teknologi AI yang empatik dan bertanggung jawab.",
      avatar: "/img/wahyu.jpeg",
      github: "https://github.com/WahyuAndikaRahadi",
      instagram: "https://instagram.com/andika.rwahyu",
    },
    {
      name: "Bagus Hasan Ali",
      role: "Head of Community & Content",
      bio: "Mengelola konten edukatif dan membangun komunitas yang aman dan suportif untuk semua pengguna Jaga Jiwa.",
      avatar: "/img/Bagus.jpeg",
      github: "https://github.com/Zyenmax",
      instagram: "https://instagram.com/bagushsnali",
    },
  ];

  const mentalHealthTrend = [
    { year: "2019", value: 9.5 },
    { year: "2020", value: 10.0 },
    { year: "2021", value: 11.0 },
    { year: "2022", value: 13.0 },
    { year: "2023", value: 17.0 },
    { year: "2024 (Est)", value: 19.0 },
    { year: "2025 (Est)", value: 20.0 },
  ];

  const lineChartData: ChartData<"line"> = {
    labels: mentalHealthTrend.map((d) => d.year),
    datasets: [
      {
        label: "Prevalensi Estimasi Populasi Terkena Kasus (%)",
        data: mentalHealthTrend.map((d) => d.value),
        borderColor: "#0d9488",
        // --- Dark Mode Chart: Menggunakan warna Teal/Hijau yang lebih terang untuk background chart, #0be084 adalah warna neon
        backgroundColor: "rgba(11, 224, 132, 0.1)", // Menggunakan #0be084 (Hijau Neon) dengan alpha
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 8,
      },
    ],
  };

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 15,
          color: "rgb(156 163 175)", // Default color, akan di-override di lineChartOptions
        },
      },
      title: {
        display: true,
        font: {
          size: 16,
          weight: "bold",
        },
        padding: {
          bottom: 20,
        },
        color: "rgb(156 163 175)", // Default color, akan di-override di lineChartOptions
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(156, 163, 175, 0.2)", // Grid line color
        },
        ticks: {
          color: "rgb(156 163 175)", // Tick label color
        },
      },
      x: {
        grid: {
          color: "rgba(156, 163, 175, 0.2)", // Grid line color
        },
        ticks: {
          color: "rgb(156 163 175)", // Tick label color
        },
      },
    },
  };

  const lineChartOptions: ChartOptions<"line"> = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        ...chartOptions.plugins!.title,
        text:
          "Tren Estimasi Kenaikan Prevalensi Gangguan Mental di Indonesia (2019-2025)",
        // Mengubah warna title agar adaptif di dark mode
        color: "rgb(156 163 175)",
      },
      legend: {
        ...chartOptions.plugins!.legend,
        labels: {
          ...chartOptions.plugins!.legend!.labels,
          color: "rgb(156 163 175)",
        }
      },
      tooltip: {
        ...chartOptions.plugins!.tooltip,
        callbacks: {
          label: (context) => ` ${context.dataset.label}: ${context.parsed.y} %`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Persentase Populasi (%)",
          color: "rgb(156 163 175)", // Title Y axis
        },
        grid: {
          color: "rgba(156, 163, 175, 0.2)",
        },
        ticks: {
          color: "rgb(156 163 175)",
        }
      },
      x: {
        grid: {
          color: "rgba(156, 163, 175, 0.2)",
        },
        ticks: {
          color: "rgb(156 163 175)",
        }
      }
    },
  };

  return (
    <div

      className="min-h-screen relative overflow-hidden transition-colors duration-500 
      bg-gradient-to-br from-indigo-50/70 via-white to-teal-50/70 
      dark:from-gray-900 dark:via-gray-950 dark:to-indigo-950"

    >
      {/* === Background Blobs (Copied from Home.tsx) === */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob dark:bg-indigo-700 dark:opacity-30" />
      <div className="absolute bottom-1/4 right-0 w-1/3 h-1/3 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000 dark:bg-rose-700 dark:opacity-30" />
      <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 dark:bg-emerald-700 dark:opacity-20" />

      {/* === HERO SECTION BARU (Bergaya seperti Home.tsx) === */}
      <section className="text-center py-20 md:py-36 relative z-10">
        <div className="space-y-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* === INI BAGIAN YANG DIBUNGKUS BORDER === */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className=" backdrop-blur-sm border-2 border-[#1ff498] dark:border-[#0be084] rounded-3xl p-6 md:p-8" // Mengubah warna dark:bg dan dark:border
          >
            <div className="space-y-6 animate-slide-up">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight">
                <GradientText
                  colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                  animationSpeed={8}
                  showBorder={false}
                  className="custom-class leading-tight"
                >
                  Tentang Kami
                </GradientText>
                <span className="block text-gray-900 mt-2 dark:text-[#ecfef7] "> {/* Mengubah dark:text */}
                  Jaga Jiwa
                </span>
              </h1>

              <p className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
                Memahami cerita di balik Jaga Jiwa dan komitmen kami untuk
                menciptakan ruang aman bagi kesehatan mentalmu.
              </p>
            </div>
          </motion.div>
          {/* === AKHIR BAGIAN YANG DIBUNGKUS BORDER === */}
        </div>
      </section>
      {/* === AKHIR HERO SECTION BARU === */}

      {/* Konten Asli Halaman About */}
      {/* Mengurangi padding atas sedikit agar tidak terlalu jauh */}
      <section className="py-12 md:py-20 "> {/* Mengubah dark:bg */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-1">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* MISI KAMI (Text) */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={textVariants}
            >
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-teal-50 text-teal-700 rounded-full text-sm font-semibold mb-6 dark:bg-[#0be084]/20 dark:text-[#0be084]"> {/* Mengubah dark:bg dan dark:text */}
                <Target className="w-4 h-4" />
                <span>Misi Kami</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 dark:text-[#ecfef7]"> {/* Mengubah dark:text */}
                Kesehatan Mental untuk Semua
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6 dark:text-gray-400">
                Di Indonesia, masih banyak stigma seputar kesehatan mental yang
                membuat orang enggan mencari bantuan.{" "}
                <span className="font-semibold text-gray-900 dark:text-[#ecfef7]"> {/* Mengubah dark:text */}
                  Jaga Jiwa
                </span>{" "}
                hadir untuk mengubah itu.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-6 dark:text-gray-400">
                Kami menyediakan platform yang mudah diakses, aman, dan gratis
                untuk membantu siapa saja yang membutuhkan tempat untuk berbagi,
                memahami perasaan mereka, dan mendapatkan dukungan awal.
              </p>
              <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl border border-teal-100 dark:from-[#0be084]/10 dark:to-emerald-900/10 dark:border-teal-800"> {/* Mengubah dark:from/to */}
                <Lightbulb className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1 dark:text-[#0be084]" /> {/* Mengubah dark:text */}
                <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                  <span className="font-semibold dark:text-[#ecfef7]"> {/* Mengubah dark:text */}
                    Catatan Penting:
                  </span>{" "}
                  Jaga Jiwa adalah alat pendukung awal dan tidak menggantikan
                  konsultasi profesional. Untuk kondisi serius, kami sangat
                  menyarankan untuk berkonsultasi dengan psikolog atau psikiater
                  berlisensi.
                </p>
              </div>
            </motion.div>

            {/* MISI KAMI (Visual) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ type: "spring", stiffness: 50, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-square bg-gradient-to-br from-teal-50 to-emerald-50 rounded-3xl overflow-hidden shadow-2xl dark:from-[#086faf]/60 dark:to-[#0be084]/60"> {/* Mengubah dark:from/to */}
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="grid grid-cols-2 gap-4 w-full">
                    {[Heart, Shield, Users, Sparkles].map((Icon, index) => (
                      <motion.div
                        key={index}
                        initial={{ rotate: -10, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="aspect-square bg-white rounded-2xl shadow-lg flex items-center justify-center transform hover:scale-110 transition duration-300 dark:bg-gray-800"
                      >
                        <Icon className="w-12 h-12 text-teal-600 dark:text-[#0be084]" /> {/* Mengubah dark:text */}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bagian Tentang Kami, Tujuan, Visi Misi */}
      <section className="py-16 md:py-20 "> {/* Mengubah dark:bg */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid md:grid-cols-2 gap-8 mb-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
          >
            {/* KARTU TENTANG KAMI */}
            <motion.div
              variants={itemVariants}
              className=" rounded-3xl p-8 border-2 border-[#1ff498] hover:border-[#50b7f7]  dark:border-[#0be084] dark:hover:border-[#086faf]" // Mengubah dark:bg dan dark:border/hover
            >
              <div className="inline-flex items-center space-x-2 px-4 py-2  text-teal-700 rounded-full text-sm font-semibold mb-6 w-fit dark:bg-[#0be084]/20 dark:text-[#0be084]"> {/* Mengubah dark:bg dan dark:text */}
                <BookHeart className="w-4 h-4" />
                <span>Tentang Kami</span>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
                <span className="font-semibold dark:text-[#ecfef7]"> {/* Mengubah dark:text */}
                  Jaga Jiwa
                </span>{" "}
                adalah platform digital kesehatan mental yang dirancang untuk
                membantu masyarakat Indonesia dalam menjaga dan meningkatkan
                kesejahteraan emosional mereka. Platform ini menyediakan ruang
                aman untuk berbagi perasaan, memahami kondisi mental, serta
                mendapatkan dukungan awal melalui teknologi AI yang empatik.
              </p>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                Lebih dari sekadar aplikasi,{" "}
                <span className="font-semibold dark:text-[#ecfef7]"> {/* Mengubah dark:text */}
                  Jaga Jiwa
                </span>{" "}
                adalah sahabat digital yang selalu siap mendengarkan tanpa
                menghakimi. Kami berkomitmen untuk menghapus stigma seputar
                kesehatan mental dan membuat dukungan psikologis lebih mudah
                diakses oleh semua kalangan, kapan saja dan di mana saja.
              </p>
            </motion.div>

            {/* KARTU TUJUAN KAMI */}
            <motion.div
              variants={itemVariants}
              className=" rounded-3xl p-8 border-2 border-[#1ff498] hover:border-[#50b7f7]  dark:border-[#0be084] dark:hover:border-[#086faf]" // Mengubah dark:bg dan dark:border/hover
            >
              <div className="inline-flex items-center space-x-2 px-4 py-2  text-teal-700 rounded-full text-sm font-semibold mb-6 w-fit dark:bg-[#0be084]/20 dark:text-[#0be084]"> {/* Mengubah dark:bg dan dark:text */}
                <Target className="w-4 h-4" />
                <span>Tujuan Kami</span>
              </div>
              <ul className="space-y-4">
                {/* UL LIST */}
                {["Mengedukasi masyarakat tentang pentingnya kesehatan mental dan mengurangi stigma yang ada.",
                  "Menyediakan akses mudah ke dukungan kesehatan mental yang aman dan terpercaya.",
                  "Mendorong kebiasaan pemantauan emosi melalui fitur tracking dan journaling interaktif.",
                  "Membantu pengguna dalam memahami dan mengelola perasaan mereka dengan lebih baik."
                ].map((tujuan, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                      {tujuan}
                    </p>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>

          {/* KARTU VISI & MISI */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={textVariants}
            className="flex justify-center"
          >
            <div className=" rounded-3xl p-8 md:p-12 border-2 border-[#1ff498] hover:border-[#50b7f7]  dark:border-[#0be084] dark:hover:border-[#086faf] max-w-3xl w-full"> {/* Mengubah dark:bg dan dark:border/hover */}
              <div className="inline-flex items-center space-x-2 px-4 py-2  text-teal-700 rounded-full text-sm font-semibold mb-8 w-fit dark:bg-[#0be084]/20 dark:text-[#0be084]"> {/* Mengubah dark:bg dan dark:text */}
                <Sparkles className="w-4 h-4" />
                <span>Visi & Misi</span>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 dark:text-[#ecfef7]"> {/* Mengubah dark:text */}
                    Visi:
                  </h3>
                  <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                    Menjadi platform kesehatan mental digital terdepan di
                    Indonesia yang dapat membantu masyarakat mencapai
                    kesejahteraan emosional dan hidup yang lebih berkualitas.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 dark:text-[#ecfef7]"> {/* Mengubah dark:text */}
                    Misi:
                  </h3>
                  <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                    Memberikan dukungan kesehatan mental yang mudah diakses,
                    aman, dan berbasis teknologi AI untuk meningkatkan kesadaran
                    dan pemahaman masyarakat tentang pentingnya menjaga
                    kesehatan jiwa.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mengapa Memilih Jaga Jiwa? (Features) */}
      <section className="py-16 md:py-24  relative z-10 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={textVariants}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 dark:text-[#ecfef7]"> {/* Mengubah dark:text */}
              Mengapa Memilih Jaga Jiwa?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto dark:text-gray-400">
              Kami berkomitmen memberikan dukungan terbaik untuk kesehatan
              mental Anda
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group  rounded-2xl p-8 border-2 border-[#1ff498] hover:border-[#50b7f7]  dark:border-[#0be084] dark:hover:border-[#086faf]" // Mengubah dark:bg dan dark:border/hover
                >
                  <div
                    className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 dark:text-[#ecfef7]"> {/* Mengubah dark:text */}
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed dark:text-gray-400">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ======================================= */}
      {/* === AWAL BAGIAN DESAIN KAMI (BARU) === */}
      {/* ======================================= */}
      <section className="py-16 md:py-24  relative z-10 "> {/* Mengubah dark:bg */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={textVariants}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold bg-teal-50 text-teal-700 border border-teal-200 mb-4 dark:bg-[#0be084]/20 dark:text-[#0be084]"> {/* Mengubah dark:bg dan dark:text */}
              <Sparkles className="w-4 h-4" /> <span>Desain Kami</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 dark:text-[#ecfef7]"> {/* Mengubah dark:text */}
              Palet Warna Jaga Jiwa
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto dark:text-gray-400">
              Warna-warna yang kami pilih dirancang untuk menciptakan lingkungan
              yang tenang, segar, dan mudah diakses.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            {/* --- Light Mode --- */}
            <motion.div
              variants={itemVariants}
              className="bg-white border-2 border-[#1ff498] hover:border-[#50b7f7] rounded-3xl p-6 md:p-8 dark:bg-gray-800 dark:border-teal-700 dark:hover:border-teal-500"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6 dark:text-[#ecfef7]"> {/* Mengubah dark:text */}
                Light Mode
              </h3>

              {/* Color Swatches */}
              <div className="flex flex-wrap gap-4 mb-6">
                {/* #f6fefc */}
                <div className="text-center">
                  <div
                    className="w-16 h-16 rounded-xl border border-gray-200 dark:border-gray-700" // Menambah dark:border
                    style={{ backgroundColor: "#f6fefc" }}
                  />
                  <span className="text-xs font-mono text-gray-600 mt-2 block dark:text-gray-400">
                    #f6fefc
                  </span>
                </div>
                {/* #1ff498 */}
                <div className="text-center">
                  <div
                    className="w-16 h-16 rounded-xl"
                    style={{ backgroundColor: "#1ff498" }}
                  />
                  <span className="text-xs font-mono text-gray-600 mt-2 block dark:text-gray-400">
                    #1ff498
                  </span>
                </div>
                {/* #50b7f7 */}
                <div className="text-center">
                  <div
                    className="w-16 h-16 rounded-xl"
                    style={{ backgroundColor: "#50b7f7" }}
                  />
                  <span className="text-xs font-mono text-gray-600 mt-2 block dark:text-gray-400">
                    #50b7f7
                  </span>
                </div>
                {/* #01130c */}
                <div className="text-center">
                  <div
                    className="w-16 h-16 rounded-xl"
                    style={{ backgroundColor: "#01130c" }}
                  />
                  <span className="text-xs font-mono text-gray-600 mt-2 block dark:text-gray-400">
                    #01130c
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                Warna hijau muda (#1ff498) melambangkan pertumbuhan dan
                kesehatan, biru (#50b7f7) menunjukkan kepercayaan dan
                profesionalisme, sementara latar belakang putih (#f6fefc)
                memberikan kesan bersih dan segar.
              </p>
            </motion.div>

            {/* === KARTU DARK MODE === */}
            <motion.div
              variants={itemVariants}
              // Mengubah semua class ke Tailwind Dark Mode dengan palet yang ditentukan
              className="bg-[#010907]/90 border-2 border-[#0be084] rounded-3xl p-6 md:p-8 hover:border-[#086faf]"
            >
              <h3 className="text-2xl font-bold text-[#ecfef7] mb-6">
                Dark Mode
              </h3>

              {/* Color Swatches */}
              <div className="flex flex-wrap gap-4 mb-6">
                {/* #010907 */}
                <div className="text-center">
                  <div
                    className="w-16 h-16 rounded-xl border border-gray-700"
                    style={{ backgroundColor: "#010907" }}
                  />
                  <span className="text-xs font-mono text-gray-400 mt-2 block">
                    #010907
                  </span>
                </div>
                {/* #0be084 */}
                <div className="text-center">
                  <div
                    className="w-16 h-16 rounded-xl"
                    style={{ backgroundColor: "#0be084" }}
                  />
                  <span className="text-xs font-mono text-gray-400 mt-2 block">
                    #0be084
                  </span>
                </div>
                {/* #086faf */}
                <div className="text-center">
                  <div
                    className="w-16 h-16 rounded-xl"
                    style={{ backgroundColor: "#086faf" }}
                  />
                  <span className="text-xs font-mono text-gray-400 mt-2 block">
                    #086faf
                  </span>
                </div>
                {/* #ecfef7 */}
                <div className="text-center">
                  <div
                    className="w-16 h-16 rounded-xl border border-gray-600"
                    style={{ backgroundColor: "#ecfef7" }}
                  />
                  <span className="text-xs font-mono text-gray-400 mt-2 block">
                    #ecfef7
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-300 leading-relaxed">
                Warna hijau neon (#0be084) pada dark mode memberikan kontras
                tinggi untuk aksesibilitas, dengan latar belakang hitam
                (#010907) yang mengurangi ketegangan mata dan menciptakan
                pengalaman membaca yang nyaman di malam hari.
              </p>
            </motion.div>
            {/* === AKHIR KARTU DARK MODE === */}
          </motion.div>
        </div>
      </section>
      {/* === AKHIR BAGIAN DESAIN KAMI === */}

      {/* === BAGIAN TIM KAMI (DIPERBARUI) === */}
      <section className="py-16 md:py-24 relative z-10 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={textVariants}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold bg-teal-50 text-teal-700 border border-teal-200 mb-4 dark:bg-[#0be084]/20 dark:text-[#0be084]"> {/* Mengubah dark:bg dan dark:text */}
              <Users className="w-4 h-4" />
              <span>Tim Kami</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 dark:text-[#ecfef7]"> {/* Mengubah dark:text */}
              Orang-Orang di Balik Jaga Jiwa
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto dark:text-gray-400">
              Kami adalah tim profesional yang bersemangat untuk membuat
              perbedaan dalam dunia kesehatan mental.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group flex flex-col items-center text-center  rounded-2xl p-8 border-2 border-[#1ff498] hover:border-teal-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2  dark:border-[#0be084] dark:hover:border-[#086faf]" // Mengubah dark:bg dan dark:border/hover
              >
                <div className="relative mb-6">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-100 to-emerald-200 transform scale-100 blur-lg transition-all duration-300 group-hover:scale-110 dark:from-[#0be084]/30 dark:to-[#086faf]/30" /> {/* Mengubah dark:from/to */}
                  <img
                    className="relative w-32 h-32 rounded-full object-cover shadow-lg mx-auto ring-4 ring-white group-hover:ring-teal-300 transition-all duration-300 dark:ring-gray-800 dark:group-hover:ring-[#0be084]" // Mengubah dark:group-hover:ring
                    src={member.avatar}
                    alt={`Foto ${member.name}`}
                  />
                  <div className="absolute bottom-1 right-1 bg-teal-500 rounded-full p-2 border-4 border-white dark:border-gray-800">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                </div>

                <div className="flex flex-col flex-grow items-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-1 dark:text-[#ecfef7]"> {/* Mengubah dark:text */}
                    {member.name}
                  </h3>
                  <p className="text-teal-600 font-semibold mb-4 dark:text-[#0be084]"> {/* Mengubah dark:text */}
                    {member.role}
                  </p>
                  <p className="text-gray-600 leading-relaxed text-sm dark:text-gray-400">
                    {member.bio}
                  </p>
                </div>

                {(member.github || member.instagram) && (
                  <div className="flex items-center justify-center gap-5 mt-6 pt-6 border-t border-teal-100 dark:border-[#0be084]/50 w-full"> {/* Mengubah dark:border */}
                    {member.github && (
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-[#ecfef7] transition-colors" // Mengubah dark:hover:text
                        aria-label={`${member.name}'s GitHub`}
                      >
                        <Github className="w-6 h-6" />
                      </a>
                    )}
                    {member.instagram && (
                      <a
                        href={member.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-pink-600 dark:text-gray-400 dark:hover:text-[#0be084] transition-colors" // Mengubah dark:hover:text
                        aria-label={`${member.name}'s Instagram`}
                      >
                        <Instagram className="w-6 h-6" />
                      </a>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      {/* === AKHIR BAGIAN TIM KAMI === */}

      <section className="py-16 md:py-24  relative z-10 "> {/* Mengubah dark:bg */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={textVariants}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold bg-teal-50 text-teal-700 border border-teal-200 mb-4 dark:bg-[#0be084]/20 dark:text-[#0be084]"> {/* Mengubah dark:bg dan dark:text */}
              <TrendingUp className="w-4 h-4" />
              <span>Data & Wawasan</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 dark:text-[#ecfef7]"> {/* Mengubah dark:text */}
              Memahami Lanskap Kesehatan Mental di Indonesia
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto dark:text-gray-400">
              Visualisasi data dari berbagai sumber ini menyoroti urgensi dan
              skala tantangan kesehatan mental yang kita hadapi bersama.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7 }}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800"
            >
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 dark:text-[#ecfef7]"> {/* Mengubah dark:text */}
                  <Activity className="text-teal-600 dark:text-[#0be084]" /> {/* Mengubah dark:text */}
                  Tren yang Perlu Diwaspadai
                </h3>
                <p className="text-gray-600 mt-2 dark:text-gray-400">
                  Grafik ini menunjukkan adanya peningkatan prevalensi gangguan
                  mental yang konsisten dari tahun ke tahun di Indonesia. Angka
                  ini menekankan pentingnya kesadaran dan intervensi dini.
                </p>
              </div>
              <Line options={lineChartOptions} data={lineChartData} />
            </motion.div>
          </div>

          {/* === BAGIAN LATAR BELAKANG (DIPERBARUI) === */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={textVariants}
            className="mt-12 max-w-7xl mx-auto  border border-teal-200 rounded-2xl p-10 shadow-sm  dark:border-[#0be084]" // Mengubah dark:bg dan dark:border
          >
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold bg-teal-50 text-teal-700 border border-teal-200 dark:bg-[#0be084]/20 dark:text-[#0be084]"> {/* Mengubah dark:bg dan dark:text */}
              <Lightbulb className="w-5 h-4" />
              <span>Latar Belakang</span>
            </div>

            <div className="mt-6 space-y-4 text-gray-700 leading-relaxed dark:text-gray-300">
              <p>
                Data yang tersaji di atas bukan sekadar angka; itu adalah
                cerminan dari tantangan nyata yang dihadapi oleh jutaan
                masyarakat Indonesia. Tren kenaikan prevalensi yang konsisten
                menjadi{" "}
                <span className="font-semibold text-gray-900 dark:text-[#ecfef7]"> {/* Mengubah dark:text */}
                  latar belakang utama
                </span>{" "}
                dan panggilan mendesak bagi kami. Kami melihat adanya{" "}
                <span className="font-semibold text-gray-900 dark:text-[#ecfef7]"> {/* Mengubah dark:text */}
                  kebutuhan mendesak
                </span>{" "}
                akan dukungan kesehatan mental yang lebih mudah dijangkau.
                Peningkatan ini, yang mungkin dipercepat oleh tekanan kehidupan
                modern, dampak pasca-pandemi, dan tuntutan digital, menunjukkan
                bahwa metode dukungan tradisional saja tidak lagi mencukupi.
              </p>
              <p>
                Di saat yang sama, kami menyadari adanya jurang besar antara
                mereka yang membutuhkan bantuan dan mereka yang
                mendapatkannya.{" "}
                <span className="font-semibold text-gray-900 dark:text-[#ecfef7]"> {/* Mengubah dark:text */}
                  Stigma sosial
                </span>{" "}
                yang masih melekat kuat membuat banyak orang takut untuk
                berbicara atau dicap "lemah". Selain itu,{" "}
                <span className="font-semibold text-gray-900 dark:text-[#ecfef7]"> {/* Mengubah dark:text */}
                  akses yang terbatas
                </span>{" "}
                ke psikolog atau psikiater profesional—baik karena lokasi
                geografis maupun antrean panjang—serta{" "}
                <span className="font-semibold text-gray-900 dark:text-[#ecfef7]"> {/* Mengubah dark:text */}
                  biaya konsultasi yang tinggi
                </span>
                , menjadi penghalang yang nyata. Akibatnya, jutaan individu
                terpaksa berjuang dalam diam, merasa sendirian, dan membiarkan
                masalah kecil berkembang menjadi krisis yang lebih besar.
              </p>
              <p>
                Oleh karena itu,{" "}
                <span className="font-semibold text-gray-900 dark:text-[#ecfef7]"> {/* Mengubah dark:text */}
                  Jaga Jiwa lahir
                </span>{" "}
                sebagai jawaban atas tantangan ini. Kami hadir untuk
                menjembatani kesenjangan tersebut. Misi kami adalah
                mendemokratisasi kesehatan mental. Kami percaya bahwa setiap
                orang berhak mendapatkan ruang untuk didengar. Dengan
                memanfaatkan kekuatan teknologi dan AI yang empatik, kami
                berkomitmen menyediakan sebuah platform digital yang{" "}
                <span className="font-semibold text-gray-900 dark:text-[#ecfef7]"> {/* Mengubah dark:text */}
                  aman, mudah diakses 24/7, sepenuhnya anonim, tanpa stigma, dan
                  gratis
                </span>
                . Jaga Jiwa dirancang sebagai sahabat digital dan langkah awal
                yang suportif bagi siapa saja yang sedang dalam perjalanan
                menjaga kesehatan jiwanya.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dampak Kami Dalam Angka (Statistics) */}
      {/* Dampak Kami Dalam Angka (Statistics) */}
      <section className="py-16 md:py-24  relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={textVariants}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 dark:text-[#ecfef7]">
              Dampak Kami dalam Angka
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Bersama membangun masyarakat yang lebih sehat
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            {/* Stat 1: Pengguna Aktif */}
            <motion.div
              variants={itemVariants}
              className=" border-2 border-[#1ff498] hover:border-[#50b7f7]  rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 "
            >
              <Users className="w-10 h-10 text-teal-600 mb-4 mx-auto dark:text-[#0be084]" />
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 dark:text-[#ecfef7]">
                  <CountUp
                    from={0}
                    to={80}
                    separator=","
                    direction="up"
                    duration={3}
                    className="count-up-text"
                  />
                </div>
                <div className="text-sm text-gray-600 font-medium dark:text-gray-400">
                  Pengguna Aktif
                </div>
              </div>
            </motion.div>

            {/* Stat 2: Sesi Curhat */}
            <motion.div
              variants={itemVariants}
              className=" border-2 border-[#1ff498] hover:border-[#50b7f7]  rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 "
            >
              <Heart className="w-10 h-10 text-teal-600 mb-4 mx-auto dark:text-[#0be084]" />
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 dark:text-[#ecfef7]">
                  <CountUp
                    from={0}
                    to={120}
                    separator=","
                    direction="up"
                    duration={3}
                    className="count-up-text"
                  />
                </div>
                <div className="text-sm text-gray-600 font-medium dark:text-gray-400">
                  Sesi Curhat
                </div>
              </div>
            </motion.div>

            {/* Stat 3: Kepuasan Pengguna */}
            <motion.div
              variants={itemVariants}
              className=" border-2 border-[#1ff498] hover:border-[#50b7f7]  rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 "
            >
              <Sparkles className="w-10 h-10 text-teal-600 mb-4 mx-auto dark:text-[#0be084]" />
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 dark:text-[#ecfef7]">
                  <CountUp
                    from={0}
                    to={95}
                    separator=","
                    direction="up"
                    duration={3}
                    className="count-up-text"
                  />%
                </div>
                <div className="text-sm text-gray-600 font-medium dark:text-gray-400">
                  Kepuasan Pengguna
                </div>
              </div>
            </motion.div>

            {/* Stat 4: Dukungan Tersedia */}
            <motion.div
              variants={itemVariants}
              className=" border-2 border-[#1ff498] hover:border-[#50b7f7]  rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 "
            >
              <Shield className="w-10 h-10 text-teal-600 mb-4 mx-auto dark:text-[#0be084]" />
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 dark:text-[#ecfef7]">
                  <CountUp
                    from={0}
                    to={24}
                    separator=","
                    direction="up"
                    duration={3}
                    className="count-up-text"
                  />/<CountUp
                    from={0}
                    to={7}
                    separator=","
                    direction="up"
                    duration={3}
                    className="count-up-text"
                  />
                </div>
                <div className="text-sm text-gray-600 font-medium dark:text-gray-400">
                  Dukungan Tersedia
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Fitur Unggulan */}
      <section className="py-10 md:py-12  relative z-10 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={containerVariants}
            className="rounded-3xl border-2 border-teal-200   dark:border-[#0be084]" // Mengubah dark:bg dan dark:border
          >
            <div className="flex items-center gap-2 px-6 md:px-8 pt-6">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold bg-teal-50 text-teal-700 dark:bg-[#0be084]/20 dark:text-[#0be084]"> {/* Mengubah dark:bg dan dark:text */}
                <Sparkles className="w-4 h-4" />
                <span>Fitur-Fitur kami</span>
              </div>
            </div>

            <div className="px-6 md:px-8 pb-8 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jjFiturUnggulan.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={idx}
                      variants={itemVariants}
                      className="rounded-xl border-2 border-[#1ff498] hover:border-[#50b7f7]  p-6 hover:shadow-md transition-shadow duration-300 dark:border-[#0be084]/50 " // Mengubah dark:border dan dark:bg
                    >
                      <div className="flex items-start gap-4">
                        <div className="shrink-0 rounded-lg p-2 bg-teal-100 dark:bg-[#0be084]/20"> {/* Mengubah dark:bg */}
                          <Icon className="w-6 h-6 text-teal-700 dark:text-[#0be084]" /> {/* Mengubah dark:text */}
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-gray-900 dark:text-[#ecfef7]"> {/* Mengubah dark:text */}
                            {item.title}
                          </h3>
                          <p className="mt-2 text-sm text-gray-600 leading-relaxed dark:text-gray-400">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

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
    </div>
  );
};

export default About;