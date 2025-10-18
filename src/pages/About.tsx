import { BookHeart, Target, Users, Heart, Shield, Sparkles, Award, Lightbulb, Pencil, TrendingUp, Activity } from "lucide-react"
import type { ChartOptions, ChartData } from 'chart.js';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement } from "chart.js"
import { Line } from "react-chartjs-2"
import GradientText from "../components/GradientText";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

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
}


const About: React.FC = () => {
  const features: (FeatureItem & { color: string })[] = [
    {
      icon: Heart,
      title: "Kesehatan Mental Prioritas",
      description: "Kami percaya kesehatan mental sama pentingnya dengan kesehatan fisik. Jaga Jiwa hadir sebagai ruang aman untuk menjaga kesejahteraan emosional Anda.",
      color: "from-red-500 to-pink-500",
    },
    {
      icon: Shield,
      title: "Privasi Terjamin",
      description: "Data dan cerita Anda adalah milik Anda. Kami menggunakan enkripsi tingkat lanjut untuk memastikan privasi dan keamanan informasi pribadi Anda.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Sparkles,
      title: "AI yang Empatik",
      description: "Teknologi AI kami dirancang untuk mendengarkan dengan empati, memberikan dukungan yang konstruktif, dan membantu Anda memahami emosi dengan lebih baik.",
      color: "from-teal-500 to-emerald-500",
    },
    {
      icon: Award,
      title: "Berbasis Riset",
      description: "Setiap fitur dikembangkan berdasarkan penelitian psikologi modern dan praktik terbaik dalam dukungan kesehatan mental.",
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
      icon: Heart,
      title: "Peta Jiwa",
      description: "Menampilkan gambaran suasana hati dan rekomendasi aktivitas pemulih emosi di sekitar Anda.",
    },
    {
      icon: Pencil,
      title: "Rencana Jiwa",
      description: "Panduan personal untuk rutinitas sehat mental: tidur, jeda napas, journaling, dan olahraga ringan.",
    },
    {
      icon: Sparkles,
      title: "Mindful Zone",
      description: "Latihan mindfulness dan meditasi singkat yang mudah diterapkan dalam keseharian.",
    },
    {
      icon: Users,
      title: "Komunitas & Event",
      description: "Forum aman dan acara edukatif untuk berbagi pengalaman serta belajar langsung dari ahli.",
    },
    {
      icon: Lightbulb,
      title: "Manajemen Emosi Sehat",
      description: "Edukasi pengelolaan emosi dan kebiasaan positif untuk mendukung kesejahteraan mental.",
    },
    {
      icon: Shield,
      title: "Dashboard Kesehatan Jiwa",
      description: "Pantau progres kesejahteraan mental melalui statistik sederhana dan rekomendasi personal.",
    },
    {
      icon: Award,
      title: "Notifikasi Jiwa",
      description: "Pengingat otomatis untuk istirahat, minum air, bernapas sadar, dan menulis jurnal.",
    },
  ];

  const teamMembers: TeamMember[] = [
    {
      name: "Dr. Bintang S.",
      role: "Founder & Lead Psychologist",
      bio: "Seorang psikolog klinis dengan pengalaman lebih dari 10 tahun dalam terapi kognitif-perilaku dan kesehatan mental digital.",
      avatar: "https://i.pravatar.cc/150?u=bintang"
    },
    {
      name: "Andi P.",
      role: "Lead AI Engineer",
      bio: "Ahli dalam machine learning dan NLP yang bersemangat membangun teknologi AI yang empatik dan bertanggung jawab.",
      avatar: "https://i.pravatar.cc/150?u=andi"
    },
    {
      name: "Citra L.",
      role: "Head of Community & Content",
      bio: "Mengelola konten edukatif dan membangun komunitas yang aman dan suportif untuk semua pengguna Jaga Jiwa.",
      avatar: "https://i.pravatar.cc/150?u=citra"
    }
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

  const lineChartData: ChartData<'line'> = {
    labels: mentalHealthTrend.map(d => d.year),
    datasets: [
      {
        label: "Prevalensi Estimasi Populasi Terkena Kasus (%)",
        data: mentalHealthTrend.map(d => d.value),
        borderColor: "#0d9488",
        backgroundColor: "rgba(13, 148, 136, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 8,
      },
    ],
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 15,
        },
      },
      title: {
        display: true,
        font: {
          size: 16,
          weight: 'bold',
        },
        padding: {
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 10,
        cornerRadius: 8,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const lineChartOptions: ChartOptions<'line'> = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        ...chartOptions.plugins!.title,
        text: "Tren Estimasi Kenaikan Prevalensi Gangguan Mental di Indonesia (2019-2025)",
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
          text: 'Persentase Populasi (%)'
        }
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden transition-colors duration-500 
      bg-gradient-to-br from-indigo-50/70 via-white to-rose-50/70 
      dark:from-gray-900 dark:via-gray-950 dark:to-indigo-950">
    
      {/* === Background Blobs (Copied from Home.tsx) === */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob dark:bg-indigo-700 dark:opacity-30" />
      <div className="absolute bottom-1/4 right-0 w-1/3 h-1/3 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000 dark:bg-rose-700 dark:opacity-30" />
      <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 dark:bg-emerald-700 dark:opacity-20" />

      {/* === HERO SECTION BARU (Bergaya seperti Home.tsx) === */}
      <section className="text-center py-20 md:py-36 relative z-10">
        <div className="space-y-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* === BAGIAN PILL YANG KOSONG TELAH DIHAPUS === */}

          {/* === INI BAGIAN YANG DIBUNGKUS BORDER === */}
          {/* --- PADDING DIKURANGI DI BARIS INI --- */}
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-2 border-teal-200 dark:border-teal-700 rounded-3xl p-6 md:p-8"> 
            <div className="space-y-6 animate-slide-up">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight">
                <GradientText
                  colors={[
                    "#40ffaa",
                    "#4079ff",
                    "#40ffaa",
                    "#4079ff",
                    "#40ffaa",
                  ]}
                  animationSpeed={8}
                  showBorder={false}
                  className="custom-class leading-tight" 
                >
                  Tentang Kami
                </GradientText>
                <span className="block text-gray-900 mt-2 dark:text-gray-100 "> 
                  Jaga Jiwa.
                </span>
              </h1>

              <p className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
                Memahami cerita di balik Jaga Jiwa dan komitmen kami untuk
                menciptakan ruang aman bagi kesehatan mentalmu.
              </p>
            </div>
          </div>
          {/* === AKHIR BAGIAN YANG DIBUNGKUS BORDER === */}

        </div>
      </section>
      {/* === AKHIR HERO SECTION BARU === */}


      {/* Konten Asli Halaman About */}
      {/* Mengurangi padding atas sedikit agar tidak terlalu jauh */}
      <section className="py-12 md:py-20 bg-gray-50 relative z-10"> 
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-1"> 
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-teal-50 text-teal-700 rounded-full text-sm font-semibold mb-6">
                <Target className="w-4 h-4" />
                <span>Misi Kami</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Kesehatan Mental untuk Semua</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Di Indonesia, masih banyak stigma seputar kesehatan mental yang membuat orang enggan mencari bantuan. <span className="font-semibold text-gray-900">Jaga Jiwa</span> hadir untuk mengubah itu.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Kami menyediakan platform yang mudah diakses, aman, dan gratis untuk membantu siapa saja yang membutuhkan tempat untuk berbagi, memahami perasaan mereka, dan mendapatkan dukungan awal.
              </p>
              <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl border border-teal-100">
                <Lightbulb className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                <p className="text-gray-700 leading-relaxed">
                  <span className="font-semibold">Catatan Penting:</span> Jaga Jiwa adalah alat pendukung awal dan tidak menggantikan konsultasi profesional. Untuk kondisi serius, kami sangat menyarankan untuk berkonsultasi dengan psikolog atau psikiater berlisensi.
                </p>
              </div>
            </div>


            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-teal-50 to-emerald-50 rounded-3xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="grid grid-cols-2 gap-4 w-full">
                    {[Heart, Shield, Users, Sparkles].map((Icon, index) => (
                      <div key={index} className="aspect-square bg-white rounded-2xl shadow-lg flex items-center justify-center transform hover:scale-110 transition duration-300">
                        <Icon className="w-12 h-12 text-teal-600" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bagian Tentang Kami, Tujuan, Visi Misi */}
      <section className="py-16 md:py-20 bg-gray-50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-3xl p-8 border-2 border-teal-200 shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-teal-50 text-teal-700 rounded-full text-sm font-semibold mb-6 w-fit">
                <BookHeart className="w-4 h-4" />
                <span>Tentang Kami</span>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                <span className="font-semibold">Jaga Jiwa</span> adalah platform digital kesehatan mental yang dirancang untuk membantu masyarakat Indonesia dalam menjaga dan meningkatkan kesejahteraan emosional mereka. Platform ini menyediakan ruang aman untuk berbagi perasaan, memahami kondisi mental, serta mendapatkan dukungan awal melalui teknologi AI yang empatik.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Lebih dari sekadar aplikasi, <span className="font-semibold">Jaga Jiwa</span> adalah sahabat digital yang selalu siap mendengarkan tanpa menghakimi. Kami berkomitmen untuk menghapus stigma seputar kesehatan mental dan membuat dukungan psikologis lebih mudah diakses oleh semua kalangan, kapan saja dan di mana saja.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border-2 border-teal-200 shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-teal-50 text-teal-700 rounded-full text-sm font-semibold mb-6 w-fit">
                <Target className="w-4 h-4" />
                <span>Tujuan Kami</span>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">Mengedukasi masyarakat tentang pentingnya kesehatan mental dan mengurangi stigma yang ada.</p>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">Menyediakan akses mudah ke dukungan kesehatan mental yang aman dan terpercaya.</p>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">Mendorong kebiasaan pemantauan emosi melalui fitur tracking dan journaling interaktif.</p>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">Membantu pengguna dalam memahami dan mengelola perasaan mereka dengan lebih baik.</p>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="bg-white rounded-3xl p-8 md:p-12 border-2 border-teal-200 shadow-sm hover:shadow-xl transition-shadow duration-300 max-w-4xl w-full">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-teal-50 text-teal-700 rounded-full text-sm font-semibold mb-8 w-fit">
                <Sparkles className="w-4 h-4" />
                <span>Visi & Misi</span>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Visi:</h3>
                  <p className="text-gray-700 leading-relaxed">Menjadi platform kesehatan mental digital terdepan di Indonesia yang dapat membantu masyarakat mencapai kesejahteraan emosional dan hidup yang lebih berkualitas.</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Misi:</h3>
                  <p className="text-gray-700 leading-relaxed">Memberikan dukungan kesehatan mental yang mudah diakses, aman, dan berbasis teknologi AI untuk meningkatkan kesadaran dan pemahaman masyarakat tentang pentingnya menjaga kesehatan jiwa.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Mengapa Memilih Jaga Jiwa?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Kami berkomitmen memberikan dukungan terbaik untuk kesehatan mental Anda</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="group bg-white rounded-2xl p-8 border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-300">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gray-50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold bg-teal-50 text-teal-700 border border-teal-200 mb-4">
              <Users className="w-4 h-4" />
              <span>Tim Kami</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Orang-Orang di Balik Jaga Jiwa</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Kami adalah tim profesional yang bersemangat untuk membuat perbedaan dalam dunia kesehatan mental.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="group flex flex-col items-center text-center bg-white rounded-2xl p-8 border-2 border-teal-100 hover:border-teal-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative mb-6">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-100 to-emerald-200 transform scale-100 blur-lg transition-all duration-300 group-hover:scale-110"></div>
                  <img
                    className="relative w-32 h-32 rounded-full object-cover shadow-lg mx-auto ring-4 ring-white group-hover:ring-teal-300 transition-all duration-300"
                    src={member.avatar}
                    alt={`Foto ${member.name}`}
                  />
                  <div className="absolute bottom-1 right-1 bg-teal-500 rounded-full p-2 border-4 border-white">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-teal-600 font-semibold mb-4">{member.role}</p>
                <p className="text-gray-600 leading-relaxed text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-teal-50/50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold bg-teal-50 text-teal-700 border border-teal-200 mb-4">
              <TrendingUp className="w-4 h-4" />
              <span>Data & Wawasan</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Memahami Lanskap Kesehatan Mental di Indonesia</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Visualisasi data dari berbagai sumber ini menyoroti urgensi dan skala tantangan kesehatan mental yang kita hadapi bersama.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Activity className="text-teal-600" />
                  Tren yang Perlu Diwaspadai
                </h3>
                <p className="text-gray-600 mt-2">
                  Grafik ini menunjukkan adanya peningkatan prevalensi gangguan mental yang konsisten dari tahun ke tahun di Indonesia. Angka ini menekankan pentingnya kesadaran dan intervensi dini.
                </p>
              </div>
              <Line
                options={lineChartOptions}
                data={lineChartData}
              />
            </div>
          </div>

          <div className="mt-12 max-w-7xl mx-auto bg-white border border-teal-200 rounded-2xl p-10 shadow-sm">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold bg-teal-50 text-teal-700 border border-teal-200">
              <Lightbulb className="w-5 h-4" />
              <span>Insight Utama dari Data</span>
            </div>
            <div className="mt-6 space-y-4 text-gray-700 leading-relaxed">
              <p>
                Grafik di atas menunjukkan adanya <span className="font-semibold text-gray-900">tren kenaikan prevalensi gangguan mental yang signifikan</span> di Indonesia dari tahun 2019 hingga estimasi 2025. Peningkatan ini mencerminkan tantangan kesehatan mental yang semakin besar, yang mungkin dipercepat oleh faktor-faktor seperti dampak pandemi, tekanan ekonomi, dan perubahan gaya hidup digital.
              </p>
              <p>
                Angka ini bukan sekadar statistik, tetapi representasi dari jutaan individu yang berjuang dalam diam. Hal ini menggarisbawahi <span className="font-semibold text-gray-900">pentingnya intervensi dini dan akses yang lebih mudah</span> terhadap layanan dukungan kesehatan mental. Misi Jaga Jiwa adalah menjawab kebutuhan ini dengan menyediakan platform yang aman, mudah diakses, dan tanpa stigma bagi siapa saja yang membutuhkan.
              </p>
            </div>
          </div>

        </div>
      </section>

      <section className="py-16 md:py-24 bg-gradient-to-br from-teal-50 to-emerald-50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Dampak Kami dalam Angka</h2>
            <p className="text-xl text-gray-600">Bersama membangun masyarakat yang lebih sehat</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {statistics.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <Icon className="w-10 h-10 text-teal-600 mb-4 mx-auto" />
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                    <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-10 md:py-12 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border-2 border-teal-200 bg-white">
            <div className="flex items-center gap-2 px-6 md:px-8 pt-6">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold bg-teal-50 text-teal-700">
                <Sparkles className="w-4 h-4" />
                <span>Fitur Unggulan</span>
              </div>
            </div>

            <div className="px-6 md:px-8 pb-8 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jjFiturUnggulan.map((item, idx) => {
                  const Icon = item.icon
                  return (
                    <div key={idx} className="rounded-xl border border-teal-100 bg-teal-50/40 p-6 hover:shadow-md transition-shadow duration-300">
                      <div className="flex items-start gap-4">
                        <div className="shrink-0 rounded-lg p-2 bg-teal-100">
                          <Icon className="w-6 h-6 text-teal-700" />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-gray-900">{item.title}</h3>
                          <p className="mt-2 text-sm text-gray-600 leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-gradient-to-br from-teal-600 to-emerald-600 text-white relative overflow-hidden z-10">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Mulai Perjalanan Anda Bersama Kami</h2>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">Kesehatan mental adalah perjalanan, bukan tujuan. Mari kita mulai bersama hari ini.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-teal-600 rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105">Mulai Sekarang</button>
            <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300">Pelajari Lebih Lanjut</button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About