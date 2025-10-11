import { useState, useEffect } from 'react';
import { BookHeart, Sparkles, Save, Trash2 } from 'lucide-react';

interface JournalEntry {
  id: string;
  date: string;
  content: string;
  summary?: string;
}

function JournalMood() {
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('journalEntries');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentEntry, setCurrentEntry] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState('');

  useEffect(() => {
    localStorage.setItem('journalEntries', JSON.stringify(entries));
  }, [entries]);

  const generateAISummary = (text: string): string => {
    const wordCount = text.split(' ').length;

    if (wordCount < 10) {
      return 'Tulisan terlalu pendek untuk dianalisis. Coba tulis lebih banyak tentang perasaanmu.';
    }

    const positiveWords = ['senang', 'bahagia', 'gembira', 'suka', 'bagus', 'hebat'];
    const negativeWords = ['sedih', 'stres', 'cemas', 'takut', 'khawatir', 'lelah'];

    const lowerText = text.toLowerCase();
    const hasPositive = positiveWords.some((word) => lowerText.includes(word));
    const hasNegative = negativeWords.some((word) => lowerText.includes(word));

    let sentiment = 'netral';
    if (hasPositive && !hasNegative) sentiment = 'positif';
    else if (hasNegative && !hasPositive) sentiment = 'negatif';
    else if (hasPositive && hasNegative) sentiment = 'campuran';

    const summaries: { [key: string]: string } = {
      positif:
        '✨ Dari tulisanmu, terlihat kamu sedang dalam suasana hati yang baik! Pertahankan energi positif ini dan jangan lupa untuk tetap bersyukur dengan hal-hal kecil di sekitarmu.',
      negatif:
        '💙 Sepertinya kamu sedang menghadapi masa yang cukup berat. Ingat, perasaan ini sementara dan wajar dirasakan. Cobalah untuk berbicara dengan orang terdekat atau istirahat sejenak.',
      campuran:
        '🌈 Perasaanmu saat ini cukup kompleks - ada suka dan duka yang bercampur. Ini sangat normal! Fokus pada hal-hal yang bisa kamu kontrol dan jangan terlalu keras pada diri sendiri.',
      netral:
        '📝 Kamu sepertinya dalam kondisi yang stabil. Terus ekspresikan perasaanmu melalui jurnal ini untuk lebih memahami dirimu sendiri.',
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
    setCurrentEntry('');
    setGeneratedSummary('');
  };

  const handleDeleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-xl flex items-center justify-center shadow-md">
              <BookHeart className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Journal Mood
            </h1>
          </div>
          <p className="text-gray-600 ml-13">
            Tulis perasaanmu dan dapatkan insight dari AI
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Apa yang kamu rasakan hari ini?
          </h2>

          <textarea
            value={currentEntry}
            onChange={(e) => setCurrentEntry(e.target.value)}
            placeholder="Tulis apapun yang ada di pikiranmu... Tidak ada yang salah atau benar di sini."
            className="w-full h-48 md:h-64 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-gray-800 placeholder-gray-400"
          />

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <button
              onClick={handleGenerateSummary}
              disabled={!currentEntry.trim() || isGenerating}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-secondary-600 to-primary-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:transform-none font-semibold"
            >
              <Sparkles className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Menganalisis...' : 'Analisis dengan AI'}</span>
            </button>

            <button
              onClick={handleSaveEntry}
              disabled={!currentEntry.trim()}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-900 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
            >
              <Save className="w-5 h-5" />
              <span>Simpan</span>
            </button>
          </div>

          {generatedSummary && (
            <div className="mt-6 p-4 md:p-6 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl border-2 border-primary-200">
              <div className="flex items-start space-x-3">
                <Sparkles className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Rangkuman AI</h3>
                  <p className="text-gray-700 leading-relaxed">{generatedSummary}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Jurnal Sebelumnya</h2>

          {entries.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 md:p-12 text-center shadow-md">
              <BookHeart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                Belum ada jurnal. Mulai tulis perasaanmu hari ini!
              </p>
            </div>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white rounded-2xl p-4 md:p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm text-gray-500">{formatDate(entry.date)}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteEntry(entry.id)}
                    className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="Hapus jurnal"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-gray-800 leading-relaxed mb-4 whitespace-pre-wrap">
                  {entry.content}
                </p>

                {entry.summary && (
                  <div className="p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg border-l-4 border-primary-500">
                    <p className="text-sm font-semibold text-primary-800 mb-1">
                      AI Summary
                    </p>
                    <p className="text-sm text-gray-700">{entry.summary}</p>
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
