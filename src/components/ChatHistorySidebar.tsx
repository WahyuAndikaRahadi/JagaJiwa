import React, { useState } from 'react';
import { Plus, Menu, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

// ========================
// 🧩 Interface & Types
// ========================
interface HistorySummary {
  id: string;
  date: Date;
  mood: '😄' | '😊' | '😐' | '😔' | '😢';
  summary: string;
}

type MoodFilter = HistorySummary['mood'] | '';

interface ChatHistorySidebarProps {
  history: HistorySummary[];
  onSelectHistory: (id: string) => void;
  onStartNewSession: () => void;
  onDeleteHistory: (id: string | 'all') => void;
  currentChatId: string | null;
  onClose?: () => void;
  onToggleSidebar: () => void;
  isOpen: boolean;
}

// ========================
// 🎨 Mood Color Map
// ========================
const moodColors: Record<HistorySummary['mood'], string> = {
  '😄': 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700',
  '😊': 'bg-sky-100 text-sky-700 border-sky-300 dark:bg-sky-900/40 dark:text-sky-300 dark:border-sky-700',
  '😐': 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
  '😔': 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700',
  '😢': 'bg-red-100 text-red-700 border-red-700 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700',
};

const allMoods: MoodFilter[] = ['😄', '😊', '😐', '😔', '😢'];

// ========================
// 🧠 Komponen Sidebar
// ========================
const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({
  history,
  onSelectHistory,
  onStartNewSession,
  onDeleteHistory,
  currentChatId,
  onToggleSidebar,
  isOpen,
}) => {
  const [moodFilter, setMoodFilter] = useState<MoodFilter>('');

  const filteredHistory = history.filter((item) =>
    moodFilter === '' ? true : item.mood === moodFilter
  );

  return (
    <div
      className={`
        fixed inset-y-0 left-0 z-40 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 
        overflow-y-auto flex-shrink-0 flex flex-col shadow-lg
        md:top-16  transition-all duration-300 ease-in-out
        w-full max-w-xs md:max-w-72
        ${isOpen ? 'translate-x-0 top-16' : '-translate-x-full'}
        lg:static lg:h-auto lg:top-auto lg:bottom-auto
        ${isOpen ? 'lg:w-72 lg:translate-x-0' : 'lg:w-16 lg:translate-x-0 lg:overflow-visible'}
      `}
    >
      {/* ======================== */}
      {/* 🔹 Header Sidebar */}
      {/* ======================== */}
      <div
        className={`
          p-4 border-b border-gray-200 dark:border-gray-700 flex items-center flex-shrink-0 h-16
          ${isOpen ? 'justify-between' : 'justify-center'}
          transition-all duration-300
        `}
      >
        {/* Tombol Menu */}
        <button
          onClick={onToggleSidebar}
          className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition duration-150"
          aria-label="Toggle Riwayat"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Judul */}
        {isOpen && (
          <h2
            className={`
              text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center absolute left-16
              transition-opacity duration-150
              ${isOpen ? 'opacity-100' : 'opacity-0 lg:static lg:opacity-100'}
            `}
          >
            Riwayat Curhat
          </h2>
        )}
      </div>

      {/* ======================== */}
      {/* 🔹 Konten Sidebar */}
      {/* ======================== */}
      <div className={`flex-grow flex flex-col overflow-y-auto ${isOpen ? 'p-3' : 'hidden'}`}>
        {/* Tombol Curhat Baru */}
        <div className="mb-3 flex-shrink-0">
          <button
            onClick={onStartNewSession}
            className="w-full flex items-center justify-center py-2 px-4 border border-transparent 
                      text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 
                      transition duration-150 shadow-md"
          >
            <Plus className="w-4 h-4 mr-2" />
            Buat Ruangan Baru
          </button>
        </div>

        {/* Filter Emosi */}
        <div className="pb-3 border-b border-gray-200 dark:border-gray-700 mb-3 flex-shrink-0">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            Filter Perasaan ({history.length}):
          </p>

          <div className="flex flex-wrap gap-2">
            {/* Tombol Semua */}
            <button
              onClick={() => setMoodFilter('')}
              className={`text-xs py-1 px-3 rounded-full transition duration-150 border ${
                moodFilter === ''
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Semua
            </button>

            {/* Tombol per Mood */}
            {allMoods.map((mood) => {
              const count = history.filter((item) => item.mood === mood).length;
              if (count === 0) return null;

              return (
                <button
                  key={mood}
                  onClick={() => setMoodFilter(mood)}
                  className={`text-xs py-1 px-3 rounded-full transition duration-150 border ${
                    moodFilter === mood
                      ? `${moodColors[mood]} border-2 border-current shadow-md`
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {mood} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* ======================== */}
        {/* 🔹 Daftar Riwayat (Diubah untuk scroll setelah 10 item pada md/desktop) */}
        {/* ======================== */}
        <div 
            className={`
                space-y-2 flex-grow 
                ${history.length >= 8 ? 'md:max-h-[900px] md:overflow-y-auto' : 'overflow-y-auto'}
                /* Penjelasan:
                   - overflow-y-auto: Diperlukan untuk layar mobile/kecil, 
                     karena sidebar induk Anda memiliki 'overflow-y-auto' global.
                   - md:max-h-[900px]: Batas tinggi untuk 10 item (asumsi 90px/item) pada md ke atas.
                   - md:overflow-y-auto: Mengaktifkan scroll pada batas tinggi tersebut.
                   - Tambahan: Menggunakan ternary operator untuk memastikan 'overflow-y-auto' default
                     diaktifkan, tetapi batas tinggi hanya diaktifkan jika jumlah item > 10.
                */
            `}
        >
          {filteredHistory.length === 0 ? (
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
              {moodFilter === ''
                ? 'Belum ada riwayat sesi.'
                : `Tidak ada sesi dengan mood ${moodFilter}.`}
            </p>
          ) : (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectHistory(item.id)}
                className={`
                  p-3 rounded-xl cursor-pointer transition duration-150 group relative 
                  ${
                    item.id === currentChatId
                      ? 'bg-emerald-50 dark:bg-emerald-900/30 border-2 border-emerald-500 shadow-md'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent'
                  }
                `}
              >
                {/* Header Item */}
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`text-xl p-1 rounded-full ${moodColors[item.mood]} shadow-sm`}>
                    {item.mood}
                  </span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-100 flex-grow">
                    Sesi{' '}
                    {new Date(item.date).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>

                {/* Ringkasan */}
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1 flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300 font-normal">{item.summary}</span>
                  <span className="text-gray-400 dark:text-gray-500 font-light ml-2 flex-shrink-0">
                    {new Date(item.date).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </p>

                {/* Tombol Hapus per Sesi */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Yakin ingin menghapus sesi curhat ini?')) {
                      onDeleteHistory(item.id);
                    }
                  }}
                  className="absolute top-1 right-1 p-1 text-red-400 hover:text-red-600 dark:text-red-500 dark:hover:text-red-400 
                             transition duration-150 opacity-0 group-hover:opacity-100 
                             rounded-full bg-white/70 dark:bg-gray-800/70 hover:bg-white dark:hover:bg-gray-700"
                  aria-label="Hapus Sesi"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* ======================== */}
        {/* 🔹 Footer - Hapus Semua */}
        {/* ======================== */}
        {history.length > 0 && isOpen && (
          <div className="p-3 border-t border-gray-200 dark:border-gray-700 mt-auto flex-shrink-0">
            <button
              onClick={() => onDeleteHistory('all')}
              className="w-full flex items-center justify-center py-2 px-4 text-sm font-medium 
                         rounded-lg text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 
                         hover:bg-red-200 dark:hover:bg-red-800/40 transition duration-150"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Hapus Semua Riwayat
            </button>
          </div>
        )}
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
};

export default ChatHistorySidebar;