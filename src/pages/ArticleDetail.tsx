import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
// Hapus Sun dan Moon karena tidak ada toggle
import { ChevronLeft, Clock, BookOpen, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// --- Data Artikel (Tidak Berubah) ---
interface FullArticle {
  id: number;
  title: string;
  summary: string;
  category: string;
  readTime: string;
  fullContent: string;
}

const ARTICLES: FullArticle[] = [
  {
    id: 1,
    title: 'Mengatasi Burnout Akademik',
    summary: 'Strategi praktis untuk mengenali dan mengatasi kelelahan mental akibat tuntutan akademik.',
    category: 'Akademik',
    readTime: '5 menit',
    fullContent: `Burnout akademik bukan sekadar rasa lelah biasa—ini adalah keadaan kelelahan emosional, fisik, dan mental yang mendalam akibat stres akademik berkepanjangan tanpa pemulihan yang memadai. Sering kali, pelajar merasa terjebak dalam siklus "harus terus produktif", hingga lupa bahwa tubuh dan pikiran juga butuh istirahat untuk berfungsi optimal.

Tanda-tanda awal burnout bisa sangat halus: kehilangan minat pada mata pelajaran yang dulu disukai, sulit fokus meski sudah minum kopi, atau merasa marah saat melihat notifikasi tugas baru. Banyak yang menyalahkan diri sendiri, menganggap ini sebagai kegagalan pribadi. Padahal, ini adalah respons alami tubuh terhadap beban yang melebihi kapasitas pemulihannya.

Langkah pertama untuk mengatasinya adalah **mengakui tanpa rasa malu** bahwa kamu sedang kewalahan. Ini bukan kelemahan—ini kejujuran. Setelah itu, evaluasi ulang jadwalmu. Apakah semua kegiatan benar-benar perlu? Apakah ada ruang untuk "tidak melakukan apa-apa"? Memberi diri waktu untuk diam, berjalan santai, atau sekadar menatap langit adalah bentuk perawatan diri yang sah dan penting.

Terapkan teknik manajemen waktu seperti **metode Pomodoro** (25 menit fokus, 5 menit istirahat) dan batasi waktu belajar maksimal 6–7 jam per hari—termasuk kuliah atau sekolah. Ingat: kualitas belajar jauh lebih penting daripada kuantitas jam duduk di meja. Tidur cukup, makan teratur, dan bergerak setiap hari adalah fondasi yang tidak bisa dikompromikan.

Terakhir, jangan ragu mencari dukungan. Bicaralah dengan dosen, guru BK, teman dekat, atau layanan konseling kampus. Burnout tidak harus dihadapi sendirian. Dengan langkah kecil yang konsisten, kamu bisa kembali menemukan keseimbangan antara prestasi akademik dan kesejahteraan mental. *Karena kamu layak sukses—tanpa harus kehilangan dirimu sendiri.*`
  },
  {
    id: 2,
    title: 'Mindfulness untuk Pemula',
    summary: 'Panduan sederhana memulai praktik mindfulness dalam kehidupan sehari-hari.',
    category: 'Teknik',
    readTime: '7 menit',
    fullContent: `Mindfulness—atau kesadaran penuh—adalah praktik membawa perhatian sepenuhnya ke momen saat ini, tanpa menghakimi. Ini bukan tentang mengosongkan pikiran, melainkan tentang **hadir** dalam pengalaman yang sedang terjadi: napas yang masuk-keluar, suara di sekitar, atau bahkan rasa hangat cangkir kopi di tanganmu.

Banyak orang salah paham bahwa mindfulness membutuhkan waktu lama, tempat khusus, atau keahlian meditasi tingkat lanjut. Padahal, kamu bisa memulainya hanya dalam **1–3 menit sehari**. Coba duduk tenang, tutup mata, dan fokus hanya pada napasmu. Saat pikiran melayang (dan itu pasti terjadi!), cukup sadari, lalu lembut bawa kembali fokus ke napas—tanpa menyalahkan diri.

Praktik ini sangat bermanfaat untuk mengurangi kecemasan, meningkatkan fokus, dan memperbaiki kualitas tidur. Penelitian menunjukkan bahwa latihan mindfulness rutin selama 8 minggu dapat mengubah struktur otak, memperkuat area yang terkait dengan regulasi emosi dan empati.

Kamu juga bisa menyisipkan mindfulness dalam aktivitas sehari-hari: saat menyikat gigi, mandi, atau berjalan ke kelas. Tanyakan pada dirimu: *Apa yang kurasakan sekarang? Apa yang kudengar? Apa yang kulihat?* Ini melatih otak untuk tidak terjebak di masa lalu atau khawatir tentang masa depan.

Mulailah kecil, konsisten, dan bersikap lembut pada diri sendiri. Tidak ada "cara yang salah" dalam mindfulness—selama kamu kembali ke saat ini, kamu sudah berada di jalur yang tepat. *Ketenangan bukanlah tujuan jauh, tapi napas berikutnya yang kamu sadari sepenuhnya.*`
  },
  {
    id: 3,
    title: 'Membangun Resiliensi Mental',
    summary: 'Cara mengembangkan ketahanan mental untuk menghadapi tantangan hidup.',
    category: 'Pengembangan Diri',
    readTime: '6 menit',
    fullContent: `Resiliensi mental bukanlah bakat bawaan—ini adalah **keterampilan yang bisa dilatih**, seperti otot. Orang yang resilien bukan berarti tidak pernah merasa sedih, takut, atau gagal. Mereka justru ahli dalam **bangkit kembali** setelah jatuh, belajar dari pengalaman, dan tetap memegang harapan meski dalam tekanan.

Salah satu fondasi utama resiliensi adalah **self-compassion**—kemampuan untuk bersikap baik pada diri sendiri saat menghadapi kegagalan. Alih-alih berkata, *"Aku bodoh karena gagal ujian,"* cobalah, *"Aku sedang belajar, dan ini bagian dari proses."* Perlakuan lembut pada diri sendiri justru mempercepat pemulihan dan mendorong pertumbuhan.

Selain itu, bangun jaringan dukungan sosial yang sehat. Orang resilien tidak berjuang sendirian. Mereka tahu kapan harus meminta bantuan, dan mereka memelihara hubungan yang saling mendukung. Bahkan satu orang yang bisa diajak bicara jujur sudah cukup menjadi jangkar emosional di masa sulit.

Latih juga kemampuan **reframing**: melihat tantangan sebagai peluang belajar, bukan ancaman. Misalnya, alih-alih berpikir, *"Aku tidak bisa presentasi dengan baik,"* ubah menjadi, *"Ini kesempatan untuk melatih keberanian berbicara di depan umum."* Pola pikir seperti ini mengurangi rasa terancam dan meningkatkan kontrol internal.

Terakhir, rawat tubuhmu. Tidur, nutrisi, dan aktivitas fisik secara langsung memengaruhi kemampuan otak mengatur stres. Resiliensi bukan hanya soal pikiran—tapi juga soal bagaimana kamu merawat wadahnya: tubuhmu sendiri. *Ketahanan mental lahir bukan dari menghindari badai, tapi dari belajar menari di tengah hujan.*`
  },
  {
    id: 4,
    title: 'Mengelola Kecemasan Sosial',
    summary: 'Tips praktis mengatasi rasa gugup dalam situasi sosial.',
    category: 'Sosial',
    readTime: '5 menit',
    fullContent: `Kecemasan sosial—rasa takut berlebihan akan penilaian negatif orang lain—bisa membuat situasi seperti presentasi kelas, ngobrol di kantin, atau bahkan balas chat terasa melelahkan. Yang perlu diingat: **kamu tidak sendiri**. Banyak orang mengalami hal serupa, meski mereka terlihat percaya diri di luar.

Gejala umum meliputi jantung berdebar, tangan berkeringat, pikiran kosong, atau keinginan kuat untuk menghindar. Ini adalah respons "fight-or-flight" alami tubuh. Tapi respons ini sering kali tidak proporsional dengan ancaman nyata—karena pada dasarnya, *orang lain tidak menghakimi kita sekeras yang kita bayangkan*.

Salah satu teknik efektif adalah **persiapan realistis**. Jika kamu akan presentasi, latih beberapa kali—tapi jangan mengejar kesempurnaan. Fokus pada pesan utama, bukan pada setiap kata. Ingat: audiens ingin kamu sukses, bukan mencari kesalahanmu.

Latih juga **pernapasan diafragma** saat merasa cemas: tarik napas dalam selama 4 detik, tahan 2 detik, buang napas perlahan selama 6 detik. Ini menenangkan sistem saraf dan mengurangi gejala fisik kecemasan dalam hitungan menit.

Terakhir, tantang pikiran negatif otomatis. Tanyakan: *"Apa buktinya orang akan menertawakanku? Apa skenario terburuk—dan apakah aku bisa menghadapinya?"* Dengan latihan, kamu akan menyadari bahwa ketakutanmu seringkali jauh lebih besar daripada kenyataan. *Keberanian sosial bukan tentang tidak takut—tapi bertindak meski takut.*`
  },
  {
    id: 5,
    title: 'Pola Tidur Sehat untuk Pelajar',
    summary: 'Pentingnya tidur berkualitas dan cara memperbaiki sleep hygiene.',
    category: 'Kesehatan',
    readTime: '4 menit',
    fullContent: `Tidur bukanlah kemewahan—ini adalah **kebutuhan biologis vital**, setara dengan makan dan minum. Bagi pelajar, tidur yang cukup sangat penting untuk konsolidasi memori, regulasi emosi, dan fungsi kognitif seperti fokus, kreativitas, dan pengambilan keputusan. Sayangnya, budaya "bangga begadang" masih merajalela di kalangan pelajar.

Kurang tidur kronis tidak hanya membuatmu mengantuk—ia meningkatkan risiko kecemasan, depresi, penurunan imun, dan bahkan kesulitan belajar jangka panjang. Otakmu membutuhkan waktu tidur untuk membersihkan racun metabolik dan menyimpan informasi penting dari hari itu. Tanpa itu, semua usaha belajarmu menjadi kurang efektif.

**Sleep hygiene**—atau kebersihan tidur—adalah serangkaian kebiasaan yang mendukung tidur berkualitas. Mulailah dengan menjaga **jadwal tidur konsisten**: tidur dan bangun di jam yang sama setiap hari, bahkan di akhir pekan. Ini mengatur ritme sirkadian tubuhmu secara alami.

Ciptakan lingkungan tidur yang ideal: gelap, dingin (18–22°C), dan sunyi. Matikan semua layar **minimal 60 menit sebelum tidur**—cahaya biru dari HP/laptop menekan produksi melatonin, hormon tidur alami. Ganti dengan aktivitas menenangkan: membaca buku fisik, mendengarkan musik lembut, atau meditasi napas.

Hindari kafein setelah jam 2 siang dan makan berat 2–3 jam sebelum tidur. Jika kamu tidak bisa tidur dalam 20 menit, bangun dan lakukan sesuatu yang tenang di ruang lain—jangan memaksakan diri di tempat tidur. Dengan konsistensi, tubuhmu akan belajar mengasosiasikan tempat tidur hanya dengan tidur—bukan dengan stres atau scroll media sosial. *Tidur yang baik adalah fondasi diam-diam dari semua pencapaianmu.*`
  },
  {
    id: 6,
    title: 'Teknik Grounding 5-4-3-2-1',
    summary: 'Latihan sederhana untuk mengatasi panic attack dan overwhelm.',
    category: 'Teknik',
    readTime: '3 menit',
    fullContent: `Saat serangan panik atau rasa kewalahan melanda, pikiranmu bisa terasa seperti "terlepas" dari realitas—berputar cepat, tidak terkendali, dan penuh ketakutan. Di sinilah **teknik grounding 5-4-3-2-1** menjadi penyelamat. Ini adalah latihan sensorik sederhana yang membantumu kembali ke "di sini dan sekarang" dengan melibatkan lima indra.

Langkah pertama: **Lihat 5 hal** di sekitarmu. Bisa apa saja—lampu di langit-langit, sepatu di lantai, daun di luar jendela. Fokus pada detailnya: warna, bentuk, tekstur. Ini mengalihkan pikiran dari kecemasan internal ke dunia eksternal yang nyata dan aman.

Langkah kedua: **Rasakan 4 hal** secara fisik. Sentuh permukaan meja, rasakan kain bajumu, tekan kaki ke lantai, atau pegang gelas air. Sensasi taktil ini mengaktifkan saraf somatik dan menenangkan sistem saraf simpatik yang sedang "on fire".

Langkah ketiga: **Dengar 3 suara**. Mungkin suara AC, kicau burung, atau napasmu sendiri. Dengarkan tanpa menghakimi—biarkan suara itu datang dan pergi. Ini melatih mindfulness pasif yang sangat menenangkan.

Langkah keempat: **Cium 2 aroma**. Jika tidak ada bau jelas, ingat bau favoritmu—kopi pagi, sabun mandi, atau hujan. Langkah kelima: **Rasakan 1 rasa** di mulutmu—minum seteguk air, atau ingat rasa permen terakhir yang kamu makan.

Latihan ini hanya butuh 1–2 menit, tapi efeknya bisa sangat kuat. Ia tidak menghilangkan penyebab kecemasan, tapi memberimu **ruang napas** untuk merespons dengan tenang, bukan bereaksi panik. Simpan teknik ini di "kotak peralatan mental"mu—kapan pun kamu merasa terombang-ambing, indramu akan selalu membawamu pulang ke saat ini. *Kamu aman. Kamu di sini. Dan ini akan berlalu.*`
  }
];

// --- Komponen ArticleDetail yang Dimodifikasi ---
const ArticleDetail = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const id = parseInt(articleId || '0');

  const article = useMemo(() => ARTICLES.find(a => a.id === id), [id]);

  // Styling untuk dark mode pada 404
  if (!article) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        // Tambahkan dark:bg-gray-900 untuk background
        className="min-h-screen bg-red-50 dark:bg-gray-900 flex items-center justify-center p-4"
      >
        <div className="text-center max-w-lg bg-white dark:bg-gray-800 rounded-xl p-8 shadow-xl border-t-4 border-red-500">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">404 Artikel Tidak Ditemukan</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Maaf, artikel dengan ID **{id}** tidak tersedia atau telah dihapus.</p>
          
          <Link 
            to="/insight" 
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-red-400 text-red-600 hover:text-white hover:bg-red-500 dark:text-red-400 dark:hover:text-white dark:hover:bg-red-600 rounded-full font-semibold transition-colors shadow-md hover:shadow-lg"
          >
            <ChevronLeft className="w-5 h-5 mr-1" /> Kembali ke Daftar Insight
          </Link>
        </div>
      </motion.div>
    );
  }

  // Styling untuk dark mode pada konten utama
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      // Tambahkan dark:from-gray-900 / dark:to-teal-900 untuk background
      className="min-h-screen relative overflow-hidden transition-colors duration-500 
      bg-gradient-to-br from-indigo-50/70 via-white to-teal-50/70 
      dark:from-gray-900 dark:via-gray-950 dark:to-indigo-950 p-4 sm:p-8"
    >
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 md:p-10 border-t-8 border-teal-500 dark:border-teal-400">
        
        <motion.div 
          whileHover={{ x: -10, scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="mb-8"
        >
          <Link 
            to="/insight" 
            // Tambahkan dark:text-teal-400 / dark:bg-teal-900
            className="inline-flex items-center text-teal-600 bg-teal-50 hover:bg-teal-100 dark:text-teal-400 dark:bg-teal-900 dark:hover:bg-teal-700 px-4 py-2 rounded-full font-semibold transition-colors shadow-sm"
          >
            <ChevronLeft className="w-5 h-5 mr-2" /> 
            Kembali ke Daftar Insight
          </Link>
        </motion.div>
        
        <motion.header
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          // Tambahkan dark:border-gray-700
          className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700"
        >
          <span className="text-sm font-semibold px-4 py-1 bg-teal-100 text-teal-700 dark:bg-teal-600 dark:text-white rounded-full inline-block mb-3 shadow-md">
            {article.category}
          </span>
          {/* Tambahkan dark:text-white */}
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
            {article.title}
          </h1>
          {/* Tambahkan dark:text-gray-400 */}
          <div className="flex items-center space-x-6 text-gray-500 dark:text-gray-400 text-sm md:text-base mt-4">
            <div className="flex items-center font-medium">
              <Clock className="w-5 h-5 mr-1 text-teal-500 dark:text-teal-400" />
              <span>{article.readTime} Bacaan</span>
            </div>
            <div className="flex items-center font-medium">
              <BookOpen className="w-5 h-5 mr-1 text-teal-500 dark:text-teal-400" />
              <span>Wawasan Mental</span>
            </div>
          </div>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          // Tambahkan dark:bg-indigo-900 / dark:border-indigo-600
          className="mb-10 p-6 bg-indigo-50 border-l-8 border-indigo-400 rounded-xl shadow-inner dark:bg-indigo-900 dark:border-indigo-600"
        >
          <p className="italic text-gray-800 dark:text-gray-200 text-lg md:text-xl">"{article.summary}"</p>
        </motion.div>

        {/* Gunakan ReactMarkdown untuk merender fullContent */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          // Tambahkan dark:prose-invert untuk styling markdown dark mode
          className="prose prose-lg max-w-none text-gray-800 dark:prose-invert dark:text-gray-200"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
              // Atur warna teks bold
              strong: ({ children }) => <strong className="font-bold text-gray-900 dark:text-white">{children}</strong>,
              // Atur warna teks italic
              em: ({ children }) => <em className="italic text-gray-700 dark:text-gray-300">{children}</em>,
              // Atur style list untuk dark mode
              ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2 prose-li:text-gray-800 dark:prose-li:text-gray-200">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-2 prose-li:text-gray-800 dark:prose-li:text-gray-200">{children}</ol>,
              li: ({ children }) => <li className="text-gray-800 dark:text-gray-200">{children}</li>,
              // Atur warna heading
              h1: ({ children }) => <h1 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">{children}</h1>,
              h2: ({ children }) => <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white">{children}</h2>,
            }}
          >
            {article.fullContent}
          </ReactMarkdown>
        </motion.div>

        <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-base font-medium">
            Semoga artikel ini memberikan wawasan yang bermanfaat untuk perjalanan mentalmu. 💙
          </p>
        </footer>
      </div>
    </motion.div>
  );
};

export default ArticleDetail;