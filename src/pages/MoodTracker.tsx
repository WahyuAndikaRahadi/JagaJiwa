import { useState, useEffect, useMemo, useRef } from 'react';
import Calendar from '../components/Calendar'; // Pastikan komponen ini sudah ada
import MoodChart from '../components/MoodChart'; // Pastikan komponen ini sudah ada
import { Smile, Meh, ChevronLeft, ChevronRight, BarChart3, CalendarDays } from 'lucide-react';
import { motion, useInView } from 'framer-motion'; // Import Framer Motion
import Swal from 'sweetalert2' // Sudah diimpor dengan benar

// --- Variasi Animasi Framer Motion (Diambil dari Home.tsx) ---
const fadeInUp: any = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const containerVariants: any = {
    animate: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const itemVariants: any = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
// --- Akhir Variasi Animasi ---

// Fungsi utilitas untuk format tanggal
const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // Format kunci: YYYY-MM-DD
};

// Mendapatkan bulan dan tahun saat ini
const TODAY = new Date();
const CURRENT_MONTH = TODAY.getMonth();
const CURRENT_YEAR = TODAY.getFullYear();


function MoodTracker() {
    // --- Refs untuk Animasi In-View ---
    const headerRef = useRef(null);
    const isHeaderInView = useInView(headerRef, { once: true, amount: 0.5 });

    const mainContentRef = useRef(null);
    const isMainContentInView = useInView(mainContentRef, { once: true, amount: 0.2 });

    const tipsRef = useRef(null);
    const isTipsInView = useInView(tipsRef, { once: true, amount: 0.2 });
    // ---------------------------------

    const [currentViewDate, setCurrentViewDate] = useState(TODAY);

    const currentMonth = currentViewDate.getMonth();
    const currentYear = currentViewDate.getFullYear();

    const [moodData, setMoodData] = useState<{ [key: string]: string }>(() => {
        // Memastikan inisialisasi hanya terjadi sekali dari localStorage
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('moodData');
            return saved ? JSON.parse(saved) : {};
        }
        return {};
    });

    const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);

    useEffect(() => {
        // Menyimpan data ke localStorage
        localStorage.setItem('moodData', JSON.stringify(moodData));
    }, [moodData]);


    // Fungsi yang dipanggil saat tanggal di kalender diklik
    const handleDateClick = (dateKey: string) => {
        setSelectedDateKey(dateKey);
    };

    // Fungsi untuk update state mood
    const updateMood = (mood: string, dateKey: string) => {
        setMoodData((prev) => ({
            ...prev,
            [dateKey]: mood,
        }));
        // Reset selected date setelah memilih mood
        setTimeout(() => setSelectedDateKey(null), 300);
    };

    // Fungsi yang dipanggil saat mood dipilih
    const handleMoodSelect = (mood: string) => {
        if (!selectedDateKey) return;
        
        const existingMood = moodData[selectedDateKey];
        const isEditing = existingMood !== undefined;
        const newMoodLabel = moodOptions.find(opt => opt.value === mood)?.label || mood;

        // Jika belum ada mood atau mood yang dipilih sama, langsung update
        if (!isEditing || existingMood === mood) {
            updateMood(mood, selectedDateKey);
            return;
        }

        // --- Logika Konfirmasi SweetAlert2 (Hanya saat edit mood yang berbeda) ---
        Swal.fire({
            title: 'Edit Mood?',
            text: `Apakah Anda yakin ingin mengubah mood tanggal ${selectedDateLabel} menjadi ${newMoodLabel}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Ubah!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                // HANYA dipanggil jika user mengklik "Ya, Ubah!"
                updateMood(mood, selectedDateKey); 
            } else {
                // Tutup pop-up jika dibatalkan
                setTimeout(() => setSelectedDateKey(null), 300); 
            }
        });
        // --- AKHIR Logika Konfirmasi ---
        
        // PENTING: updateMood() yang lama di akhir dihapus!
    };

    // Menghitung tanggal yang dipilih dalam format bahasa Indonesia
    const selectedDateLabel = useMemo(() => {
        if (!selectedDateKey) return '';
        const date = new Date(selectedDateKey);
        // CATATAN: Penyesuaian +1 hari untuk zona waktu dipertahankan
        date.setDate(date.getDate() + 1);
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    }, [selectedDateKey]);


    const moodOptions = [
        // Menggunakan warna yang lebih sesuai dengan skema teal/blue
        { value: 'very-happy', label: 'Sangat Senang', emoji: '😄', color: 'from-[#1ff498] to-emerald-500', baseColor: 'emerald' },
        { value: 'happy', label: 'Senang', emoji: '😊', color: 'from-[#72e4f8] to-[#50b7f7]', baseColor: 'cyan' },
        { value: 'neutral', label: 'Netral', emoji: '😐', color: 'from-amber-400 to-yellow-500', baseColor: 'amber' },
        { value: 'sad', label: 'Sedih', emoji: '😔', color: 'from-indigo-400 to-blue-500', baseColor: 'indigo' },
        { value: 'very-sad', label: 'Sangat Sedih', emoji: '😢', color: 'from-rose-500 to-pink-600', baseColor: 'rose' },
    ];

    // Navigasi Bulan
    const handleNextMonth = () => {
        setCurrentViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    const handlePrevMonth = () => {
        setCurrentViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };


    return (
        <div
            className="min-h-screen relative overflow-hidden transition-colors duration-500 
            bg-gradient-to-br from-indigo-50/70 via-white to-teal-50/70 
            dark:from-gray-900 dark:via-gray-950 dark:to-indigo-950"
        >
            {/* === Background Blobs (Sama dengan Home.tsx) === */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply opacity-20 dark:bg-indigo-700 dark:opacity-10" />
            <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply opacity-20 animation-delay-2000 dark:bg-emerald-700 dark:opacity-10" />
            <div className="absolute top-1/2 left-1/4 w-52 h-52 bg-teal-300 rounded-full mix-blend-multiply opacity-20 animation-delay-4000 dark:bg-teal-700 dark:opacity-10" />
            {/* Ornamen Pattern Titik Estetik */}
            <div
                className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 
                w-96 h-96 opacity-10 dark:opacity-5 pointer-events-none z-[1]"
                style={{
                    backgroundImage: `radial-gradient(circle, #1ff498 1px, rgba(0, 0, 0, 0) 1px)`,
                    backgroundSize: '20px 20px',
                    transform: `rotate(45deg) scale(1.5)`
                }}
            ></div>
            {/* === AKHIR Background Blobs === */}


            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 relative z-10">

                {/* === Header (Diberi Animasi) === */}
                <motion.div
                    ref={headerRef}
                    variants={fadeInUp}
                    initial="initial"
                    animate={isHeaderInView ? "animate" : "initial"}
                    className="mb-8 md:mb-12 pt-6"
                >
                    <div className="flex items-center space-x-4 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#1ff498] to-[#50b7f7] rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                            <Smile className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100">
                            Mood Tracker
                        </h1>
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-400 ml-16">
                        Pantau, catat, dan analisis pola emosi serta suasana hatimu.
                    </p>
                </motion.div>

                {/* === Popup Pemilihan Mood (Animated dan Aesthetic) === */}
                {selectedDateKey && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="mb-8 md:mb-12 p-5 md:p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border-2 border-[#1ff498] dark:border-[#0be084] backdrop-blur-sm"
                    >
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
                            Bagaimana perasaanmu pada tanggal <span className="text-[#50b7f7] dark:text-[#72e4f8]">{selectedDateLabel}</span>?
                        </h3>

                        <motion.div
                            variants={containerVariants}
                            initial="initial"
                            animate="animate"
                            className="grid grid-cols-3 md:grid-cols-5 gap-4 md:gap-6"
                        >
                            {moodOptions.map((mood, index) => (
                                <motion.button
                                    key={mood.value}
                                    variants={itemVariants}
                                    onClick={() => handleMoodSelect(mood.value)}
                                    // Styling yang lebih estetik
                                    className={`group relative overflow-hidden rounded-xl p-4 md:p-6 bg-white dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-700 
                                    hover:border-4 hover:border-transparent transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-xl hover:shadow-${mood.baseColor}-300/50 dark:hover:shadow-${mood.baseColor}-700/50`}
                                >
                                    {/* Layer Gradien di Hover */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${mood.color} opacity-0 group-hover:opacity-30 transition-opacity duration-300`}></div>

                                    <div className="flex flex-col items-center space-y-2 relative z-10">
                                        <span className="text-5xl md:text-6xl transform group-hover:scale-110 transition-transform">
                                            {mood.emoji}
                                        </span>
                                        <span className={`text-xs md:text-base font-semibold text-gray-700 dark:text-gray-300 text-center transition-colors group-hover:text-gray-900 dark:group-hover:text-white`}>
                                            {mood.label}
                                        </span>
                                    </div>
                                </motion.button>
                            ))}
                        </motion.div>

                        <motion.button
                            variants={itemVariants}
                            onClick={() => setSelectedDateKey(null)}
                            className="mt-6 text-sm md:text-base font-medium text-gray-500 dark:text-gray-400 hover:text-[#50b7f7] dark:hover:text-[#72e4f8] transition-colors mx-auto block"
                        >
                            <ChevronLeft className='inline-block w-4 h-4 mr-1' /> Batalkan Pilihan
                        </motion.button>
                    </motion.div>
                )}

                {/* === Kalender dan Grafik (Grid Animated) === */}
                <motion.div
                    ref={mainContentRef}
                    variants={containerVariants}
                    initial="initial"
                    animate={isMainContentInView ? "animate" : "initial"}
                    className="grid lg:grid-cols-2 gap-8 md:gap-10 mb-12"
                >
                    {/* Kalender */}
                    <motion.div variants={itemVariants} className="rounded-3xl shadow-xl border-2 border-gray-100 dark:border-gray-700 p-4 md:p-6 bg-white dark:bg-gray-800">
                        <h2 className="flex items-center text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                            <CalendarDays className="w-6 h-6 mr-2 text-[#1ff498]" /> Kalender Mood
                        </h2>
                        <Calendar
                            moodData={moodData}
                            currentMonth={currentMonth}
                            currentYear={currentYear}
                            onDateClick={handleDateClick}
                            onNextMonth={handleNextMonth}
                            onPrevMonth={handlePrevMonth}
                        />
                    </motion.div>

                    {/* Grafik */}
                    <motion.div variants={itemVariants} className="rounded-3xl shadow-xl border-2 border-gray-100 dark:border-gray-700 p-4 md:p-6 bg-white dark:bg-gray-800">
                        <MoodChart
                            moodData={moodData}
                            currentMonth={currentMonth}
                            currentYear={currentYear}
                        />
                    </motion.div>
                </motion.div>

                {/* === Tips Tracking Mood (Animated) === */}
                <motion.div
                    ref={tipsRef}
                    variants={fadeInUp}
                    initial="initial"
                    animate={isTipsInView ? "animate" : "initial"}
                    className="mt-10 md:mt-12 p-6 md:p-8 rounded-3xl shadow-2xl border-2 border-emerald-300 dark:border-emerald-700
                    bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-900/50 dark:to-teal-900/50"
                >
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#1ff498] to-[#50b7f7] rounded-xl flex items-center justify-center shadow-md">
                            <Meh className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                                Tips Agar Tracking Mood Lebih Optimal
                            </h3>
                            <ul className="space-y-3 text-base md:text-lg text-gray-700 dark:text-gray-300">
                                <li className="flex items-start space-x-3">
                                    <span className="text-[#1ff498] dark:text-[#0be084] font-extrabold text-xl">•</span>
                                    <span><strong>Konsistensi adalah Kunci:</strong> Catat mood-mu setiap hari di jam yang sama untuk hasil yang lebih akurat dan menemukan pola yang jelas.</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <span className="text-[#1ff498] dark:text-[#0be084] font-extrabold text-xl">•</span>
                                    <span><strong>Cari Pola:</strong> Setelah beberapa minggu, lihat grafikmu. Pola mood-mu akan membantu mengidentifikasi pemicu stres atau aktivitas yang meningkatkan suasana hati.</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <span className="text-[#1ff498] dark:text-[#0be084] font-extrabold text-xl">•</span>
                                    <span><strong>Hubungkan dengan Jurnal:</strong> Gunakan fitur <strong>Journal Mood</strong> untuk mencatat detail perasaanmu. Ini memberikan konteks mengapa kamu merasa seperti itu pada hari tertentu.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </motion.div>

            </div>

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
}

export default MoodTracker;