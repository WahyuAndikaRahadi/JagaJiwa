interface CalendarProps {
  moodData: { [key: string]: string };
  onDateClick?: (date: number) => void;
}

function Calendar({ moodData, onDateClick }: CalendarProps) {
  const daysInMonth = 30;
  const firstDayOffset = 2;
  const weekDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

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

    for (let i = 0; i < firstDayOffset; i++) {
      days.push(
        <div key={`empty-${i}`} className="aspect-square"></div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const mood = moodData[day];
      const emoji = mood ? moodEmojis[mood] : '';
      const colorClass = mood ? moodColors[mood] : 'bg-gray-50 border-gray-200';

      days.push(
        <button
          key={day}
          onClick={() => onDateClick?.(day)}
          className={`aspect-square rounded-lg border-2 ${colorClass} hover:scale-110 transition-transform duration-200 flex flex-col items-center justify-center cursor-pointer shadow-sm hover:shadow-md`}
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
      <div className="mb-4">
        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
          Mood Kalender
        </h3>
        <p className="text-sm text-gray-600">
          Klik tanggal untuk melihat detail
        </p>
      </div>

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

      <div className="grid grid-cols-7 gap-2">
        {renderDays()}
      </div>

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
