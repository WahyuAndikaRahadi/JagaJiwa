import {
  Brain,
  TrendingUp,
  AlertCircle,
  BookOpen,
  Target,
  Lightbulb,
  Activity,
  Heart,
  Phone,
  PlayCircle,
  CheckCircle,
  ChevronRight,
  Loader,
  PauseCircle,
  StopCircle,
  Flower,
  BookLock,
} from "lucide-react";
import { useState, useEffect, useMemo, useRef } from "react";
import {
  GoogleGenAI,
} from "@google/genai";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import GradientText from "../components/GradientText";

// ==================== INITIALISASI AI (Ganti dengan API Key Anda) ====================
// PENTING: Dalam aplikasi nyata, JANGAN simpan API Key di client-side code seperti ini.
// Gunakan server-side proxy atau fungsi serverless untuk memanggil API.
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
const model = "gemini-2.5-flash";

// ==================== TIPE DATA ====================
interface MoodData {
  [key: string]: string;
}

interface JournalEntry {
  id: string;
  date: string;
  content: string;
  summary?: string;
}

interface EmotionGuide {
  name: string;
  definition: string;
  triggers: string[];
  managementTips: string[];
  color: string;
  icon: string;
}

interface LockedWorry {
  text: string;
  type: string;
  date: string;
  aiAnalysis?: string;
}

interface Article {
  id: number;
  title: string;
  summary: string;
  category: string;
  readTime: string;
}

interface AudioGuide {
  title: string;
  duration: string;
  color: string;
  icon: string;
  audioFile: string; // Tambahan field audio
}

// ==================== DATA EDUKASI ====================
const EMOTION_GUIDES: EmotionGuide[] = [
  {
    name: "Rasa Bersalah",
    definition:
      "Perasaan menyesal atau bertanggung jawab atas kesalahan yang dilakukan, baik nyata maupun yang dibayangkan.",
    triggers: [
      "Mengecewakan orang lain",
      "Tidak memenuhi ekspektasi diri sendiri",
      "Membuat keputusan yang merugikan",
    ],
    managementTips: [
      "Bedakan antara rasa bersalah yang konstruktif dan destruktif",
      "Minta maaf jika memang ada kesalahan nyata",
      "Latih self-compassion - ingat bahwa semua orang membuat kesalahan",
      "Fokus pada pembelajaran, bukan penyesalan berkepanjangan",
    ],
    color: "from-purple-500 to-indigo-600",
    icon: "💭",
  },
  {
    name: "Kecemasan",
    definition:
      "Respons emosional terhadap ancaman yang dipersepsikan, ditandai dengan kekhawatiran berlebihan tentang masa depan.",
    triggers: [
      "Ketidakpastian atau perubahan besar",
      "Tekanan akademik atau sosial",
      "Overthinking tentang hal-hal di luar kendali",
    ],
    managementTips: [
      "Praktikkan teknik grounding 5-4-3-2-1",
      "Tulis worry list dan kategorikan: bisa dikontrol vs tidak bisa",
      "Lakukan breathing exercise 4-7-8",
      "Batasi konsumsi berita atau media yang memicu cemas",
    ],
    color: "from-yellow-500 to-orange-500",
    icon: "😰",
  },
  {
    name: "Kesedihan",
    definition:
      "Respons emosional terhadap kehilangan, kekecewaan, atau situasi yang tidak sesuai harapan.",
    triggers: [
      "Kehilangan seseorang atau sesuatu yang berharga",
      "Kegagalan atau penolakan",
      "Merasa tidak dihargai atau diabaikan",
    ],
    managementTips: [
      "Izinkan dirimu merasakan kesedihan tanpa menghakimi",
      "Berbicara dengan orang yang dipercaya",
      "Tulis ekspresif journaling tentang perasaanmu",
      "Lakukan aktivitas yang biasanya membuatmu nyaman",
    ],
    color: "from-blue-500 to-cyan-600",
    icon: "😢",
  },
  {
    name: "Kemarahan",
    definition:
      "Respons emosional terhadap ketidakadilan, frustrasi, atau pelanggaran batas personal.",
    triggers: [
      "Merasa diperlakukan tidak adil",
      "Batas personal dilanggar",
      "Frustrasi akumulatif yang tidak terselesaikan",
    ],
    managementTips: [
      "Identifikasi kebutuhan di balik kemarahanmu",
      "Praktikkan progressive muscle relaxation",
      "Komunikasikan perasaan dengan assertif, bukan agresif",
      "Beri jeda sebelum bereaksi (count to 10)",
    ],
    color: "from-red-500 to-rose-600",
    icon: "😠",
  },
  {
    name: "Stres",
    definition:
      "Respons fisik dan mental terhadap tuntutan atau tekanan yang melebihi kapasitas koping.",
    triggers: [
      "Beban tugas atau tanggung jawab berlebihan",
      "Deadline yang ketat",
      "Konflik interpersonal",
    ],
    managementTips: [
      "Prioritaskan tugas dengan Eisenhower Matrix",
      "Break down tugas besar menjadi langkah kecil",
      "Jadwalkan break time secara konsisten",
      "Lakukan aktivitas fisik ringan setiap hari",
    ],
    color: "from-orange-500 to-amber-600",
    icon: "😣",
  },
];

const ARTICLES = [
  {
    id: 1,
    title: "Mengatasi Burnout Akademik",
    summary:
      "Strategi praktis untuk mengenali dan mengatasi kelelahan mental akibat tuntutan akademik.",
    category: "Akademik",
    readTime: "5 menit",
  },
  {
    id: 2,
    title: "Mindfulness untuk Pemula",
    summary:
      "Panduan sederhana memulai praktik mindfulness dalam kehidupan sehari-hari.",
    category: "Teknik",
    readTime: "7 menit",
  },
  {
    id: 3,
    title: "Membangun Resiliensi Mental",
    summary:
      "Cara mengembangkan ketahanan mental untuk menghadapi tantangan hidup.",
    category: "Pengembangan Diri",
    readTime: "6 menit",
  },
  {
    id: 4,
    title: "Mengelola Kecemasan Sosial",
    summary: "Tips praktis mengatasi rasa gugup dalam situasi sosial.",
    category: "Sosial",
    readTime: "5 menit",
  },
  {
    id: 5,
    title: "Pola Tidur Sehat untuk Pelajar",
    summary: "Pentingnya tidur berkualitas dan cara memperbaiki sleep hygiene.",
    category: "Kesehatan",
    readTime: "4 menit",
  },
  {
    id: 6,
    title: "Teknik Grounding 5-4-3-2-1",
    summary: "Latihan sederhana untuk mengatasi panic attack dan overwhelm.",
    category: "Teknik",
    readTime: "3 menit",
  },
];

const CRISIS_RESOURCES = [
  { title: "Hotline Bunuh Diri (Kemenkes)", number: "119", type: "danger" },
  { title: "Ambulans", number: "118 / 119", type: "emergency" },
  { title: "Polisi", number: "110", type: "emergency" },
  { title: "Komnas Perempuan", number: "021-3903963", type: "support" },
];

const AUDIO_GUIDES: AudioGuide[] = [
  {
    title: "Pernapasan 4-7-8",
    duration: "3 menit",
    color: "from-teal-500 to-cyan-600",
    icon: "🌬️",
    audioFile: "/audio/4-7-8.mp3",
  },
  {
    title: "Body Scan Relaxation",
    duration: "8 menit",
    color: "from-blue-500 to-indigo-600",
    icon: "🧘",
    audioFile: "/audio/body-scan.mp3",
  },
  {
    title: "Grounding 5-4-3-2-1",
    duration: "2 menit",
    color: "from-green-500 to-emerald-600",
    icon: "🌿",
    audioFile: "/audio/Grounding.mp3",
  },
  {
    title: "White Noise untuk Fokus",
    duration: "5 menit",
    color: "from-gray-500 to-slate-600",
    icon: "🎵",
    audioFile: "/audio/white-noise.mp3",
  },
];

