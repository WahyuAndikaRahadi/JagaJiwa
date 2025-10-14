import { useState, useRef, useEffect, memo } from 'react';
import { Send, Bot, User, Loader2, Mic, AlertTriangle } from 'lucide-react'; 
// --- Import untuk Markdown ---
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // Untuk mendukung GFM (Tabel, checklist, dll.)
// --- Import dari react-speech-recognition ---
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'; 
// ---------------------------------------------

interface Message {
  role: 'ai' | 'user';
  text: string;
  timestamp: Date;
}

interface ChatWindowProps {
  conversation: Message[];
  onSendMessage: (message: string) => void;
  isDisabled: boolean;
}

// =======================================================
// Komponen Pembantu: MessageBubble
// =======================================================

interface MessageBubbleProps {
  message: Message;
  formatTime: (date: Date) => string;
}

const MessageBubble = memo(({ message, formatTime }: MessageBubbleProps) => {
  const isUser = message.role === 'user';
  const isTyping = message.text === 'Jiwamu sedang mengetik...';
  
  const typingBg = 'bg-gray-200 text-gray-500'; 
  const aiBg = 'bg-white text-gray-800';
  const userBg = 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'; 

  // Menentukan komponen kustom untuk ReactMarkdown (khusus untuk bubble AI)
  const AiMarkdownComponents = {
      // Mengatasi elemen <li> agar terlihat rapi
      li: ({ node, ...props }: any) => (
        <li className="mb-1 ml-4 list-disc marker:text-emerald-500" {...props} />
      ),
      // Mengatasi elemen <p>
      p: ({ node, ...props }: any) => (
        <p className="mb-2 last:mb-0" {...props} />
      ),
      // Mengatasi elemen <code> (inline code)
      code: ({ node, inline, className, children, ...props }: any) => {
          return inline ? (
            <code className="bg-gray-100 text-red-600 px-1 py-0.5 rounded text-sm" {...props}>
              {children}
            </code>
          ) : (
            // Untuk block code, gunakan pre dan code
            <pre className="bg-gray-100 p-2 rounded-lg my-2 overflow-x-auto text-xs">
              <code className="text-gray-800" {...props}>{children}</code>
            </pre>
          );
      },
  };

  return (
    <div
      className={`flex items-start space-x-2 ${
        isUser ? 'flex-row-reverse space-x-reverse' : ''
      }`}
    >
      {/* Avatar/Ikon */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center 
          ${isUser ? 'bg-gray-700' : 'bg-gradient-to-br from-emerald-500 to-teal-500'}
        `}
      >
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </div>

      {/* Konten Pesan */}
      <div
        className={`flex flex-col max-w-[75%] md:max-w-[70%] ${
          isUser ? 'items-end' : 'items-start'
        }`}
      >
        <div
          className={`px-4 py-3 rounded-2xl shadow-sm transition-colors duration-200 
            ${isUser ? userBg : (isTyping ? typingBg : aiBg)} 
            ${isUser ? 'rounded-tr-sm' : 'rounded-tl-sm'}
          `}
        >
          {isTyping ? (
            <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <p className="text-sm md:text-base italic">
                    {message.text}
                </p>
            </div>
          ) : (
            <div className={`${isUser ? 'text-white' : 'text-gray-800'} text-sm md:text-base leading-relaxed whitespace-pre-wrap`}>
              {/* MENGGUNAKAN REACT MARKDOWN DI SINI */}
              {isUser ? (
                  <p>{message.text}</p>
              ) : (
                  <ReactMarkdown
                    components={AiMarkdownComponents}
                    remarkPlugins={[remarkGfm]}
                  >
                    {message.text}
                  </ReactMarkdown>
              )}
            </div>
          )}
        </div>
        {/* Timestamp hanya jika BUKAN pesan typing */}
        {!isTyping && (
          <span className="text-xs text-gray-500 mt-1 px-1">
            {formatTime(message.timestamp)}
          </span>
        )}
      </div>
    </div>
  );
});

// =======================================================
// Komponen Utama: ChatWindow
// =======================================================

function ChatWindow({ conversation, onSendMessage, isDisabled }: ChatWindowProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null); 

  // --- LOGIKA SPEECH RECOGNITION ---
  const {
      transcript,
      listening,
      resetTranscript,
      browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  
  const [isVoiceMode, setIsVoiceMode] = useState(false);

  useEffect(() => {
      if (isVoiceMode) {
          setInputValue(transcript);
      }
  }, [transcript, isVoiceMode]);
  // ---------------------------------
  
 


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedValue = inputValue.trim();
    
    // Hentikan voice recognition jika sedang aktif saat pesan dikirim
    if (listening) {
        SpeechRecognition.stopListening();
        setIsVoiceMode(false);
    }
    
    if (trimmedValue && !isDisabled) {
      onSendMessage(trimmedValue);
      setInputValue('');
      resetTranscript(); // Reset transcript setelah pesan dikirim
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isDisabled && !listening) {
        e.preventDefault(); 
        handleSubmit(e as unknown as React.FormEvent);
    }
  };
  
  // FUNGSI TOGGLE MIKROFON
  const toggleListening = () => {
      if (!browserSupportsSpeechRecognition) return;

      if (listening) {
          SpeechRecognition.stopListening();
          setIsVoiceMode(false);
      } else {
          // Hapus input yang diketik sebelum memulai STT
          setInputValue(''); 
          resetTranscript();
          
          SpeechRecognition.startListening({ 
              continuous: true, 
              language: 'id-ID' // Menggunakan bahasa Indonesia
          });
          setIsVoiceMode(true);
      }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  // Tampilkan peringatan jika browser tidak mendukung STT
  if (!browserSupportsSpeechRecognition) {
      return (
          <div className="flex flex-col h-full bg-white rounded-2xl shadow-lg overflow-hidden items-center justify-center p-8 text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
              <h2 className="text-xl font-bold text-gray-800 mb-2">Browser Tidak Didukung</h2>
              <p className="text-gray-600">
                  Fitur *voice input* tidak didukung oleh browser ini. Silakan gunakan **Google Chrome atau Microsoft Edge** di desktop atau Android.
              </p>
          </div>
      );
  }


  return (
    // Menggunakan h-full untuk mengatasi masalah scroll halaman utama
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-lg overflow-hidden">
      
      {/* Header Statis */}
      <header className="bg-gradient-to-r from-emerald-500 to-teal-500 px-4 md:px-6 py-4 text-white flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold">Jiwamu - Teman Curhat AI</h3>
            <p className="text-xs text-white/80">Selalu siap mendengarkan tanpa menghakimi 💖</p>
          </div>
        </div>
      </header>

      {/* Area Pesan yang Dapat Di-scroll */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gray-50">
        {conversation.map((message, index) => (
          <MessageBubble 
            key={index} 
            message={message} 
            formatTime={formatTime} 
          />
        ))}
        {/* Marker ref untuk scroll otomatis */}
        <div ref={messagesEndRef} className="h-0.5" /> 
      </div>

      {/* Input dan Tombol Kirim */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-gray-200 p-4 bg-white flex-shrink-0"
      >
        <div className="flex items-center space-x-2">
          
          {/* Tombol Mikrofon */}
          <button
            type="button"
            onClick={toggleListening}
            disabled={isDisabled}
            className={`
              relative p-3 rounded-full transition-colors duration-200 border-2
              ${listening 
                  ? 'bg-red-600 text-white border-red-700 shadow-xl ring-4 ring-red-300/50' // Style saat merekam
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200' // Style normal
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
            aria-label={listening ? "Stop Recording" : "Start Recording"}
          >
            {/* Efek Denyut (Pulse) - Layer Bawah */}
            {listening && (
              <span className="absolute inset-0 rounded-full bg-red-600 opacity-75 animate-ping"></span>
            )}
            {/* Ikon Mikrofon */}
            <Mic className="w-5 h-5 relative z-10" />
          </button>
          
          {/* Input Teks */}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              // Matikan mode bicara jika user mulai mengetik manual
              if (isVoiceMode) setIsVoiceMode(false);
            }}
            onKeyDown={handleKeyDown} 
            placeholder={
                isDisabled 
                  ? "Tunggu Jiwamu selesai membalas..." 
                  : (listening ? "Mendengarkan ucapan Anda..." : "Ketik pesan di sini...")
            }
            disabled={isDisabled || listening} // Disable input saat loading atau mendengarkan
            className={`flex-1 px-4 py-3 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm md:text-base transition-colors duration-200 
              ${isDisabled || listening ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-800'}
            `}
          />
          
          {/* Tombol Kirim */}
          <button
            type="submit"
            disabled={!inputValue.trim() || isDisabled || listening} // Disable juga saat mendengarkan
            className="p-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:transform-none"
          >
            {isDisabled ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
                <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatWindow;
