import {
  Heart,
  Brain,
  MessageCircle,
  TrendingUp,
  BookOpen,
  Star,
  Zap,
  Smile,
  Sparkles,
} from "lucide-react";


function Home() {
  const features = [
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

  const articles = [
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

  return (
    <div
      className="min-h-screen relative overflow-hidden transition-colors duration-500 
      bg-gradient-to-br from-indigo-50/70 via-white to-rose-50/70 
      dark:from-gray-900 dark:via-gray-950 dark:to-indigo-950"
    >
      {/* === Background Blobs === */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob dark:bg-indigo-700 dark:opacity-30" />
      <div className="absolute bottom-1/4 right-0 w-1/3 h-1/3 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000 dark:bg-rose-700 dark:opacity-30" />
      <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 dark:bg-emerald-700 dark:opacity-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-9 md:py-14 relative z-10">
        {/* === Hero Section === */}
        <section className="text-center mb-20 md:mb-36">
          <div className="space-y-8 max-w-4xl mx-auto">
            <div
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full shadow-xl border-2 animate-fade-in-down
              bg-white/80 backdrop-blur-sm border-[#1ff498]
              dark:bg-gray-800/80"
            >
              <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
              <span className="text-sm md:text-base font-semibold text-gray-700 dark:text-gray-300">
                Platform Kesehatan Mental Terbaikmu
              </span>
            </div>

            <div className="space-y-6 animate-slide-up">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight">
                
                <span className="block text-gray-900 mt-2 dark:text-gray-100">
                  Jaga Jiwa.
                </span>
              </h1>

              <p className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
                Alat kesehatan mental berbasis AI yang dirancang untuk
                membantumu mengelola emosi, meningkatkan kesejahteraan, dan
                mencapai keseimbangan hidup yang optimal.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <a
                  href="/tracker"
                  className="group relative inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-white bg-gradient-to-r from-[#1ff498] to-[#50b7f7] rounded-full transform hover:scale-105 transition-all duration-300 overflow-hidden hover:shadow-md hover:shadow-[#1ff498]/50"
                >
                  <Zap className="w-5 h-5 mr-2 animate-pulse-fast" />
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
              </div>
            </div>
          </div>
        </section>

        {/* === Filosofi Kami === */}
        <div
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
            {[
              { text: "100% Anonim & Aman", color: "red" },
              { text: "Teknologi AI Canggih", color: "yellow" },
              { text: "Mendukung Kesejahteraan Pelajar", color: "emerald" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center space-x-3 px-6 py-3 shadow-lg rounded-full border transition-all hover:scale-105
                text-gray-700 bg-white border-gray-100 hover:bg-gray-50
                dark:text-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <div
                  className={`w-3 h-3 bg-${item.color}-500 rounded-full animate-ping-slow`}
                  style={{ animationDelay: `${i * 500}ms` }}
                ></div>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* === Mengapa Kami Berbeda === */}
        <h2 className="pt-16 text-4xl font-extrabold mb-12 text-center text-gray-900 dark:text-gray-100">
          Mengapa Kami Berbeda?
        </h2>

        <div className="grid md:grid-cols-3 gap-10 mb-24">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="rounded-3xl p-8 border-2 backdrop-blur-sm transition-all duration-500 transform group flex flex-col items-center text-center
                border-[#72e4f8] hover:border-[#1ff498] dark:bg-gray-900/50"
                style={{ animationDelay: `${index * 200}ms` }}
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
                  className="mt-auto inline-flex items-center font-bold text-base transition-colors text-[#1ff498] "
                >
                  Lihat Fitur <span className="ml-2 text-xl">&rarr;</span>
                </a>
              </div>
            );
          })}
        </div>

        {/* === Wawasan Terbaru === */}
        <div className="mb-24 pt-10 border-t border-[#72e4f8]">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10 ">
            <h2 className="text-4xl font-extrabold text-center sm:text-left mb-6 sm:mb-0 text-gray-900  dark:text-gray-100">
              <BookOpen className="inline-block w-9 h-9 mr-3 text-emerald-600 dark:text-emerald-400" />
              Wawasan Terbaru
            </h2>
            <a
              href="/blog"
              className="font-bold text-lg inline-flex items-center text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              Lihat Semua Artikel <span className="ml-2 text-xl">&rarr;</span>
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {articles.map((article, index) => (
              <a
                key={article.id}
                href={article.link}
                className="block rounded-3xl shadow-xl overflow-hidden border hover:shadow-2xl transition-all duration-300 group transform hover:-translate-y-2 bg-white border-gray-100 dark:bg-gray-800 dark:border-gray-700 ring-2 ring-[#72e4f8]"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="w-full h-52 bg-gray-100 overflow-hidden ">
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
              </a>
            ))}
          </div>
        </div>

        {/* === Testimoni Section === */}
        <div className="mb-24 pt-10 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-4xl font-extrabold mb-12 text-center text-gray-900 dark:text-gray-100">
            <Smile className="inline-block w-9 h-9 mr-3 text-rose-600 dark:text-rose-400" />
            Dengarkan Kata Mereka
          </h2>

          <div
            className="rounded-3xl p-8 md:p-14 shadow-2xl border 
            bg-gradient-to-br from-white to-rose-50 dark:from-gray-800 dark:to-gray-900
            border-rose-200 dark:border-gray-700"
          >
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2 text-center md:text-left">
                <div className="flex justify-center md:justify-start mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-7 h-7 text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>

                <p className="text-2xl font-medium italic leading-relaxed mb-5 text-gray-800 dark:text-gray-300">
                  "Jaga Jiwa benar-benar mengubah cara saya mengelola stres.
                  Fitur Mood Tracker-nya sangat membantu saya memahami pola
                  emosi saya, dan Talk Room terasa seperti memiliki teman yang
                  selalu ada."
                </p>
                <p className="font-bold text-lg text-gray-900 dark:text-gray-100">
                  - Alex, Mahasiswa Tahun Akhir
                </p>
                <p className="text-base text-gray-500 dark:text-gray-400">
                  Pengguna sejak Januari 2024
                </p>
              </div>

              {/* === CTA Card === */}
              <div
                className="md:w-1/2 p-8 rounded-3xl border shadow-lg text-center md:text-left
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
