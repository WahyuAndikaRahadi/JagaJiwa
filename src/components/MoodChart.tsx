// FILE: MoodChart.tsx (REVISI FINAL + OPTIMASI)

import { useState, useMemo } from 'react';
import { BarChart3 } from 'lucide-react';

interface MoodChartProps {
  moodData: { [key: string]: string };
  currentMonth: number;
  currentYear: number;
}

// Utilitas untuk mendapatkan daftar kunci tanggal YYYY-MM-DD
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

// Daftar Nama Bulan
const monthNames = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

type PeriodType = 7 | 30 | 'all' | 'month';

function MoodChart({ moodData, currentMonth, currentYear }: MoodChartProps) {
  // State
  const [period, setPeriod] = useState<PeriodType>(7);
  const [selectedMonthYear, setSelectedMonthYear] = useState<string>(`${currentYear}-${currentMonth}`);

  const moodValues: { [key: string]: number } = {
    'very-happy': 5, 'happy': 4, 'neutral': 3, 'sad': 2, 'very-sad': 1,
  };

  // FUNGSI FILTER UTAMA
  const filterMoodData = (data: { [key: string]: string }, filterPeriod: PeriodType, monthYearFilter: string): { [key: string]: string } => {
    if (filterPeriod === 'all') {
      return data;
    }

    if (filterPeriod === 'month') {
      // monthYearFilter format: YYYY-BulanIndeks (contoh: 2025-9)
      const [year, monthIndexStr] = monthYearFilter.split('-');
      const monthIndex = parseInt(monthIndexStr);

      // Format prefix yang dicari (YYYY-MM)
      const prefix = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;

      const filtered: { [key: string]: string } = {};
      for (const key in data) {
        // Key format: YYYY-MM-DD
        if (key.startsWith(prefix)) {
          filtered[key] = data[key];
        }
      }
      return filtered;
    }

    // Filter 7 atau 30 hari terakhir (menggunakan getDateKeys)
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

  // ⭐️ OPTIMASI: useMemo terpisah untuk menghitung bulan yang tersedia.
  // Hanya dieksekusi ulang jika moodData berubah.
  const availableMonths = useMemo(() => {
    const months = new Set<string>(); // Format: YYYY-M (M adalah 0-11)
    for (const key in moodData) {
      const date = new Date(key);

      if (!isNaN(date.getTime())) {
        // Gunakan date.getUTCMonth() jika Anda yakin ingin mengabaikan Timezone
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
      // Urutkan dari bulan terbaru ke terlama
      .sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        return b.month - a.month;
      });

  }, [moodData]);

  // 🔴 LOGIC MEMO UTAMA: Menghitung semua statistik berdasarkan filter
  const { average, distribution, totalDays } = useMemo(() => {
    // 1. Filter data terlebih dahulu
    const filteredMoodData = filterMoodData(moodData, period, selectedMonthYear);

    // 2. Kalkulasi statistik dari data yang sudah difilter
    let sum = 0;
    const dist: { [key: string]: number } = {
      'very-happy': 0, 'happy': 0, 'neutral': 0, 'sad': 0, 'very-sad': 0,
    };
    let daysLoggedCount = 0;

    for (const dateKey in filteredMoodData) {
      const mood = filteredMoodData[dateKey];
      if (mood) {
        dist[mood]++;
        sum += (moodValues[mood] || 0);
        daysLoggedCount++;
      }
    }

    const avg = daysLoggedCount === 0 ? 0 : (sum / daysLoggedCount);

    return {
      average: avg.toFixed(1), // Mengembalikan string yang sudah diformat
      distribution: dist,
      totalDays: daysLoggedCount,
    };
  }, [moodData, period, selectedMonthYear]); // Dependencies yang memicu perhitungan filter

  // Variabel untuk menentukan bulan/tahun saat ini
  const currentMonthYearDefault = `${currentYear}-${currentMonth}`;

  // Menentukan label periode saat ini
  const periodLabel = period === 7 ? '7 Hari Terakhir' :
    period === 30 ? '30 Hari Terakhir' :
      period === 'all' ? 'Sepanjang Waktu' :
        availableMonths.find(m => m.value === selectedMonthYear)?.label || 'Bulan Dipilih';


  const moodLabels: { [key: string]: string } = {
    'very-happy': 'Sangat Senang', 'happy': 'Senang', 'neutral': 'Netral',
    'sad': 'Sedih', 'very-sad': 'Sangat Sedih',
  };
  const moodColors: { [key: string]: string } = {
    'very-happy': 'bg-green-500', 'happy': 'bg-emerald-500', 'neutral': 'bg-yellow-500',
    'sad': 'bg-orange-500', 'very-sad': 'bg-red-500',
  };

  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg">

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-6 h-6 text-primary-600" />
          <h3 className="text-lg md:text-xl font-bold text-gray-900">
            Statistik Mood
          </h3>
        </div>
      </div>

      {/* Tombol Pemilih Periode */}
      <div className="mb-4">
        <div className="flex justify-around bg-gray-100 rounded-lg p-1 overflow-x-auto">
          {/* Tombol 7 Hari */}
          <button
            onClick={() => { setPeriod(7); setSelectedMonthYear(currentMonthYearDefault); }}
            className={`flex-shrink-0 px-3 py-2 rounded-md text-sm font-medium transition-all ${period === 7 ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
          > 7 Hari </button>
          {/* Tombol 30 Hari */}
          <button
            onClick={() => { setPeriod(30); setSelectedMonthYear(currentMonthYearDefault); }}
            className={`flex-shrink-0 px-3 py-2 rounded-md text-sm font-medium transition-all ${period === 30 ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
          > 30 Hari </button>
          {/* Tombol Semua Waktu */}
          <button
            onClick={() => { setPeriod('all'); setSelectedMonthYear(currentMonthYearDefault); }}
            className={`flex-shrink-0 px-3 py-2 rounded-md text-sm font-medium transition-all ${period === 'all' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
          > Semua Waktu </button>
          {/* Dropdown Filter Bulan */}
          <select
            // Nilai yang ditampilkan adalah bulan yang sedang difilter
            value={period === 'month' ? selectedMonthYear : currentMonthYearDefault}
            onChange={(e) => { setPeriod('month'); setSelectedMonthYear(e.target.value); }}
            className={`flex-shrink-0 appearance-none bg-gray-100 px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-all ${period === 'month' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            {/* Menampilkan Bulan saat ini sebagai default jika belum ada data lain */}
            {availableMonths.length === 0 && (
              <option value={currentMonthYearDefault}>{monthNames[currentMonth]} {currentYear}</option>
            )}

            {availableMonths.map(month => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Rata-rata Mood */}
      <div className="mb-6 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl">
        <p className="text-sm text-gray-600 mb-1">Rata-rata Mood</p>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl md:text-4xl font-bold text-gray-900">
            {average}
          </span>
          <span className="text-sm text-gray-500">/ 5.0</span>
        </div>
      </div>

      {/* Distribusi Mood */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-gray-700 mb-3">
          Distribusi Mood ({periodLabel})
        </p>
        {totalDays === 0 ? (
          <div className="text-center py-4 text-gray-500">
            <p className="text-sm">Belum ada data mood yang dicatat untuk periode ini.</p>
          </div>
        ) : (
          Object.entries(distribution).map(([mood, count]) => {
            const percentage = totalDays > 0 ? (count / totalDays) * 100 : 0;
            return (
              <div key={mood} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{moodLabels[mood]}</span>
                  <span className="font-semibold text-gray-900">
                    {count} hari ({Math.round(percentage)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
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
    </div>
  );
}

export default MoodChart;