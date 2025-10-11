import { MessageCircleHeart, Plus, X, Menu } from 'lucide-react';
import React, { useState } from 'react';

// ... (Interface dan type declarations yang sama)
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
    currentChatId: string | null;
    onClose: () => void; // Fungsi untuk menutup (hanya di mobile)
    onToggleSidebar: () => void; // Fungsi toggle (untuk desktop/hamburger)
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
    currentChatId,
    onClose,
    onToggleSidebar, 
    isOpen
}) => {
    const [moodFilter, setMoodFilter] = useState<MoodFilter>('');

    const filteredHistory = history.filter(item => {
        if (moodFilter === '') return true;
        return item.mood === moodFilter;
    });

    return (
        <div className={`
            // FIXED: Tambahkan md:top-16 di sini
            fixed inset-y-0 left-0 z-40 bg-white border-r border-gray-200 h-full overflow-y-auto flex-shrink-0 flex flex-col shadow-lg
            
            // Perbaikan agar sidebar mulai di bawah Navbar (tinggi Navbar = h-16)
            md:top-16 
            
            transition-all duration-300 ease-in-out

            // Mobile
            w-full max-w-xs md:max-w-72
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}

            // Desktop (lg)
            // Di desktop, kita perlu memastikan bahwa 'bottom' (karena ada fixed) juga diatur
            lg:static lg:h-auto lg:inset-y-0 
            ${isOpen ? 'lg:w-72 lg:translate-x-0' : 'lg:w-16 lg:translate-x-0 lg:overflow-visible'} 
        `}>

            {/* Header Sidebar (Selalu terlihat) */}
            <div className={`
                // Tambahkan h-16 agar tinggi header tetap konsisten dengan Navlink di desktop
                p-4 border-b flex items-center flex-shrink-0 
                ${isOpen ? 'justify-between' : 'justify-center'} 
                transition-all duration-300
            `}>
                
                {/* Tombol Hamburger/Menu (di Kiri Atas Sidebar) */}
                <button 
                    onClick={onToggleSidebar}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition duration-150"
                    aria-label="Toggle Riwayat"
                >
                    <Menu className="w-6 h-6" />
                </button>

                {/* Judul (Hanya tampil saat terbuka penuh) */}
                {isOpen && (
                    <h2 className={`text-lg font-semibold text-gray-800 flex items-center absolute left-16 transition-opacity duration-150 ${isOpen ? 'opacity-100' : 'opacity-0 lg:static lg:opacity-100'}`}>
                        Riwayat Curhat
                    </h2>
                )}

                {/* Tombol Close untuk Mobile (Hanya tampil saat terbuka) */}
                <button
                    onClick={onClose}
                    className={`text-gray-500 hover:text-gray-900 p-1 rounded-md transition-opacity duration-150 
                        ${isOpen && window.innerWidth < 768 ? '' : 'hidden'} // Hanya tampil di mobile saat sidebar terbuka
                        ${isOpen && window.innerWidth >= 768 ? 'md:hidden' : ''}
                    `}
                    aria-label="Tutup Sidebar"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Konten Sidebar - Hanya tampil jika terbuka penuh */}
            <div className={`flex-grow flex flex-col overflow-y-auto ${isOpen ? 'p-3' : 'hidden'}`}>
                
                {/* Tombol Curhat Baru */}
                <div className="mb-3 flex-shrink-0">
                    <button
                        onClick={onStartNewSession}
                        className="w-full flex items-center justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 transition duration-150 shadow-md"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Buat Ruangan Baru
                    </button>
                </div>

                {/* Filter Emosi */}
                <div className="pb-3 border-b mb-3 flex-shrink-0">
                    <p className="text-sm font-medium text-gray-600 mb-2">Filter Perasaan ({history.length}):</p>
                    <div className="flex flex-wrap gap-2">
                        {/* Tombol 'Semua' */}
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
                        {/* Tombol Emosi */}
                        {allMoods.map((mood) => {
                            const count = history.filter(item => item.mood === mood).length;
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
                            {moodFilter === '' ? 'Belum ada riwayat sesi.' : `Tidak ada sesi dengan mood ${moodFilter}.`}
                        </p>
                    ) : (
                        filteredHistory.map((item) => (
                            <div
                                key={item.id}
                                className={`p-3 rounded-xl cursor-pointer transition duration-150 ${
                                    item.id === currentChatId
                                        ? 'bg-emerald-50 border-2 border-emerald-500 shadow-md'
                                        : 'hover:bg-gray-50 border border-transparent'
                                }`}
                                onClick={() => onSelectHistory(item.id)}
                            >
                                <div className="flex items-center space-x-2 mb-1">
                                    <span className={`text-xl p-1 rounded-full ${moodColors[item.mood]} shadow-sm`}>
                                        {item.mood}
                                    </span>
                                    <span className="text-sm font-medium text-gray-800 flex-grow">
                                        Sesi {new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 line-clamp-2 mt-1 flex justify-between">
                                    <span className="text-gray-700 font-normal">{item.summary}</span>
                                    <span className="text-gray-400 font-light ml-2 flex-shrink-0">
                                        {new Date(item.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatHistorySidebar;