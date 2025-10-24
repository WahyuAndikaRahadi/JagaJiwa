import { useState, useEffect, memo, useRef } from 'react'; // useRef tetap diimpor
import { Send, Bot, User, Loader2, Mic, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm'; 
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
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

interface MessageBubbleProps {
  message: Message;
  formatTime: (date: Date) => string;
}

const MessageBubble = memo(({ message, formatTime }: MessageBubbleProps) => {
  const isUser = message.role === 'user';
  const isTyping = message.text === 'Jiwamu sedang mengetik...';

  const typingBg = 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400';
  const aiBg = 'bg-white text-gray-800 dark:bg-gray-700 dark:text-gray-100';
  const userBg = 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white';

  const AiMarkdownComponents = {
    li: ({ node, ...props }: any) => (
      <li className="mb-1 ml-4 list-disc marker:text-emerald-500" {...props} />
    ),
    p: ({ node, ...props }: any) => (
      <p className="mb-2 last:mb-0" {...props} />
    ),
    code: ({ inline, children, ...props }: any) =>
      inline ? (
        <code className="bg-gray-100 text-red-600 px-1 py-0.5 rounded text-sm dark:bg-gray-900 dark:text-red-400" {...props}>
          {children}
        </code>
      ) : (
        <pre className="bg-gray-100 p-2 rounded-lg my-2 overflow-x-auto text-xs dark:bg-gray-900">
          <code className="text-gray-800 dark:text-gray-200" {...props}>{children}</code>
        </pre>
      ),
  };

  return (
    <div className={`flex items-start space-x-2 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center 
          ${isUser ? 'bg-gray-700' : 'bg-gradient-to-br from-emerald-500 to-teal-500'}`}
      >
        {isUser ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
      </div>

      <div className={`flex flex-col max-w-[75%] md:max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-3 rounded-2xl shadow-sm transition-colors duration-200
            ${isUser ? userBg : (isTyping ? typingBg : aiBg)} 
            ${isUser ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}
        >
          {isTyping ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <p className="text-sm italic">{message.text}</p>
            </div>
          ) : (
            <div className={`text-sm leading-relaxed whitespace-pre-wrap ${isUser ? 'text-white' : 'text-gray-800 dark:text-gray-100'}`}>
              {isUser ? (
                <p>{message.text}</p>
              ) : (
                <ReactMarkdown components={AiMarkdownComponents}>
                  {message.text}
                </ReactMarkdown>
              )}
            </div>
          )}
        </div>

        {!isTyping && (
          <span className="text-xs text-gray-500 mt-1 px-1 dark:text-gray-400">{formatTime(message.timestamp)}</span>
        )}
      </div>
    </div>
  );
});

function ChatWindow({ conversation, onSendMessage, isDisabled }: ChatWindowProps) {
  const [inputValue, setInputValue] = useState('');
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  
  const scrollableContainerRef = useRef<HTMLDivElement>(null); 

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    if (isVoiceMode) setInputValue(transcript);
  }, [transcript, isVoiceMode]);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  const scrollToBottom = () => {
    const container = scrollableContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();

    if (listening) {
      SpeechRecognition.stopListening();
      setIsVoiceMode(false);
    }

    if (trimmed && !isDisabled) {
      onSendMessage(trimmed);
      setInputValue('');
      resetTranscript();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isDisabled && !listening) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const toggleListening = () => {
    if (!browserSupportsSpeechRecognition) return;

    if (listening) {
      SpeechRecognition.stopListening();
      setIsVoiceMode(false);
    } else {
      setInputValue('');
      resetTranscript();
      SpeechRecognition.startListening({
        continuous: true,
        // language: 'id-ID',
      });
      setIsVoiceMode(true);
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="flex flex-col h-full bg-white rounded-2xl shadow-lg overflow-hidden items-center justify-center p-8 text-center dark:bg-gray-800">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2 dark:text-gray-100">Browser Tidak Didukung</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Fitur voice input tidak didukung oleh browser ini. Gunakan Google Chrome atau Microsoft Edge di desktop atau Android.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-h-[85vh] bg-white rounded-2xl shadow-lg overflow-hidden dark:bg-gray-800">
      <header className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4 text-white flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold">Jiwamu - Teman Curhat AI</h3>
            <p className="text-xs text-white/80">Selalu siap mendengarkan tanpa menghakimi</p>
          </div>
        </div>
      </header>

      <div 
        className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-900"
        ref={scrollableContainerRef} // Ref dipasang pada kontainer yang memiliki scrollbar
      >
        {conversation.map((message, index) => (
          <MessageBubble key={index} message={message} formatTime={formatTime} />
        ))}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 bg-white flex-shrink-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={toggleListening}
            disabled={isDisabled}
            className={`relative p-3 rounded-full border-2 transition-colors duration-200
              ${listening
                ? 'bg-red-600 text-white border-red-700 shadow-xl ring-4 ring-red-300/50'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:border-gray-700'}
              disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label={listening ? 'Stop Recording' : 'Start Recording'}
          >
            {listening && <span className="absolute inset-0 rounded-full bg-red-600 opacity-75 animate-ping"></span>}
            <Mic className="w-5 h-5 relative z-10" />
          </button>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (isVoiceMode) setIsVoiceMode(false);
            }}
            onKeyDown={handleKeyDown}
            placeholder={
              isDisabled
                ? 'Tunggu Jiwamu selesai membalas...'
                : listening
                ? 'Mendengarkan ucapan Anda...'
                : 'Ketik pesan di sini...'
            }
            disabled={isDisabled || listening}
            className={`flex-1 px-4 py-3 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm
              ${isDisabled || listening 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400'}`}
          />

          <button
            type="submit"
            disabled={!inputValue.trim() || isDisabled || listening}
            className="p-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl shadow-md hover:shadow-lg
              disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:transform-none"
          >
            {isDisabled ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatWindow;