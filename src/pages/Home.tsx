import { Link } from 'react-router-dom';
import { Heart, Brain, MessageCircle, TrendingUp, BookOpen, Star, Zap, Smile } from 'lucide-react';

// Data tidak berubah, menggunakan data dari jawaban sebelumnya
function Home() {
  const features = [
    {
      icon: TrendingUp,
      title: 'Mood Tracker',
      description: 'Pantau perubahan suasana hatimu setiap hari',
      color: 'from-blue-400 to-primary-600',
    },
    {
      icon: Brain,
      title: 'Journal Mood',
      description: 'Tulis dan analisis perasaanmu dengan AI',
      color: 'from-pink-400 to-secondary-600',
    },
    {
      icon: MessageCircle,
      title: 'Talk Room',
      description: 'Curhat dengan AI yang siap mendengarkan',
      color: 'from-teal-400 to-emerald-600',
    },
  ];

  const articles = [
    {
      id: 1,
      title: 'Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit',
      summary: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      link: '/artikel/lorem-1',
    },
    {
      id: 2,
      title: 'Duis Aute Irure Dolor in Reprehenderit in Voluptate',
      summary: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      link: '/artikel/lorem-2',
    },
    {
      id: 3,
      title: 'Voluptatem Accusantium Doloremque Laudantium, Totam Rem',
      summary: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
      link: '/artikel/lorem-3',
    },
  ];
  
  return (
    // Peningkatan BG: Menggunakan gradien halus untuk seluruh halaman
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50/70 via-white to-pink-50/70"> 
        {/* Dekorasi BG: Dua "Floating Blob" blur untuk kedalaman visual */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10">
        
        {/* --- HERO SECTION (Lebih Dramatis) --- */}
        <div className="text-center mb-16 md:mb-24 relative overflow-hidden bg-white rounded-3xl p-8 shadow-2xl border border-gray-100"> 
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-pink-500 to-blue-500 rounded-3xl mb-6 shadow-2xl animate-pulse-slow">
              <Heart className="w-12 h-12 text-white transform hover:rotate-6 transition-transform" />
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-4 bg-gradient-to-r from-primary-700 via-secondary-700 to-teal-700 bg-clip-text text-transparent leading-tight">
              Temukan Ketenangan, Jaga Jiwa
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto font-light text-balance">
              Alat kesehatan mental berbasis AI yang dirancang khusus untuk membantumu mengelola emosi dan mencapai keseimbangan hidup.
            </p>
          </div>
        </div>

        {/* --- CTA UTAMA (Lebih Interaktif) --- */}
        <div className="flex flex-col items-center mb-20">
          <Link
            to="/tracker"
            className="group relative inline-flex items-center justify-center px-10 py-5 text-xl font-extrabold text-white bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full shadow-2xl shadow-primary-300 hover:shadow-primary-500/50 transform hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            <Zap className="w-6 h-6 mr-3 animate-bounce-slow" />
            Mulai Tracking Mood Sekarang
            <span className="absolute inset-0 w-full h-full transition duration-300 ease-out opacity-0 bg-gradient-to-r from-white/10 via-white/50 to-white/10 group-hover:opacity-100"></span>
          </Link>
          <p className="text-base text-gray-500 mt-4 italic">
            Daftar hanya 30 detik. Privasi terjamin.
          </p>
        </div>

        {/* --- FITUR UNGGULAN (Kartu 3D Effect) --- */}
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Mengapa Kami Berbeda?
        </h2>
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                // Kartu kini memiliki latar belakang putih solid dan padding yang lebih besar
                className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:border-primary-300 transform hover:-translate-y-2 group"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mb-5 shadow-lg`}>
                  <Icon className="w-8 h-8 text-white transition-transform group-hover:rotate-6" />
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                <Link to="#" className="mt-4 inline-flex items-center text-primary-600 font-semibold text-sm hover:text-primary-800 transition-colors">
                    Lihat Fitur <span className='ml-1 text-lg'>&rarr;</span>
                </Link>
              </div>
            );
          })}
        </div>
        
        {/* --- BAGIAN ARTIKEL TERBARU (Layout Majalah) --- */}
        <div className="mb-20 pt-10 border-t border-gray-200">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">
              <BookOpen className="inline-block w-7 h-7 mr-2 text-primary-600" />
              Wawasan Terbaru
            </h2>
            <Link 
              to="/blog"
              className="text-primary-600 font-bold hover:text-primary-800 transition-colors text-lg"
            >
              Lihat Semua <span className='ml-1 text-lg'>&rarr;</span>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <Link 
                to={article.link} 
                key={article.id} 
                className="block bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 group"
              >
                {/* Image Placeholder dengan Aspect Ratio */}
                <div className={`w-full ${index === 0 ? 'h-48' : 'h-36'} bg-gray-200 flex items-center justify-center text-gray-500 font-medium overflow-hidden`}>
                   <img src={`https://via.placeholder.com/${index === 0 ? '600x400' : '400x250'}?text=Gambar+Artikel`} alt="Placeholder" className='object-cover w-full h-full transition-transform duration-500 group-hover:scale-105' />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {article.summary}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        {/* --- BAGIAN REKOMENDASI/TESTIMONIAL (Callout Section) --- */}
        <div className="mb-20 pt-10 border-t border-gray-200">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
                <Smile className="inline-block w-7 h-7 mr-2 text-secondary-600" />
                Dengarkan Kata Mereka
            </h2>
            
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-secondary-200">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Testimonial Card */}
                    <div className="md:w-1/2">
                        <Star className="w-8 h-8 text-yellow-500 fill-yellow-500 mb-3" />
                        <p className="text-xl font-medium italic text-gray-700 leading-relaxed mb-4">
                            "Sed ut perspiciatis unde omnis iste natus error sit voluptatem. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
                        </p>
                        <p className="font-bold text-gray-900">- Alex, Mahasiswa Tahun Akhir</p>
                        <p className="text-sm text-gray-500">Pengguna sejak Januari 2024</p>
                    </div>

                    {/* CTA Pelengkap */}
                    <div className="md:w-1/2 bg-gradient-to-br from-emerald-50 to-teal-100 p-6 rounded-2xl border border-emerald-200">
                        <h3 className="text-2xl font-bold text-emerald-800 mb-3">Siap Merasa Lebih Baik?</h3>
                        <p className="text-emerald-700 mb-4">
                            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur.
                        </p>
                        <Link 
                            to="/daftar" 
                            className="inline-flex items-center px-6 py-3 font-semibold text-white bg-emerald-600 rounded-full hover:bg-emerald-700 transition-colors shadow-md"
                        >
                            Daftar Gratis &rarr;
                        </Link>
                    </div>
                </div>
            </div>
        </div>

        {/* --- BAGIAN KENAPA KAMI (Lebih Clean) --- */}
        <div className="bg-white rounded-3xl p-8 md:p-12 text-center shadow-inner border border-gray-100">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-5">
            Filosofi Kami
          </h2>
          <p className="text-lg text-gray-700 max-w-4xl mx-auto mb-8 leading-relaxed">
            Kesehatan mental adalah perjalanan, bukan tujuan. Jaga Jiwa berkomitmen menjadi pendamping digitalmu yang andal, aman, dan tanpa penghakiman.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-base font-semibold text-gray-600">
            <div className="flex items-center space-x-2 bg-gray-50 px-5 py-2 rounded-full shadow-inner border border-gray-200 transition-all hover:bg-gray-100">
              <div className="w-2.5 h-2.5 bg-pink-500 rounded-full"></div>
              <span>100% Anonim</span>
            </div>
            <div className="flex items-center space-x-2 bg-gray-50 px-5 py-2 rounded-full shadow-inner border border-gray-200 transition-all hover:bg-gray-100">
              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
              <span>Teknologi Canggih</span>
            </div>
            <div className="flex items-center space-x-2 bg-gray-50 px-5 py-2 rounded-full shadow-inner border border-gray-200 transition-all hover:bg-gray-100">
              <div className="w-2.5 h-2.5 bg-teal-500 rounded-full"></div>
              <span>Fokus pada Pelajar</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;