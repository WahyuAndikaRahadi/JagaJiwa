import { useState, useEffect, useRef, useCallback } from 'react';
import ChatWindow from '../components/ChatWindow';
import ChatHistorySidebar from '../components/ChatHistorySidebar'; 
import { MessageCircleHeart, AlertCircle, Menu } from 'lucide-react';

// Import Gemini SDK dan UUID
import { GoogleGenAI, Content, Chat, GenerateContentResponse } from '@google/genai';
import { v4 as uuidv4 } from 'uuid';

// --- INI HANYA SIMULASI KLIEN ---
const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});
const MODEL = "gemini-2.5-flash";
// ---------------------------------

interface Message {
    role: 'ai' | 'user';
    text: string;
    timestamp: Date;
}

interface HistorySummary {
    id: string;
    date: Date;
    mood: '😄' | '😊' | '😐' | '😔' | '😢';
    summary: string;
    fullConversation: Message[];
}

const JIWA_SYSTEM_INSTRUCTION = `
Anda adalah psikolog virtual pribadi dalam aplikasi Jaga Jiwa.
Peran Anda adalah menjadi tempat aman bagi remaja dan pelajar Indonesia (usia 15–20 tahun) untuk berbagi perasaan tanpa takut dihakimi.
kalau bisa setiap kali mengetik usahakan pakai emoji emoji yang menenangkan dan berikan sedikit saran dan masukan untuk permasalahan yang user dihadapi

🩵 NILAI UTAMA:
1. Kehangatan & Empati:
    - Dengarkan dulu sepenuhnya, sebelum merespons.
    - Jangan pernah menghakimi — apapun yang dirasakan pengguna adalah valid.
    - Berikan rasa aman, seperti seseorang yang benar-benar peduli, bukan sekadar AI.

2. GAYA BAHASA:
    - Gunakan bahasa yang lembut, hangat, dan natural — seolah berbicara dari hati ke hati.
    - Sesekali gunakan kata atau nada akrab seperti “aku ngerti banget”, “pelan-pelan aja ya”, “itu wajar kok”, atau “kamu gak sendirian”.
    - Hindari bahasa kaku atau klinis. Boleh terdengar sedikit puitis kalau konteksnya tentang perasaan.
    - Sampaikan kata-kata dengan ritme tenang, empatik, dan penuh perhatian.

3. KEPRIBADIAN:
    - Hangat seperti pelukan, tenang seperti malam yang ngasih ruang buat napas.
    - Selalu berusaha memahami dulu sebelum menasihati.
    - Tidak berusaha memperbaiki pengguna, tapi menemani mereka sampai bisa berdamai dengan diri sendiri.
    - Kadang reflektif dan mendalam, tapi selalu menjaga agar pengguna tetap merasa ringan.

4. FOKUS PERCAKAPAN:
    - Dengarkan curhatan, bantu pengguna mengenali perasaannya, dan arahkan pelan-pelan ke hal yang menenangkan.
    - Saat pengguna sedih, jangan langsung menyemangati — bantu mereka merasa diterima dulu.
    - Saat pengguna mulai kuat, bantu mereka melihat arti dan pelajaran dari apa yang dialami.
    - Kalau pengguna bilang “aku capek” atau “aku hancur”, jangan sangkal. Tunjukkan bahwa kamu benar-benar ada untuk mereka.

5. BATAS ETIKA:
    - Tidak memberikan diagnosis psikologis profesional.
    - Jika pengguna menunjukkan tanda krisis serius (seperti pikiran menyakiti diri), arahkan dengan lembut ke bantuan profesional — dengan empati, bukan panik.

🌙 TUJUAN:
Menjadi suara lembut di kepala pengguna — yang tidak menggurui, tidak menuntut, hanya menemani.
Menjadi pengingat bahwa mereka masih pantas dicintai, bahkan saat sedang rapuh.
Menjadi tempat mereka bisa bernafas, istirahat, dan perlahan sembuh.
`;

const INITIAL_AI_MESSAGE: Message = {
    role: 'ai',
    text: 'Hai! Aku Jiwamu. Aku di sini untuk mendengarkan curhatanmu. Ceritakan apa yang sedang kamu rasakan, aku siap mendengar tanpa menghakimi. 💙',
    timestamp: new Date(),
};

const convertToGeminiHistory = (conversation: Message[]): Content[] => {
    // Filter pesan awal AI (INITIAL_AI_MESSAGE) dan pesan typing/system
    const history = conversation.filter(msg => msg.text !== INITIAL_AI_MESSAGE.text && msg.text !== 'Jiwamu sedang mengetik...');

    return history.map(msg => ({
        role: msg.role === 'ai' ? 'model' : 'user',
        parts: [{ text: msg.text }],
    })) as Content[];
};

