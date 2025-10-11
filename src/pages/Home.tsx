import { Link } from 'react-router-dom';
import { Heart, Brain, MessageCircle, TrendingUp } from 'lucide-react';

function Home() {
  const features = [
    {
      icon: TrendingUp,
      title: 'Mood Tracker',
      description: 'Pantau perubahan suasana hatimu setiap hari',
      color: 'from-primary-500 to-primary-600',
    },
    {
      icon: Brain,
      title: 'Journal Mood',
      description: 'Tulis dan analisis perasaanmu dengan AI',
      color: 'from-secondary-500 to-secondary-600',
    },
    {
      icon: MessageCircle,
      title: 'Talk Room',
      description: 'Curhat dengan AI yang siap mendengarkan',
      color: 'from-emerald-500 to-teal-600',
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl mb-6 shadow-lg">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary-600 via-secondary-600 to-emerald-600 bg-clip-text text-transparent">
            Jaga Jiwa
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto text-balance">
            Kelola stres dan pantau kesehatan mentalmu dengan cara yang mudah dan menyenangkan
          </p>
        </div>

        <div className="flex flex-col items-center mb-16">
          <Link
            to="/tracker"
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <TrendingUp className="w-6 h-6 mr-2" />
            Mulai Tracking Mood
            <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-secondary-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
          </Link>
          <p className="text-sm text-gray-500 mt-3">
            Gratis dan mudah digunakan
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 md:p-8 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl mb-4 shadow-md`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Kenapa Jaga Jiwa?
          </h2>
          <p className="text-gray-700 max-w-3xl mx-auto mb-6 leading-relaxed">
            Kesehatan mental sama pentingnya dengan kesehatan fisik. Jaga Jiwa membantu pelajar mengenali
            pola stres lebih dini, mencatat perasaan, dan mendapatkan dukungan kapan saja dibutuhkan.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-gray-600">
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <span>Privasi Terjaga</span>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <div className="w-2 h-2 bg-secondary-500 rounded-full"></div>
              <span>Mudah Digunakan</span>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span>Dukungan 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
