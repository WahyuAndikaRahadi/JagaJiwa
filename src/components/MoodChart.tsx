import { useState } from 'react';
import { BarChart3 } from 'lucide-react';

interface MoodChartProps {
  moodData: { [key: string]: string };
}

function MoodChart({ moodData }: MoodChartProps) {
  const [period, setPeriod] = useState<'7' | '30'>('7');

  const moodValues: { [key: string]: number } = {
    'very-happy': 5,
    'happy': 4,
    'neutral': 3,
    'sad': 2,
    'very-sad': 1,
  };

  const calculateAverage = () => {
    const days = Object.keys(moodData).slice(-parseInt(period));
    if (days.length === 0) return 0;

    const sum = days.reduce((acc, day) => {
      const mood = moodData[day];
      return acc + (moodValues[mood] || 0);
    }, 0);

    return (sum / days.length).toFixed(1);
  };

  const getMoodDistribution = () => {
    const days = Object.keys(moodData).slice(-parseInt(period));
    const distribution: { [key: string]: number } = {
      'very-happy': 0,
      'happy': 0,
      'neutral': 0,
      'sad': 0,
      'very-sad': 0,
    };

    days.forEach((day) => {
      const mood = moodData[day];
      if (mood) distribution[mood]++;
    });

    return distribution;
  };

  const distribution = getMoodDistribution();
  const totalDays = Object.values(distribution).reduce((a, b) => a + b, 0);

  const moodLabels: { [key: string]: string } = {
    'very-happy': 'Sangat Senang',
    'happy': 'Senang',
    'neutral': 'Netral',
    'sad': 'Sedih',
    'very-sad': 'Sangat Sedih',
  };

  const moodColors: { [key: string]: string } = {
    'very-happy': 'bg-green-500',
    'happy': 'bg-emerald-500',
    'neutral': 'bg-yellow-500',
    'sad': 'bg-orange-500',
    'very-sad': 'bg-red-500',
  };

  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-6 h-6 text-primary-600" />
          <h3 className="text-lg md:text-xl font-bold text-gray-900">
            Statistik Mood
          </h3>
        </div>

        <div className="flex space-x-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setPeriod('7')}
            className={`px-3 md:px-4 py-2 rounded-md text-sm font-medium transition-all ${
              period === '7'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            7 Hari
          </button>
          <button
            onClick={() => setPeriod('30')}
            className={`px-3 md:px-4 py-2 rounded-md text-sm font-medium transition-all ${
              period === '30'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            30 Hari
          </button>
        </div>
      </div>

      <div className="mb-6 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl">
        <p className="text-sm text-gray-600 mb-1">Rata-rata Mood</p>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl md:text-4xl font-bold text-gray-900">
            {calculateAverage()}
          </span>
          <span className="text-sm text-gray-500">/ 5.0</span>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-gray-700 mb-3">
          Distribusi Mood ({period} Hari Terakhir)
        </p>
        {Object.entries(distribution).map(([mood, count]) => {
          const percentage = totalDays > 0 ? (count / totalDays) * 100 : 0;
          return (
            <div key={mood} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">{moodLabels[mood]}</span>
                <span className="font-semibold text-gray-900">
                  {count} hari
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
        })}
      </div>

      {totalDays === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">
            Belum ada data mood untuk periode ini
          </p>
        </div>
      )}
    </div>
  );
}

export default MoodChart;
