import { useState, useEffect } from 'react';
import Calendar from '../components/Calendar';
import MoodChart from '../components/MoodChart';
import { Smile, Meh, Frown } from 'lucide-react';

function MoodTracker() {
  const [moodData, setMoodData] = useState<{ [key: string]: string }>(() => {
    const saved = localStorage.getItem('moodData');
    return saved ? JSON.parse(saved) : generateSampleData();
  });

  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem('moodData', JSON.stringify(moodData));
  }, [moodData]);

  function generateSampleData() {
    const moods = ['very-happy', 'happy', 'neutral', 'sad', 'very-sad'];
    const data: { [key: string]: string } = {};

    for (let i = 1; i <= 30; i++) {
      if (Math.random() > 0.2) {
        data[i] = moods[Math.floor(Math.random() * moods.length)];
      }
    }

    return data;
  }

  const handleDateClick = (date: number) => {
    setSelectedDate(date);
  };

  const handleMoodSelect = (mood: string) => {
    if (selectedDate) {
      setMoodData((prev) => ({
        ...prev,
        [selectedDate]: mood,
      }));
      setSelectedDate(null);
    }
  };

  const moodOptions = [
    { value: 'very-happy', label: 'Sangat Senang', emoji: '😄', color: 'from-green-500 to-emerald-500' },
    { value: 'happy', label: 'Senang', emoji: '😊', color: 'from-emerald-500 to-teal-500' },
    { value: 'neutral', label: 'Netral', emoji: '😐', color: 'from-yellow-500 to-amber-500' },
    { value: 'sad', label: 'Sedih', emoji: '😔', color: 'from-orange-500 to-red-500' },
    { value: 'very-sad', label: 'Sangat Sedih', emoji: '😢', color: 'from-red-500 to-rose-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-md">
              <Smile className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Mood Tracker
            </h1>
          </div>
          <p className="text-gray-600 ml-13">
            Pantau dan analisis perubahan suasana hatimu
          </p>
        </div>

        {selectedDate && (
          <div className="mb-6 bg-white rounded-2xl p-4 md:p-6 shadow-lg border-2 border-primary-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Bagaimana perasaanmu tanggal {selectedDate}?
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {moodOptions.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => handleMoodSelect(mood.value)}
                  className="group relative overflow-hidden rounded-xl p-4 bg-gray-50 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 border-2 border-gray-200 hover:border-primary-300 transition-all duration-200 transform hover:scale-105"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <span className="text-4xl transform group-hover:scale-110 transition-transform">
                      {mood.emoji}
                    </span>
                    <span className="text-xs md:text-sm font-medium text-gray-700 text-center">
                      {mood.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setSelectedDate(null)}
              className="mt-4 text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Batal
            </button>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          <Calendar moodData={moodData} onDateClick={handleDateClick} />
          <MoodChart moodData={moodData} />
        </div>

        <div className="mt-6 md:mt-8 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-6 md:p-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-md">
              <Meh className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Tips Tracking Mood
              </h3>
              <ul className="space-y-2 text-sm md:text-base text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="text-primary-600 font-bold">•</span>
                  <span>Catat mood-mu setiap hari untuk hasil yang lebih akurat</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary-600 font-bold">•</span>
                  <span>Perhatikan pola mood untuk mengidentifikasi pemicu stres</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary-600 font-bold">•</span>
                  <span>Gunakan fitur Journal untuk mencatat detail perasaanmu</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MoodTracker;
