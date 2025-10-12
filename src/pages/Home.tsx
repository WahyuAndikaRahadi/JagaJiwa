import { Heart, Brain, MessageCircle, TrendingUp, BookOpen, Star, Zap, Smile, Sparkles } from 'lucide-react';

function Home() {
  const features = [
    {
      icon: TrendingUp,
      title: 'Mood Tracker',
      description: 'Pantau perubahan suasana hatimu setiap hari',
      color: 'from-purple-500 to-indigo-600', // Warna lebih berani
    },
    {
      icon: Brain,
      title: 'Journal Mood',
      description: 'Tulis dan analisis perasaanmu dengan AI',
      color: 'from-rose-500 to-pink-600', // Warna lebih berani
    },
    {
      icon: MessageCircle,
      title: 'Talk Room',
      description: 'Curhat dengan AI yang siap mendengarkan',
      color: 'from-emerald-500 to-teal-600', // Warna lebih berani
    },
  ];

  const articles = [
    {
      id: 1,
      title: 'Mengatasi Burnout Akademik: Tips dan Strategi',
      summary: 'Pelajari cara mengenali tanda-tanda burnout dan strategi efektif untuk mengatasinya agar tetap produktif.',
      link: '/artikel/burnout-akademik',
    },
    {
      id: 2,
      title: 'Pentingnya Mindfulness dalam Rutinitas Harian',
      summary: 'Integrasikan praktik mindfulness ke dalam keseharianmu untuk meningkatkan fokus dan mengurangi stres.',
      link: '/artikel/mindfulness',
    },
    {
      id: 3,
      title: 'Membangun Resiliensi Mental di Era Digital',
      summary: 'Kembangkan ketahanan mental untuk menghadapi tantangan di dunia digital yang serba cepat dan penuh tekanan.',
      link: '/artikel/resiliensi-digital',
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-50/70 via-white to-rose-50/70">
      {/* Background blobs yang lebih dinamis */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
      <div className="absolute bottom-1/4 right-0 w-1/3 h-1/3 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
      <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-9 md:py-8 relative z-10">

        <section className="text-center mb-20 md:mb-28">
          {/* Header utama di tengah */}
          <div className="space-y-8 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-xl border border-indigo-100 animate-fade-in-down">
              <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
              <span className="text-sm md:text-base font-semibold text-gray-700">Platform Kesehatan Mental Terbaikmu</span>
            </div>

            <div className="space-y-6 animate-slide-up">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight tracking-tight">
                <span className="block text-gray-900 mb-2">Temukan</span>
                <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 bg-clip-text text-transparent animate-gradient-slow">
                  Ketenangan,
                </span>
                <span className="block text-gray-900 mt-2">Jaga Jiwa.</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                Alat kesehatan mental berbasis AI yang dirancang khusus untuk membantumu mengelola emosi, meningkatkan kesejahteraan, dan mencapai keseimbangan hidup yang optimal.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <a
                  href="/tracker"
                  className="group relative inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-2xl hover:shadow-indigo-400/50 transform hover:scale-105 transition-all duration-300 overflow-hidden ring-4 ring-indigo-300 ring-opacity-50"
                >
                  <span className="absolute inset-0 w-full h-full transition duration-300 ease-out opacity-0 bg-gradient-to-r from-white/10 via-white/50 to-white/10 group-hover:opacity-100"></span>
                  <Zap className="w-5 h-5 mr-2 animate-pulse-fast" />
                  <span className="relative">Mulai Sekarang</span>
                </a>

                <a
                  href="/tentang"
                  className="inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-gray-800 bg-white/90 backdrop-blur-md border-2 border-gray-200 rounded-full hover:border-purple-400 hover:text-purple-700 transition-all duration-300 shadow-md"
                >
                  Pelajari Lebih Lanjut
                </a>
              </div>
            </div>
          </div>
        </section>

        <h2 className="text-4xl font-extrabold text-gray-900 mb-12 text-center pt-10 animate-fade-in">
          Mengapa Kami Berbeda?
        </h2>
        <div className="grid md:grid-cols-3 gap-10 mb-24">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 backdrop-blur-sm transition-all duration-500 hover:shadow-purple-200/50 hover:border-purple-300 transform hover:-translate-y-3 group flex flex-col items-center text-center animate-slide-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${feature.color} rounded-full mb-6 shadow-xl`}>
                  <Icon className="w-10 h-10 text-white transition-transform group-hover:rotate-12 group-hover:scale-110" />
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {feature.description}
                </p>
                <a href="#" className="mt-auto inline-flex items-center text-purple-600 font-bold text-base hover:text-purple-800 transition-colors group-hover:underline">
                  Lihat Fitur <span className='ml-2 text-xl'>&rarr;</span>
                </a>
              </div>
            );
          })}
        </div>

        <div className="mb-24 pt-10 border-t border-gray-200 animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
            <h2 className="text-4xl font-extrabold text-gray-900 text-center sm:text-left mb-6 sm:mb-0">
              <BookOpen className="inline-block w-9 h-9 mr-3 text-emerald-600" />
              Wawasan Terbaru
            </h2>
            <a
              href="/blog"
              className="text-emerald-600 font-bold hover:text-emerald-800 transition-colors text-lg inline-flex items-center"
            >
              Lihat Semua Artikel <span className='ml-2 text-xl'>&rarr;</span>
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {articles.map((article, index) => (
              <a
                href={article.link}
                key={article.id}
                className="block bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 group transform hover:-translate-y-2 animate-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className={`w-full ${index === 0 ? 'h-52' : 'h-40'} bg-gray-100 flex items-center justify-center text-gray-500 font-medium overflow-hidden`}>
                  <img src={`https://source.unsplash.com/random/600x400?mental-health,wellness,nature&sig=${article.id}`} alt={`Gambar Artikel ${article.id}`} className='object-cover w-full h-full transition-transform duration-500 group-hover:scale-110' />
                </div>
                <div className="p-7">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {article.summary}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="mb-24 pt-10 border-t border-gray-200 animate-fade-in">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-12 text-center">
            <Smile className="inline-block w-9 h-9 mr-3 text-rose-600" />
            Dengarkan Kata Mereka
          </h2>

          <div className="bg-gradient-to-br from-white to-rose-50 rounded-3xl p-8 md:p-14 shadow-2xl border border-rose-200">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2 text-center md:text-left">
                <div className="flex justify-center md:justify-start mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-7 h-7 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-2xl font-medium italic text-gray-800 leading-relaxed mb-5">
                  "Jaga Jiwa benar-benar mengubah cara saya mengelola stres. Fitur Mood Tracker-nya sangat membantu saya memahami pola emosi saya, dan Talk Room terasa seperti memiliki teman yang selalu ada."
                </p>
                <p className="font-bold text-gray-900 text-lg">- Alex, Mahasiswa Tahun Akhir</p>
                <p className="text-base text-gray-500">Pengguna sejak Januari 2024</p>
              </div>

              <div className="md:w-1/2 bg-gradient-to-br from-emerald-100 to-teal-100 p-8 rounded-3xl border border-emerald-300 shadow-lg text-center md:text-left">
                <h3 className="text-3xl font-bold text-emerald-800 mb-4">Siap Merasa Lebih Baik?</h3>
                <p className="text-emerald-700 mb-6 text-lg">
                  Bergabunglah dengan ribuan pengguna yang telah menemukan ketenangan dan keseimbangan hidup dengan bantuan Jaga Jiwa. Mulai perjalanan kesehatan mentalmu sekarang!
                </p>
                <a
                  href="/daftar"
                  className="inline-flex items-center px-8 py-4 font-bold text-white bg-emerald-600 rounded-full hover:bg-emerald-700 transition-colors shadow-lg text-lg"
                >
                  Daftar Gratis <span className='ml-2 text-xl'>&rarr;</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-indigo-50 rounded-3xl p-8 md:p-14 text-center shadow-2xl border border-indigo-200">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
            Filosofi Kami
          </h2>
          <p className="text-xl text-gray-700 max-w-5xl mx-auto mb-10 leading-relaxed">
            Kesehatan mental adalah perjalanan, bukan tujuan. Jaga Jiwa berkomitmen menjadi pendamping digitalmu yang andal, aman, dan tanpa penghakiman. Kami percaya setiap individu berhak mendapatkan dukungan terbaik untuk mencapai kesejahteraan jiwa.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-lg font-semibold text-gray-700">
            <div className="flex items-center space-x-3 bg-white px-6 py-3 rounded-full shadow-lg border border-gray-100 transition-all hover:bg-gray-50 transform hover:scale-105">
              <div className="w-3 h-3 bg-rose-500 rounded-full animate-ping-slow"></div>
              <span>100% Anonim & Aman</span>
            </div>
            <div className="flex items-center space-x-3 bg-white px-6 py-3 rounded-full shadow-lg border border-gray-100 transition-all hover:bg-gray-50 transform hover:scale-105">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-ping-slow animation-delay-500"></div>
              <span>Teknologi AI Canggih</span>
            </div>
            <div className="flex items-center space-x-3 bg-white px-6 py-3 rounded-full shadow-lg border border-gray-100 transition-all hover:bg-gray-50 transform hover:scale-105">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping-slow animation-delay-1000"></div>
              <span>Mendukung Kesejahteraan Pelajar</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;