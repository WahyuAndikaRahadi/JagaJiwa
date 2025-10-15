
import { BookHeart, Target, Users, Heart, Shield, Sparkles, Award, Lightbulb, Pencil, TrendingUp, AlertCircle, Brain, Activity } from "lucide-react"
import type { ChartOptions, ChartData } from 'chart.js';

// Import Chart.js dan komponennya
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement } from "chart.js"
import { Line, Pie, Bar } from "react-chartjs-2"

// Registrasi elemen-elemen Chart.js yang akan digunakan
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement)

// Definisikan tipe untuk Data Statistik
interface StatItem {
  number: string;
  label: string;
  icon: React.ElementType; // Menggunakan React.ElementType untuk komponen Lucide
}

// Definisikan tipe untuk Fitur Unggulan
interface FeatureItem {
  icon: React.ElementType;
  title: string;
  description: string;
}

const About: React.FC = () => {
  // Data state yang sudah ada
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

  // --- DATA YANG DIMODIFIKASI BERDASARKAN INPUT PENGGUNA ---
  
  // 1. Tren Estimasi Prevalensi Gangguan Mental
  const mentalHealthTrend = [
    { year: "2019", value: 9.5 }, 
    { year: "2020", value: 10.0 }, 
    { year: "2021", value: 11.0 }, 
    { year: "2022", value: 13.0 }, 
    { year: "2023", value: 17.0 }, 
    { year: "2024 (Est)", value: 19.0 }, 
    { year: "2025 (Est)", value: 20.0 }, 
  ];

  // 2. Distribusi Jenis Gangguan (Menggunakan 5 data prevalensi tertinggi yang Anda berikan untuk Pie Chart)
  const disorderDistribution = [
    { type: "Gangguan Tidur (Pekerja)", percentage: 57.6, color: "#14b8a6" }, // teal-500
    { type: "Stres Kerja (Ringan-Berat)", percentage: 35.0, color: "#fb923c" }, // orange-400
    { type: "Gangguan Mental Emosional", percentage: 9.8, color: "#ec4899" }, // pink-500
    { type: "Kecemasan (Remaja)", percentage: 3.7, color: "#facc15" }, // yellow-400
    { type: "Depresi (Nasional)", percentage: 1.4, color: "#a855f7" }, // purple-500
  ];
	
  // Menghitung persentase relatif untuk Pie Chart
  const totalRelativePrevalence = disorderDistribution.reduce((sum, item) => sum + item.percentage, 0);
  const pieDataRelative = disorderDistribution.map(d => (d.percentage / totalRelativePrevalence) * 100);
  
  

  // 3. Prevalensi Berdasarkan Usia (Estimasi Jumlah Kasus Depresi)
  const prevalenceByAge = [
    { ageGroup: "15-24 tahun", cases: 5688780, color: "#ec4899" }, // pink-500
    { ageGroup: "Lansia (>75)", cases: 5404341, color: "#fb923c" }, // orange-400
    { ageGroup: "65-74 tahun", cases: 4551024, color: "#facc15" }, // yellow-400
    { ageGroup: "25-34 tahun", cases: 3697707, color: "#14b8a6" }, // teal-500
    { ageGroup: "55-64 tahun", cases: 3413268, color: "#a855f7" }, // purple-500
  ];
  // Memastikan data Bar Chart hanya mencakup 5 kelompok usia teratas yang ada di data
  const topFiveAgeGroups = prevalenceByAge.slice(0, 5).sort((a, b) => b.cases - a.cases);


  // --- DATA UNTUK GRAFIK (MENGGUNAKAN DATA BARU) ---

  const lineChartData: ChartData<'line'> = {
    labels: mentalHealthTrend.map(d => d.year),
    datasets: [
      {
        label: "Prevalensi Estimasi Populasi Terkena Kasus (%)",
        data: mentalHealthTrend.map(d => d.value),
        borderColor: "#0d9488", // teal-600
        backgroundColor: "rgba(13, 148, 136, 0.1)",
        fill: true,
        tension: 0.4, 
        pointRadius: 5,
        pointHoverRadius: 8,
      },
    ],
  };

  const pieChartData: ChartData<'pie'> = {
    labels: disorderDistribution.map(d => `${d.type} (${d.percentage}%)`),
    datasets: [
      {
        label: "Prevalensi Relatif (%)",
        data: pieDataRelative, // Menggunakan persentase relatif
        backgroundColor: disorderDistribution.map(d => d.color),
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  const barChartData: ChartData<'bar'> = {
    labels: topFiveAgeGroups.map(d => d.ageGroup),
    datasets: [
      {
        label: "Estimasi Jumlah Kasus Depresi",
        data: topFiveAgeGroups.map(d => d.cases),
        backgroundColor: topFiveAgeGroups.map(d => d.color),
        borderRadius: 8,
categoryPercentage: 1.0, // Batang menggunakan 100% lebar kategori
        barPercentage: 0.95,     // Menyisakan celah sangat kecil antar batang (95%)
        

      },
    ],
  };

  // Menggunakan tipe ChartOptions dari Chart.js
  const chartOptions: ChartOptions<'line' | 'pie' | 'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const, // Penegasan tipe untuk enum
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

  // Opsi spesifik untuk Line Chart
  const lineChartOptions: ChartOptions<'line'> = {
    ...chartOptions as ChartOptions<'line'>, // Casting untuk memastikan tipe benar
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

  // Opsi spesifik untuk Pie Chart
  const pieChartOptions: ChartOptions<'pie'> = {
    ...chartOptions as ChartOptions<'pie'>,
    plugins: {
      ...chartOptions.plugins,
      title: {
        ...chartOptions.plugins!.title,
        text: "Distribusi Prevalensi Relatif Jenis Gangguan Terpilih",
      },
      tooltip: {
        ...chartOptions.plugins!.tooltip,
        callbacks: {
          label: (context) => {
            const label = context.label || ''
            const value = context.parsed.toFixed(2) 
            return `${label}: ${value}%`
          }
        }
      }
    },
  };

  // Opsi spesifik untuk Bar Chart
  const barChartOptions: ChartOptions<'bar'> = {
    ...chartOptions as ChartOptions<'bar'>,
    plugins: {
      ...chartOptions.plugins,
      title: {
        ...chartOptions.plugins!.title,
        text: "Estimasi Jumlah Kasus Depresi Berdasarkan Kelompok Usia (Populasi 284,4 Juta)",
      },
      legend: {
        display: false, 
        position: "bottom" as const,
      },
      tooltip: {
        ...chartOptions.plugins!.tooltip,
        callbacks: {
          label: (context) => ` Kasus: ${context.parsed.y!.toLocaleString('id-ID')} orang`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Jumlah Kasus (orang)'
        },
        ticks: {
          // Untuk format angka jutaan
          callback: function(value: any) {
            return (value / 1000000).toLocaleString('id-ID') + ' Juta'
          }
        }
      }
    }

  };


  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold bg-teal-50 text-teal-700 border border-teal-200">
          <Pencil className="w-4 h-4" />
          <span>Tentang Kami</span>
        </div>

        <h1 className="mt-4 text-3xl md:text-5xl font-bold text-balance">
          <span className="text-foreground">Mengenal </span>
          <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">Jaga Jiwa</span>
        </h1>

        <p className="mt-4 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto text-pretty">
          Platform kesehatan holistik yang membantu Anda mencapai keseimbangan dalam semua aspek kehidupan dengan dukungan AI yang empatik dan aman.
        </p>
      </div>

      <section className="py-16 md:py-20 bg-gray-50">
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

      {/* --- SEKSI STATISTIK GRAFIK BARU DIMULAI DI SINI --- */}
      <section className="py-16 md:py-24 bg-teal-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Data & Statistik Kesehatan Mental di Indonesia</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">Visualisasi data dari berbagai sumber mengenai kondisi kesehatan mental saat ini.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Grafik Garis (Line Chart) */}
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 lg:col-span-2">
              <Line
                options={lineChartOptions}
                data={lineChartData}
              />
            </div>

            {/* Grafik Lingkaran (Pie Chart) */}
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Pie
                options={pieChartOptions}
                data={pieChartData}
              />
            </div>

            {/* Grafik Batang (Bar Chart) */}
            <div className="bg-white p-6 rounded-2xl  shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Bar
                options={barChartOptions}
                data={barChartData}
              />
            </div>
          </div>
        </div>
      </section>
      {/* --- SEKSI STATISTIK GRAFIK SELESAI --- */}

      <section className="py-16 md:py-24 bg-gradient-to-br from-teal-50 to-emerald-50">
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

      {/* ... Sisa kode Anda yang lain ... */}
      <section className="py-10 md:py-12 bg-white">
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

      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

      <section className="py-16 md:py-24 bg-white">
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

      <section className="py-16 md:py-20 bg-gradient-to-br from-teal-600 to-emerald-600 text-white relative overflow-hidden">
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