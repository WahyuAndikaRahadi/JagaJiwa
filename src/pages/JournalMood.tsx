import { useState, useEffect, useMemo } from "react";
import {
  BookHeart,
  Save,
  Trash2,
  Zap,
  Bot,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleGenAI } from "@google/genai";
import Swal from "sweetalert2"; // <-- Import SweetAlert2

// ==================== INITIALISASI AI ====================
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
const model = "gemini-2.5-flash";
// =========================================================

// --- KOMPONEN GRADIENTTEXT DIDEFINISIKAN LANGSUNG DI SINI ---
interface GradientTextProps {
  children: React.ReactNode;
  colors: string[];
  animationSpeed?: number;
  className?: string;
}

const GradientText: React.FC<GradientTextProps> = ({
  children,
  colors,
  animationSpeed = 5,
  className = '',
}) => {
  const gradientStyle = useMemo(() => {
    const colorStops = colors.join(', ');
    return {
      background: `linear-gradient(90deg, ${colorStops})`,
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent',
      backgroundSize: '200% 200%',
      animation: `gradientAnimation ${animationSpeed}s ease infinite`,
    };
  }, [colors, animationSpeed]);

<<<<<<< HEAD
=======
  const borderStyle = showBorder
    ? {
      border: '2px solid transparent',
      borderImage: `linear-gradient(90deg, ${colors.join(', ')}) 1`,
    }
    : {};

>>>>>>> 3c6d009bcb1f66977d79279016d5bb7a8376f1d8
  const keyframes = `
    @keyframes gradientAnimation {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <span style={gradientStyle as React.CSSProperties} className={className}>
        {children}
      </span>
    </>
  );
};
// --- AKHIR DARI KOMPONEN GRADIENTTEXT ---


interface JournalEntry {
  id: string;
  date: string;
  content: string;
  summary?: string;
}

// ==================== FUNGSI GENERATE AI SESUNGGUHNYA ====================
const generateGeminiSummary = async (text: string): Promise<string> => {
  if (text.split(/\s+/).filter(word => word.length > 0).length < 10) {
    return "Tulisan terlalu pendek (minimal 10 kata) untuk dianalisis oleh AI. Tambahkan detail lebih lanjut tentang perasaanmu hari ini.";
  }

  const prompt = `
    Anda adalah seorang psikolog AI yang bertugas menganalisis jurnal harian pengguna. 
    Berikan rangkuman singkat (maksimal 3-4 kalimat) dalam Bahasa Indonesia yang:
    1. Mengidentifikasi sentimen utama (positif, negatif, atau campuran).
    2. Menyebutkan inti masalah/perasaan yang dominan (jika ada).
    3. Memberikan satu kalimat motivasi atau saran yang menenangkan.
    
    Jurnal: "${text}"
    `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text!.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Maaf, AI gagal menganalisis. Silakan periksa koneksi atau kunci API Anda.";
  }
};
// ========================================================================

// ==================== VARIAN FRAMER MOTION ====================
const aosVariants: any = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const listContainerVariants: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};
// =============================================================

function JournalMood() {
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem("journalEntries");
    return saved ? JSON.parse(saved) : [];
  });

  const [currentEntry, setCurrentEntry] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    localStorage.setItem("journalEntries", JSON.stringify(entries));
  }, [entries]);

  const handleGenerateSummary = async () => {
    if (!currentEntry.trim()) return;

    setIsGenerating(true);
    setGeneratedSummary("");

    const summary = await generateGeminiSummary(currentEntry);
    setGeneratedSummary(summary);
    setIsGenerating(false);
  };

  // Fungsi Save dengan SweetAlert Success (Bawaan)
  const handleSaveEntry = () => {
    if (!currentEntry.trim()) return;

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      content: currentEntry,
      summary: generatedSummary || undefined,
    };

    setEntries((prev) => [newEntry, ...prev]);
    setCurrentEntry("");
    setGeneratedSummary("");

    // SweetAlert Success TOAST (menggunakan style bawaan)
    Swal.fire({
      icon: 'success',
      title: 'Berhasil Disimpan!',
      text: 'Jurnal Anda telah berhasil dicatat.',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
    });
  };

  // Fungsi Delete dengan SweetAlert Confirmation (Bawaan)
  const handleDeleteEntry = async (id: string) => {
    const result = await Swal.fire({
      title: 'Apakah Anda Yakin?',
      text: "Jurnal ini akan dihapus permanen. Tindakan ini tidak bisa dibatalkan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus Saja!',
      cancelButtonText: 'Batal',
      // Menggunakan warna bawaan Swal: #3085d6 (Confirm) dan #d33 (Cancel)
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      // Menghapus custom styling agar menggunakan bawaan SweetAlert
      buttonsStyling: true,
    });

    if (result.isConfirmed) {
      setEntries((prev) => prev.filter((entry) => entry.id !== id));

      // SweetAlert Success setelah Hapus (menggunakan style bawaan)
      Swal.fire(
        'Terhapus!',
        'Jurnal Anda berhasil dihapus.',
        'success'
      );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden transition-colors duration-500 
      bg-gradient-to-br from-indigo-50/70 via-white to-rose-50/70 
      dark:from-gray-900 dark:via-gray-950 dark:to-indigo-950"
    >
      {/* === Background Blobs (Framer Motion Blur) === */}
      <motion.div
        initial={{ scale: 0.8, x: -100, y: -100 }}
        animate={{ scale: 1.2, x: 0, y: 0 }}
        transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
        className="absolute top-0 left-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 dark:bg-indigo-700 dark:opacity-30"
      />
      <motion.div
        initial={{ scale: 1.2, x: 100, y: 100 }}
        animate={{ scale: 0.8, x: 0, y: 0 }}
        transition={{ duration: 15, repeat: Infinity, repeatType: "reverse", delay: 3 }}
        className="absolute bottom-1/4 right-0 w-1/3 h-1/3 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 dark:bg-rose-700 dark:opacity-30"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-9 md:py-14 relative z-10">

        {/* === Header (AOS Effect) === */}
        <motion.div
          variants={aosVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.8 }}
          className="mb-8 md:mb-12"
        >
          <div className="flex items-center space-x-4 mb-3">
<<<<<<< HEAD
            <motion.div
              initial={{ rotate: -90, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 12 }}
              className="w-14 h-14 bg-gradient-to-br from-[#1ff498]/20 to-[#50b7f7]/20 
              rounded-2xl flex items-center justify-center shadow-lg border-2 border-white/50"
            >
              <BookHeart className="w-7 h-7 text-teal-600 dark:text-teal-400" />
            </motion.div>
=======
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#1ff498] to-[#50b7f7] rounded-2xl flex items-center justify-center shadow-xl">
              <BookHeart className="w-8 h-8 sm:w-9 sm:h-9 text-white"/>
            </div>
>>>>>>> 3c6d009bcb1f66977d79279016d5bb7a8376f1d8
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
              <GradientText
                colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                animationSpeed={8}
                className="block"
              >
                Journal Mood
              </GradientText>
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 ml-[72px]">
            Curahkan isi hatimu, biarkan AI memahami dan membantu menenangkan jiwamu.
          </p>
        </motion.div>

        {/* === Input Card (AOS Effect) === */}
        <motion.div
          variants={aosVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ ...aosVariants.visible.transition, delay: 0.2 }}
          animate={{ scale: isFocused ? 1.01 : 1 }}
          className="rounded-3xl p-6 md:p-8 border-2 shadow-xl mb-8
          border-[#72e4f8] bg-white/60 backdrop-blur-md 
          dark:bg-gray-900/60 dark:border-[#50b7f7] relative"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-5">
            Apa yang kamu rasakan hari ini?
          </h2>

          <textarea
            value={currentEntry}
            onChange={(e) => setCurrentEntry(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Tulis apapun yang ada di pikiranmu... Tidak ada yang salah atau benar di sini."
            className="w-full h-48 md:h-64 px-4 py-3 bg-white/80 dark:bg-gray-800/80 border-2 
            border-indigo-200 dark:border-gray-700 rounded-2xl 
            focus:outline-none focus:ring-4 focus:ring-[#1ff498]/50 focus:border-transparent 
            resize-none text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400
            transition-all duration-300"
          />

          <div className="flex flex-col sm:flex-row gap-4 mt-5">
            {/* Tombol AI Analysis */}
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: "0 10px 20px rgba(31, 244, 152, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerateSummary}
              disabled={!currentEntry.trim() || isGenerating}
              className="group flex-1 relative inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-[#1ff498] to-[#50b7f7] rounded-full transition-all duration-300 overflow-hidden shadow-md shadow-[#1ff498]/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
<<<<<<< HEAD
              {isGenerating ? (
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 animate-spin" />
                  <span>Menganalisis...</span>
                </div>
              ) : (
                <>
                  <Bot className="w-5 h-5 mr-2" />
                  <span>Analisis dengan AI</span>
                </>
              )}
            </motion.button>
=======
              <Sparkles
                className={`w-5 h-5 mr-2 ${isGenerating ? "animate-spin" : "group-hover:animate-pulse-fast"
                  }`}
              />
              <span>{isGenerating ? "Menganalisis..." : "Analisis dengan AI"}</span>
            </button>
>>>>>>> 3c6d009bcb1f66977d79279016d5bb7a8376f1d8

            {/* Tombol Simpan */}
            <motion.button
              whileHover={{ scale: 1.03, borderColor: "#1ff498" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSaveEntry}
              disabled={!currentEntry.trim()}
              className="flex-1 inline-flex items-center justify-center px-8 py-3 text-lg font-semibold rounded-full transition-all duration-300 
              text-gray-800 bg-white/90 backdrop-blur-md border-2 border-[#72e4f8] hover:border-[#1ff498]
              dark:text-gray-200 dark:bg-gray-800/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5 mr-2" />
              <span>Simpan</span>
            </motion.button>
          </div>

          {/* Kartu Ringkasan AI dengan AnimatePresence */}
          <AnimatePresence>
            {generatedSummary && (
              <motion.div
                key="ai-summary"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.95 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                className="mt-6 p-5 md:p-6 rounded-2xl border
                bg-gradient-to-br from-emerald-100 to-teal-100 
                border-emerald-300
                dark:from-emerald-900/50 dark:to-teal-900/50 dark:border-emerald-700"
              >
                <div className="flex items-start space-x-3">
                  <Bot className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-300 mb-2">
                      Rangkuman AI
                    </h3>
                    <p className="text-gray-700 dark:text-emerald-200 leading-relaxed whitespace-pre-wrap">
                      {generatedSummary}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* === Daftar Jurnal (Staggered List AOS) === */}
        <div className="space-y-6">
          <motion.h2
            variants={aosVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.8 }}
            className="text-3xl font-extrabold text-gray-900 dark:text-gray-100"
          >
            Jurnal Sebelumnya
          </motion.h2>

          {entries.length === 0 ? (
            <motion.div
              variants={aosVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.8 }}
              transition={{ ...aosVariants.visible.transition, delay: 0.1 }}
              className="rounded-3xl p-8 md:p-12 text-center border-2 
              border-gray-200 dark:border-gray-700 
              bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm"
            >
              <BookHeart className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-lg text-gray-500 dark:text-gray-400">
                Belum ada jurnal. Mulai tulis perasaanmu hari ini!
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={listContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="space-y-6"
            >
              <AnimatePresence>
                {entries.map((entry) => (
                  <motion.div
                    key={entry.id}
                    variants={aosVariants}
                    exit={{ opacity: 0, height: 0, marginBottom: 0, transition: { duration: 0.3 } }}
                    whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="rounded-3xl p-6 md:p-8 border border-gray-200 
                    dark:border-gray-700 bg-white/70 backdrop-blur-sm 
                    dark:bg-gray-800/70 shadow-lg cursor-pointer
                    hover:border-[#1ff498] dark:hover:border-[#1ff498]"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {formatDate(entry.date)}
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full transition-colors flex-shrink-0"
                        title="Hapus jurnal"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>

                    <p className="text-gray-800 dark:text-gray-200 leading-relaxed mb-4 whitespace-pre-wrap">
                      {entry.content}
                    </p>

                    {entry.summary && (
                      <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg border-l-4 border-indigo-400 dark:border-indigo-500">
                        <p className="text-sm font-semibold text-indigo-800 dark:text-indigo-300 mb-1">
                          AI Summary
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {entry.summary}
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
      <div className="relative h-32 w-full overflow-hidden flex-shrink-0 z-10">
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

export default JournalMood;