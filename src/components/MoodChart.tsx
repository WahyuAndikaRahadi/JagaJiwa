import { useState, useMemo } from 'react';
import { BarChart3, Bot, Zap } from 'lucide-react'; 
import { GoogleGenAI } from "@google/genai"; 
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
const model = "gemini-2.5-flash";

interface MoodChartProps {
  moodData: { [key: string]: string };
  currentMonth: number;
  currentYear: number;
}

const getDateKeys = (daysAgo: number) => {
  const dates: string[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < daysAgo; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    dates.push(`${year}-${month}-${day}`);
  }
  return dates;
};

const monthNames = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

type PeriodType = 7 | 30 | 'all' | 'month';


function MoodChart({ moodData, currentMonth, currentYear }: MoodChartProps) {
  const [period, setPeriod] = useState<PeriodType>(7);
  const [selectedMonthYear, setSelectedMonthYear] = useState<string>(`${currentYear}-${currentMonth}`);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // ---------------------

  const moodValues: { [key: string]: number } = {
    'very-happy': 5, 'happy': 4, 'neutral': 3, 'sad': 2, 'very-sad': 1,
  };

  const filterMoodData = (data: { [key: string]: string }, filterPeriod: PeriodType, monthYearFilter: string): { [key: string]: string } => {
    if (filterPeriod === 'all') {
      return data;
    }

    if (filterPeriod === 'month') {
      const [year, monthIndexStr] = monthYearFilter.split('-');
      const monthIndex = parseInt(monthIndexStr);
      const prefix = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;

      const filtered: { [key: string]: string } = {};
      for (const key in data) {
        if (key.startsWith(prefix)) {
          filtered[key] = data[key];
        }
      }
      return filtered;
    }

    const daysToFilter = filterPeriod === 7 ? 7 : 30;
    const relevantDaysKeys = getDateKeys(daysToFilter);

    const filtered: { [key: string]: string } = {};
    for (const dateKey of relevantDaysKeys) {
      if (data[dateKey]) {
        filtered[dateKey] = data[dateKey];
      }
    }
    return filtered;
  };

  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    for (const key in moodData) {
      const date = new Date(key);
      if (!isNaN(date.getTime())) {
        months.add(`${date.getFullYear()}-${date.getMonth()}`);
      }
    }

    return Array.from(months)
      .map(key => {
        const [year, monthIndex] = key.split('-').map(Number);
        return {
          value: key,
          label: `${monthNames[monthIndex]} ${year}`,
          year: year,
          month: monthIndex
        };
      })
      .sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        return b.month - a.month;
      });
  }, [moodData]);

  const { average, distribution, totalDays, dominantMoodKey } = useMemo(() => {
    const filteredMoodData = filterMoodData(moodData, period, selectedMonthYear);

    let sum = 0;
    const dist: { [key: string]: number } = {
      'very-happy': 0, 'happy': 0, 'neutral': 0, 'sad': 0, 'very-sad': 0,
    };
    let daysLoggedCount = 0;
    let maxCount = -1;
    let dominantKey: string | null = null;

    for (const dateKey in filteredMoodData) {
      const mood = filteredMoodData[dateKey];
      if (mood) {
        dist[mood]++;
        sum += (moodValues[mood] || 0);
        daysLoggedCount++;

        if (dist[mood] > maxCount) {
            maxCount = dist[mood];
            dominantKey = mood;
        }
      }
    }

    const avg = daysLoggedCount === 0 ? 0 : (sum / daysLoggedCount);
    const finalDominantMoodKey = dominantKey || 'neutral';


    return {
      average: avg.toFixed(1),
      distribution: dist,
      totalDays: daysLoggedCount,
      dominantMoodKey: finalDominantMoodKey,
    };
  }, [moodData, period, selectedMonthYear]);

  const currentMonthYearDefault = `${currentYear}-${currentMonth}`;

  const moodLabels: { [key: string]: string } = {
    'very-happy': 'Sangat Senang', 'happy': 'Senang', 'neutral': 'Netral',
    'sad': 'Sedih', 'very-sad': 'Sangat Sedih',
  };

  const dominantMoodLabel = moodLabels[dominantMoodKey] || 'Netral';


  const periodLabel = period === 7 ? '7 Hari Terakhir' :
    period === 30 ? '30 Hari Terakhir' :
      period === 'all' ? 'Sepanjang Waktu' :
        availableMonths.find(m => m.value === selectedMonthYear)?.label || 'Bulan Dipilih';


  
  const moodColors: { [key: string]: string } = {
    'very-happy': 'bg-green-500 dark:bg-green-400',
    'happy': 'bg-emerald-500 dark:bg-emerald-400',
    'neutral': 'bg-yellow-500 dark:bg-yellow-400',
    'sad': 'bg-orange-500 dark:bg-orange-400',
    'very-sad': 'bg-red-500 dark:bg-red-400',
  };
  const primaryColor = 'text-[#1ff498] dark:text-[#0be084]';

  const generateSummary = async () => {
    if (totalDays === 0) {
      setAiSummary("Tidak ada data mood yang tercatat untuk periode ini. Tidak dapat membuat ringkasan.");
      return;
    }

    setIsLoading(true);
    setAiSummary(null);

    const distributionText = Object.entries(distribution)
      .filter(([mood, count]) => count > 0)
      .map(([mood, count]) => {
        const percentage = totalDays > 0 ? ((count / totalDays) * 100).toFixed(1) : 0;
        return `${moodLabels[mood]} (${count} hari, ${percentage}%)`;
      })
      .join(', ');

    const prompt = `
      Anda adalah seorang asisten AI yang bertugas menganalisis data mood dari pengguna.
      Buatlah ringkasan singkat, insightful, dan memotivasi dalam BAHASA INDONESIA, berdasarkan data berikut:
      
      1. Periode Analisis: ${periodLabel}
      2. Jumlah Hari Tercatat: ${totalDays} hari
      3. Rata-rata Mood (Skala 1-5): ${average}
      4. Dominasi Mood: ${dominantMoodLabel}
      5. Distribusi Mood Lengkap: ${distributionText}
      
      Analisis Anda harus mencakup:
      - Tren keseluruhan berdasarkan Rata-rata Mood.
      - Komentar tentang Mood Dominan.
      - Sebuah saran kecil atau kalimat motivasi.
      
      Batasi output Anda dalam 3-4 kalimat paragraf tunggal.
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });
        
        setAiSummary(response.text!.trim());
    } catch (error) {
      console.error("Gemini API Error:", error);
      setAiSummary("Maaf, gagal mengambil ringkasan AI. Silakan coba lagi. (Cek kunci API di konsol)");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 shadow-lg dark:shadow-xl dark:shadow-gray-950/50">

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <BarChart3 className={`w-6 h-6 ${primaryColor}`} />
          <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">
            Statistik Mood
          </h3>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex justify-around bg-gray-100 dark:bg-gray-700 rounded-lg p-1 overflow-x-auto">
          <button
            onClick={() => { setPeriod(7); setSelectedMonthYear(currentMonthYearDefault); setAiSummary(null); }}
            className={`flex-shrink-0 px-3 py-2 rounded-md text-sm font-medium transition-all ${period === 7 ? 'bg-white dark:bg-gray-900 text-primary-600 dark:text-[#1ff498] shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
          > 7 Hari </button>
          <button
            onClick={() => { setPeriod(30); setSelectedMonthYear(currentMonthYearDefault); setAiSummary(null); }}
            className={`flex-shrink-0 px-3 py-2 rounded-md text-sm font-medium transition-all ${period === 30 ? 'bg-white dark:bg-gray-900 text-primary-600 dark:text-[#1ff498] shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
          > 30 Hari </button>
          <select
            value={period === 'month' ? selectedMonthYear : currentMonthYearDefault}
            onChange={(e) => { setPeriod('month'); setSelectedMonthYear(e.target.value); setAiSummary(null); }}
            className={`flex-shrink-0 appearance-none bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-all 
            ${period === 'month' ? 'bg-white dark:bg-gray-900 text-primary-600 dark:text-[#1ff498] shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
              } dark:text-gray-300`}
          >
            {availableMonths.length === 0 && (
              <option value={currentMonthYearDefault} className='dark:bg-gray-800 dark:text-gray-300'>{monthNames[currentMonth]} {currentYear}</option>
            )}
            {availableMonths.map(month => (
              <option key={month.value} value={month.value} className='dark:bg-gray-800 dark:text-gray-300'>
                {month.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => { setPeriod('all'); setSelectedMonthYear(currentMonthYearDefault); setAiSummary(null); }}
            className={`flex-shrink-0 px-3 py-2 rounded-md text-sm font-medium transition-all ${period === 'all' ? 'bg-white dark:bg-gray-900 text-primary-600 dark:text-[#1ff498] shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
          > Semua Waktu </button>
        </div>
      </div>

      <div className="mb-6 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-indigo-900/40 dark:to-teal-900/40 rounded-xl">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Rata-rata Mood</p>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
            {average}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">/ 5.0</span>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Distribusi Mood ({periodLabel})
        </p>
        {totalDays === 0 ? (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            <p className="text-sm">Belum ada data mood yang dicatat untuk periode ini.</p>
          </div>
        ) : (
          Object.entries(distribution).map(([mood, count]) => {
            const percentage = totalDays > 0 ? (count / totalDays) * 100 : 0;
            return (
              <div key={mood} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-300">{moodLabels[mood]}</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {count} hari ({Math.round(percentage)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full ${moodColors[mood]} transition-all duration-500 rounded-full`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {totalDays > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                  onClick={generateSummary}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-xl text-white font-bold transition-all duration-300
                  bg-gradient-to-r from-[#50b7f7] to-[#1ff498] hover:from-[#1ff498] hover:to-[#50b7f7]
                  disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                  {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <Zap className="w-5 h-5 animate-pulse" />
                        <span>Menganalisis...</span>
                      </div>
                  ) : (
                      <>
                          <Bot className="w-5 h-5" />
                          <span>Dapatkan Ringkasan AI ({periodLabel})</span>
                      </>
                  )}
              </button>
          </div>
      )}

      {aiSummary && (
          <div className="mt-4 p-4 rounded-xl border-2 border-[#50b7f7] dark:border-[#1ff498] bg-white dark:bg-gray-700/50 shadow-inner">
              <h4 className="text-md font-bold text-[#50b7f7] dark:text-[#1ff498] mb-2 flex items-center space-x-2">
                  <Bot className="w-4 h-4" />
                  <span>Analisis Dengan</span>
              </h4>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm md:text-base">
                  {aiSummary}
              </p>
          </div>
      )}
    </div>
  );
}

export default MoodChart;