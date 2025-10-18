import {
  Brain,
  TrendingUp,
  AlertCircle,
  BookOpen,
  Target,
  Lightbulb,
  Activity,
  Heart,
  Zap,
  Phone,
  PlayCircle,
  CheckCircle,
  ChevronRight,
  Sparkles,
  Calendar,
  Lock,
  Loader,
  PauseCircle,
  StopCircle,
} from 'lucide-react';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { GoogleGenAI, Content, Chat, GenerateContentResponse } from '@google/genai';
import { motion, AnimatePresence } from 'framer-motion';

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
    name: 'Rasa Bersalah',
    definition: 'Perasaan menyesal atau bertanggung jawab atas kesalahan yang dilakukan, baik nyata maupun yang dibayangkan.',
    triggers: [
      'Mengecewakan orang lain',
      'Tidak memenuhi ekspektasi diri sendiri',
      'Membuat keputusan yang merugikan',
    ],
    managementTips: [
      'Bedakan antara rasa bersalah yang konstruktif dan destruktif',
      'Minta maaf jika memang ada kesalahan nyata',
      'Latih self-compassion - ingat bahwa semua orang membuat kesalahan',
      'Fokus pada pembelajaran, bukan penyesalan berkepanjangan',
    ],
    color: 'from-purple-500 to-indigo-600',
    icon: '💭',
  },
  {
    name: 'Kecemasan',
    definition: 'Respons emosional terhadap ancaman yang dipersepsikan, ditandai dengan kekhawatiran berlebihan tentang masa depan.',
    triggers: [
      'Ketidakpastian atau perubahan besar',
      'Tekanan akademik atau sosial',
      'Overthinking tentang hal-hal di luar kendali',
    ],
    managementTips: [
      'Praktikkan teknik grounding 5-4-3-2-1',
      'Tulis worry list dan kategorikan: bisa dikontrol vs tidak bisa',
      'Lakukan breathing exercise 4-7-8',
      'Batasi konsumsi berita atau media yang memicu cemas',
    ],
    color: 'from-yellow-500 to-orange-500',
    icon: '😰',
  },
  {
    name: 'Kesedihan',
    definition: 'Respons emosional terhadap kehilangan, kekecewaan, atau situasi yang tidak sesuai harapan.',
    triggers: [
      'Kehilangan seseorang atau sesuatu yang berharga',
      'Kegagalan atau penolakan',
      'Merasa tidak dihargai atau diabaikan',
    ],
    managementTips: [
      'Izinkan dirimu merasakan kesedihan tanpa menghakimi',
      'Berbicara dengan orang yang dipercaya',
      'Tulis ekspresif journaling tentang perasaanmu',
      'Lakukan aktivitas yang biasanya membuatmu nyaman',
    ],
    color: 'from-blue-500 to-cyan-600',
    icon: '😢',
  },
  {
    name: 'Kemarahan',
    definition: 'Respons emosional terhadap ketidakadilan, frustrasi, atau pelanggaran batas personal.',
    triggers: [
      'Merasa diperlakukan tidak adil',
      'Batas personal dilanggar',
      'Frustrasi akumulatif yang tidak terselesaikan',
    ],
    managementTips: [
      'Identifikasi kebutuhan di balik kemarahanmu',
      'Praktikkan progressive muscle relaxation',
      'Komunikasikan perasaan dengan assertif, bukan agresif',
      'Beri jeda sebelum bereaksi (count to 10)',
    ],
    color: 'from-red-500 to-rose-600',
    icon: '😠',
  },
  {
    name: 'Stres',
    definition: 'Respons fisik dan mental terhadap tuntutan atau tekanan yang melebihi kapasitas koping.',
    triggers: [
      'Beban tugas atau tanggung jawab berlebihan',
      'Deadline yang ketat',
      'Konflik interpersonal',
    ],
    managementTips: [
      'Prioritaskan tugas dengan Eisenhower Matrix',
      'Break down tugas besar menjadi langkah kecil',
      'Jadwalkan break time secara konsisten',
      'Lakukan aktivitas fisik ringan setiap hari',
    ],
    color: 'from-orange-500 to-amber-600',
    icon: '😣',
  },
];

const ARTICLES = [
  {
    id: 1,
    title: 'Mengatasi Burnout Akademik',
    summary: 'Strategi praktis untuk mengenali dan mengatasi kelelahan mental akibat tuntutan akademik.',
    category: 'Akademik',
    readTime: '5 menit',
  },
  {
    id: 2,
    title: 'Mindfulness untuk Pemula',
    summary: 'Panduan sederhana memulai praktik mindfulness dalam kehidupan sehari-hari.',
    category: 'Teknik',
    readTime: '7 menit',
  },
  {
    id: 3,
    title: 'Membangun Resiliensi Mental',
    summary: 'Cara mengembangkan ketahanan mental untuk menghadapi tantangan hidup.',
    category: 'Pengembangan Diri',
    readTime: '6 menit',
  },
  {
    id: 4,
    title: 'Mengelola Kecemasan Sosial',
    summary: 'Tips praktis mengatasi rasa gugup dalam situasi sosial.',
    category: 'Sosial',
    readTime: '5 menit',
  },
  {
    id: 5,
    title: 'Pola Tidur Sehat untuk Pelajar',
    summary: 'Pentingnya tidur berkualitas dan cara memperbaiki sleep hygiene.',
    category: 'Kesehatan',
    readTime: '4 menit',
  },
  {
    id: 6,
    title: 'Teknik Grounding 5-4-3-2-1',
    summary: 'Latihan sederhana untuk mengatasi panic attack dan overwhelm.',
    category: 'Teknik',
    readTime: '3 menit',
  },
];

const CRISIS_RESOURCES = [
  { title: 'Hotline Bunuh Diri (Kemenkes)', number: '119', type: 'danger' },
  {  title: 'Ambulans', number: '118 / 119', type: 'emergency' },
  { title: 'Polisi', number: '110', type: 'emergency' },
  { title: 'Komnas Perempuan', number: '021-3903963', type: 'support' },
];