// ==================== FUNGSI AI ANALISIS ====================

// Fungsi Analisis AI untuk Gratitude Garden
const analyzeGratitudeWithAI = async (gratitude: string) => {
  try {
    const prompt = `Analisis kalimat rasa syukur ini: "${gratitude}". Berikan respons singkat, positif, dan penuh makna (maksimal 3 kalimat) tentang pentingnya rasa syukur ini untuk kesehatan mental, seolah-olah Anda adalah seorang pendamping mental. Awali dengan emoji 🌟.`;
    const response = await ai.models.generateContent({
      model: model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    return response.text;
  } catch (error) {
    console.error("AI Gratitude Analysis Error:", error);
    return "Gagal mendapatkan wawasan AI. Coba lagi nanti!";
  }
};

// Fungsi Analisis AI untuk Worry Vault
const analyzeWorryWithAI = async (
  worry: string,
  type: string,
  action: string
) => {
  try {
    let prompt: string;
    if (type === "Dapat Dikontrol") {
      prompt = `Kekhawatiran yang terkunci: "${worry}" dan rencana aksi: "${action}". Sebagai pendamping mental, berikan 1-2 kalimat penyemangat yang realistis tentang kekuatan diri untuk fokus pada aksi tersebut. Awali dengan emoji 💪.`;
    } else {
      // Tidak Dapat Dikontrol
      prompt = `Kekhawatiran yang terkunci: "${worry}" adalah di luar kendali. Sebagai pendamping mental, berikan 1-2 kalimat yang menekankan penerimaan dan pentingnya melepaskan pikiran berlebihan, fokus pada masa kini. Awali dengan emoji 🌬️.`;
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    return response.text;
  } catch (error) {
    console.error("AI Worry Analysis Error:", error);
    return "Gagal mendapatkan wawasan AI. Fokus pada rencana aksimu!";
  }
};

// Fungsi Analisis AI untuk CBT Worksheet
const analyzeCBTWorksheetWithAI = async (data: {
  situation: string;
  thought: string;
  evidence: string;
  alternative: string;
}) => {
  try {
    const prompt = `Lakukan analisis singkat (maksimal 4 kalimat) terhadap CBT Worksheet ini. Fokus pada perbandingan antara 'Pikiran Otomatis' dan 'Perspektif Alternatif'. Berikan validasi atas usaha mencari alternatif dan penekanan pada realistisnya perspektif baru. Gunakan bahasa yang suportif dan profesional. Awali dengan emoji 🧠.

Situasi: ${data.situation}
Pikiran Otomatis: ${data.thought}
Bukti: ${data.evidence}
Perspektif Alternatif: ${data.alternative}
`;

    const response = await ai.models.generateContent({
      model: model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    return response.text;
  } catch (error) {
    console.error("AI CBT Analysis Error:", error);
    return "Gagal melakukan analisis AI. Namun, usaha Anda untuk mengisi lembar kerja ini sudah merupakan langkah besar!";
  }
};



// ==================== KOMPONEN UTAMA ====================
const Insight = () => {
  const [moodData, setMoodData] = useState<MoodData>({});
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [activeTab, setActiveTab] = useState<
    "personal" | "interactive" | "education"
  >("personal");

  // Gratitude Garden State
  const [gardenSeeds, setGardenSeeds] = useState<number>(0);
  const [gardenFlowers, setGardenFlowers] = useState<string[]>([]);
  const [gratitudeText, setGratitudeText] = useState("");
  const [canPlantToday, setCanPlantToday] = useState(true);
  const [lastPlantDate, setLastPlantDate] = useState("");
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains('dark')
  );
  const [aiGratitudeAnalysis, setAiGratitudeAnalysis] = useState<string | null>(
    null
  );
  const [isGratitudeLoading, setIsGratitudeLoading] = useState(false); // State Loading

  const flowerEmojis = ["🌸", "🌺", "🌻", "🌷", "🌹", "🌼", "💮", "🏵️"];

  // Worry Vault State
  const [worryText, setWorryText] = useState("");
  const [worryType, setWorryType] = useState<
    "controllable" | "uncontrollable" | null
  >(null);
  const [actionPlan, setActionPlan] = useState("");
  const [lockedWorries, setLockedWorries] = useState<LockedWorry[]>([]);
  const [showWorryVault, setShowWorryVault] = useState(false);
  const [isWorryLoading, setIsWorryLoading] = useState(false); // State Loading

  // CBT Worksheet State
  const [worksheetStep, setWorksheetStep] = useState(0);
  const [worksheetData, setWorksheetData] = useState({
    situation: "",
    thought: "",
    evidence: "",
    alternative: "",
    aiAnalysis: "",
  });
  const [isCBTLoading, setIsCBTLoading] = useState(false); // State Loading

  // Audio Player State (BARU)
  const [currentAudio, setCurrentAudio] = useState<AudioGuide | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // State untuk perbaikan race condition localStorage
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  

  // ==================== EFFECT HOOKS ====================

  useEffect(() => {
    // Cek apakah URL memiliki #artikel
    if (window.location.hash === "#artikel") {
        // 1. Ganti tab ke "education" (sesuaikan nama state tab Anda)
        setActiveTab("education"); 
        
        // 2. Lakukan scroll setelah state berubah dan komponen dirender
        // Kita menggunakan setTimeout singkat untuk memastikan tab sudah terbuka
        setTimeout(() => {
            const artikelElement = document.getElementById("artikel");
            if (artikelElement) {
                artikelElement.scrollIntoView({ behavior: "smooth" });
            }
        }, 100); // Penundaan singkat untuk render
    }
}, []); // [] agar hanya berjalan saat komponen dimuat

  // Load Data dari Local Storage
  useEffect(() => {
    const savedMood = localStorage.getItem("moodData");
    const savedJournal = localStorage.getItem("journalEntries");
    const savedSeeds = localStorage.getItem("gardenSeeds");
    const savedFlowers = localStorage.getItem("gardenFlowers");
    const savedLastPlantDate = localStorage.getItem("lastPlantDate");
    const savedWorries = localStorage.getItem("lockedWorries");

    if (savedMood) setMoodData(JSON.parse(savedMood));
    if (savedJournal) setJournalEntries(JSON.parse(savedJournal));
    if (savedSeeds) setGardenSeeds(parseInt(savedSeeds));
    if (savedFlowers) {
      try {
        const parsedFlowers = JSON.parse(savedFlowers);
        if (Array.isArray(parsedFlowers)) {
          setGardenFlowers(parsedFlowers);
        } else {
          setGardenFlowers([]);
        }
      } catch (e) {
        setGardenFlowers([]);
      }
    }
    if (savedWorries) {
      try {
        const parsedWorries = JSON.parse(savedWorries);
        if (Array.isArray(parsedWorries)) {
          setLockedWorries(parsedWorries);
        } else {
          setLockedWorries([]);
        }
      } catch (e) {
        setLockedWorries([]);
      }
    }

    const today = new Date().toISOString().split("T")[0];
    if (savedLastPlantDate && savedLastPlantDate === today) {
      setCanPlantToday(false);
    } else {
      setCanPlantToday(true);
    }
    setLastPlantDate(savedLastPlantDate || "");

    // Tandai bahwa data telah selesai dimuat

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          setIsDark(document.documentElement.classList.contains("dark"));
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
    });

    // Cleanup observer
    return () => observer.disconnect();
    
    setIsDataLoaded(true);
  }, []);

  // Save Garden and Worry Vault Data ke Local Storage
  useEffect(() => {
    // Hanya simpan JIKA data sudah selesai dimuat
    if (isDataLoaded) {
      localStorage.setItem("gardenSeeds", gardenSeeds.toString());
      localStorage.setItem("gardenFlowers", JSON.stringify(gardenFlowers));
      localStorage.setItem("lastPlantDate", lastPlantDate);
      localStorage.setItem("lockedWorries", JSON.stringify(lockedWorries));
    }
  }, [gardenSeeds, gardenFlowers, lastPlantDate, lockedWorries, isDataLoaded]);

  // Audio Cleanup Effect (BARU)
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      // Event listener untuk saat audio selesai diputar
      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentAudio(null);
      };

      audio.addEventListener("ended", handleEnded);

      // Clean up event listener
      return () => {
        audio.removeEventListener("ended", handleEnded);
        // Pastikan audio berhenti saat komponen di-unmount
        audio.pause();
      };
    }
  }, [audioRef.current]);

  // ==================== MEMORIZED VALUES (ANALISIS) ====================

  const moodAnalysis = useMemo(() => {
    const entries = Object.entries(moodData);
    if (entries.length === 0) return null;

    const now = new Date();
    const last7Days = entries.filter(([dateKey]) => {
      const date = new Date(dateKey);
      const diffTime = now.getTime() - date.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      return diffDays <= 7;
    });

    const moodValues: { [key: string]: number } = {
      "very-happy": 5,
      happy: 4,
      neutral: 3,
      sad: 2,
      "very-sad": 1,
    };

    const avgMood =
      last7Days.length > 0
        ? last7Days.reduce(
            (sum, [, mood]) => sum + (moodValues[mood] || 3),
            0
          ) / last7Days.length
        : 3;

    const moodCounts = last7Days.reduce((acc, [, mood]) => {
      acc[mood] = (acc[mood] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    return {
      avgMood: avgMood.toFixed(1),
      totalDays: last7Days.length,
      moodCounts,
      trend:
        avgMood >= 3.5 ? "positive" : avgMood <= 2.5 ? "negative" : "stable",
    };
  }, [moodData]);

  const stopWords = [
    "aku", "saya", "kamu", "dia", "mereka", "kita", "kami",
    "yang", "dan", "atau", "tapi", "namun", "juga", "serta", "seperti",
    "di", "ke", "dari", "untuk", "oleh", "pada", "tentang", "dengan", "tanpa",
    "ini", "itu", "adalah", "ialah", "merupakan", "tidak", "bukan", "sudah",
    "belum", "akan", "sedang", "saat", "waktu", "kalau", "ketika", "lagi",
    "ada", "telah", "tapi", "jadi", "bisa", "harus", "cuma", "hanya",
    "mau", "ingin", "pun", "nya", "sangat", "lebih", "paling", "kurang",
    "sekali", "begitu", "hanya", "dan", "juga", "deh", "loh", "nih", "ya",
];

  const topTriggers = useMemo(() => {
    // journalEntries harus didefinisikan di MoodTracker.tsx
    // Asumsi struktur journalEntries: Array<{ date: string, content: string }>

    // 1. Filter entri yang mood-nya rendah
    const lowMoodEntries = journalEntries.filter((entry: any) => { // Ganti 'any' dengan tipe JournalEntry yang benar
        const dateKey = entry.date.split("T")[0];
        const mood = moodData[dateKey];
        return mood === "sad" || mood === "very-sad";
    });

    const phraseFrequency: { [key: string]: number } = {};

    lowMoodEntries.forEach((entry: any) => { // Ganti 'any' dengan tipe JournalEntry yang benar
        // Membersihkan konten: huruf kecil, hapus karakter non-alfanumerik/spasi, lalu split
        const content = entry.content.toLowerCase();
        const cleanedContent = content.replace(/[^\w\s]/g, "");
        const words = cleanedContent.split(/\s+/).filter(w => w.length > 2); // Filter kata-kata pendek

        // Helper untuk memeriksa apakah frasa mengandung stopword
        const hasStopWord = (phraseWords: string[]) => {
            return phraseWords.some(word => stopWords.includes(word));
        };

        // --- Analisis N-gram (Bigram & Trigram) ---
        
        // Bigram (Frasa 2 kata)
        for (let i = 0; i < words.length - 1; i++) {
            const bigramWords = [words[i], words[i + 1]];
            if (!hasStopWord(bigramWords)) {
                const bigram = bigramWords.join(" ");
                phraseFrequency[bigram] = (phraseFrequency[bigram] || 0) + 1;
            }
        }

        // Trigram (Frasa 3 kata)
        for (let i = 0; i < words.length - 2; i++) {
            const trigramWords = [words[i], words[i + 1], words[i + 2]];
            if (!hasStopWord(trigramWords)) {
                const trigram = trigramWords.join(" ");
                phraseFrequency[trigram] = (phraseFrequency[trigram] || 0) + 1;
            }
        }
    });

    // Urutkan dan ambil 3 frasa teratas
    return Object.entries(phraseFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([word, count]) => ({ word, count }));
}, [journalEntries, moodData]);

  const todayEmotion = useMemo(() => {
    const dayOfYear = Math.floor(
      (new Date().getTime() -
        new Date(new Date().getFullYear(), 0, 0).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return EMOTION_GUIDES[dayOfYear % EMOTION_GUIDES.length];
  }, []);

  // ==================== FUNGSI INTERAKTIF ====================

  // Fungsi Audio Player (BARU)
  const playAudio = (audio: AudioGuide) => {
    if (audioRef.current) {
      // Jika audio yang sama diklik, toggle pause/play
      if (currentAudio?.audioFile === audio.audioFile) {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          audioRef.current.play();
          setIsPlaying(true);
        }
      } else {
        // Jika audio berbeda, stop yang lama dan mainkan yang baru
        if (audioRef.current) {
          audioRef.current.pause();
        }

        setCurrentAudio(audio);
        setIsPlaying(true);

        // Tunggu DOM update untuk audioRef.current.src
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.src = audio.audioFile; // Set source baru
            audioRef.current.load(); // Load audio baru
            audioRef.current.play().catch((error) => {
              console.error("Audio playback failed:", error);
              Swal.fire('Error', 'Gagal memutar audio. Silakan coba lagi.', 'error');
              setIsPlaying(false);
            });
          }
        }, 50); // Jeda singkat untuk DOM update
      }
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentAudio(null);
    }
  };

  const plantGratitudeSeed = async () => {
    if (!gratitudeText.trim()) {
      Swal.fire('Peringatan', 'Tuliskan sesuatu yang kamu syukuri terlebih dahulu! 🌱', 'warning');
      return;
    }

    if (!canPlantToday) {
      Swal.fire('Peringatan', 'Anda sudah menanam benih hari ini. Datang lagi besok! 😊', 'warning');
      return;
    }

    setIsGratitudeLoading(true); // Mulai loading
    setAiGratitudeAnalysis(null);

    let aiResult = "Gagal memuat analisis AI.";
    try {
      // AI Analysis
      aiResult = await analyzeGratitudeWithAI(gratitudeText);
      setAiGratitudeAnalysis(aiResult);

      const newFlower =
        flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)];
      setGardenFlowers((prev) => [...prev, newFlower]);
      setGardenSeeds((prev) => prev + 1);

      const today = new Date().toISOString().split("T")[0];
      setLastPlantDate(today);
      setCanPlantToday(false);

      // Save to Journal
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        content: `[Gratitude Garden] Syukur: ${gratitudeText}\nAI Insight: ${aiResult}`,
      };
      const currentEntries = JSON.parse(
        localStorage.getItem("journalEntries") || "[]"
      );
      localStorage.setItem(
        "journalEntries",
        JSON.stringify([newEntry, ...currentEntries])
      );

      setGratitudeText("");
      Swal.fire('Sukses', '🌸 Benih rasa syukur berhasil ditanam! Cek insight AI di bawah.', 'success');
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Terjadi kesalahan saat menganalisis. Silakan coba lagi.', 'error');
    } finally {
      setIsGratitudeLoading(false); // Selesai loading
    }
  };

  const lockWorry = async () => {
    if (!worryText.trim() || !worryType) {
      Swal.fire('Peringatan', 'Lengkapi kekhawatiranmu dan pilih kategorinya! 🔒', 'warning');
      return;
    }

    const typeLabel =
      worryType === "controllable"
        ? "Dapat Dikontrol"
        : "Tidak Dapat Dikontrol";

    if (worryType === "controllable" && !actionPlan.trim()) {
      Swal.fire('Peringatan', 'Tuliskan rencana aksi untuk kekhawatiran yang dapat dikontrol! 📝', 'warning');
      return;
    }

    setIsWorryLoading(true); // Mulai loading

    let aiResult = "Gagal memuat analisis AI.";
    try {
      // AI Analysis
      aiResult = await analyzeWorryWithAI(worryText, typeLabel, actionPlan);

      const newWorry: LockedWorry = {
        text: worryText,
        type: typeLabel,
        date: new Date().toLocaleDateString("id-ID"),
        aiAnalysis: aiResult,
      };

      setLockedWorries((prev) => [...prev, newWorry]);

      Swal.fire('Sukses', '🔒 Kekhawatiran berhasil dikunci! Cek insight AI di bawah.', 'success');

      // Save to Journal
      const journalContent = `[Worry Vault - ${typeLabel}]\nKekhawatiran: ${worryText}${
        actionPlan ? `\nRencana Aksi: ${actionPlan}` : ""
      }\nAI Insight: ${aiResult}`;
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        content: journalContent,
      };
      const currentEntries = JSON.parse(
        localStorage.getItem("journalEntries") || "[]"
      );
      localStorage.setItem(
        "journalEntries",
        JSON.stringify([newEntry, ...currentEntries])
      );

      setWorryText("");
      setWorryType(null);
      setActionPlan("");
      setShowWorryVault(false);
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Terjadi kesalahan saat menganalisis. Silakan coba lagi.', 'error');
    } finally {
      setIsWorryLoading(false); // Selesai loading
    }
  };

  const worksheetSteps = [
    {
      title: "Situasi",
      question: "Apa situasi yang membuatmu merasa tertekan?",
      field: "situation",
    },
    {
      title: "Pikiran",
      question: "Apa pikiran otomatis yang muncul?",
      field: "thought",
    },
    {
      title: "Bukti",
      question: "Apa bukti yang mendukung pikiran ini?",
      field: "evidence",
    },
    {
      title: "Alternatif",
      question: "Apa cara pandang alternatif yang lebih seimbang?",
      field: "alternative",
    },
  ];

  const advanceWorksheetStep = async () => {
    if (worksheetStep < worksheetSteps.length - 1) {
      setWorksheetStep((prev) => prev + 1);
    } else {
      // Last step, perform AI analysis
      setIsCBTLoading(true); // Mulai loading
      let aiResult = "Gagal memuat analisis AI.";
      try {
        aiResult = await analyzeCBTWorksheetWithAI(worksheetData);
      } catch (error) {
        console.error(error);
      } finally {
        setWorksheetData((prev) => ({ ...prev, aiAnalysis: aiResult }));
        setWorksheetStep((prev) => prev + 1); // Move to summary step
        setIsCBTLoading(false); // Selesai loading
      }
    }
  };

  const saveWorksheet = () => {
    const worksheetText = `[CBT Worksheet]\nSituasi: ${worksheetData.situation}\nPikiran: ${worksheetData.thought}\nBukti: ${worksheetData.evidence}\nPerspektif Alternatif: ${worksheetData.alternative}\nAI Analisis: ${worksheetData.aiAnalysis}`;

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      content: worksheetText,
    };

    const currentEntries = JSON.parse(
      localStorage.getItem("journalEntries") || "[]"
    );
    localStorage.setItem(
      "journalEntries",
      JSON.stringify([newEntry, ...currentEntries])
    );

    Swal.fire('Sukses', '✅ Worksheet berhasil disimpan ke Journal!', 'success');
    setWorksheetStep(0);
    setWorksheetData({
      situation: "",
      thought: "",
      evidence: "",
      alternative: "",
      aiAnalysis: "",
    });
  };

  // Komponen Audio Player Mini (BARU)
  const MiniAudioPlayer = () => {
    if (!currentAudio) return null;

    const Icon = isPlaying ? PauseCircle : PlayCircle;
    const action = isPlaying ? "Jeda" : "Lanjut";

    return (
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-2xl p-4 md:p-6 border-t-4 border-teal-500"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-3xl">{currentAudio.icon}</span>
            <div>
              <p className="font-bold text-gray-900 dark:text-white text-sm sm:text-lg">
                Sedang Memutar:
              </p>
              <p className="text-teal-600 dark:text-teal-400 font-semibold text-base sm:text-xl">
                {currentAudio.title}
              </p>
            </div>
          </div>
          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => playAudio(currentAudio)}
              className="flex items-center space-x-2 bg-teal-500 text-white p-3 rounded-full font-semibold text-sm sm:text-base shadow-lg hover:bg-teal-600 transition-colors"
            >
              <Icon className="w-5 h-5" />
              <span>{action}</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={stopAudio}
              className="flex items-center space-x-2 bg-red-500 text-white p-3 rounded-full font-semibold text-sm sm:text-base shadow-lg hover:bg-red-600 transition-colors"
            >
              <StopCircle className="w-5 h-5" />
              <span>Stop</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden transition-colors duration-500 
      bg-gradient-to-br from-indigo-50/70 via-white to-teal-50/70 
      dark:from-gray-900 dark:via-gray-950 dark:to-indigo-950">
      {/* Audio Element (Hidden) */}
      <audio ref={audioRef} preload="auto" />

      {/* Decorative blobs, dibuat lebih kecil di mobile */}
      <div className="absolute top-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-indigo-300 dark:bg-indigo-900 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-40 dark:opacity-20 animate-blob" />
      <div className="absolute bottom-1/4 right-0 w-64 h-64 md:w-1/3 md:h-1/3 bg-rose-300 dark:bg-rose-900 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-40 dark:opacity-20 animate-blob animation-delay-4000" />
      <div className="absolute top-1/2 left-1/4 w-48 h-48 md:w-72 md:h-72 bg-emerald-300 dark:bg-emerald-900 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-30 dark:opacity-20 animate-blob animation-delay-2000" />

      {/* Padding utama diubah untuk mobile */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <div className="flex items-center justify-center space-x-3 mb-2">
            <div
              className="w-14 h-14 bg-gradient-to-br from-[#1ff498]/20 to-[#50b7f7]/20 
              rounded-2xl flex items-center justify-center shadow-lg border-2 border-white/50"
            >
              <Brain className="w-7 h-7 text-teal-600 dark:text-teal-400" /> 
            </div>
            <h1 className="leading-normal text-4xl md:text-5xl md:leading-relaxed font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
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
              >
                Insight
              </GradientText>
            </h1>
         </div>

          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
            Wawasan mendalam untuk kesehatan mentalmu
          </p>
        </motion.div>

        {/* Tombol tab diubah dari space-x ke gap agar wrapping lebih baik */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex justify-center mb-8 flex-wrap gap-3"
        >
          {[
            { id: "personal", label: "Analisis Personal", icon: Activity },
            { id: "interactive", label: "Latihan Interaktif", icon: Target },
            { id: "education", label: "Edukasi & Dukungan", icon: BookOpen },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center space-x-2 px-5 py-3 sm:px-6 rounded-2xl font-semibold transition-all transform ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-[#1ff498] to-[#50b7f7] text-white shadow-lg"
                    : "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:bg-gray-900 dark:hover:bg-gray-700 border-2 border-[#72e4f8] dark:border-teal-500"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="whitespace-nowrap text-sm sm:text-base">
                  {tab.label}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        <AnimatePresence mode="wait">
          {/* ==================== TAB PERSONAL ==================== */}
          {activeTab === "personal" && (
            <motion.div
              key="personal"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 md:space-y-8"
            >
              {/* Padding kartu diubah */}
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border-2 border-[#72e4f8] dark:border-gray-600 hover:border-[#1ff498] dark:hover:border-teal-500 transition-all"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-[#1ff498]" />
                  {/* Ukuran Teks header kartu diresponsifkan */}
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    Pola Mood 7 Hari Terakhir
                  </h2>
                </div>
                {moodAnalysis ? (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
                      {/* Kartu internal dianimasikan */}
                      <motion.div
                        whileHover={{ translateY: -5 }}
                        className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl p-5 sm:p-6 border-2 border-indigo-200 dark:border-indigo-700"
                      >
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">
                          Rata-rata Mood
                        </p>
                        {/* Ukuran Teks metriks diresponsifkan */}
                        <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                          {moodAnalysis.avgMood}/5
                        </p>
                      </motion.div>
                      <motion.div
                        whileHover={{ translateY: -5 }}
                        className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-2xl p-5 sm:p-6 border-2 border-emerald-200 dark:border-emerald-700"
                      >
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">
                          Hari Dicatat
                        </p>
                        <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                          {moodAnalysis.totalDays}
                        </p>
                      </motion.div>
                      <motion.div
                        whileHover={{ translateY: -5 }}
                        className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/30 dark:to-pink-900/30 rounded-2xl p-5 sm:p-6 border-2 border-rose-200 dark:border-rose-700"
                      >
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">
                          Tren Mood Kamu
                        </p>
                        <p
                          className={`text-2xl sm:text-3xl font-bold ${
                            moodAnalysis.trend === "positive"
                              ? "text-green-600"
                              : moodAnalysis.trend === "negative"
                              ? "text-red-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {moodAnalysis.trend === "positive"
                            ? "📈 Membaik"
                            : moodAnalysis.trend === "negative"
                            ? "📉 Menurun"
                            : "➡️ Stabil"}
                        </p>
                      </motion.div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900/50 dark:bg-gray-900/50 rounded-2xl p-5 sm:p-6 border-2 border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                        Distribusi Mood:
                      </p>
                      <div className="space-y-3">
                        {Object.entries(moodAnalysis.moodCounts).map(
                          ([mood, count]) => (
                            <motion.div
                              key={mood}
                              initial={{ x: -50, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{
                                duration: 0.3,
                                delay: 0.3 + count * 0.05,
                              }}
                              className="flex items-center space-x-3 sm:space-x-4"
                            >
                              <span className="text-2xl sm:text-3xl">
                                {mood === "very-happy"
                                  ? "😄"
                                  : mood === "happy"
                                  ? "😊"
                                  : mood === "neutral"
                                  ? "😐"
                                  : mood === "sad"
                                  ? "😔"
                                  : "😢"}
                              </span>
                              <div className="flex-grow h-4 bg-gray-200 dark:bg-gray-700 dark:bg-gray-700 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{
                                    width: `${
                                      (count / moodAnalysis.totalDays) * 100
                                    }%`,
                                  }}
                                  transition={{
                                    duration: 0.8,
                                    ease: "easeOut",
                                  }}
                                  className="h-full bg-gradient-to-r from-[#1ff498] to-[#50b7f7] transition-all duration-500"
                                />
                              </div>
                              <span className="text-sm font-bold text-gray-700 dark:text-gray-300 min-w-[40px]">
                                {count}x
                              </span>
                            </motion.div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900/50 dark:to-indigo-900/30 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                    <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">
                      Belum ada data mood. Mulai tracking di halaman Mood
                      Tracker! 📊
                    </p>
                  </div>
                )}
              </motion.div>

                            <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className={`bg-gradient-to-br ${todayEmotion.color} rounded-3xl p-6 md:p-8 shadow-xl text-white border-2 border-white/30`}
              >
                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-4xl sm:text-5xl">
                    {todayEmotion.icon}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold">
                    Emosi Fokus: {todayEmotion.name}
                  </h2>
                </div>
                <p className="text-lg sm:text-xl mb-6 opacity-95 leading-relaxed">
                  {todayEmotion.definition}
                </p>

                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 sm:p-6 mb-6 border-2 border-white/30">
                  <h3 className="font-bold text-base sm:text-lg mb-3">
                    Pemicu Umum:
                  </h3>
                  <ul className="space-y-2">
                    {todayEmotion.triggers.map((trigger, i) => (
                      <li key={i} className="flex items-start space-x-3">
                        <span className="text-lg sm:text-xl">•</span>
                        <span className="text-sm sm:text-base">{trigger}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border-2 border-white/30">
                  <h3 className="font-bold text-base sm:text-lg mb-3">
                    Tips Mengelola:
                  </h3>
                  <ul className="space-y-3">
                    {todayEmotion.managementTips.map((tip, i) => (
                      <li key={i} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5" />
                        <span className="text-sm sm:text-base">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border-2 border-[#72e4f8] dark:border-gray-600 hover:border-[#1ff498] dark:hover:border-teal-500 transition-all"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <AlertCircle className="w-6 h-6 sm:w-7 sm:h-7 text-rose-500" />
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    Pemicu Emosi Utama
                  </h2>
                </div>
                {topTriggers.length > 0 ? (
                  <div className="space-y-4">
                    {topTriggers.map((trigger, index) => (
                      <motion.div
                        key={trigger.word}
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                        whileHover={{ scale: 1.01 }}
                        className="flex items-center space-x-4 sm:space-x-5 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/30 dark:to-pink-900/30 rounded-2xl p-4 sm:p-5 border-2 border-rose-200 dark:border-rose-700 hover:border-rose-300 dark:hover:border-rose-600 transition-all"
                      >
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-lg flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-grow">
                          <p className="font-bold text-gray-900 dark:text-white capitalize text-base sm:text-lg">
                            {trigger.word}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Muncul {trigger.count}x dalam jurnal mood rendah
                          </p>
                        </div>
                      </motion.div>
                    ))}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl p-4 sm:p-5 border-2 border-blue-200 dark:border-blue-700 mt-6">
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        💡{" "}
                        <strong className="text-blue-700 dark:text-blue-400">
                          Insight:
                        </strong>{" "}
                        Kata-kata ini sering muncul saat mood-mu rendah. Coba
                        refleksikan pola ini.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-rose-50 dark:from-gray-900/50 dark:to-rose-900/30 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                    <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">
                      Belum cukup data jurnal untuk analisis. Tulis lebih banyak
                      di Journal Mood! ✍️
                    </p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}

          {/* ==================== TAB INTERAKTIF ==================== */}
          {activeTab === "interactive" && (
            <motion.div
              key="interactive"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 md:space-y-8"
            >
              {/* The Gratitude Garden */}
<motion.div
    initial={{ scale: 0.95 }}
    animate={{ scale: 1 }}
    transition={{ duration: 0.5, delay: 0.1 }}
    // Shadow dipertebal, border dipertebal, background sedikit lebih transparan
    className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-emerald-300 dark:border-emerald-700 hover:border-[#1ff498] dark:hover:border-teal-500 transition-all"
>
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2 border-b pb-4 border-emerald-100 dark:border-gray-700">
        <div className="flex items-center space-x-3">
            <Flower className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                The Gratitude Garden
            </h2>
        </div>
        <div className="text-xl sm:text-3xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
            {gardenSeeds} Benih Ditanam 🌳
        </div>
    </div>

    <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed text-sm sm:text-base">
        Tumbuhkan taman syukurmu! Setiap kali kamu menuliskan hal yang
        kamu syukuri, sebuah bunga indah akan mekar di tamanmu.
        Maksimal satu benih per hari.
    </p>

    {/* === VISUAL TAMAN YANG LEBIH ESTETIK & DINAMIS === */}
    <div
        // Latar belakang diubah untuk kesan langit/horizon
        className="bg-gradient-to-b from-sky-50 to-emerald-100 dark:from-gray-900 dark:to-green-950 rounded-3xl p-4 sm:p-8 mb-6 min-h-[250px] sm:min-h-[300px] border-4 border-emerald-400 dark:border-emerald-700 relative overflow-hidden flex flex-col justify-end shadow-inner shadow-green-900/10"
    >

        {/* SUN / MOON (dengan Framer Motion dan deteksi dark mode) */}
        <AnimatePresence mode="wait">
            {/* Ganti 'isDarkMode' dengan variabel deteksi tema Anda yang sebenarnya */}
            {isDark ? (
                <motion.div
                    key="moon"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5 }}
                    className='absolute top-4 right-4 text-4xl text-blue-300 animate-pulse'
                >
                    🌙
                </motion.div>
            ) : (
                <motion.div
                    key="sun"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5 }}
                    className='absolute top-4 right-4 text-4xl text-yellow-500 animate-pulse'
                >
                    ☀️
                </motion.div>
            )}
        </AnimatePresence>
        
        {/* Lapisan 1: Jaring-jaring rumput/tanah (z-index rendah) */}
        <div className="absolute inset-0 bg-repeat bg-center opacity-30 dark:opacity-20 z-0" 
             style={{ 
                 backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 20 20'%3E%3Cpath fill='%2365a30d' d='M0 0h10v10H0zm10 10h10v10H10z' opacity='0.05'/%3E%3C/svg%3E")`
             }}>
        </div>

        {/* --- Area Bunga (Z-index 30, selalu di depan rumput) --- */}
        <div className="flex-grow w-full grid grid-cols-6 md:grid-cols-10 gap-x-2 gap-y-1 items-end justify-center z-30">
            {gardenFlowers.length === 0 ? (
                <div className="col-span-10 text-center py-10 sm:py-12">
                    <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg mb-2 animate-bounce">
                        Tamanmu masih kosong 🌱
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm sm:text-base">
                        Mulai tanam benih syukur pertamamu!
                    </p>
                </div>
            ) : (
                gardenFlowers.map((flower, index) => (
                    <motion.div
                        key={index}
                        initial={{ scale: 0, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 150,
                            damping: 10,
                            delay: index * 0.05,
                        }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        // Z-index 30 agar bunga di atas rumput
                        className="text-4xl sm:text-5xl text-center cursor-pointer relative z-30"
                        style={{
                            alignSelf: "flex-end",
                            transform: `translateX(${Math.floor(Math.random() * 10 - 5)}px)`
                        }}
                    >
                        {flower}
                    </motion.div>
                ))
            )}
        </div>

        {/* --- Lapisan Rumput & Tanah (z-index 10) --- */}
        <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-green-700 to-green-600 dark:from-green-900 dark:to-green-800 rounded-b-3xl z-10">
            {/* Tekstur rumput dengan SVG */}
            <div className="absolute inset-0 bg-repeat opacity-20" 
                 style={{ 
                     backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 20 20'%3E%3Cpath fill='%2322c55e' d='M0 0h10v10H0zm10 10h10v10H10z' opacity='0.1'/%3E%3C/svg%3E")`
                 }}>
            </div>
        </div>

        {/* Garis Tanah Paling Bawah (z-index 20, menutupi rumput) */}
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-green-800 dark:bg-green-950 rounded-b-[22px] shadow-xl z-20"></div>

    </div>
    {/* === AKHIR VISUAL TAMAN === */}

    <div className="space-y-4">
        <textarea
            value={gratitudeText}
            onChange={(e) => {
                setGratitudeText(e.target.value);
                setAiGratitudeAnalysis(null);
            }}
            className="w-full h-24 px-5 py-4 bg-white dark:bg-gray-900 border-2 border-emerald-200 dark:border-emerald-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-400/50 dark:focus:ring-emerald-500/50 resize-none text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 text-sm sm:text-base shadow-inner"
            placeholder="Apa yang kamu syukuri hari ini?"
            disabled={isGratitudeLoading}
        />
        <motion.button
            onClick={plantGratitudeSeed}
            disabled={
                !canPlantToday ||
                !gratitudeText.trim() ||
                isGratitudeLoading
            }
            whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(16, 185, 129, 0.5)" }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
        >
            {isGratitudeLoading ? (
                <>
                    <Loader className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                    <span>Menganalisis...</span>
                </>
            ) : (
                <span>
                    {canPlantToday
                        ? " Tanam Benih Syukur"
                        : " Sudah Menanam Hari Ini"}
                </span>
            )}
        </motion.button>
    </div>

    <AnimatePresence>
        {aiGratitudeAnalysis && (
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl p-4 sm:p-5 border-2 border-blue-200 dark:border-blue-700 shadow-md"
            >
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                    <strong className="text-blue-700 dark:text-blue-400">
                        Wawasan AI:
                    </strong>{" "}
                    {aiGratitudeAnalysis}
                </p>
            </motion.div>
        )}
    </AnimatePresence>
</motion.div>

              {/* Worry Vault */}
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border-2 border-amber-300 dark:border-amber-700 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
                  <div className="flex items-center space-x-3">
                    <BookLock className="w-6 h-6 sm:w-7 sm:h-7 text-amber-600" />
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      Worry Vault 
                    </h2>
                  </div>
                  <div className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    {lockedWorries.length} Kekhawatiran Terkunci
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed text-sm sm:text-base">
                  Tulis kekhawatiranmu dan kunci di brankas mental. Pisahkan
                  mana yang bisa kamu kontrol dan mana yang harus kamu lepaskan.
                  
                </p>

                <AnimatePresence mode="wait">
                  {!showWorryVault ? (
                    <motion.button
                      key="open-vault"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => setShowWorryVault(true)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-2xl hover:shadow-lg transition-all text-base sm:text-lg"
                    >
                       Buka Worry Vault
                    </motion.button>
                  ) : (
                    <motion.div
                      key="vault-form"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-6"
                    >
                      <div className="space-y-4">
                        <textarea
                          value={worryText}
                          onChange={(e) => setWorryText(e.target.value)}
                          className="w-full h-24 px-5 py-4 bg-white dark:bg-gray-900 border-2 border-amber-200 dark:border-amber-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-500 resize-none text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 text-sm sm:text-base"
                          placeholder="Apa yang membuatmu khawatir? Tuliskan..."
                          disabled={isWorryLoading}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <motion.button
                            onClick={() => setWorryType("controllable")}
                            disabled={isWorryLoading}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className={`p-5 rounded-2xl border-2 transition-all  ${
                              worryType === "controllable"
                                ? " border-blue-400 shadow-lg scale-105"
                                : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-600 hover:border-blue-300"
                            } disabled:opacity-50 text-left sm:text-center`}
                          >
                            <Target className="w-6 h-6 text-blue-600 mb-2 sm:mx-auto" />
                            <p className="font-bold text-gray-900 mb-1 dark:text-white">
                              Bisa Dikontrol
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Aku bisa melakukan sesuatu tentang ini
                            </p>
                          </motion.button>

                          <motion.button
                            onClick={() => setWorryType("uncontrollable")}
                            disabled={isWorryLoading}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className={`p-5 rounded-2xl border-2 transition-all  ${
                              worryType === "uncontrollable"
                                ? " border-purple-400 shadow-lg scale-105"
                                : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-600 hover:border-purple-300"
                            } disabled:opacity-50 text-left sm:text-center`}
                          >
                            <Heart className="w-6 h-6 text-purple-600 mb-2 sm:mx-auto" />
                            <p className="font-bold text-gray-900 mb-1  dark:text-white">
                              Tidak Bisa Dikontrol
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Ini di luar kuasaku
                            </p>
                          </motion.button>
                        </div>

                        <AnimatePresence>
                          {worryType === "controllable" && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-amber-200 dark:border-amber-700 dark:bg-gray-800"
                            >
                              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                Rencana aksi 5 menit:
                              </label>
                              <input
                                type="text"
                                value={actionPlan}
                                onChange={(e) => setActionPlan(e.target.value)}
                                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border-2 border-amber-200 dark:border-amber-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                                placeholder="contoh: Bicara dengan guru, buat jadwal..."
                                disabled={isWorryLoading}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {worryType === "uncontrollable" && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white dark:bg-gray-900 dark:border-gray-600 rounded-2xl p-4 sm:p-5 border-2 border-purple-200"
                          >
                            <p className="text-sm text-gray-700 dark:text-gray-400">
                               <strong>Reminder:</strong> Karena ini di luar
                              kontrolmu, fokus pada menerima dan melepaskan.
                            </p>
                          </motion.div>
                        )}

                        {/* Tombol diubah jadi vertikal di mobile */}
                        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:space-x-3">
                          <motion.button
                            onClick={() => {
                              setShowWorryVault(false);
                              setWorryText("");
                              setWorryType(null);
                              setActionPlan("");
                            }}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="w-full sm:w-auto px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-gray-300 font-semibold"
                            disabled={isWorryLoading}
                          >
                            Batal
                          </motion.button>
                          <motion.button
                            onClick={lockWorry}
                            disabled={
                              !worryText.trim() ||
                              !worryType ||
                              (worryType === "controllable" &&
                                !actionPlan.trim()) ||
                              isWorryLoading
                            }
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full sm:flex-grow px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-2xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center space-x-2"
                          >
                            {isWorryLoading ? (
                              <>
                                <Loader className="w-5 h-5 animate-spin" />
                                <span>Mengunci...</span>
                              </>
                            ) : (
                              <span>🔒 Kunci Kekhawatiran</span>
                            )}
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {lockedWorries.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-4 dark:text-white">
                       Kekhawatiran Terkunci Terbaru:
                    </h3>
                    {lockedWorries
                      .slice(-3)
                      .reverse()
                      .map((worry, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 border-2 border-gray-200 dark:border-gray-700"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-2">
                            <p className="font-medium text-gray-900 flex-grow mr-4 text-sm sm:text-base dark:text-gray-400">
                              {worry.text}
                            </p>
                            <span
                              className={`text-xs px-3 py-1 rounded-full font-semibold flex-shrink-0 w-fit ${
                                worry.type === "Dapat Dikontrol"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-transparent text-purple-700 dark:text-purple-200"
                              }`}
                            >
                              {worry.type}
                            </span>
                          </div>
                          {worry.aiAnalysis && (
                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                              <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                <strong className="text-gray-900 dark:text-white">
                                  AI Insight:
                                </strong>{" "}
                                {worry.aiAnalysis}
                              </p>
                            </div>
                          )}
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
                            🗓️ {worry.date}
                          </p>
                        </motion.div>
                      ))}
                  </div>
                )}
              </motion.div>

              {/* Buku Latihan CBT */}
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border-2 border-purple-300 dark:border-purple-700 transition-all"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <Lightbulb className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600" />
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    Buku Latihan CBT
                  </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed text-sm sm:text-base">
                  Latihan singkat untuk menganalisis dan mengubah pola pikirmu
                  dengan metode Cognitive Behavioral Therapy (CBT).
                </p>

                <div className="mb-6 flex items-center space-x-2">
                  {worksheetSteps.map((_, index) => (
                    <motion.div
                      key={index}
                      initial={{ width: 0 }}
                      animate={{
                        width: index <= worksheetStep ? "100%" : "0%",
                      }}
                      transition={{ duration: 0.5 }}
                      className={`h-2 sm:h-3 flex-grow rounded-full transition-all ${
                        index <= worksheetStep
                          ? "bg-gradient-to-r from-purple-500 to-indigo-500"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {worksheetStep < worksheetSteps.length ? (
                    <motion.div
                      key={`step-${worksheetStep}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 sm:p-6 border-2 border-purple-200 dark:border-purple-700/50">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 ">
                          Langkah {worksheetStep + 1}:{" "}
                          {worksheetSteps[worksheetStep].title}
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                          {worksheetSteps[worksheetStep].question}
                        </p>
                      </div>
                      <textarea
                        value={
                          worksheetData[
                            worksheetSteps[worksheetStep]
                              .field as keyof typeof worksheetData
                          ]
                        }
                        onChange={(e) =>
                          setWorksheetData((prev) => ({
                            ...prev,
                            [worksheetSteps[worksheetStep].field]:
                              e.target.value,
                          }))
                        }
                        className="w-full h-32 px-5 py-4 bg-white dark:bg-gray-900 border-2 border-purple-200 dark:border-purple-700/50 rounded-2xl focus:outline-none  resize-none text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-400 text-sm sm:text-base"
                        placeholder="Tulis jawabanmu di sini..."
                        disabled={isCBTLoading}
                      />
                      {/* Tombol diubah jadi vertikal di mobile */}
                      <div className="flex flex-col-reverse sm:flex-row gap-3 sm:space-x-3">
                        {worksheetStep > 0 && (
                          <motion.button
                            onClick={() => setWorksheetStep((prev) => prev - 1)}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="w-full sm:w-auto px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-gray-300 font-semibold"
                            disabled={isCBTLoading}
                          >
                            ← Kembali
                          </motion.button>
                        )}
                        <motion.button
                          onClick={advanceWorksheetStep}
                          disabled={
                            !worksheetData[
                              worksheetSteps[worksheetStep]
                                .field as keyof typeof worksheetData
                            ].trim() || isCBTLoading
                          }
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full sm:flex-grow px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all flex items-center justify-center space-x-2"
                        >
                          {isCBTLoading &&
                          worksheetStep === worksheetSteps.length - 1 ? (
                            <>
                              <Loader className="w-5 h-5 animate-spin" />
                              <span>Menganalisis...</span>
                            </>
                          ) : (
                            <span>
                              {worksheetStep === worksheetSteps.length - 1
                                ? "Analisis & Selesai →"
                                : "Lanjut →"}
                            </span>
                          )}
                        </motion.button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="worksheet-summary"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className=" rounded-2xl p-5 sm:p-6 border-2 border-purple-200">
                        <h3 className="text-lg sm:text-xl font-bold text-purple-500 mb-4">
                           Rangkuman & Analisis CBT
                        </h3>
                        <div className="space-y-4 text-sm">
                          <div className="bg-white dark:bg-gray-900 rounded-xl p-4">
                            <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
                              Situasi:
                            </p>
                            <p className="text-gray-600">
                              {worksheetData.situation}
                            </p>
                          </div>
                          <div className="bg-white dark:bg-gray-900 rounded-xl p-4">
                            <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
                              Pikiran Otomatis:
                            </p>
                            <p className="text-gray-600">
                              {worksheetData.thought}
                            </p>
                          </div>
                          <div className="bg-white dark:bg-gray-900 rounded-xl p-4">
                            <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
                              Perspektif Alternatif:
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 font-medium">
                              {worksheetData.alternative}
                            </p>
                          </div>
                          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                            <p className="font-semibold text-yellow-800 mb-1">
                              Analisis AI (Gemini):
                            </p>
                            <p className="text-gray-700">
                              {worksheetData.aiAnalysis ||
                                "Sedang memuat analisis AI..."}
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* Tombol diubah jadi vertikal di mobile */}
                      <div className="flex flex-col-reverse sm:flex-row gap-3 sm:space-x-3">
                        <motion.button
                          onClick={() => {
                            setWorksheetStep(0);
                            setWorksheetData({
                              situation: "",
                              thought: "",
                              evidence: "",
                              alternative: "",
                              aiAnalysis: "",
                            });
                          }}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className="w-full sm:w-auto px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-gray-300 font-semibold"
                        >
                          Mulai Ulang
                        </motion.button>
                        <motion.button
                          onClick={saveWorksheet}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full sm:flex-grow px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl hover:shadow-lg font-semibold transition-all"
                        >
                          Simpan ke Journal
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Panduan Audio Fokus */}
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border-2 border-teal-300 dark:border-teal-700 hover:border-[#1ff498] dark:hover:border-teal-500 transition-all"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <PlayCircle className="w-6 h-6 sm:w-7 sm:h-7 text-teal-600" />
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    Panduan Audio Fokus 
                  </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed text-sm sm:text-base">
                  Latihan audio singkat untuk menenangkan pikiran dan tubuhmu.
                  Gunakan headphone untuk pengalaman terbaik.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {AUDIO_GUIDES.map((audio) => {
                    const isPlayingThis =
                      isPlaying && currentAudio?.audioFile === audio.audioFile;
                    const Icon = isPlayingThis ? PauseCircle : PlayCircle;
                    return (
                      <motion.button
                        key={audio.title}
                        onClick={() => playAudio(audio)}
                        whileHover={{
                          scale: 1.02,
                          boxShadow:
                            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                        }}
                        whileTap={{ scale: 0.98 }}
                        className={`bg-gradient-to-br ${
                          audio.color
                        } rounded-2xl p-5 sm:p-6 text-white text-left transition-all group border-2 ${
                          isPlayingThis
                            ? "border-4 border-white shadow-2xl"
                            : "border-white/20"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-3xl sm:text-4xl">
                            {audio.icon}
                          </span>
                          <Icon className="w-8 h-8 sm:w-10 sm:h-10 opacity-80 group-hover:scale-110 transition-transform" />
                        </div>
                        <h3 className="font-bold text-lg sm:text-xl mb-2">
                          {audio.title}
                        </h3>
                        <p className="text-sm opacity-90">{audio.duration}</p>
                        {isPlayingThis && (
                          <p className="text-xs font-semibold mt-2 bg-white/20 p-1 rounded-full w-fit">
                            Sedang Diputar
                          </p>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
                <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl p-4 border-2 border-teal-300 dark:border-teal-700 text-center">
                  <p className="text-sm text-gray-700 dark:text-white">
                    💡 <strong>Tips:</strong> Cari tempat tenang dan berikan
                    dirimu waktu tanpa gangguan.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* ==================== TAB EDUKASI ==================== */}
          {activeTab === "education" && (
            <motion.div
              key="education"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 md:space-y-8"
            >

              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white/80 dark:bg-gray-900 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border-2 border-emerald-300 hover:border-[#1ff498] transition-all"
              >
                <div className="flex items-center space-x-3 mb-8">
                  <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600" />
                  <h2 id="artikel" className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    Pusat Artikel & Wawasan
                  </h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {ARTICLES.map((article, index) => (
                    <motion.a
                      key={article.id}
                      href={`/insight/artikel/${article.id}`}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                      whileHover={{ translateY: -3 }}
                      className="block bg-white dark:bg-gray-900 rounded-2xl p-5 sm:p-6 hover:shadow-xl border-2 transition-all duration-300  group border-emerald-300/50"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-xs font-semibold px-3 py-1 sm:px-4 sm:py-2 bg-emerald-100 text-emerald-700 rounded-full">
                          {article.category}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                          {article.readTime}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-3 group-hover:text-emerald-700 transition-colors text-base sm:text-lg dark:text-white">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        {article.summary}
                      </p>
                      <div className="flex items-center text-emerald-600 font-semibold text-sm">
                        <span>Baca Selengkapnya</span>
                        <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </motion.a>
                  ))}
                </div>
              </motion.div>


              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                // DARK MODE: Ubah gradien latar belakang dan border kontainer utama
                className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900 dark:to-teal-900 rounded-3xl p-6 md:p-8 border-2 border-emerald-300 dark:border-emerald-700 shadow-xl"
              >
                {/* Judul */}
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600 mr-3" />
                  Tips Menjaga Kesehatan Mental
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    "Tidur 7-9 jam setiap malam",
                    "Olahraga ringan 20-30 menit/hari",
                    "Batasi konsumsi media sosial",
                    "Praktikkan gratitude journaling",
                    "Jaga koneksi sosial yang bermakna",
                    "Makan makanan bergizi seimbang",
                    "Luangkan waktu untuk hobi",
                    "Jangan ragu mencari bantuan profesional",
                  ].map((tip, index) => (
                    <motion.div
                      key={index}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                      whileHover={{ translateX: 5 }}
                      // DARK MODE: Ubah latar belakang kartu tips dan border
                      // Saya ganti dark:bg-gray-900 menjadi dark:bg-gray-800 agar ada kontras sedikit dengan latar belakang yang lebih gelap
                      className="flex items-start space-x-4 bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-5 border-2 border-emerald-200 hover:border-emerald-400 dark:border-emerald-700 dark:hover:border-emerald-500 transition-all"
                    >
                      <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                      {/* DARK MODE: Ubah warna teks */}
                      <span className="text-gray-700 dark:text-gray-200 font-medium text-sm sm:text-base">
                        {tip}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

             <motion.div
    initial={{ scale: 0.95 }}
    animate={{ scale: 1 }}
    transition={{ duration: 0.5, delay: 0.4 }}
    // DARK MODE: Ubah gradien latar belakang dan border kontainer utama
    className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900 dark:to-rose-900 border-2 border-red-300 dark:border-red-700 rounded-3xl p-6 md:p-8 shadow-xl"
>
    <div className="flex items-center space-x-3 mb-6">
        <Phone className="w-6 h-6 sm:w-7 sm:h-7 text-red-600" />
        {/* DARK MODE: Kelas dark:text-red-200 sudah ada di kode asli */}
        <h2 className="text-xl sm:text-2xl font-bold text-red-900 dark:text-red-200">
            Pusat Bantuan Krisis
        </h2>
    </div>
    {/* DARK MODE: Ubah warna teks paragraf */}
    <p className="text-gray-700 dark:text-gray-300 mb-8 text-base sm:text-lg leading-relaxed">
        Jika kamu atau seseorang yang kamu kenal dalam keadaan
        darurat, segera hubungi layanan berikut:
    </p>
    <div className="space-y-4">
        {CRISIS_RESOURCES.map((resource, index) => (
            <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 sm:p-6 rounded-2xl border-2 ${
                    // DARK MODE: Ubah latar belakang dan border dinamis untuk setiap jenis sumber daya
                    resource.type === "danger"
                        ? "bg-red-100 border-red-400 dark:bg-red-950 dark:border-red-700"
                        : resource.type === "emergency"
                        ? "bg-yellow-100 border-yellow-400 dark:bg-yellow-950 dark:border-yellow-700"
                        : "bg-blue-100 border-blue-400 dark:bg-blue-950 dark:border-blue-700"
                }`}
            >
                <div className="sm:flex-grow">
                    {/* DARK MODE: Ubah warna teks judul kartu */}
                    <p className="font-bold text-gray-900 dark:text-white text-base sm:text-lg">
                        {resource.title}
                    </p>
                    {/* DARK MODE: Kelas dark:text-gray-400 sudah ada di kode asli */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Tersedia 24/7
                    </p>
                </div>
                <motion.a
                    href={`tel:${resource.number.split("/")[0].trim()}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    // Tombol dibuat full-width di mobile
                    className={`w-full sm:w-auto text-center px-6 py-3 sm:px-8 sm:py-4 rounded-2xl font-bold text-white ${
                        resource.type === "danger"
                            ? "bg-red-600 hover:bg-red-700"
                            : resource.type === "emergency"
                            ? "bg-yellow-600 hover:bg-yellow-700"
                            : "bg-blue-600 hover:bg-blue-700"
                    } transition-all hover:shadow-lg`}
                >
                    📞 {resource.number}
                </motion.a>
            </motion.div>
        ))}
    </div>
    {/* Catatan Penting */}
    <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-6 border-2 border-red-200 dark:border-red-700">
        {/* DARK MODE: Ubah warna latar belakang dan border. Menggunakan dark:bg-gray-800 untuk konsistensi kontras */}
        <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
            ⚠️{" "}
            <strong className="text-red-700 dark:text-red-400">
                Penting:
            </strong>{" "}
            Jika kamu merasa dalam bahaya, segera hubungi nomor darurat
            di atas atau cari bantuan dari orang terdekat. Kamu tidak
            sendirian. 💙
        </p>
    </div>
</motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mini Audio Player (Di luar AnimatePresence utama) */}
      <AnimatePresence>{currentAudio && <MiniAudioPlayer />}</AnimatePresence>

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
};

export default Insight;