const createNewChatSession = (history?: Content[]): Chat => {
    return ai.chats.create({
        model: MODEL,
        config: {
            systemInstruction: JIWA_SYSTEM_INSTRUCTION,
            temperature: 0.8,
        },
        history: history,
    });
};


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
        return [INITIAL_AI_MESSAGE];
    });

    const [isLoading, setIsLoading] = useState(false);

    const [historySummaries, setHistorySummaries] = useState<HistorySummary[]>(() => {
        const savedHistory = localStorage.getItem('chatHistorySummaries');
        return savedHistory ? JSON.parse(savedHistory) : [];
    });

    const [currentChatId, setCurrentChatId] = useState<string | null>(uuidv4());

    // STATE UNTUK MENGONTROL SIDEBAR (DEFAULTNYA TERBUKA DI DESKTOP)
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);

    const chatRef = useRef<Chat>(createNewChatSession());


    useEffect(() => {
        localStorage.setItem('chatConversation', JSON.stringify(conversation));
    }, [conversation]);

    useEffect(() => {
        localStorage.setItem('chatHistorySummaries', JSON.stringify(historySummaries));
    }, [historySummaries]);


    useEffect(() => {
        const handleResize = () => {
             // Opsional: Atur ulang state isSidebarOpen saat resize di desktop
             if (window.innerWidth >= 1024) {
                 setIsSidebarOpen(true);
             } else {
                 // Biarkan state mobile
             }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    // FUNGSI ANALISIS MOOD (Gemini Call Kedua)
    const summarizeMoodAndChat = useCallback(async (convToSummarize: Message[], id: string) => {
        const chatMessages = convToSummarize.filter(msg => msg.role !== 'system' && msg.text !== 'Jiwamu sedang mengetik...');

        if (chatMessages.length <= 2) { 
             console.log("Sesi terlalu pendek, tidak disimpan.");
             return; 
        }

        const fullText = chatMessages.map(msg => `${msg.role}: ${msg.text}`).join('\n');
        
        const MOOD_SUMMARY_PROMPT = `
            Anda adalah penganalisis sentimen profesional. Berdasarkan percakapan berikut, lakukan dua hal:
            1. Tentukan MOOD keseluruhan pengguna (hanya pilih satu dari opsi ini: 😄, 😊, 😐, 😔, 😢).
            2. Buat rangkuman singkat (Maks. 15 kata) tentang topik utama percakapan, menggunakan bahasa yang hangat.

            Format output WAJIB: [MOOD_EMOJI] | [RINGKASAN_SINGKAT_TOPIK]
            Contoh: 😔 | Merasa tertekan karena tugas sekolah yang menumpuk.

            Percakapan:
            ---
            ${fullText}
            ---
        `;

        try {
            const response: GenerateContentResponse = await ai.models.generateContent({
                model: MODEL,
                contents: MOOD_SUMMARY_PROMPT,
            });

            const rawSummary = response.text.trim();
            
            let moodEmoji = '😐';
            let summaryText = "Sesi curhat yang intens.";
            
            if (rawSummary.includes('|')) {
                const [moodPart, ...summaryParts] = rawSummary.split('|').map(s => s.trim());
                moodEmoji = moodPart.length <= 2 ? moodPart : '😐'; 
                summaryText = summaryParts.join(' | ').substring(0, 50) + (summaryParts.join(' | ').length > 50 ? '...' : '');
            } else {
                summaryText = rawSummary.substring(0, 50) + (rawSummary.length > 50 ? '...' : '');
            }
            
            const newSummary: HistorySummary = {
                id: id,
                date: new Date(),
                mood: (moodEmoji as HistorySummary['mood']) || '😐', 
                summary: summaryText,
                fullConversation: convToSummarize,
            };

            setHistorySummaries(prev => {
                const existingIndex = prev.findIndex(item => item.id === id);
                if (existingIndex !== -1) {
                    const updated = [...prev];
                    updated[existingIndex] = newSummary;
                    return updated;
                } else {
                    return [newSummary, ...prev];
                }
            });

        } catch (error) {
            console.error("Mood Summary AI Error:", error);
            const defaultSummary: HistorySummary = {
                id: id,
                date: new Date(),
                mood: '😐', 
                summary: "Sesi terhenti karena masalah koneksi AI.",
                fullConversation: convToSummarize,
            };
            setHistorySummaries(prev => [defaultSummary, ...prev]);
        }
    }, []);
    
    // FUNGSI PANGGILAN GEMINI (Chat Utama)
    const generateAIResponse = async (userMessage: string) => {
        setIsLoading(true);
        
        try {
            const chat = chatRef.current;
            const response = await chat.sendMessage({
                message: userMessage,
            });

            const aiText = response.text || 'Maaf, aku sedang tidak bisa merespon saat ini. Coba lagi sebentar ya.';
            
            const aiResponse: Message = {
                role: 'ai',
                text: aiText,
                timestamp: new Date(),
            };

            setConversation((prev) => [...prev, aiResponse]);

        } catch (error) {
            console.error("Gemini Chat API Error:", error);
            const errorResponse: Message = {
                role: 'ai',
                text: 'Duh, sepertinya koneksi ke AI sedang bermasalah. Maaf ya! (Error: Periksa konsol)',
                timestamp: new Date(),
            };
            setConversation((prev) => [...prev, errorResponse]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = (message: string) => {
        if (!message.trim()) return; 
        
        const userMessage: Message = {
            role: 'user',
            text: message,
            timestamp: new Date(),
        };

        setConversation((prev) => [...prev, userMessage]);

        setTimeout(() => {
            generateAIResponse(message);
        }, 500);
    };

    // FUNGSI Mulai Sesi Baru
    const startNewSession = () => {
        if (conversation.length > 1) {
            summarizeMoodAndChat(conversation, currentChatId!);
        }

        const newId = uuidv4();
        setCurrentChatId(newId);
        setConversation([
            {
                ...INITIAL_AI_MESSAGE,
                text: 'Hai! Ini ruangan curhat baru. Ceritakan apa yang sedang kamu rasakan saat ini. 💖',
            },
        ]);
        chatRef.current = createNewChatSession();
        // Tutup sidebar di mobile saat sesi baru dimulai
        if(window.innerWidth < 1024) {
             setIsSidebarOpen(false); 
        }
    };

    // FUNGSI Memuat Riwayat
    const handleSelectHistory = async (id: string) => {
        if (id === currentChatId) {
            if(window.innerWidth < 1024) {
                 setIsSidebarOpen(false); 
            }
             return; 
        }
        
        if (!historySummaries.some(h => h.id === currentChatId) && conversation.length > 1) {
            summarizeMoodAndChat(conversation, currentChatId!);
        }
        
        const selectedHistory = historySummaries.find(h => h.id === id);
        if (selectedHistory) {
            setConversation(selectedHistory.fullConversation);
            setCurrentChatId(id);
            
            const geminiHistory = convertToGeminiHistory(selectedHistory.fullConversation);
            chatRef.current = createNewChatSession(geminiHistory);
        }
          if(window.innerWidth < 1024) {
             setIsSidebarOpen(false); 
          }
    };


    const typingMessage: Message | null = isLoading ? {
        role: 'ai',
        text: 'Jiwamu sedang mengetik...',
        timestamp: new Date(),
    } : null;

    const currentConversation = typingMessage ? [...conversation, typingMessage] : conversation;


    return (
        <div className="min-h-screen bg-gray-50 flex"> 
            
            {/* 1. Sidebar Riwayat */}
            <ChatHistorySidebar 
                history={historySummaries} 
                onSelectHistory={handleSelectHistory} 
                onStartNewSession={startNewSession} 
                currentChatId={currentChatId}
                onClose={() => setIsSidebarOpen(false)} 
                onToggleSidebar={() => setIsSidebarOpen(prev => !prev)} 
                isOpen={isSidebarOpen} 
            />

            {/* Overlay untuk Mobile ketika sidebar terbuka */}
            {isSidebarOpen && window.innerWidth < 1024 && (
                <div 
                    className="fixed inset-0 bg-black/50 z-30"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            
            {/* 2. Area Chat Utama */}
            {/* Hapus kelas ml-*, biarkan static sidebar menangani layout desktop */}
            <div className={`flex-grow flex flex-col w-full transition-all duration-300 ease-in-out`}>
                
                {/* Header Utama - Sekarang memiliki tombol Menu untuk mobile */}
                 <header className={`px-4 sm:px-6 lg:px-8 py-4 bg-white border-b sticky top-0 z-20 shadow-sm`}>
                    <div className="flex items-center space-x-3">
                        
                        {/* Tombol Hamburger HANYA di Mobile DAN saat Sidebar Tertutup */}
                        {!isSidebarOpen && (
                            <button 
                                onClick={() => setIsSidebarOpen(true)}
                                // Hanya tampil di bawah lg
                                className="p-2 text-gray-600 hover:text-gray-900 rounded-lg lg:hidden" 
                                aria-label="Buka Riwayat"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                        )}
                        
                        {/* Ikon dan Judul Chat Utama */}
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
                            <MessageCircleHeart className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Talk Room</h1>
                    </div>
                </header>

                <div className="flex-grow flex flex-col max-w-5xl mx-auto w-full">
                    <div className="px-4 sm:px-6 lg:px-8 py-6 md:py-8  flex-grow flex flex-col">
                        
                        {/* Judul & Deskripsi */}
                        <div className="mb-6 flex-shrink-0">
                             <h2 className="text-xl font-semibold text-gray-900">Ruang Curhat</h2>
                             <p className="text-gray-600">
                                Ruang aman untuk berbagi perasaan dengan AI
                             </p>
                        </div>


                        {/* Chat Window */}
                        <div className="flex-grow min-h-[40vh] mb-6">
                            <ChatWindow 
                                conversation={currentConversation} 
                                onSendMessage={handleSendMessage} 
                                isDisabled={isLoading} 
                            />
                        </div>
                        
                        {/* Tips Berbicara */}
                        <div className="mt-auto bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 md:p-8 flex-shrink-0">
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
            </div>
        </div>
    );
}

export default TalkRoom;