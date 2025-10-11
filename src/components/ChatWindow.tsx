import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';

interface Message {
  role: 'ai' | 'user';
  text: string;
  timestamp: Date;
}

interface ChatWindowProps {
  conversation: Message[];
  onSendMessage: (message: string) => void;
}

function ChatWindow({ conversation, onSendMessage }: ChatWindowProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex flex-col h-[550px] md:h-[600px] bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-4 md:px-6 py-4 text-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold">AI Support Assistant</h3>
            <p className="text-xs text-white/80">Selalu siap mendengarkan</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gray-50">
        {conversation.map((message, index) => (
          <div
            key={index}
            className={`flex items-start space-x-2 ${
              message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.role === 'ai'
                  ? 'bg-gradient-to-br from-primary-500 to-secondary-500'
                  : 'bg-gradient-to-br from-gray-600 to-gray-700'
              }`}
            >
              {message.role === 'ai' ? (
                <Bot className="w-5 h-5 text-white" />
              ) : (
                <User className="w-5 h-5 text-white" />
              )}
            </div>

            <div
              className={`flex flex-col max-w-[75%] md:max-w-[70%] ${
                message.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`px-4 py-3 rounded-2xl shadow-sm ${
                  message.role === 'ai'
                    ? 'bg-white text-gray-800 rounded-tl-sm'
                    : 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-tr-sm'
                }`}
              >
                <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                  {message.text}
                </p>
              </div>
              <span className="text-xs text-gray-500 mt-1 px-1">
                {formatTime(message.timestamp)}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t border-gray-200 p-4 bg-white"
      >
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ketik pesan di sini..."
            className="flex-1 px-4 py-3 bg-gray-100 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="px-4 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:transform-none"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatWindow;