const AUDIO_GUIDES: AudioGuide[] = [
    { title: 'Pernapasan 4-7-8', duration: '3 menit', color: 'from-teal-500 to-cyan-600', icon: '🌬️', audioFile: '/audio/4-7-8.mp3' },
    { title: 'Body Scan Relaxation', duration: '8 menit', color: 'from-blue-500 to-indigo-600', icon: '🧘', audioFile: '/audio/body-scan.mp3' },
    { title: 'Grounding 5-4-3-2-1', duration: '2 menit', color: 'from-green-500 to-emerald-600', icon: '🌿', audioFile: '/audio/Grounding.mp3' },
    { title: 'White Noise untuk Fokus', duration: '5 menit', color: 'from-gray-500 to-slate-600', icon: '🎵', audioFile: '/audio/white-noise.mp3' },
];

// ==================== FUNGSI AI ANALISIS ====================

// Fungsi Analisis AI untuk Gratitude Garden
const analyzeGratitudeWithAI = async (gratitude: string) => {
    try {
        const prompt = `Analisis kalimat rasa syukur ini: "${gratitude}". Berikan respons singkat, positif, dan penuh makna (maksimal 3 kalimat) tentang pentingnya rasa syukur ini untuk kesehatan mental, seolah-olah Anda adalah seorang pendamping mental. Awali dengan emoji 🌟.`;
        const response = await ai.models.generateContent({
            model: model,
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
        });
        return response.text;
    } catch (error) {
        console.error("AI Gratitude Analysis Error:", error);
        return "Gagal mendapatkan wawasan AI. Coba lagi nanti!";
    }
};

// Fungsi Analisis AI untuk Worry Vault
const analyzeWorryWithAI = async (worry: string, type: string, action: string) => {
    try {
        let prompt: string;
        if (type === 'Dapat Dikontrol') {
            prompt = `Kekhawatiran yang terkunci: "${worry}" dan rencana aksi: "${action}". Sebagai pendamping mental, berikan 1-2 kalimat penyemangat yang realistis tentang kekuatan diri untuk fokus pada aksi tersebut. Awali dengan emoji 💪.`;
        } else { // Tidak Dapat Dikontrol
            prompt = `Kekhawatiran yang terkunci: "${worry}" adalah di luar kendali. Sebagai pendamping mental, berikan 1-2 kalimat yang menekankan penerimaan dan pentingnya melepaskan pikiran berlebihan, fokus pada masa kini. Awali dengan emoji 🌬️.`;
        }

        const response = await ai.models.generateContent({
            model: model,
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
        });
        return response.text;
    } catch (error) {
        console.error("AI Worry Analysis Error:", error);
        return "Gagal mendapatkan wawasan AI. Fokus pada rencana aksimu!";
    }
};

