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
  
  // 1. Hitung jumlah hari dalam bulan
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // 2. Tentukan hari pertama bulan (0=Min, 1=Sen, ...)
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

  const moodColors: { [key: string]: string } = {
    'very-happy': 'bg-green-100 border-green-300',
    'happy': 'bg-emerald-100 border-emerald-300',
    'neutral': 'bg-yellow-100 border-yellow-300',
    'sad': 'bg-orange-100 border-orange-300',
    'very-sad': 'bg-red-100 border-red-300',
  };

  const renderDays = () => {
    const days = [];
    
    // Offset untuk hari pertama (tanggal 1 diletakkan di hari yang benar)
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className="aspect-square"></div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = formatDateKey(currentYear, currentMonth, day);
      const mood = moodData[dateKey];
      const emoji = mood ? moodEmojis[mood] : '';
      const colorClass = mood ? moodColors[mood] : 'bg-gray-50 border-gray-200';
      
      const isToday = dateKey === TODAY_KEY;
      const isPastOrPresent = new Date(currentYear, currentMonth, day) <= TODAY;

      // Gaya untuk hari ini
      const todayClass = isToday ? 'border-primary-500 ring-2 ring-primary-500' : '';
      
      // Gaya untuk tanggal di masa depan (tidak dapat diklik)
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
          <span className="text-xs md:text-sm font-semibold text-gray-700">
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
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg">
      
      {/* Header Kalender */}
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={onPrevMonth}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition"
          aria-label="Bulan Sebelumnya"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-lg md:text-xl font-bold text-gray-900">
          {monthNames[currentMonth]} {currentYear}
        </h3>
        <button 
          onClick={onNextMonth}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition"
          aria-label="Bulan Selanjutnya"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      
      <p className="text-sm text-gray-600 text-center mb-4">
        Klik tanggal untuk mengisi mood.
      </p>

      {/* Nama Hari */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs md:text-sm font-semibold text-gray-600 py-2"
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
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center mb-3">Legenda Mood</p>
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          {Object.entries(moodEmojis).map(([key, emoji]) => (
            <div
              key={key}
              className="flex items-center space-x-1 text-xs md:text-sm"
            >
              <span className="text-lg">{emoji}</span>
              <span className="text-gray-600 capitalize">
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