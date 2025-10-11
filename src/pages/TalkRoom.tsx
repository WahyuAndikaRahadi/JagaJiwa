import { useState, useEffect } from 'react';
import ChatWindow from '../components/ChatWindow';
import { MessageCircleHeart, AlertCircle } from 'lucide-react';

interface Message {
  role: 'ai' | 'user';
  text: string;
  timestamp: Date;
}

function TalkRoom() {
  const [conversation, setConversation] = useState<Message[]>(() => {
    const saved = localStorage.getItem('chatConversation');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
    }
    return [
      {
        role: 'ai',
        text: 'Hai! Aku di sini untuk mendengarkan curhatanmu. Ceritakan apa yang sedang kamu rasakan, aku siap mendengar tanpa menghakimi. 💙',
        timestamp: new Date(),
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('chatConversation', JSON.stringify(conversation));
  }, [conversation]);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    const responses = {
      stress: [
        'Saya mengerti bahwa kamu sedang merasa stres. Ingat, perasaan ini wajar dan sementara. Cobalah untuk menarik napas dalam-dalam beberapa kali. Apa yang membuatmu merasa stres?',
        'Stres memang berat, tapi kamu sudah melakukan langkah yang tepat dengan berbagi. Apakah ada sesuatu yang spesifik yang ingin kamu bicarakan?',
      ],
      sedih: [
        'Aku turut merasakan kesedihanmu. Tidak apa-apa untuk merasa sedih, ini adalah bagian dari kehidupan. Apa yang bisa membuatmu merasa sedikit lebih baik sekarang?',
        'Terima kasih sudah berbagi perasaanmu denganku. Kesedihan adalah emosi yang valid. Mau cerita lebih lanjut tentang apa yang membuatmu sedih?',
      ],
      senang: [
        'Wah, senang mendengar kabar baik darimu! 😊 Apa yang membuatmu senang hari ini?',
        'Itu luar biasa! Pertahankan energi positif ini. Cerita dong, apa yang terjadi?',
      ],
      cemas: [
        'Kecemasan bisa sangat mengganggu, tapi ingat bahwa kamu tidak sendirian. Coba fokus pada hal-hal yang bisa kamu kontrol. Apa yang membuatmu cemas?',
        'Saya di sini untukmu. Kecemasan adalah respons alami tubuh, tapi kita bisa menghadapinya bersama. Mau berbagi lebih detail?',
      ],
      terima_kasih: [
        'Sama-sama! Aku selalu di sini kapanpun kamu butuh. 💙',
        'Senang bisa membantu! Jangan ragu untuk kembali kapanpun ya.',
      ],
      default: [
        'Terima kasih sudah berbagi. Ceritakan lebih banyak, aku mendengarkan dengan seksama.',
        'Saya memahami. Apa lagi yang ingin kamu ceritakan?',
        'Menarik. Bagaimana perasaanmu tentang hal itu?',
        'Saya di sini untukmu. Lanjutkan ceritamu, aku mendengarkan.',
      ],
    };

    if (lowerMessage.includes('stres') || lowerMessage.includes('stress')) {
      return responses.stress[Math.floor(Math.random() * responses.stress.length)];
    } else if (lowerMessage.includes('sedih') || lowerMessage.includes('galau')) {
      return responses.sedih[Math.floor(Math.random() * responses.sedih.length)];
    } else if (
      lowerMessage.includes('senang') ||
      lowerMessage.includes('bahagia') ||
      lowerMessage.includes('gembira')
    ) {
      return responses.senang[Math.floor(Math.random() * responses.senang.length)];
    } else if (
      lowerMessage.includes('cemas') ||
      lowerMessage.includes('takut') ||
      lowerMessage.includes('khawatir')
    ) {
      return responses.cemas[Math.floor(Math.random() * responses.cemas.length)];
    } else if (
      lowerMessage.includes('terima kasih') ||
      lowerMessage.includes('makasih') ||
      lowerMessage.includes('thanks')
    ) {
      return responses.terima_kasih[
        Math.floor(Math.random() * responses.terima_kasih.length)
      ];
    } else {
      return responses.default[Math.floor(Math.random() * responses.default.length)];
    }
  };

  const handleSendMessage = (message: string) => {
    const userMessage: Message = {
      role: 'user',
      text: message,
      timestamp: new Date(),
    };

    setConversation((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const aiResponse: Message = {
        role: 'ai',
        text: generateAIResponse(message),
        timestamp: new Date(),
      };
      setConversation((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const handleClearChat = () => {
    if (confirm('Apakah kamu yakin ingin menghapus semua percakapan?')) {
      setConversation([
        {
          role: 'ai',
          text: 'Hai! Aku di sini untuk mendengarkan curhatanmu. Ceritakan apa yang sedang kamu rasakan, aku siap mendengar tanpa menghakimi. 💙',
          timestamp: new Date(),
        },
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
                <MessageCircleHeart className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Talk Room</h1>
            </div>
            <button
              onClick={handleClearChat}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Hapus Chat
            </button>
          </div>
          <p className="text-gray-600 ml-13">
            Ruang aman untuk berbagi perasaan dengan AI
          </p>
        </div>

        <div className="mb-6 bg-amber-50 border-l-4 border-amber-500 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-amber-900 font-medium mb-1">Catatan Penting</p>
            <p className="text-sm text-amber-800">
              Ini adalah simulasi AI untuk tujuan demonstrasi. Jika kamu mengalami masalah
              kesehatan mental yang serius, silakan hubungi profesional kesehatan mental atau
              hotline krisis.
            </p>
          </div>
        </div>

        <ChatWindow conversation={conversation} onSendMessage={handleSendMessage} />

        <div className="mt-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 md:p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Tips Berbicara</h3>
          <ul className="space-y-2 text-sm md:text-base text-gray-700">
            <li className="flex items-start space-x-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span>Jujur dengan perasaanmu, tidak ada yang salah atau benar</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span>Gunakan ruang ini untuk melepaskan beban pikiran</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span>Semua percakapan bersifat privat dan tersimpan lokal</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default TalkRoom;
