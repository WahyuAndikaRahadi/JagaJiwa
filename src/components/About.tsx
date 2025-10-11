import { BookHeart, Target, Users, Heart, Shield, Sparkles, Award, Lightbulb } from 'lucide-react';

function About() {
  const features = [
    {
      icon: Heart,
      title: 'Kesehatan Mental Prioritas',
      description: 'Kami percaya kesehatan mental sama pentingnya dengan kesehatan fisik. Jaga Jiwa hadir sebagai ruang aman untuk menjaga kesejahteraan emosional Anda.',
      color: 'from-red-500 to-pink-500',
    },
    {
      icon: Shield,
      title: 'Privasi Terjamin',
      description: 'Data dan cerita Anda adalah milik Anda. Kami menggunakan enkripsi tingkat lanjut untuk memastikan privasi dan keamanan informasi pribadi Anda.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Sparkles,
      title: 'AI yang Empatik',
      description: 'Teknologi AI kami dirancang untuk mendengarkan dengan empati, memberikan dukungan yang konstruktif, dan membantu Anda memahami emosi dengan lebih baik.',
      color: 'from-purple-500 to-indigo-500',
    },
    {
      icon: Award,
      title: 'Berbasis Riset',
      description: 'Setiap fitur dikembangkan berdasarkan penelitian psikologi modern dan praktik terbaik dalam dukungan kesehatan mental.',
      color: 'from-amber-500 to-orange-500',
    },
  ];

  const statistics = [
    { number: '10K+', label: 'Pengguna Aktif', icon: Users },
    { number: '50K+', label: 'Sesi Curhat', icon: Heart },
    { number: '95%', label: 'Kepuasan Pengguna', icon: Sparkles },
    { number: '24/7', label: 'Dukungan Tersedia', icon: Shield },
  ];

  const team = [
    {
      role: 'Mental Health Focus',
      description: 'Menormalisasi percakapan tentang kesehatan mental di Indonesia',
    },
    {
      role: 'Technology Innovation',
      description: 'Menggunakan AI untuk membuat dukungan mental lebih accessible',
    },
    {
      role: 'Community Building',
      description: 'Membangun komunitas yang saling mendukung dan bebas stigma',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-secondary-600 to-primary-700 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl mb-6 shadow-2xl">
              <BookHeart className="w-12 h-12 text-white" fill="white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
              Tentang Jaga Jiwa
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto font-light leading-relaxed">
              Platform kesehatan mental berbasis AI yang memberikan ruang aman untuk berbagi, memahami emosi, dan merawat kesejahteraan mental Anda.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-6">
                <Target className="w-4 h-4" />
                <span>Misi Kami</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Kesehatan Mental untuk Semua
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Di Indonesia, masih banyak stigma seputar kesehatan mental yang membuat orang enggan mencari bantuan. <span className="font-semibold text-gray-900">Jaga Jiwa</span> hadir untuk mengubah itu.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Kami menyediakan platform yang mudah diakses, aman, dan gratis untuk membantu siapa saja yang membutuhkan tempat untuk berbagi, memahami perasaan mereka, dan mendapatkan dukungan awal.
              </p>
              <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl border border-primary-100">
                <Lightbulb className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                <p className="text-gray-700 leading-relaxed">
                  <span className="font-semibold">Catatan Penting:</span> Jaga Jiwa adalah alat pendukung awal dan tidak menggantikan konsultasi profesional. Untuk kondisi serius, kami sangat menyarankan untuk berkonsultasi dengan psikolog atau psikiater berlisensi.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary-100 to-secondary-100 rounded-3xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="grid grid-cols-2 gap-4 w-full">
                    {[Heart, Shield, Users, Sparkles].map((Icon, index) => (
                      <div
                        key={index}
                        className="aspect-square bg-white rounded-2xl shadow-lg flex items-center justify-center transform hover:scale-110 transition duration-300"
                      >
                        <Icon className="w-12 h-12 text-primary-600" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Dampak yang Kami Ciptakan
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Setiap hari, kami membantu ribuan orang merawat kesehatan mental mereka
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {statistics.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                      {stat.number}
                    </p>
                    <p className="text-sm text-gray-600 font-medium">
                      {stat.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mengapa Memilih Jaga Jiwa?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Kami menggabungkan teknologi terdepan dengan pendekatan yang penuh empati
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:border-transparent"
                >
                  <div className={`inline-flex w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nilai-Nilai Kami
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Prinsip yang memandu setiap keputusan yang kami buat
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="w-12 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mb-6"></div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {item.role}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary-600 via-secondary-600 to-primary-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Mulai Perjalanan Anda Bersama Kami
          </h2>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Kesehatan mental adalah perjalanan, bukan tujuan. Mari kita mulai bersama hari ini.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              Mulai Sekarang
            </button>
            <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300">
              Pelajari Lebih Lanjut
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
