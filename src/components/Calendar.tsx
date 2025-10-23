import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
    moodData: { [key: string]: string };
    onDateClick: (dateKey: string) => void;
    currentMonth: number;
    currentYear: number;
    onNextMonth: () => void;
    onPrevMonth: () => void;
}

const formatDateKey = (year: number, month: number, day: number) => {
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${monthStr}-${dayStr}`;
};

const Calendar: React.FC<CalendarProps> = ({
    moodData,
    onDateClick,
    currentMonth,
    currentYear,
    onNextMonth,
    onPrevMonth,
}) => {
    const TODAY = new Date();
    const TODAY_KEY = formatDateKey(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate());

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const weekDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const moodEmojis: { [key: string]: string } = {
        'very-happy': '😄',
        'happy': '😊',
        'neutral': '😐',
        'sad': '😔',
        'very-sad': '😢',
    };

    // --- LIGHT MODE PALETTE (Lebih Cerah dan Estetik) ---
    const moodColorsLight: { [key: string]: string } = {
        'very-happy': 'bg-emerald-300/80 border-emerald-400 text-emerald-900',
        'happy': 'bg-cyan-300/80 border-cyan-400 text-cyan-900',
        'neutral': 'bg-amber-300/80 border-amber-400 text-amber-900',
        'sad': 'bg-indigo-300/80 border-indigo-400 text-indigo-900',
        'very-sad': 'bg-rose-300/80 border-rose-400 text-rose-900',
    };

    // --- DARK MODE PALETTE ---
    const moodColorsDark: { [key: string]: string } = {
        'very-happy': 'bg-green-700/50 border-green-600 text-gray-100',
        'happy': 'bg-emerald-700/50 border-emerald-600 text-gray-100',
        'neutral': 'bg-yellow-700/50 border-yellow-600 text-gray-100',
        'sad': 'bg-indigo-700/50 border-indigo-600 text-gray-100',
        'very-sad': 'bg-red-700/50 border-red-600 text-gray-100',
    };

    const renderDays = () => {
        const days = [];

        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(
                <div key={`empty-${i}`} className="aspect-square"></div>
            );
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dateKey = formatDateKey(currentYear, currentMonth, day);
            const mood = moodData[dateKey];
            const emoji = mood ? moodEmojis[mood] : '';
            
            // Tentukan kelas warna berdasarkan mode
            let colorClass = 'bg-gray-100 border-gray-300 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300';
            let textColor = 'text-gray-800 dark:text-gray-200';

            if (mood) {
                // Terapkan Light Mode (default) dan Dark Mode (awalan dark:)
                const light = moodColorsLight[mood];
                const dark = moodColorsDark[mood];
                
                // Menggabungkan kelas light dan dark mode
                colorClass = `${light} dark:${dark}`;
                // Karena warna light mode sudah memiliki warna teks yang kontras, 
                // kita ambil warna teks dari moodColorsLight untuk light mode, 
                // dan override dengan dark:text-gray-100 untuk dark mode.
                textColor = `${moodColorsLight[mood].match(/text-\w+-\d+/)?.[0] || 'text-gray-900'} dark:text-gray-100`;
            }


            const isToday = dateKey === TODAY_KEY;
            const isPastOrPresent = new Date(currentYear, currentMonth, day) <= TODAY;

            // Primary color dari MoodTracker: #1ff498 (Emerald/Teal)
            const todayClass = isToday ? 'border-[#1ff498] ring-2 ring-[#1ff498] dark:border-[#0be084] dark:ring-[#0be084]' : '';

            const futureClass = !isPastOrPresent ? 'opacity-50 cursor-default pointer-events-none' : 'cursor-pointer hover:scale-105';

            days.push(
                <button
                    key={day}
                    onClick={() => isPastOrPresent && onDateClick(dateKey)}
                    className={`
                        aspect-square rounded-lg border-2
                        ${colorClass}
                        ${futureClass}
                        ${todayClass}
                        transition-all duration-200
                        flex flex-col items-center justify-center
                        shadow-sm hover:shadow-md
                    `}
                    disabled={!isPastOrPresent}
                >
                    <span className={`text-xs md:text-sm font-semibold ${textColor}`}>
                        {day}
                    </span>
                    {emoji && (
                        <span className="text-xl md:text-2xl mt-1">
                            {emoji}
                        </span>
                    )}
                </button>
            );
        }

        return days;
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 shadow-lg dark:shadow-xl dark:shadow-gray-950/50">
            {/* Header Kalender */}
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={onPrevMonth}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition"
                    aria-label="Bulan Sebelumnya"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">
                    {monthNames[currentMonth]} {currentYear}
                </h3>
                <button
                    onClick={onNextMonth}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition"
                    aria-label="Bulan Selanjutnya"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
                Klik tanggal untuk mengisi mood.
            </p>

            {/* Nama Hari */}
            <div className="grid grid-cols-7 gap-2 mb-2">
                {weekDays.map((day) => (
                    <div
                        key={day}
                        className="text-center text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-400 py-2"
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Tanggal */}
            <div className="grid grid-cols-7 gap-2">
                {renderDays()}
            </div>

            {/* Legenda */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-3">Legenda Mood</p>
                <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                    {Object.entries(moodEmojis).map(([key, emoji]) => (
                        <div
                            key={key}
                            className="flex items-center space-x-1 text-xs md:text-sm"
                        >
                            <span className="text-lg">{emoji}</span>
                            <span className="text-gray-600 dark:text-gray-300 capitalize">
                                {key.replace('-', ' ')}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Calendar;