import { useMemo } from 'react';
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
  },
  {
    id: 7,
    title: 'Mengatur Ekspektasi Diri Sendiri',
    summary: 'Belajar membedakan antara ambisi sehat dan perfeksionisme yang merusak.',
    category: 'Pengembangan Diri',
    readTime: '5 menit',
    fullContent: `Kita sering mengira bahwa menuntut diri sendiri untuk "selalu terbaik" adalah tanda disiplin. Tapi batas antara ambisi sehat dan perfeksionisme toksik sangat tipis—dan sering kali, kita sudah melewatinya tanpa sadar. Perfeksionisme bukan tentang keunggulan, melainkan tentang takut gagal, takut dihakimi, dan keyakinan bahwa nilai diri bergantung pada pencapaian.

Tanda-tandanya? Kamu merasa bersalah saat beristirahat, menunda memulai karena takut hasilnya tidak sempurna, atau merasa "belum cukup" meski sudah berhasil. Ini melelahkan—dan ironisnya, justru menghambat produktivitas jangka panjang.

Langkah pertama adalah **mengganti standar "sempurna" dengan "cukup baik"**. Tanyakan: *"Apa tujuan utama dari tugas ini? Apakah 'cukup baik' sudah memenuhinya?"* Sering kali, jawabannya ya. Belajar menerima ketidaksempurnaan bukan kegagalan—itu kebijaksanaan.

Latih juga **self-talk yang mendukung**, bukan menghukum. Alih-alih, *"Kalau nilaiku bukan A, aku gagal,"* coba, *"Aku sudah berusaha sesuai kapasitasku hari ini—itu layak dihargai."* Perlakuan ini membangun hubungan yang sehat dengan diri sendiri.

Ingat: kamu bukan mesin. Kamu manusia—yang punya hari baik, hari buruk, dan hari di mana sekadar bangun dari tempat tidur saja sudah merupakan kemenangan. *Kebaikan pada diri sendiri bukan kemewahan—itu prasyarat untuk tumbuh.*`
  },
  {
    id: 8,
    title: 'Digital Detox untuk Kesehatan Mental',
    summary: 'Cara melepaskan ketergantungan pada layar dan kembali ke kehidupan nyata.',
    category: 'Kesehatan',
    readTime: '6 menit',
    fullContent: `Di era hiperkoneksi, notifikasi terus-menerus, scroll tanpa akhir, dan perbandingan sosial di media bisa menciptakan kelelahan mental yang tak kasatmata. Otak kita tidak dirancang untuk memproses begitu banyak informasi sekaligus—apalagi informasi yang memicu rasa iri, cemas, atau FOMO (fear of missing out).

Digital detox bukan berarti menghapus semua akun media sosial selamanya. Ini tentang **membangun batas sadar** antara dunia digital dan kehidupan nyata. Mulailah dengan audit kecil: berapa jam sehari kamu menghabiskan waktu di layar? Apa emosi yang muncul setelah scroll Instagram selama 30 menit?

Cobalah aturan sederhana: **tidak ada HP di meja makan**, **tidak mengecek notifikasi 1 jam pertama setelah bangun**, dan **HP di luar kamar tidur saat malam**. Ganti waktu layar dengan aktivitas yang melibatkan tubuh dan indera: jalan kaki tanpa earphone, menulis jurnal tangan, atau memasak sambil mendengarkan musik.

Kamu juga bisa coba "detoks mingguan"—misalnya, Sabtu pagi tanpa layar sama sekali. Awalnya mungkin terasa gelisah, tapi itu justru tanda otakmu mulai "membersihkan" kebisingan digital. Dalam keheningan itu, kamu mungkin menemukan kembali suara batin yang selama ini tenggelam dalam notifikasi.

Ingat: teknologi seharusnya melayanimu—bukan menguasaimu. *Kehidupan nyata terjadi di luar layar. Dan kamu layak hadir sepenuhnya di dalamnya.*`
  },
  {
    id: 9,
    title: 'Menulis Jurnal sebagai Terapi Diri',
    summary: 'Manfaat menulis harian untuk mengelola emosi dan meningkatkan kesadaran diri.',
    category: 'Teknik',
    readTime: '4 menit',
    fullContent: `Menulis jurnal bukan hanya untuk penyair atau remaja patah hati. Ini adalah alat terapi yang kuat—dan gratis—untuk memahami emosi, mengurangi stres, dan menemukan pola pikir yang tidak sehat. Penelitian menunjukkan bahwa menulis ekspresif selama 15–20 menit sehari selama beberapa hari dapat meningkatkan kesejahteraan psikologis dan bahkan fungsi imun.

Kamu tidak perlu menulis indah atau terstruktur. Cukup ambil kertas dan pena, lalu tulis apa pun yang muncul di kepalamu: *"Aku marah karena dosen tidak menghargai usahaku,"* atau *"Aku takut besok presentasi akan kacau."* Biarkan tinta mengalir tanpa sensor.

Teknik sederhana yang bisa dicoba: **"3 hal yang kurasakan hari ini"**, **"Apa yang membuatku bersyukur?"**, atau **"Apa yang ingin kulepaskan malam ini?"** Pertanyaan-pertanyaan ini membimbingmu ke dalam diri sendiri dengan lembut.

Yang penting bukan hasil tulisannya, tapi prosesnya. Saat kamu menuliskan kekacauan batin, kamu memberinya bentuk—dan sesuatu yang berbentuk lebih mudah dipahami, diatur, bahkan dilepaskan. *Kertas tidak menghakimi. Ia hanya mendengar—dan menyimpan rahasia dengan setia.*`
  },
  {
    id: 10,
    title: 'Mengenali dan Mengatasi Prokrastinasi',
    summary: 'Memahami akar prokrastinasi dan cara mengubahnya menjadi aksi.',
    category: 'Akademik',
    readTime: '6 menit',
    fullContent: `Prokrastinasi bukan soal kemalasan—ini sering kali respons emosional terhadap tugas yang terasa mengancam, membosankan, atau terlalu besar. Otak kita secara alami menghindari ketidaknyamanan, jadi kita memilih aktivitas yang memberi kepuasan instan (scroll media, nonton video) sebagai pelarian.

Tapi menyalahkan diri sendiri hanya memperparah siklus: prokrastinasi → rasa bersalah → stres → prokrastinasi lagi. Alih-alih, cobalah **berempati pada dirimu sendiri**. Tanyakan: *"Apa yang membuatku takut atau enggan memulai tugas ini?"* Apakah takut gagal? Bingung dari mana memulai? Atau merasa tugasnya tidak bermakna?

Setelah mengenali akarnya, gunakan strategi kecil: **"aturan 2 menit"**—jika tugas bisa diselesaikan dalam 2 menit, lakukan sekarang. Jika tidak, lakukan hanya selama 2 menit. Sering kali, memulai adalah bagian tersulit—setelah itu, momentum akan membawamu lebih jauh.

Pecah tugas besar menjadi langkah-langkah mikro. Daripada "menulis makalah", tulis: "buka dokumen → tulis judul → cari 3 referensi". Setiap centimeter kemajuan layak dirayakan.

Ingat: kamu tidak perlu merasa siap untuk memulai. Kamu memulai agar merasa siap. *Aksi kecil hari ini lebih berharga daripada rencana sempurna yang tak pernah dimulai.*`
  },
  {
    id: 11,
    title: 'Menjaga Motivasi Jangka Panjang',
    summary: 'Strategi mempertahankan semangat saat tujuan terasa jauh.',
    category: 'Pengembangan Diri',
    readTime: '5 menit',
    fullContent: `Motivasi awal—saat semuanya terasa mungkin dan penuh semangat—itu mudah. Tapi bagaimana saat minggu ke-12, kelelahan datang, hasil belum terlihat, dan keraguan mulai menggerogoti? Di sinilah **disiplin dan sistem** menggantikan motivasi sesaat.

Alih-alih hanya fokus pada tujuan akhir ("lulus dengan IPK 3.8"), bangun **ritual harian** yang mendukungnya: belajar 45 menit setiap pagi, review catatan setiap Jumat, atau istirahat cukup setiap malam. Sistem ini membuatmu tetap bergerak, bahkan saat motivasi sedang turun.

Rayakan **kemajuan mikro**. Menyelesaikan satu bab buku? Itu layak diakui. Tidak menunda tugas hari ini? Itu kemenangan. Otak kita termotivasi oleh penghargaan—jadi beri ia umpan balik positif secara konsisten.

Selain itu, ingatkan dirimu pada **"mengapa"** yang lebih dalam. Bukan hanya "aku ingin lulus", tapi "aku ingin lulus agar bisa membantu keluargaku" atau "agar suatu hari nanti aku bisa mengajar anak-anak yang kurang beruntung". Nilai-nilai ini adalah bahan bakar jangka panjang.

Dan saat semuanya terasa berat, izinkan dirimu **beristirahat tanpa rasa bersalah**. Motivasi bukan api yang harus terus menyala—kadang, ia perlu ditiup pelan agar bara tetap hidup. *Perjalanan panjang dimenangkan oleh mereka yang tahu kapan harus berlari—dan kapan harus duduk sejenak.*`
  },
  {
    id: 12,
    title: 'Menghadapi Kegagalan dengan Bijak',
    summary: 'Mengubah kegagalan dari akhir menjadi awal yang baru.',
    category: 'Pengembangan Diri',
    readTime: '5 menit',
    fullContent: `Kegagalan terasa seperti pukulan—terutama saat kamu sudah berusaha keras. Tapi bagaimana jika kegagalan bukan akhir, melainkan **data**? Bukan bukti ketidakmampuan, tapi petunjuk tentang apa yang perlu disesuaikan?

Orang yang tumbuh dengan pola pikir berkembang (*growth mindset*) tidak melihat kegagalan sebagai identitas ("Aku gagal" → "Aku orang gagal"), tapi sebagai proses ("Aku gagal" → "Aku sedang belajar"). Perbedaan kecil ini mengubah seluruh narasi.

Setelah kegagalan, tanyakan tiga pertanyaan reflektif:  
1. *Apa yang bisa kubelajar dari ini?*  
2. *Apa yang masih bisa kuperbaiki?*  
3. *Apa langkah kecil berikutnya?*

Jangan biarkan kegagalan mendefinisikanmu. Kamu adalah kumpulan dari semua usaha, keberanian, dan keinginan untuk terus mencoba—bukan hanya hasil akhirnya.

Dan ingat: hampir semua orang sukses pernah gagal berkali-kali. Yang membedakan mereka bukan keberuntungan, tapi **kegigihan untuk bangkit**. *Kegagalan bukan lawanmu—ia guru yang keras, tapi jujur.*`
  },
  {
    id: 13,
    title: 'Membangun Rutinitas Pagi yang Menenangkan',
    summary: 'Cara memulai hari dengan tenang dan penuh energi positif.',
    category: 'Kesehatan',
    readTime: '4 menit',
    fullContent: `Jam-jam pertama setelah bangun tidur menentukan arah seluruh harimu. Jika kamu langsung mengecek notifikasi, buru-buru mandi, lalu lari ke kelas sambil sarapan di jalan, otakmu masuk mode "bertahan"—bukan "berkembang".

Rutinitas pagi yang menenangkan bukan tentang bangun jam 4 pagi atau yoga selama 1 jam. Ini tentang **menciptakan 15–30 menit pertama yang milikmu sendiri**—tanpa tuntutan eksternal.

Cobalah: bangun 15 menit lebih awal, minum segelas air, lalu duduk diam sambil menarik napas dalam. Kamu bisa menambahkan peregangan ringan, menulis 1 hal yang kamu syukuri, atau membaca satu halaman buku inspiratif.

Hindari layar selama 30–60 menit pertama. Biarkan pikiranmu bangun secara alami, bukan dipaksa masuk ke dunia digital yang penuh tekanan.

Rutinitas ini bukan kemewahan—ini investasi. Dengan memulai hari dalam keadaan tenang, kamu membawa ketenangan itu ke setiap interaksi, keputusan, dan tugas yang mengikutinya. *Hari yang baik tidak dimulai dengan daftar tugas—tapi dengan kehadiran diri sendiri.*`
  },
  {
    id: 14,
    title: 'Mengelola Konflik dengan Teman atau Rekan',
    summary: 'Cara berkomunikasi asertif tanpa merusak hubungan.',
    category: 'Sosial',
    readTime: '6 menit',
    fullContent: `Konflik adalah bagian alami dari hubungan manusia—tapi cara kita menghadapinya menentukan apakah ia merusak atau memperkuat ikatan. Banyak orang menghindari konflik karena takut dianggap "kasar" atau "egois". Padahal, menghindar justru menumpuk dendam dan salah paham.

Kunci komunikasi asertif adalah: **jujur tanpa menyerang, tegas tanpa menghakimi**. Gunakan kalimat "aku", bukan "kamu". Alih-alih, *"Kamu selalu telat!"*, coba, *"Aku merasa cemas saat janji tidak ditepati—bisa kita diskusikan cara mengatasinya?"*

Sebelum bicara, pastikan emosimu sudah cukup tenang. Jika masih marah, katakan: *"Aku butuh waktu sebentar untuk menenangkan diri—nanti kita lanjutkan, ya?"* Ini bukan penundaan, tapi bentuk penghormatan pada hubungan.

Dengarkan juga dengan niat memahami, bukan memenangkan argumen. Tanyakan: *"Apa maksudmu saat mengatakan itu?"* atau *"Bagaimana perasaanmu saat itu?"* Sering kali, konflik lahir dari asumsi yang salah—bukan niat jahat.

Ingat: hubungan yang sehat bukan yang tanpa konflik, tapi yang mampu **menyelesaikan konflik dengan empati dan kejujuran**. *Kedewasaan sosial bukan soal menghindari gesekan—tapi mengubahnya menjadi pemahaman.*`
  },
  {
    id: 15,
    title: 'Mengatasi Rasa Tidak Cukup (Impostor Syndrome)',
    summary: 'Mengenali dan melawan perasaan sebagai "penipu" meski sudah berprestasi.',
    category: 'Pengembangan Diri',
    readTime: '5 menit',
    fullContent: `Pernah merasa seperti "penipu"—bahwa suatu hari nanti orang akan sadar kamu sebenarnya tidak sehebat yang mereka kira? Itu disebut *impostor syndrome*, dan ia menyerang bahkan orang-orang paling kompeten sekalipun.

Gejalanya: meremehkan pencapaian sendiri ("Aku hanya beruntung"), takut dinilai, atau merasa harus bekerja dua kali lebih keras agar "layak". Ironisnya, semakin sukses kamu, semakin kuat perasaan ini—karena standar internalmu terus naik.

Langkah pertama: **namai perasaan itu**. Katakan pada dirimu, *"Ini impostor syndrome bicara—bukan kenyataan."* Ini menciptakan jarak antara emosi dan identitasmu.

Kedua, **kumpulkan bukti nyata**. Buat daftar pencapaian, pujian dari orang lain, atau proyek yang berhasil kamu selesaikan. Saat keraguan datang, baca daftar itu—bukan sebagai pamer, tapi sebagai pengingat objektif.

Ketiga, bicarakan dengan orang tepercaya. Kamu akan terkejut betapa banyak orang merasakan hal yang sama. Berbagi keraguan justru memperkuat rasa koneksi—dan mengurangi rasa "sendirian".

Ingat: kamu tidak perlu merasa 100% layak untuk berada di tempatmu sekarang. Kamu **sudah** layak—karena kamu ada di sana. *Kehadiranmu bukan kesalahan. Itu konfirmasi bahwa kamu cukup.*`
  },
  {
    id: 16,
    title: 'Latihan Pernapasan untuk Menenangkan Pikiran',
    summary: 'Teknik pernapasan sederhana yang bisa dilakukan di mana saja.',
    category: 'Teknik',
    readTime: '3 menit',
    fullContent: `Napas adalah jembatan antara tubuh dan pikiran. Saat cemas, napas menjadi cepat dan dangkal—yang justru memperkuat sinyal "bahaya" ke otak. Tapi dengan mengatur napas, kamu bisa mengirim sinyal sebaliknya: *"Kita aman. Kita tenang."*

Salah satu teknik paling efektif adalah **pernapasan kotak (box breathing)**:  
- Tarik napas melalui hidung selama 4 detik  
- Tahan napas selama 4 detik  
- Buang napas perlahan lewat mulut selama 4 detik  
- Tahan lagi selama 4 detik  
Ulangi 3–5 kali.

Teknik ini digunakan oleh pilot, atlet, dan tentara untuk tetap tenang di bawah tekanan. Kamu bisa melakukannya di kelas sebelum ujian, di kamar saat merasa overwhelmed, atau bahkan di toilet kampus selama 1 menit.

Kuncinya: fokus penuh pada sensasi napas—udara masuk, dada mengembang, udara keluar. Saat pikiran melayang, lembut bawa kembali ke hitungan.

Latihan ini tidak menghilangkan masalah, tapi memberimu **ruang mental** untuk merespons dengan jernih, bukan bereaksi impulsif. *Ketenangan selalu tersedia—cukup tarik napas, dan kembalilah ke pusat dirimu.*`
  },
  {
    id: 17,
    title: 'Menjaga Keseimbangan Hidup Mahasiswa',
    summary: 'Tips mengelola waktu antara kuliah, organisasi, dan kehidupan pribadi.',
    category: 'Akademik',
    readTime: '6 menit',
    fullContent: `Menjadi mahasiswa bukan hanya soal kuliah—ada organisasi, tugas kelompok, kerja paruh waktu, hubungan sosial, dan kebutuhan pribadi. Tanpa batas yang jelas, mudah terjebak dalam "ya" untuk semua hal—lalu kehabisan energi untuk diri sendiri.

Keseimbangan bukan berarti melakukan semuanya dengan sempurna setiap hari. Ini tentang **prioritas yang sadar dan fleksibel**. Tanyakan setiap minggu: *"Apa yang paling penting minggu ini?"* Mungkin minggu ini fokus pada ujian tengah semester, jadi organisasi bisa dikurangi sementara.

Gunakan prinsip **"kalender > to-do list"**. Masukkan waktu untuk belajar, tidur, makan, dan istirahat ke kalender—seperti janji dengan orang lain. Jika tidak masuk jadwal, kemungkinan besar tidak akan terjadi.

Belajar berkata **"tidak" dengan sopan tapi tegas**. Kamu tidak wajib ikut semua rapat, acara, atau proyek. Menolak satu hal berarti mengatakan "ya" pada kesehatan mentalmu.

Dan jangan lupa: **istirahat bukan hadiah setelah selesai semua—ia bagian dari proses**. Tubuh dan pikiran yang dirawat akan memberimu energi lebih untuk menjalani semua peran itu—tanpa kehilangan dirimu sendiri. *Keseimbangan bukan tujuan akhir, tapi pilihan harian yang penuh kesadaran.*`
  },
  {
    id: 18,
    title: 'Mengelola Emosi Negatif dengan Sehat',
    summary: 'Cara mengakui, memahami, dan menyalurkan emosi seperti marah, sedih, atau kecewa.',
    category: 'Kesehatan',
    readTime: '5 menit',
    fullContent: `Emosi negatif—marah, sedih, frustrasi—sering dianggap "buruk" dan harus dihindari. Tapi sebenarnya, semua emosi adalah sinyal penting dari dalam diri. Marah menunjukkan batas dilanggar. Sedih menunjukkan kehilangan yang perlu diakui. Frustrasi menunjukkan harapan yang tidak terpenuhi.

Masalah bukan pada emosinya, tapi pada **cara kita menanggapinya**. Menekan emosi membuatnya meledak di waktu yang salah. Mengumbar emosi tanpa filter melukai orang lain.

Langkah pertama: **beri nama emosimu**. *"Aku merasa kecewa karena ekspektasiku tidak dipenuhi."* Penamaan ini mengaktifkan korteks prefrontal—bagian otak yang membantu mengatur respons.

Kedua, **tunda reaksi**. Saat emosi memuncak, tunggu 10–15 menit sebelum merespons. Gunakan waktu itu untuk napas dalam, jalan kaki, atau menulis perasaanmu.

Ketiga, **salurkan dengan cara sehat**: olahraga, menulis, berbicara dengan teman, atau menangis jika perlu. Emosi butuh jalan keluar—bukan penjara.

Ingat: merasa tidak nyaman bukan berarti ada yang salah denganmu. Itu berarti kamu manusia—dan kamu sedang belajar mengelola kompleksitas hidup dengan lebih bijak. *Emosi bukan musuh. Mereka utusan dari jiwamu yang ingin didengar.*`
  },
  {
    id: 19,
    title: 'Membangun Kebiasaan Belajar yang Efektif',
    summary: 'Strategi berbasis sains untuk belajar lebih cerdas, bukan lebih lama.',
    category: 'Akademik',
    readTime: '7 menit',
    fullContent: `Belajar 8 jam sehari tanpa hasil? Mungkin bukan soal usaha—tapi metode. Otak kita belajar paling baik melalui **pengulangan terdistribusi**, **pengujian aktif**, dan **koneksi makna**—bukan menghafal maraton semalam sebelum ujian.

Alih-alih membaca ulang catatan berjam-jam, coba **teknik recall aktif**: tutup buku, lalu tulis atau jelaskan sebanyak mungkin dari ingatan. Ini memperkuat jalur saraf jauh lebih efektif daripada sekadar mengenali informasi.

Gunakan **spaced repetition**: ulangi materi pada hari ke-1, ke-3, ke-7, lalu ke-14. Aplikasi seperti Anki bisa membantu, tapi bahkan jadwal sederhana di kalender pun cukup.

Saat belajar, **ajukan pertanyaan** pada dirimu: *"Mengapa ini terjadi?"*, *"Bagaimana ini terkait dengan yang sudah kumengerti?"* Menghubungkan informasi baru dengan pengetahuan lama membuatnya lebih mudah diingat.

Jangan lupa: **tidur setelah belajar** sangat penting. Saat tidur, otak mengkonsolidasi memori—jadi begadang justru menghapus sebagian usahamu.

Dan yang terpenting: **istirahat terjadwal**. Otak butuh waktu untuk mencerna informasi. Belajar 50 menit + istirahat 10 menit lebih efektif daripada 3 jam nonstop.

Belajar bukan lomba ketahanan—ini seni memahami cara otakmu bekerja. *Kecerdasan bukan soal berapa lama kamu duduk, tapi seberapa dalam kamu terlibat.*`
  },
  {
    id: 20,
    title: 'Menemukan Makna dalam Perjalanan Akademik',
    summary: 'Menghubungkan studi dengan nilai dan tujuan hidup yang lebih besar.',
    category: 'Pengembangan Diri',
    readTime: '5 menit',
    fullContent: `Ada saat-saat ketika tugas, ujian, dan deadline terasa hampa—seperti roda yang berputar tanpa arah. Di sinilah pentingnya **menghubungkan studimu dengan "mengapa" yang lebih dalam**.

Tanyakan pada dirimu:  
- *Mengapa aku memilih jurusan ini?*  
- *Apa dampak yang ingin kuberikan lewat ilmu ini?*  
- *Nilai apa yang ingin kuhidupi—dan bagaimana studiku mendukung itu?*

Jawaban-jawaban ini bukan harus muluk-muluk. Mungkin kamu belajar teknik sipil karena ingin membangun jembatan yang aman bagi desa asalmu. Atau belajar psikologi karena pernah merasakan betapa pentingnya dukungan mental.

Saat makna ini jelas, tugas yang membosankan berubah menjadi bagian dari sesuatu yang lebih besar. Ujian bukan hanya angka—tapi batu loncatan menuju kontribusimu.

Dan jika kamu belum tahu "mengapa"-mu, itu juga oke. Gunakan masa studi ini untuk **menjelajahi**, bukan hanya mengejar. Ikut proyek sosial, magang di bidang berbeda, atau ajak dosen ngobrol tentang passion mereka.

Ingat: pendidikan bukan hanya tentang gelar—tapi tentang **menjadi versi dirimu yang paling utuh dan bermakna**. *Ketika belajar terhubung dengan hati, lelah pun terasa ringan.*`
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