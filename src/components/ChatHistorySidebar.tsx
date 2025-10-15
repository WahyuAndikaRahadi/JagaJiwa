// File: ChatHistorySidebar.jsx
import React, { useState } from 'react';
import { MessageCircleHeart, Plus, X, Menu, Trash2 } from 'lucide-react'; // BARU: Import Trash2

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
  onDeleteHistory: (id: string | 'all') => void; // PROPS BARU
  currentChatId: string | null;
  onClose: () => void;
  onToggleSidebar: () => void;
  isOpen: boolean;
}

const moodColors: Record<HistorySummary['mood'], string> = {
  '😄': 'bg-emerald-100 text-emerald-700 border-emerald-300',
  '😊': 'bg-sky-100 text-sky-700 border-sky-300',
  '😐': 'bg-gray-100 text-gray-700 border-gray-300',
  '😔': 'bg-amber-100 text-amber-700 border-amber-300',
  '😢': 'bg-red-100 text-red-700 border-red-700',
};

const allMoods: MoodFilter[] = ['😄', '😊', '😐', '😔', '😢'];

const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({
  history,
  onSelectHistory,
  onStartNewSession,
  onDeleteHistory, // DESTRUCTURE PROPS BARU
  currentChatId,
  onClose,
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
        fixed inset-y-0 left-0 z-40 bg-white border-r border-gray-200 overflow-y-auto 
        flex-shrink-0 flex flex-col shadow-lg
        md:top-16 md:bottom-0
        transition-all duration-300 ease-in-out
        w-full max-w-xs md:max-w-72
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:static lg:h-auto lg:top-auto lg:bottom-auto
        ${isOpen ? 'lg:w-72 lg:translate-x-0' : 'lg:w-16 lg:translate-x-0 lg:overflow-visible'}
      `}
    >
      {/* Header Sidebar (Tetap Sama) */}
      <div
        className={`
          p-4 border-b flex items-center flex-shrink-0 h-16
          ${isOpen ? 'justify-between' : 'justify-center'}
          transition-all duration-300
        `}
      >
        {/* Tombol Menu */}
        <button
          onClick={onToggleSidebar}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition duration-150"
          aria-label="Toggle Riwayat"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Judul */}
        {isOpen && (
          <h2
            className={`
              text-lg font-semibold text-gray-800 flex items-center absolute left-16
              transition-opacity duration-150
              ${isOpen ? 'opacity-100' : 'opacity-0 lg:static lg:opacity-100'}
            `}
          >
            Riwayat Curhat
          </h2>
        )}

        {/* Tombol Close (Mobile) */}
        <button
          onClick={onClose}
          className={`
            text-gray-500 hover:text-gray-900 p-1 rounded-md transition-opacity duration-150
            ${isOpen ? 'md:hidden' : 'hidden'}
          `}
          aria-label="Tutup Sidebar"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Konten Sidebar */}
      <div className={`flex-grow flex flex-col overflow-y-auto ${isOpen ? 'p-3' : 'hidden'}`}>
        {/* Tombol Curhat Baru (Tetap Sama) */}
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

        {/* Filter Emosi (Tetap Sama) */}
        <div className="pb-3 border-b mb-3 flex-shrink-0">
          <p className="text-sm font-medium text-gray-600 mb-2">
            Filter Perasaan ({history.length}):
          </p>
          <div className="flex flex-wrap gap-2">
            {/* Tombol Semua */}
            <button
              onClick={() => setMoodFilter('')}
              className={`text-xs py-1 px-3 rounded-full transition duration-150 border ${
                moodFilter === ''
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
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
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {mood} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Daftar Riwayat */}
        <div className="space-y-2 flex-grow overflow-y-auto">
          {filteredHistory.length === 0 ? (
            <p className="text-center text-sm text-gray-500 py-4">
              {moodFilter === ''
                ? 'Belum ada riwayat sesi.'
                : `Tidak ada sesi dengan mood ${moodFilter}.`}
            </p>
          ) : (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectHistory(item.id)}
                className={`p-3 rounded-xl cursor-pointer transition duration-150 group relative ${ // Tambah 'group relative'
                  item.id === currentChatId
                    ? 'bg-emerald-50 border-2 border-emerald-500 shadow-md'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                {/* Konten Riwayat */}
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`text-xl p-1 rounded-full ${moodColors[item.mood]} shadow-sm`}>
                    {item.mood}
                  </span>
                  <span className="text-sm font-medium text-gray-800 flex-grow">
                    Sesi{' '}
                    {new Date(item.date).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2 mt-1 flex justify-between">
                  <span className="text-gray-700 font-normal">{item.summary}</span>
                  <span className="text-gray-400 font-light ml-2 flex-shrink-0">
                    {new Date(item.date).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </p>
                
                {/* Tombol Hapus per Sesi (BARU) */}
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // Penting: mencegah onSelectHistory terpanggil
                        if(window.confirm("Yakin ingin menghapus sesi curhat ini?")) {
                            onDeleteHistory(item.id);
                        }
                    }}
                    className="absolute top-1 right-1 p-1 text-red-400 hover:text-red-600 transition duration-150 opacity-0 group-hover:opacity-100 rounded-full bg-white/70 hover:bg-white"
                    aria-label="Hapus Sesi"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
        
        {/* BARU: Footer dengan Tombol Hapus Semua */}
        {history.length > 0 && isOpen && (
            <div className="p-3 border-t mt-auto flex-shrink-0">
                <button
                    onClick={() => onDeleteHistory('all')}
                    className="w-full flex items-center justify-center py-2 px-4 text-sm font-medium rounded-lg text-red-700 bg-red-100 hover:bg-red-200 transition duration-150"
                >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Hapus Semua Riwayat
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistorySidebar;