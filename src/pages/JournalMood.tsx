import { useState, useEffect, useMemo } from "react";
import {
  BookHeart,
  Sparkles,
  Save,
  Trash2,
  Zap, // Impor icon Zap
} from "lucide-react";

// --- KOMPONEN GRADIENTTEXT DIDEFINISIKAN LANGSUNG DI SINI UNTUK MEMPERBAIKI ERROR ---
interface GradientTextProps {
  children: React.ReactNode;
  colors: string[];
  animationSpeed?: number;
  showBorder?: boolean;
  className?: string;
}

const GradientText: React.FC<GradientTextProps> = ({
  children,
  colors,
  animationSpeed = 5,
  showBorder = false,
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

  const borderStyle = showBorder
    ? {
        border: '2px solid transparent',
        borderImage: `linear-gradient(90deg, ${colors.join(', ')}) 1`,
      }
    : {};

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
      <span style={{ ...gradientStyle, ...borderStyle }} className={className}>
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

function JournalMood() {
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem("journalEntries");
    return saved ? JSON.parse(saved) : [];
  });

  const [currentEntry, setCurrentEntry] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState("");

  useEffect(() => {
    localStorage.setItem("journalEntries", JSON.stringify(entries));
  }, [entries]);

  // (Fungsi generateAISummary, formatDate tetap sama)
  const generateAISummary = (text: string): string => {
    const wordCount = text.split(" ").length;

    if (wordCount < 10) {
      return "Tulisan terlalu pendek untuk dianalisis. Coba tulis lebih banyak tentang perasaanmu.";
    }

    const positiveWords = [
      "senang",
      "bahagia",
      "gembira",
      "suka",
      "bagus",
      "hebat",
    ];
    const negativeWords = [
      "sedih",
      "stres",
      "cemas",
      "takut",
      "khawatir",
      "lelah",
    ];

    const lowerText = text.toLowerCase();
    const hasPositive = positiveWords.some((word) => lowerText.includes(word));
    const hasNegative = negativeWords.some((word) => lowerText.includes(word));

    let sentiment = "netral";
    if (hasPositive && !hasNegative) sentiment = "positif";
    else if (hasNegative && !hasPositive) sentiment = "negatif";
    else if (hasPositive && hasNegative) sentiment = "campuran";

    const summaries: { [key: string]: string } = {
      positif:
        "✨ Dari tulisanmu, terlihat kamu sedang dalam suasana hati yang baik! Pertahankan energi positif ini dan jangan lupa untuk tetap bersyukur dengan hal-hal kecil di sekitarmu.",
      negatif:
        "💙 Sepertinya kamu sedang menghadapi masa yang cukup berat. Ingat, perasaan ini sementara dan wajar dirasakan. Cobalah untuk berbicara dengan orang terdekat atau istirahat sejenak.",
      campuran:
        "🌈 Perasaanmu saat ini cukup kompleks - ada suka dan duka yang bercampur. Ini sangat normal! Fokus pada hal-hal yang bisa kamu kontrol dan jangan terlalu keras pada diri sendiri.",
      netral:
        "📝 Kamu sepertinya dalam kondisi yang stabil. Terus ekspresikan perasaanmu melalui jurnal ini untuk lebih memahami dirimu sendiri.",
    };

    return summaries[sentiment] || summaries.netral;
  };

  const handleGenerateSummary = () => {
    if (!currentEntry.trim()) return;

    setIsGenerating(true);
    setTimeout(() => {
      const summary = generateAISummary(currentEntry);
      setGeneratedSummary(summary);
      setIsGenerating(false);
    }, 1500);
  };

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
  };

  const handleDeleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
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
      {/* === Background Blobs (dari Home.tsx) === */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob dark:bg-indigo-700 dark:opacity-30" />
      <div className="absolute bottom-1/4 right-0 w-1/3 h-1/3 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000 dark:bg-rose-700 dark:opacity-30" />
      <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 dark:bg-emerald-700 dark:opacity-20" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-9 md:py-14 relative z-10">
        <div className="mb-8 md:mb-12">
          <div className="flex items-center space-x-4 mb-3">
            <div
              className="w-14 h-14 bg-gradient-to-br from-[#1ff498]/20 to-[#50b7f7]/20 
              rounded-2xl flex items-center justify-center shadow-lg border-2 border-white/50"
            >
              <BookHeart className="w-7 h-7 text-teal-600 dark:text-teal-400" /> 
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
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
                Journal Mood
              </GradientText>
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 ml-[72px]">
            Curahkan isi hatimu, biarkan AI memahami dan membantu menenangkan jiwamu.
          </p>
        </div>

        {/* === Input Card === */}
        <div
          className="rounded-3xl p-6 md:p-8 border-2 shadow-xl mb-8
          border-[#72e4f8] bg-white/60 backdrop-blur-sm 
          dark:bg-gray-900/60 dark:border-[#50b7f7]"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-5">
            Apa yang kamu rasakan hari ini?
          </h2>

          <textarea
            value={currentEntry}
            onChange={(e) => setCurrentEntry(e.target.value)}
            placeholder="Tulis apapun yang ada di pikiranmu... Tidak ada yang salah atau benar di sini."
            className="w-full h-48 md:h-64 px-4 py-3 bg-white/80 dark:bg-gray-800/80 border-2 
            border-indigo-200 dark:border-gray-700 rounded-2xl 
            focus:outline-none focus:ring-2 focus:ring-[#1ff498] focus:border-transparent 
            resize-none text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
          />

          <div className="flex flex-col sm:flex-row gap-4 mt-5">
            <button
              onClick={handleGenerateSummary}
              disabled={!currentEntry.trim() || isGenerating}
              className="group flex-1 relative inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-[#1ff498] to-[#50b7f7] rounded-full transform hover:scale-105 transition-all duration-300 overflow-hidden hover:shadow-md hover:shadow-[#1ff498]/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Sparkles
                className={`w-5 h-5 mr-2 ${
                  isGenerating ? "animate-spin" : "group-hover:animate-pulse-fast"
                }`}
              />
              <span>{isGenerating ? "Menganalisis..." : "Analisis dengan AI"}</span>
            </button>

            <button
              onClick={handleSaveEntry}
              disabled={!currentEntry.trim()}
              className="flex-1 inline-flex items-center justify-center px-8 py-3 text-lg font-semibold rounded-full transition-all duration-300 
              text-gray-800 bg-white/90 backdrop-blur-md border-2 border-[#72e4f8] hover:border-[#1ff498] hover:scale-105
              dark:text-gray-200 dark:bg-gray-800/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5 mr-2" />
              <span>Simpan</span>
            </button>
          </div>

          {generatedSummary && (
            <div
              className="mt-6 p-5 md:p-6 rounded-2xl border
              bg-gradient-to-br from-emerald-100 to-teal-100 
              border-emerald-300
              dark:from-emerald-900/50 dark:to-teal-900/50 dark:border-emerald-700"
            >
              <div className="flex items-start space-x-3">
                <Sparkles className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-300 mb-2">
                    Rangkuman AI
                  </h3>
                  <p className="text-gray-700 dark:text-emerald-200 leading-relaxed">
                    {generatedSummary}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* === Daftar Jurnal === */}
        <div className="space-y-6">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Jurnal Sebelumnya
          </h2>

          {entries.length === 0 ? (
            <div
              className="rounded-3xl p-8 md:p-12 text-center border-2 
              border-gray-200 dark:border-gray-700 
              bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm"
            >
              <BookHeart className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-lg text-gray-500 dark:text-gray-400">
                Belum ada jurnal. Mulai tulis perasaanmu hari ini!
              </p>
            </div>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="rounded-3xl p-6 md:p-8 border border-gray-200 
                dark:border-gray-700 bg-white/70 backdrop-blur-sm 
                dark:bg-gray-800/70 shadow-lg transition-all duration-300 
                hover:shadow-xl hover:border-[#72e4f8] dark:hover:border-[#72e4f8]"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {formatDate(entry.date)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteEntry(entry.id)}
                    className="text-red-500 hover:text-red-700 p-2 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                    title="Hapus jurnal"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
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
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default JournalMood;