// Fungsi Analisis AI untuk CBT Worksheet
const analyzeCBTWorksheetWithAI = async (data: { situation: string, thought: string, evidence: string, alternative: string }) => {
    try {
        const prompt = `Lakukan analisis singkat (maksimal 4 kalimat) terhadap CBT Worksheet ini. Fokus pada perbandingan antara 'Pikiran Otomatis' dan 'Perspektif Alternatif'. Berikan validasi atas usaha mencari alternatif dan penekanan pada realistisnya perspektif baru. Gunakan bahasa yang suportif dan profesional. Awali dengan emoji 🧠.

Situasi: ${data.situation}
Pikiran Otomatis: ${data.thought}
Bukti: ${data.evidence}
Perspektif Alternatif: ${data.alternative}
`;

        const response = await ai.models.generateContent({
            model: model,
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
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
  const [activeTab, setActiveTab] = useState<'personal' | 'interactive' | 'education'>('personal');
  
  // Gratitude Garden State
  const [gardenSeeds, setGardenSeeds] = useState<number>(0);
  const [gardenFlowers, setGardenFlowers] = useState<string[]>([]);
  const [gratitudeText, setGratitudeText] = useState('');
  const [canPlantToday, setCanPlantToday] = useState(true);
  const [lastPlantDate, setLastPlantDate] = useState('');
  const [aiGratitudeAnalysis, setAiGratitudeAnalysis] = useState<string | null>(null);
  const [isGratitudeLoading, setIsGratitudeLoading] = useState(false); // State Loading

  const flowerEmojis = ['🌸', '🌺', '🌻', '🌷', '🌹', '🌼', '💐', '🏵️'];

  // Worry Vault State
  const [worryText, setWorryText] = useState('');
  const [worryType, setWorryType] = useState<'controllable' | 'uncontrollable' | null>(null);
  const [actionPlan, setActionPlan] = useState('');
  const [lockedWorries, setLockedWorries] = useState<LockedWorry[]>([]);
  const [showWorryVault, setShowWorryVault] = useState(false);
  const [isWorryLoading, setIsWorryLoading] = useState(false); // State Loading

  // CBT Worksheet State
  const [worksheetStep, setWorksheetStep] = useState(0);
  const [worksheetData, setWorksheetData] = useState({
    situation: '',
    thought: '',
    evidence: '',
    alternative: '',
    aiAnalysis: '',
  });
  const [isCBTLoading, setIsCBTLoading] = useState(false); // State Loading
  
  // Audio Player State (BARU)
  const [currentAudio, setCurrentAudio] = useState<AudioGuide | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);


  // State untuk perbaikan race condition localStorage
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // ==================== EFFECT HOOKS ====================

  // Load Data dari Local Storage
  useEffect(() => {
    const savedMood = localStorage.getItem('moodData');
    const savedJournal = localStorage.getItem('journalEntries');
    const savedSeeds = localStorage.getItem('gardenSeeds');
    const savedFlowers = localStorage.getItem('gardenFlowers');
    const savedLastPlantDate = localStorage.getItem('lastPlantDate');
    const savedWorries = localStorage.getItem('lockedWorries');

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

    const today = new Date().toISOString().split('T')[0];
    if (savedLastPlantDate && savedLastPlantDate === today) {
        setCanPlantToday(false);
    } else {
        setCanPlantToday(true);
    }
    setLastPlantDate(savedLastPlantDate || '');

    // Tandai bahwa data telah selesai dimuat
    setIsDataLoaded(true);

  }, []);

  // Save Garden and Worry Vault Data ke Local Storage
  useEffect(() => {
    // Hanya simpan JIKA data sudah selesai dimuat
    if (isDataLoaded) {
      localStorage.setItem('gardenSeeds', gardenSeeds.toString());
      localStorage.setItem('gardenFlowers', JSON.stringify(gardenFlowers));
      localStorage.setItem('lastPlantDate', lastPlantDate);
      localStorage.setItem('lockedWorries', JSON.stringify(lockedWorries));
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

      audio.addEventListener('ended', handleEnded);

      // Clean up event listener
      return () => {
        audio.removeEventListener('ended', handleEnded);
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
      'very-happy': 5,
      'happy': 4,
      'neutral': 3,
      'sad': 2,
      'very-sad': 1,
    };

    const avgMood = last7Days.length > 0
      ? last7Days.reduce((sum, [, mood]) => sum + (moodValues[mood] || 3), 0) / last7Days.length
      : 3;

    const moodCounts = last7Days.reduce((acc, [, mood]) => {
      acc[mood] = (acc[mood] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    return {
      avgMood: avgMood.toFixed(1),
      totalDays: last7Days.length,
      moodCounts,
      trend: avgMood >= 3.5 ? 'positive' : avgMood <= 2.5 ? 'negative' : 'stable',
    };
  }, [moodData]);

  const topTriggers = useMemo(() => {
    const lowMoodEntries = journalEntries.filter((entry) => {
        const dateKey = entry.date.split('T')[0];
        const mood = moodData[dateKey];
        return mood === 'sad' || mood === 'very-sad';
      });
  
      const wordFrequency: { [key: string]: number } = {};
      const stopWords = ['aku', 'saya', 'yang', 'dan', 'di', 'ke', 'dari', 'untuk', 'ini', 'itu', 'adalah'];
  
      lowMoodEntries.forEach((entry) => {
        const words = entry.content.toLowerCase().split(/\s+/);
        words.forEach((word) => {
          const cleaned = word.replace(/[^\w]/g, '');
          if (cleaned.length > 3 && !stopWords.includes(cleaned)) {
            wordFrequency[cleaned] = (wordFrequency[cleaned] || 0) + 1;
          }
        });
      });
  
      return Object.entries(wordFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([word, count]) => ({ word, count }));
  }, [journalEntries, moodData]);

  const todayEmotion = useMemo(() => {
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
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
                audioRef.current.play().catch(error => {
                    console.error("Audio playback failed:", error);
                    alert("Gagal memutar audio. Pastikan file audio tersedia di direktori public.");
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
      alert('Tuliskan sesuatu yang kamu syukuri terlebih dahulu! 🌱');
      return;
    }

    if (!canPlantToday) {
        alert('Anda sudah menanam benih hari ini. Datang lagi besok! 😊');
        return;
    }

    setIsGratitudeLoading(true); // Mulai loading
    setAiGratitudeAnalysis(null);

    let aiResult = "Gagal memuat analisis AI.";
    try {
      // AI Analysis
      aiResult = await analyzeGratitudeWithAI(gratitudeText);
      setAiGratitudeAnalysis(aiResult);

      const newFlower = flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)];
      setGardenFlowers(prev => [...prev, newFlower]);
      setGardenSeeds(prev => prev + 1);

      const today = new Date().toISOString().split('T')[0];
      setLastPlantDate(today);
      setCanPlantToday(false);
      
      // Save to Journal
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        content: `[Gratitude Garden] Syukur: ${gratitudeText}\nAI Insight: ${aiResult}`,
      };
      const currentEntries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
      localStorage.setItem('journalEntries', JSON.stringify([newEntry, ...currentEntries]));

      setGratitudeText('');
      alert('🌸 Benih syukur berhasil ditanam! Tamanmu semakin indah. Baca insight AI di bawah.');

    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan saat menganalisis. Silakan coba lagi.');
    } finally {
      setIsGratitudeLoading(false); // Selesai loading
    }
  };

  const lockWorry = async () => {
    if (!worryText.trim() || !worryType) {
      alert('Lengkapi kekhawatiranmu dan pilih kategorinya! 🔒');
      return;
    }

    const typeLabel = worryType === 'controllable' ? 'Dapat Dikontrol' : 'Tidak Dapat Dikontrol';

    if (worryType === 'controllable' && !actionPlan.trim()) {
      alert('Buat rencana aksi singkat untuk kekhawatiran yang bisa dikontrol! 📝');
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
        date: new Date().toLocaleDateString('id-ID'),
        aiAnalysis: aiResult,
      };

      setLockedWorries(prev => [...prev, newWorry]);
      
      alert(`🔒 Kekhawatiran berhasil dikunci! Cek insight AI.`);
      
      // Save to Journal
      const journalContent = `[Worry Vault - ${typeLabel}]\nKekhawatiran: ${worryText}${actionPlan ? `\nRencana Aksi: ${actionPlan}` : ''}\nAI Insight: ${aiResult}`;
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        content: journalContent,
      };
      const currentEntries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
      localStorage.setItem('journalEntries', JSON.stringify([newEntry, ...currentEntries]));

      setWorryText('');
      setWorryType(null);
      setActionPlan('');
      setShowWorryVault(false);

    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan saat menganalisis. Silakan coba lagi.');
    } finally {
      setIsWorryLoading(false); // Selesai loading
    }
  };

  const worksheetSteps = [
    { title: 'Situasi', question: 'Apa situasi yang membuatmu merasa tertekan?', field: 'situation' },
    { title: 'Pikiran', question: 'Apa pikiran otomatis yang muncul?', field: 'thought' },
    { title: 'Bukti', question: 'Apa bukti yang mendukung pikiran ini?', field: 'evidence' },
    { title: 'Alternatif', question: 'Apa cara pandang alternatif yang lebih seimbang?', field: 'alternative' },
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

    const currentEntries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
    localStorage.setItem('journalEntries', JSON.stringify([newEntry, ...currentEntries]));
    
    alert('✅ Worksheet berhasil disimpan ke Journal!');
    setWorksheetStep(0);
    setWorksheetData({ situation: '', thought: '', evidence: '', alternative: '', aiAnalysis: '' });
  };
  
  // Komponen Audio Player Mini (BARU)
  const MiniAudioPlayer = () => {
    if (!currentAudio) return null;

    const Icon = isPlaying ? PauseCircle : PlayCircle;
    const action = isPlaying ? 'Jeda' : 'Lanjut';

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-2xl p-4 md:p-6 border-t-4 border-teal-500"
        >
            <div className="max-w-4xl mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <span className="text-3xl">{currentAudio.icon}</span>
                    <div>
                        <p className="font-bold text-gray-900 text-sm sm:text-lg">Sedang Memutar:</p>
                        <p className="text-teal-600 font-semibold text-base sm:text-xl">{currentAudio.title}</p>
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Audio Element (Hidden) */}
      <audio ref={audioRef} preload="auto" />

      {/* Decorative blobs, dibuat lebih kecil di mobile */}
      <div className="absolute top-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob" />
      <div className="absolute bottom-1/4 right-0 w-64 h-64 md:w-1/3 md:h-1/3 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000" />
      <div className="absolute top-1/2 left-1/4 w-48 h-48 md:w-72 md:h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />

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
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#1ff498] to-[#50b7f7] rounded-2xl flex items-center justify-center shadow-xl">
              <Brain className="w-8 h-8 sm:w-9 sm:h-9 text-white" />
            </div>
            {/* Ukuran Teks judul diresponsifkan */}
            <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-[#1ff498] to-[#50b7f7] bg-clip-text text-transparent">
              Insight
            </h1>
          </div>
          <p className="text-gray-600 text-base sm:text-lg">Wawasan mendalam untuk kesehatan mentalmu</p>
        </motion.div>

        {/* Tombol tab diubah dari space-x ke gap agar wrapping lebih baik */}
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex justify-center mb-8 flex-wrap gap-3"
        >
          {[
            { id: 'personal', label: 'Analisis Personal', icon: Activity },
            { id: 'interactive', label: 'Latihan Interaktif', icon: Target },
            { id: 'education', label: 'Edukasi & Dukungan', icon: BookOpen },
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
                    ? 'bg-gradient-to-r from-[#1ff498] to-[#50b7f7] text-white shadow-lg'
                    : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white border-2 border-[#72e4f8]'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="whitespace-nowrap text-sm sm:text-base">{tab.label}</span>
              </motion.button>
            );
          })}
        </motion.div>
        
        <AnimatePresence mode="wait">
        {/* ==================== TAB PERSONAL ==================== */}
        {activeTab === 'personal' && (
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
                className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border-2 border-[#72e4f8] hover:border-[#1ff498] transition-all"
            >
              <div className="flex items-center space-x-3 mb-6">
                <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-[#1ff498]" />
                {/* Ukuran Teks header kartu diresponsifkan */}
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Pola Mood 7 Hari Terakhir</h2>
              </div>
              {moodAnalysis ? (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
                    {/* Kartu internal dianimasikan */}
                    <motion.div whileHover={{ translateY: -5 }} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 sm:p-6 border-2 border-indigo-200">
                      <p className="text-sm text-gray-600 mb-2 font-medium">Rata-rata Mood</p>
                      {/* Ukuran Teks metriks diresponsifkan */}
                      <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{moodAnalysis.avgMood}/5</p>
                    </motion.div>
                    <motion.div whileHover={{ translateY: -5 }} className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 sm:p-6 border-2 border-emerald-200">
                      <p className="text-sm text-gray-600 mb-2 font-medium">Hari Dicatat</p>
                      <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{moodAnalysis.totalDays}</p>
                    </motion.div>
                    <motion.div whileHover={{ translateY: -5 }} className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-5 sm:p-6 border-2 border-rose-200">
                      <p className="text-sm text-gray-600 mb-2 font-medium">Tren Mood Kamu</p>
                      <p className={`text-2xl sm:text-3xl font-bold ${
                        moodAnalysis.trend === 'positive' ? 'text-green-600' :
                        moodAnalysis.trend === 'negative' ? 'text-red-600' : 'text-yellow-600'
                      }`}>
                        {moodAnalysis.trend === 'positive' ? '📈 Membaik' :
                         moodAnalysis.trend === 'negative' ? '📉 Menurun' : '➡️ Stabil'}
                      </p>
                    </motion.div>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-5 sm:p-6 border-2 border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-4">Distribusi Mood:</p>
                    <div className="space-y-3">
                      {Object.entries(moodAnalysis.moodCounts).map(([mood, count]) => (
                        <motion.div 
                            key={mood} 
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.3 + (count * 0.05) }}
                            className="flex items-center space-x-3 sm:space-x-4"
                        >
                          <span className="text-2xl sm:text-3xl">
                            {mood === 'very-happy' ? '😄' : mood === 'happy' ? '😊' : 
                             mood === 'neutral' ? '😐' : mood === 'sad' ? '😔' : '😢'}
                          </span>
                          <div className="flex-grow h-4 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(count / moodAnalysis.totalDays) * 100}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-[#1ff498] to-[#50b7f7] transition-all duration-500"
                            />
                          </div>
                          <span className="text-sm font-bold text-gray-700 min-w-[40px]">{count}x</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-indigo-50 rounded-2xl border-2 border-dashed border-gray-300">
                  <p className="text-gray-500 text-base sm:text-lg">Belum ada data mood. Mulai tracking di halaman Mood Tracker! 📊</p>
                </div>
              )}
            </motion.div>

            <motion.div 
                initial={{ scale: 0.95 }} 
                animate={{ scale: 1 }} 
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border-2 border-[#72e4f8] hover:border-[#1ff498] transition-all"
            >
              <div className="flex items-center space-x-3 mb-6">
                <AlertCircle className="w-6 h-6 sm:w-7 sm:h-7 text-rose-500" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Pemicu Emosi Utama</h2>
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
                        className="flex items-center space-x-4 sm:space-x-5 bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-4 sm:p-5 border-2 border-rose-200 hover:border-rose-300 transition-all"
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-lg flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-grow">
                        <p className="font-bold text-gray-900 capitalize text-base sm:text-lg">{trigger.word}</p>
                        <p className="text-sm text-gray-600">Muncul {trigger.count}x dalam jurnal mood rendah</p>
                      </div>
                    </motion.div>
                  ))}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 sm:p-5 border-2 border-blue-200 mt-6">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      💡 <strong className="text-blue-700">Insight:</strong> Kata-kata ini sering muncul saat mood-mu rendah. Coba refleksikan pola ini.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-rose-50 rounded-2xl border-2 border-dashed border-gray-300">
                  <p className="text-gray-500 text-base sm:text-lg">Belum cukup data jurnal untuk analisis. Tulis lebih banyak di Journal Mood! ✍️</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* ==================== TAB INTERAKTIF ==================== */}
        {activeTab === 'interactive' && (
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
                className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border-2 border-emerald-300 hover:border-[#1ff498] transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
                <div className="flex items-center space-x-3">
                  <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600" />
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">The Gratitude Garden 🌸</h2>
                </div>
                <div className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {gardenSeeds} Benih Ditanam
                </div>
              </div>
              
              <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">
                Tumbuhkan taman syukurmu! Setiap kali kamu menuliskan hal yang kamu syukuri, sebuah bunga indah akan mekar di tamanmu. Maksimal satu benih per hari. 🌺
              </p>

              <div className="bg-gradient-to-b from-teal-50 to-emerald-100 rounded-3xl p-4 sm:p-8 mb-6 min-h-[200px] sm:min-h-[250px] border-4 border-emerald-300 relative overflow-hidden flex flex-col justify-end">
                <div className="flex-grow w-full grid grid-cols-6 md:grid-cols-10 gap-2 items-end justify-center">
                    {gardenFlowers.length === 0 ? (
                        <div className="col-span-10 text-center py-10 sm:py-12">
                            <p className="text-gray-500 text-base sm:text-lg mb-2">Tamanmu masih kosong 🌱</p>
                            <p className="text-gray-400 text-sm sm:text-base">Mulai tanam benih syukur pertamamu!</p>
                        </div>
                    ) : (
                        gardenFlowers.map((flower, index) => (
                            <motion.div 
                                key={index} 
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 150, damping: 10, delay: index * 0.05 }}
                                className="text-4xl sm:text-5xl text-center"
                                style={{
                                    alignSelf: 'flex-end',
                                }}
                            >
                                {flower}
                            </motion.div>
                        ))
                    )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-green-800/50 rounded-b-3xl"></div>
              </div>

              <div className="space-y-4">
                <textarea
                  value={gratitudeText}
                  onChange={(e) => {
                    setGratitudeText(e.target.value);
                    setAiGratitudeAnalysis(null);
                  }}
                  className="w-full h-24 px-5 py-4 bg-white border-2 border-emerald-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none text-gray-800 placeholder-gray-400 text-sm sm:text-base"
                  placeholder="Apa yang kamu syukuri hari ini?"
                  disabled={isGratitudeLoading}
                />
                <motion.button
                  onClick={plantGratitudeSeed}
                  disabled={!canPlantToday || !gratitudeText.trim() || isGratitudeLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-2xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg flex items-center justify-center space-x-2"
                >
                  {isGratitudeLoading ? (
                    <>
                      <Loader className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                      <span>Menganalisis...</span>
                    </>
                  ) : (
                    <span>{canPlantToday ? '🌱 Tanam Benih Syukur' : '✅ Sudah Menanam Hari Ini'}</span>
                  )}
                </motion.button>
              </div>

              <AnimatePresence>
              {aiGratitudeAnalysis && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 sm:p-5 border-2 border-blue-200"
                >
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-medium">
                        <strong className="text-blue-700">Wawasan AI:</strong> {aiGratitudeAnalysis}
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
                className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border-2 border-amber-300 hover:border-[#1ff498] transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
                <div className="flex items-center space-x-3">
                  <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-amber-600" />
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Worry Vault 🔒</h2>
                </div>
                <div className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  {lockedWorries.length} Kekhawatiran Terkunci
                </div>
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">
                Tulis kekhawatiranmu dan kunci di brankas mental. Pisahkan mana yang bisa kamu kontrol dan mana yang harus kamu lepaskan. 🧘
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
                  🔓 Buka Worry Vault
                </motion.button>
              ) : (
                <motion.div 
                    key="vault-form"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                >
                  <div className="space-y-4">
                    <textarea
                      value={worryText}
                      onChange={(e) => setWorryText(e.target.value)}
                      className="w-full h-24 px-5 py-4 bg-white border-2 border-amber-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none text-gray-800 placeholder-gray-400 text-sm sm:text-base"
                      placeholder="Apa yang membuatmu khawatir? Tuliskan..."
                      disabled={isWorryLoading}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <motion.button
                        onClick={() => setWorryType('controllable')}
                        disabled={isWorryLoading}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className={`p-5 rounded-2xl border-2 transition-all ${
                          worryType === 'controllable'
                            ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-400 shadow-lg scale-105'
                            : 'bg-white border-gray-200 hover:border-blue-300'
                        } disabled:opacity-50 text-left sm:text-center`}
                      >
                        <Target className="w-6 h-6 text-blue-600 mb-2 sm:mx-auto" />
                        <p className="font-bold text-gray-900 mb-1">Bisa Dikontrol</p>
                        <p className="text-sm text-gray-600">Aku bisa melakukan sesuatu tentang ini</p>
                      </motion.button>

                      <motion.button
                        onClick={() => setWorryType('uncontrollable')}
                        disabled={isWorryLoading}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className={`p-5 rounded-2xl border-2 transition-all ${
                          worryType === 'uncontrollable'
                            ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-400 shadow-lg scale-105'
                            : 'bg-white border-gray-200 hover:border-purple-300'
                        } disabled:opacity-50 text-left sm:text-center`}
                      >
                        <Heart className="w-6 h-6 text-purple-600 mb-2 sm:mx-auto" />
                        <p className="font-bold text-gray-900 mb-1">Tidak Bisa Dikontrol</p>
                        <p className="text-sm text-gray-600">Ini di luar kuasaku</p>
                      </motion.button>
                    </div>

                    <AnimatePresence>
                    {worryType === 'controllable' && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-blue-50 rounded-2xl p-4 sm:p-5 border-2 border-blue-200"
                      >
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Rencana aksi 5 menit:
                        </label>
                        <input
                          type="text"
                          value={actionPlan}
                          onChange={(e) => setActionPlan(e.target.value)}
                          className="w-full px-4 py-3 bg-white border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                          placeholder="contoh: Bicara dengan guru, buat jadwal..."
                          disabled={isWorryLoading}
                        />
                      </motion.div>
                    )}
                    </AnimatePresence>

                    {worryType === 'uncontrollable' && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="bg-purple-50 rounded-2xl p-4 sm:p-5 border-2 border-purple-200"
                      >
                        <p className="text-sm text-gray-700">
                          💜 <strong>Reminder:</strong> Karena ini di luar kontrolmu, fokus pada menerima dan melepaskan. 
                        </p>
                      </motion.div>
                    )}

                    {/* Tombol diubah jadi vertikal di mobile */}
                    <div className="flex flex-col-reverse sm:flex-row gap-3 sm:space-x-3">
                      <motion.button
                        onClick={() => {
                          setShowWorryVault(false);
                          setWorryText('');
                          setWorryType(null);
                          setActionPlan('');
                        }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full sm:w-auto px-6 py-3 bg-gray-200 text-gray-700 rounded-2xl hover:bg-gray-300 font-semibold"
                        disabled={isWorryLoading}
                      >
                        Batal
                      </motion.button>
                      <motion.button
                        onClick={lockWorry}
                        disabled={!worryText.trim() || !worryType || (worryType === 'controllable' && !actionPlan.trim()) || isWorryLoading}
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
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-4">📦 Kekhawatiran Terkunci Terbaru:</h3>
                  {lockedWorries.slice(-3).reverse().map((worry, index) => (
                    <motion.div 
                        key={index} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-200"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-2">
                        <p className="font-medium text-gray-900 flex-grow mr-4 text-sm sm:text-base">{worry.text}</p>
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold flex-shrink-0 w-fit ${
                          worry.type === 'Dapat Dikontrol' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {worry.type}
                        </span>
                      </div>
                      {worry.aiAnalysis && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                              <p className="text-sm text-gray-700 font-medium">
                                  <strong className="text-gray-900">AI Insight:</strong> {worry.aiAnalysis}
                              </p>
                          </div>
                      )}
                      <p className="text-xs sm:text-sm text-gray-500 mt-2">🗓️ {worry.date}</p>
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
                className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border-2 border-purple-300 hover:border-[#1ff498] transition-all"
            >
              <div className="flex items-center space-x-3 mb-6">
                <Lightbulb className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Buku Latihan CBT 📝</h2>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">
                Latihan singkat untuk menganalisis dan mengubah pola pikirmu dengan metode Cognitive Behavioral Therapy (CBT).
              </p>

              <div className="mb-6 flex items-center space-x-2">
                {worksheetSteps.map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ width: 0 }}
                    animate={{ width: index <= worksheetStep ? '100%' : '0%' }}
                    transition={{ duration: 0.5 }}
                    className={`h-2 sm:h-3 flex-grow rounded-full transition-all ${
                      index <= worksheetStep ? 'bg-gradient-to-r from-purple-500 to-indigo-500' : 'bg-gray-200'
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
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-5 sm:p-6 border-2 border-purple-200">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                      Langkah {worksheetStep + 1}: {worksheetSteps[worksheetStep].title}
                    </h3>
                    <p className="text-gray-700 text-sm sm:text-base">{worksheetSteps[worksheetStep].question}</p>
                  </div>
                  <textarea
                    value={worksheetData[worksheetSteps[worksheetStep].field as keyof typeof worksheetData]}
                    onChange={(e) =>
                      setWorksheetData((prev) => ({
                        ...prev,
                        [worksheetSteps[worksheetStep].field]: e.target.value,
                      }))
                    }
                    className="w-full h-32 px-5 py-4 bg-white border-2 border-purple-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none text-gray-800 placeholder-gray-400 text-sm sm:text-base"
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
                        className="w-full sm:w-auto px-6 py-3 bg-gray-200 text-gray-700 rounded-2xl hover:bg-gray-300 font-semibold"
                        disabled={isCBTLoading}
                      >
                        ← Kembali
                      </motion.button>
                    )}
                    <motion.button
                      onClick={advanceWorksheetStep}
                      disabled={!worksheetData[worksheetSteps[worksheetStep].field as keyof typeof worksheetData].trim() || isCBTLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full sm:flex-grow px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all flex items-center justify-center space-x-2"
                    >
                      {isCBTLoading && worksheetStep === worksheetSteps.length - 1 ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          <span>Menganalisis...</span>
                        </>
                      ) : (
                        <span>{worksheetStep === worksheetSteps.length - 1 ? 'Analisis & Selesai →' : 'Lanjut →'}</span>
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
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-5 sm:p-6 border-2 border-purple-200">
                    <h3 className="text-lg sm:text-xl font-bold text-purple-900 mb-4">📝 Rangkuman & Analisis CBT</h3>
                    <div className="space-y-4 text-sm">
                      <div className="bg-white rounded-xl p-4">
                        <p className="font-semibold text-gray-700 mb-1">Situasi:</p>
                        <p className="text-gray-600">{worksheetData.situation}</p>
                      </div>
                      <div className="bg-white rounded-xl p-4">
                        <p className="font-semibold text-gray-700 mb-1">Pikiran Otomatis:</p>
                        <p className="text-gray-600">{worksheetData.thought}</p>
                      </div>
                      <div className="bg-white rounded-xl p-4">
                        <p className="font-semibold text-gray-700 mb-1">Perspektif Alternatif:</p>
                        <p className="text-gray-600 font-medium">{worksheetData.alternative}</p>
                      </div>
                      <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                        <p className="font-semibold text-yellow-800 mb-1">Analisis AI (Gemini):</p>
                        <p className="text-gray-700">{worksheetData.aiAnalysis || 'Sedang memuat analisis AI...'}</p>
                      </div>
                    </div>
                  </div>
                  {/* Tombol diubah jadi vertikal di mobile */}
                  <div className="flex flex-col-reverse sm:flex-row gap-3 sm:space-x-3">
                    <motion.button
                      onClick={() => {
                        setWorksheetStep(0);
                        setWorksheetData({ situation: '', thought: '', evidence: '', alternative: '', aiAnalysis: '' });
                      }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full sm:w-auto px-6 py-3 bg-gray-200 text-gray-700 rounded-2xl hover:bg-gray-300 font-semibold"
                    >
                      🔄 Mulai Ulang
                    </motion.button>
                    <motion.button
                      onClick={saveWorksheet}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full sm:flex-grow px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl hover:shadow-lg font-semibold transition-all"
                    >
                      💾 Simpan ke Journal
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
                className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border-2 border-teal-300 hover:border-[#1ff498] transition-all"
            >
              <div className="flex items-center space-x-3 mb-6">
                <PlayCircle className="w-6 h-6 sm:w-7 sm:h-7 text-teal-600" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Panduan Audio Fokus 🎧</h2>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">
                Latihan audio singkat untuk menenangkan pikiran dan tubuhmu. Gunakan headphone untuk pengalaman terbaik.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {AUDIO_GUIDES.map((audio) => {
                    const isPlayingThis = isPlaying && currentAudio?.audioFile === audio.audioFile;
                    const Icon = isPlayingThis ? PauseCircle : PlayCircle;
                    return (
                        <motion.button
                            key={audio.title}
                            onClick={() => playAudio(audio)}
                            whileHover={{ scale: 1.02, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
                            whileTap={{ scale: 0.98 }}
                            className={`bg-gradient-to-br ${audio.color} rounded-2xl p-5 sm:p-6 text-white text-left transition-all group border-2 ${isPlayingThis ? 'border-4 border-white shadow-2xl' : 'border-white/20'}`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-3xl sm:text-4xl">{audio.icon}</span>
                                <Icon className="w-8 h-8 sm:w-10 sm:h-10 opacity-80 group-hover:scale-110 transition-transform" />
                            </div>
                            <h3 className="font-bold text-lg sm:text-xl mb-2">{audio.title}</h3>
                            <p className="text-sm opacity-90">{audio.duration}</p>
                            {isPlayingThis && (
                                <p className="text-xs font-semibold mt-2 bg-white/20 p-1 rounded-full w-fit">Sedang Diputar</p>
                            )}
                        </motion.button>
                    );
                })}
              </div>
              <div className="mt-6 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-4 border-2 border-teal-200 text-center">
                <p className="text-sm text-gray-700">
                  💡 <strong>Tips:</strong> Cari tempat tenang dan berikan dirimu waktu tanpa gangguan.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ==================== TAB EDUKASI ==================== */}
        {activeTab === 'education' && (
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
                transition={{ duration: 0.5, delay: 0.1 }}
                className={`bg-gradient-to-br ${todayEmotion.color} rounded-3xl p-6 md:p-8 shadow-xl text-white border-2 border-white/30`}
            >
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-4xl sm:text-5xl">{todayEmotion.icon}</span>
                <h2 className="text-2xl sm:text-3xl font-bold">Emosi Fokus: {todayEmotion.name}</h2>
              </div>
              <p className="text-lg sm:text-xl mb-6 opacity-95 leading-relaxed">{todayEmotion.definition}</p>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 sm:p-6 mb-6 border-2 border-white/30">
                <h3 className="font-bold text-base sm:text-lg mb-3">Pemicu Umum:</h3>
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
                <h3 className="font-bold text-base sm:text-lg mb-3">Tips Mengelola:</h3>
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
                className="bg-gradient-to-r from-[#1ff498] to-[#50b7f7] rounded-3xl p-6 md:p-8 text-white shadow-xl border-2 border-white/30"
            >
              <div className="flex items-center space-x-3 mb-6">
                <Sparkles className="w-7 h-7 sm:w-8 sm:h-8" />
                <h2 className="text-2xl sm:text-3xl font-bold">Rekomendasi Aksi Hari Ini</h2>
              </div>
              {moodAnalysis && moodAnalysis.trend === 'negative' ? (
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border-2 border-white/30">
                  <p className="text-lg sm:text-xl mb-6 leading-relaxed">
                    Moodmu sedang menurun. Yuk, coba aktivitas ini! 💙
                  </p>
                  <div className="space-y-4">
                    <motion.a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('interactive');
                      }}
                      whileHover={{ x: 5 }}
                      className="flex items-center justify-between bg-white/30 rounded-2xl p-4 sm:p-5 hover:bg-white/40 transition-all group"
                    >
                      <div className="flex items-center space-x-4">
                        <Heart className="w-6 h-6 sm:w-7 sm:h-7" />
                        <span className="font-semibold text-sm sm:text-lg">Tanam Benih di Gratitude Garden</span>
                      </div>
                      <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </motion.a>
                    <motion.a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('interactive');
                      }}
                      whileHover={{ x: 5 }}
                      className="flex items-center justify-between bg-white/30 rounded-2xl p-4 sm:p-5 hover:bg-white/40 transition-all group"
                    >
                      <div className="flex items-center space-x-4">
                        <Zap className="w-6 h-6 sm:w-7 sm:h-7" />
                        <span className="font-semibold text-sm sm:text-lg">Kunci Kekhawatiranmu</span>
                      </div>
                      <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </motion.a>
                    <motion.a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('interactive');
                      }}
                      whileHover={{ x: 5 }}
                      className="flex items-center justify-between bg-white/30 rounded-2xl p-4 sm:p-5 hover:bg-white/40 transition-all group"
                    >
                      <div className="flex items-center space-x-4">
                        <PlayCircle className="w-6 h-6 sm:w-7 sm:h-7" />
                        <span className="font-semibold text-sm sm:text-lg">Dengarkan Audio Grounding</span>
                      </div>
                      <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </motion.a>
                  </div>
                </div>
              ) : (
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border-2 border-white/30">
                  <p className="text-lg sm:text-xl mb-6 leading-relaxed">
                    Pertahankan mood positifmu dengan aktivitas ini! ✨
                  </p>
                  <div className="space-y-4">
                    <motion.a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('interactive');
                      }}
                      whileHover={{ x: 5 }}
                      className="flex items-center justify-between bg-white/30 rounded-2xl p-4 sm:p-5 hover:bg-white/40 transition-all group"
                    >
                      <div className="flex items-center space-x-4">
                        <Heart className="w-6 h-6 sm:w-7 sm:h-7" />
                        <span className="font-semibold text-sm sm:text-lg">Tambah Bunga di Tamanmu</span>
                      </div>
                      <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </motion.a>
                    <motion.a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('personal');
                      }}
                      whileHover={{ x: 5 }}
                      className="flex items-center justify-between bg-white/30 rounded-2xl p-4 sm:p-5 hover:bg-white/40 transition-all group"
                    >
                      <div className="flex items-center space-x-4">
                        <Calendar className="w-6 h-6 sm:w-7 sm:h-7" />
                        <span className="font-semibold text-sm sm:text-lg">Lihat Pola Moodmu</span>
                      </div>
                      <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </motion.a>
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div 
                initial={{ scale: 0.95 }} 
                animate={{ scale: 1 }} 
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border-2 border-emerald-300 hover:border-[#1ff498] transition-all"
            >
              <div className="flex items-center space-x-3 mb-8">
                <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Pusat Artikel & Wawasan</h2>
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
                    className="block bg-white rounded-2xl p-5 sm:p-6 hover:shadow-xl border-2 border-gray-100 hover:border-emerald-300 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-xs font-semibold px-3 py-1 sm:px-4 sm:py-2 bg-emerald-100 text-emerald-700 rounded-full">
                        {article.category}
                      </span>
                      <span className="text-xs text-gray-500 font-medium">{article.readTime}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-3 group-hover:text-emerald-700 transition-colors text-base sm:text-lg">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">{article.summary}</p>
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
                className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-6 md:p-8 border-2 border-emerald-300 shadow-xl"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600 mr-3" />
                Tips Menjaga Kesehatan Mental
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  'Tidur 7-9 jam setiap malam',
                  'Olahraga ringan 20-30 menit/hari',
                  'Batasi konsumsi media sosial',
                  'Praktikkan gratitude journaling',
                  'Jaga koneksi sosial yang bermakna',
                  'Makan makanan bergizi seimbang',
                  'Luangkan waktu untuk hobi',
                  'Jangan ragu mencari bantuan profesional',
                ].map((tip, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                    whileHover={{ translateX: 5 }}
                    className="flex items-start space-x-4 bg-white rounded-2xl p-4 sm:p-5 border-2 border-emerald-200 hover:border-emerald-400 transition-all"
                  >
                    <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-medium text-sm sm:text-base">{tip}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

                        <motion.div 
                initial={{ scale: 0.95 }} 
                animate={{ scale: 1 }} 
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-300 rounded-3xl p-6 md:p-8 shadow-xl"
            >
              <div className="flex items-center space-x-3 mb-6">
                <Phone className="w-6 h-6 sm:w-7 sm:h-7 text-red-600" />
                <h2 className="text-xl sm:text-2xl font-bold text-red-900">Pusat Bantuan Krisis</h2>
              </div>
              <p className="text-gray-700 mb-8 text-base sm:text-lg leading-relaxed">
                Jika kamu atau seseorang yang kamu kenal dalam keadaan darurat, segera hubungi layanan berikut:
              </p>
              <div className="space-y-4">
                {CRISIS_RESOURCES.map((resource, index) => (
                  // Layout diubah jadi vertikal di mobile
                  <motion.div
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                    className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 sm:p-6 rounded-2xl border-2 ${
                      resource.type === 'danger'
                        ? 'bg-red-100 border-red-400'
                        : resource.type === 'emergency'
                        ? 'bg-yellow-100 border-yellow-400'
                        : 'bg-blue-100 border-blue-400'
                    }`}
                  >
                    <div className="sm:flex-grow">
                      <p className="font-bold text-gray-900 text-base sm:text-lg">{resource.title}</p>
                      <p className="text-sm text-gray-600 mt-1">Tersedia 24/7</p>
                    </div>
                    <motion.a
                      href={`tel:${resource.number.split('/')[0].trim()}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      // Tombol dibuat full-width di mobile
                      className={`w-full sm:w-auto text-center px-6 py-3 sm:px-8 sm:py-4 rounded-2xl font-bold text-white ${
                        resource.type === 'danger'
                          ? 'bg-red-600 hover:bg-red-700'
                          : resource.type === 'emergency'
                          ? 'bg-yellow-600 hover:bg-yellow-700'
                          : 'bg-blue-600 hover:bg-blue-700'
                      } transition-all hover:shadow-lg`}
                    >
                      📞 {resource.number}
                    </motion.a>
                  </motion.div>
                ))}
              </div>
              <div className="mt-8 bg-white rounded-2xl p-5 sm:p-6 border-2 border-red-200">
                <p className="text-sm text-gray-700 font-medium leading-relaxed">
                  ⚠️ <strong className="text-red-700">Penting:</strong> Jika kamu merasa dalam bahaya,
                  segera hubungi nomor darurat di atas atau cari bantuan dari orang terdekat. Kamu tidak sendirian. 💙
                </p>
              </div>
            </motion.div>

          </motion.div>
        )}
        </AnimatePresence>
      </div>
      
      {/* Mini Audio Player (Di luar AnimatePresence utama) */}
      <AnimatePresence>
        {currentAudio && <MiniAudioPlayer />}
      </AnimatePresence>
    </div>
  );
};

export default Insight;