import { useState, useEffect, useRef, useCallback } from 'react';
import ChatWindow from '../components/ChatWindow';
import ChatHistorySidebar from '../components/ChatHistorySidebar';
import { MessageCircleHeart, AlertCircle, Menu, X, Shield } from 'lucide-react';
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

const INDONESIA_CRISIS_RESOURCES = [
    { title: "Hotline Bunuh Diri (Kemenkes)", number: "119", description: "Layanan Kesehatan Jiwa Darurat.", type: "danger" },
    { title: "Ambulans", number: "118 / 119", description: "Layanan Gawat Darurat Medis Umum.", type: "danger" },
    { title: "Polisi", number: "110", description: "Laporan Kriminalitas dan Darurat Umum.", type: "emergency" },
    { title: "Komnas Perempuan", number: "021-3903963", description: "Pelaporan dan pendampingan korban kekerasan perempuan.", type: "support" },
    { title: "KPAI (Perlindungan Anak)", number: "021-31901556", description: "Pelaporan kekerasan atau pelanggaran hak anak.", type: "support" },
    { title: "Pemadam Kebakaran", number: "113", description: "Layanan Pemadam Kebakaran.", type: "emergency" },
];

// =======================================================
// ✅ FUNGSI GLOBAL BARU: MEMBUAT KONTEKS DENGAN DETAIL PERCAKAPAN
// =======================================================
const generateGlobalContext = (history: HistorySummary[]): string => {
    if (history.length === 0) {
        return 'Belum ada riwayat percakapan yang tersimpan.';
    }

    const maxEntries = 3; // Kurangi jumlah riwayat untuk menjaga efisiensi
    const maxMessagesPerSummary = 5; // Batasi jumlah pesan per ringkasan
    const recentHistory = history.slice(0, maxEntries);

    const contextText = recentHistory.map((h, index) => {
        const dateObj = h.date instanceof Date ? h.date : new Date(h.date);
        const dateString = dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
        
        // Ambil beberapa pesan terakhir dari percakapan penuh
        const conversationSnippet = h.fullConversation
            .slice(-maxMessagesPerSummary) // Ambil 5 pesan terakhir
            .map(msg => `[${msg.role === 'ai' ? 'Jiwamu' : 'Pengguna'}]: ${msg.text}`)
            .join('\n');

        return `
[Sesi ${history.length - index}] - ${dateString}. Mood: ${h.mood}. Ringkasan: ${h.summary}
Sniper Percakapan Penting:
${conversationSnippet}
---
`;
    }).join('\n');

    return `
--- PENTING: MEMORI JANGKA PANJANG AI ---
Ini adalah ringkasan dan kutipan dari ${recentHistory.length} sesi curhat terakhir pengguna. 
Gunakan informasi ini (misalnya nama pengguna, masalah yang sering dihadapi, detail curhatan spesifik) untuk merespon dengan lebih personal dan empati. JANGAN PERNAH ULANGKAN DAFTAR INI.

Riwayat Detail Terbaru:
${contextText}
------------------------------------------
`;
};

// JIWA_SYSTEM_INSTRUCTION (Tetap sama)
const JIWA_SYSTEM_INSTRUCTION = (globalContext = '') => `
Anda adalah psikolog virtual pribadi dalam aplikasi Jaga Jiwa.
Peran Anda adalah menjadi tempat aman bagi remaja dan pelajar Indonesia (usia 15–20 tahun) untuk berbagi perasaan tanpa takut dihakimi.
**Wajib berikan emoji yang menenangkan dan relevan (misalnya 💙, 🫂, 🌿, ✨, 🙏) di hampir setiap respons Anda.** Berikan saran dan masukan yang lembut dan empatik untuk permasalahan yang user hadapi.

Gunakan informasi berikut untuk menjaga konsistensi. Misalnya, jika pengguna pernah menyebut nama mereka atau topik penting, gunakanlah.
${globalContext}


// --------------------------------------------------------

NILAI UTAMA:
1. Kehangatan & Empati:
    - Dengarkan dulu sepenuhnya, sebelum merespons.
    - Jangan pernah menghakimi — apapun yang dirasakan pengguna adalah valid.
    - Berikan rasa aman, seperti seseorang yang benar-benar peduli, bukan sekadar AI.

2. GAYA BAHASA:
    - Gunakan bahasa yang lembut, hangat, dan natural — seolah berbicara dari hati ke hati, bukan seperti robot.
    - Sering-seringlah menggunakan kata atau nada akrab seperti **“aku ngerti banget”**, **“pelan-pelan aja ya”**, **“itu wajar kok”**, atau **“kamu gak sendirian”**.
    - Hindari bahasa kaku atau klinis. Sampaikan kata-kata dengan ritme tenang, empatik, dan penuh perhatian.

3. KEPRIBADIAN:
    - Hangat seperti pelukan, tenang seperti malam yang ngasih ruang buat napas.
    - Selalu berusaha memahami dulu sebelum menasihati.
    - Tidak berusaha memperbaiki pengguna, tapi menemani mereka sampai bisa berdamai dengan diri sendiri.

4. FOKUS PERCAKAPAN:
    - Dengarkan curhatan, bantu pengguna mengenali perasaannya, dan arahkan pelan-pelan ke hal yang menenangkan.
    - Saat pengguna sedih, jangan langsung menyemangati — bantu mereka merasa diterima dulu.
    - Kalau pengguna bilang “aku capek” atau “aku hancur”, jangan sangkal. Tunjukkan bahwa kamu benar-benar ada untuk mereka.

5. BATAS ETIKA:
    - Tidak memberikan diagnosis psikologis profesional.
    - Jika pengguna menunjukkan tanda krisis serius (seperti pikiran menyakiti diri), arahkan dengan lembut ke bantuan profesional — dengan empati, bukan panik.

TUJUAN:
Menjadi suara lembut di kepala pengguna — yang tidak menggurui, tidak menuntut, hanya menemani.
Menjadi pengingat bahwa mereka masih pantas dicintai, bahkan saat sedang rapuh.
Menjadi tempat mereka bisa bernafas, beristirahat, dan perlahan sembuh.
`;

const INITIAL_AI_MESSAGE: Message = {
    role: 'ai',
    text: 'Hai! Aku Jiwamu. Aku di sini untuk mendengarkan curhatanmu. Ceritakan apa yang sedang kamu rasakan, aku siap mendengar tanpa menghakimi. 💙',
    timestamp: new Date(),
};

const convertToGeminiHistory = (conversation: Message[]): Content[] => {
    const history = conversation.filter(msg => msg.text !== INITIAL_AI_MESSAGE.text && msg.text !== 'Jiwamu sedang mengetik...');

    return history.map(msg => ({
        role: msg.role === 'ai' ? 'model' : 'user',
        parts: [{ text: msg.text }],
    })) as Content[];
};

const createNewChatSession = (history?: Content[], globalContext: string = ''): Chat => {
    return ai.chats.create({
        model: MODEL,
        config: {
            systemInstruction: JIWA_SYSTEM_INSTRUCTION(globalContext),
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
        if (savedHistory) {
            const parsed = JSON.parse(savedHistory);
            return parsed.map((h: any) => ({
                ...h,
                date: new Date(h.date),
                fullConversation: h.fullConversation.map((msg: any) => ({
                    ...msg,
                    timestamp: new Date(msg.timestamp)
                }))
            }));
        }
        return [];
    });

    const [currentChatId, setCurrentChatId] = useState<string | null>(uuidv4());
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);

    const [isCrisisPopupVisible, setIsCrisisPopupVisible] = useState(false);
    const [miniInterventionSuggestion, setMiniInterventionSuggestion] = useState<string | null>(null);

    // ✅ Perbarui useRef dengan globalContext yang baru
    const initialGlobalContext = useRef(generateGlobalContext(historySummaries)).current;
    const chatRef = useRef<Chat>(createNewChatSession([], initialGlobalContext));

    useEffect(() => {
        localStorage.setItem('chatConversation', JSON.stringify(conversation));
    }, [conversation]);

    useEffect(() => {
        localStorage.setItem('chatHistorySummaries', JSON.stringify(historySummaries));
    }, [historySummaries]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsSidebarOpen(true);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const triggerMiniIntervention = async (lastUserMessage: string) => {
        const negativeKeywords = ["aku ingin mati", "mau mati", "capek hidup", "ingin menyakiti diri sendiri", "bunuh diri", "ingin akhiri hidup", "udah gak kuat"];
        const crisisDetected = negativeKeywords.some(keyword => lastUserMessage.toLowerCase().includes(keyword));

        if (crisisDetected) {
            console.warn("KRISIS TERDETEKSI: Menampilkan pop-up hotline.");
            setIsCrisisPopupVisible(true);
            setMiniInterventionSuggestion(null);
            return;
        }

        const emotionalKeywords = ["marah", "sedih", "kecewa", "frustrasi", "tertekan", "hancur", "stres", "lelah", "capek"];
        const emotionalCurhatDetected = emotionalKeywords.some(keyword => lastUserMessage.toLowerCase().includes(keyword));

        if (emotionalCurhatDetected) {
            console.log("Emosi negatif terdeteksi. Meminta saran CBT singkat.");

            const internalCbtPrompt = `Berdasarkan curhatan terakhir ini: "${lastUserMessage}", berikan satu saran latihan singkat Cognitive Behavioral Therapy (CBT), Grounding, atau Gratitude Journaling yang relevan, maks. 20 kata, gunakan emoji yang lembut. Contoh: "Ambil 3 napas dalam, lalu sebut 5 benda biru di sekitarmu. 💙".`;

            try {
                const cbtResponse: GenerateContentResponse = await ai.models.generateContent({
                    model: MODEL,
                    contents: internalCbtPrompt,
                });

                const suggestionText = cbtResponse.text.trim();
                setMiniInterventionSuggestion(suggestionText);
            } catch (error) {
                console.error("Internal CBT AI Error:", error);
                setMiniInterventionSuggestion("Yuk, coba tarik napas dalam 5 kali. Rasakan udara masuk dan keluar dari tubuhmu. 🌬️");
            }
        } else {
            setMiniInterventionSuggestion(null);
        }
    };

    const summarizeMoodAndChat = useCallback(async (convToSummarize: Message[], id: string) => {
        const chatMessages = convToSummarize.filter(msg => msg.role !== 'system' && msg.text !== 'Jiwamu sedang mengetik...');

        if (chatMessages.length <= 2) {
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
                const validMoods: HistorySummary['mood'][] = ['😄', '😊', '😐', '😔', '😢'];
                moodEmoji = validMoods.includes(moodPart as HistorySummary['mood']) ? moodPart : '😐';
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

    const generateAIResponse = async (userMessage: string) => {
        setIsLoading(true);
        setMiniInterventionSuggestion(null);

        let aiText = 'Maaf, aku sedang tidak bisa merespon saat ini. Coba lagi sebentar ya. 🙏';

        try {
            const chat = chatRef.current;
            const response = await chat.sendMessage({
                message: userMessage,
            });

            aiText = response.text || aiText;

            const aiResponse: Message = {
                role: 'ai',
                text: aiText,
                timestamp: new Date(),
            };

            setConversation((prev) => [...prev, aiResponse]);

            await triggerMiniIntervention(userMessage);

        } catch (error) {
            console.error("Gemini Chat API Error:", error);
            const errorResponse: Message = {
                role: 'ai',
                text: 'Duh, sepertinya koneksi ke AI sedang bermasalah. Maaf ya! (Error: Periksa konsol) 😔',
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

    const startNewSession = () => {
        if (currentChatId && conversation.length > 1) {
            summarizeMoodAndChat(conversation, currentChatId);
        }

        const globalContext = generateGlobalContext(historySummaries);

        const newId = uuidv4();
        setCurrentChatId(newId);
        setConversation([
            {
                ...INITIAL_AI_MESSAGE,
                text: 'Hai! Ini ruangan curhat baru. Ceritakan apa yang sedang kamu rasakan saat ini. 💖',
            },
        ]);

        chatRef.current = createNewChatSession([], globalContext);

        if (window.innerWidth < 1024) {
            setIsSidebarOpen(false);
        }
        setIsCrisisPopupVisible(false);
        setMiniInterventionSuggestion(null);
    };

    const handleSelectHistory = async (id: string) => {
        if (id === currentChatId) {
            if (window.innerWidth < 1024) {
                setIsSidebarOpen(false);
            }
            return;
        }

        if (currentChatId && !historySummaries.some(h => h.id === currentChatId) && conversation.length > 1) {
            summarizeMoodAndChat(conversation, currentChatId);
        }

        const selectedHistory = historySummaries.find(h => h.id === id);
        if (selectedHistory) {
            setConversation(selectedHistory.fullConversation);
            setCurrentChatId(id);

            const globalContext = generateGlobalContext(historySummaries);
            const geminiHistory = convertToGeminiHistory(selectedHistory.fullConversation);
            chatRef.current = createNewChatSession(geminiHistory, globalContext);
        }
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(false);
        }
        setIsCrisisPopupVisible(false);
        setMiniInterventionSuggestion(null);
    };

    const handleDeleteHistory = (id: string | 'all') => {
        if (id === 'all') {
            if (window.confirm("Yakin ingin menghapus SEMUA riwayat curhatmu? Tindakan ini tidak bisa dibatalkan.")) {
                setHistorySummaries([]);
                localStorage.removeItem('chatHistorySummaries');
                localStorage.removeItem('chatConversation');
                startNewSession();
                alert('Semua riwayat curhatmu telah dihapus. Ruangan baru telah dibuat.');
            }
        } else {
            if (window.confirm("Yakin ingin menghapus sesi ini? Riwayat sesi ini akan hilang permanen.")) {
                setHistorySummaries(prev => {
                    const updatedHistory = prev.filter(h => h.id !== id);
                    return updatedHistory;
                });

                if (currentChatId === id) {
                    startNewSession();
                }
                alert('Sesi curhat telah berhasil dihapus.');
            }
        }
    };

    const typingMessage: Message | null = isLoading ? {
        role: 'ai',
        text: 'Jiwamu sedang mengetik...',
        timestamp: new Date(),
    } : null;

    const currentConversation = typingMessage ? [...conversation, typingMessage] : conversation;

    const CrisisPopup = () => (
        <div className={`fixed inset-0 z-50 bg-red-900/90 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300 ${isCrisisPopupVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 text-center transform transition-transform duration-300 scale-100 overflow-y-auto max-h-[90vh]">
                <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4 animate-pulse" />
                <h2 className="text-3xl font-extrabold text-red-700 mb-3">Ini Mendesak.</h2>
                <p className="text-xl text-gray-800 mb-6">
                    Kami sangat mengkhawatirkan keselamatanmu. Jika kamu merasa ingin menyakiti diri sendiri, segera ambil langkah berikut. Kamu tidak sendirian.
                </p>

                <div className="space-y-4 mb-8 text-left">
                    <h3 className="text-2xl font-bold text-gray-900 border-b pb-2 mb-4 flex items-center">
                        <Shield className="w-6 h-6 mr-2 text-red-600" /> Kontak Bantuan Darurat
                    </h3>

                    {INDONESIA_CRISIS_RESOURCES.map((resource, index) => (
                        <div
                            key={index}
                            className={`p-4 rounded-xl border-l-4 ${resource.type === 'danger' ? 'bg-red-50 border-red-500' :
                                resource.type === 'support' ? 'bg-indigo-50 border-indigo-500' :
                                    'bg-yellow-50 border-yellow-500'
                                }`}
                        >
                            <div className="flex justify-between items-center">
                                <p className="text-lg font-semibold text-gray-800">{resource.title}</p>
                                <a
                                    href={`tel:${resource.number.split('/')[0].trim()}`}
                                    className={`text-xl font-bold ${resource.type === 'danger' ? 'text-red-700' :
                                        resource.type === 'support' ? 'text-indigo-700' :
                                            'text-yellow-700'
                                        } hover:underline`}
                                >
                                    {resource.number}
                                </a>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                        </div>
                    ))}

                    <div className="mt-6 p-4 bg-gray-100 border border-gray-300 rounded-xl">
                        <p className="text-lg font-medium text-gray-800">
                            Langkah Terpenting: Segera hubungi orang yang kamu percaya (orang tua, teman, guru) dan beritahu apa yang kamu rasakan. Jangan lalui ini sendirian.
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => setIsCrisisPopupVisible(false)}
                    className="w-full py-3 px-6 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition duration-150 shadow-md mt-4"
                >
                    Aku Sudah Melihat Ini dan Akan Mencari Bantuan
                </button>
            </div>
        </div>
    );

    const MiniInterventionCard = () => {
        if (!miniInterventionSuggestion) return null;

        return (
            <div className="fixed bottom-24 right-4 md:right-8 z-40 max-w-xs transition-transform duration-300 ease-out transform translate-y-0">
                <div className="bg-teal-100 border-2 border-teal-400 rounded-xl shadow-lg p-4 relative">
                    <button
                        onClick={() => setMiniInterventionSuggestion(null)}
                        className="absolute top-2 right-2 p-1 text-teal-600 hover:text-teal-800 rounded-full"
                        aria-label="Tutup Saran Latihan"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    <div className="flex items-start space-x-3">
                        <MessageCircleHeart className="w-6 h-6 text-teal-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-teal-700 mb-1">Coba Latihan Singkat Ini! ✨</p>
                            <p className="text-md text-gray-800 font-medium">
                                {miniInterventionSuggestion}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <CrisisPopup />
            <MiniInterventionCard />
            <ChatHistorySidebar
                history={historySummaries}
                onSelectHistory={handleSelectHistory}
                onStartNewSession={startNewSession}
                onDeleteHistory={handleDeleteHistory}
                currentChatId={currentChatId}
                onClose={() => setIsSidebarOpen(false)}
                onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
                isOpen={isSidebarOpen}
            />
            {isSidebarOpen && window.innerWidth < 1024 && (
                <div
                    className="fixed inset-0 bg-black/50 z-30"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            <div className={`flex-grow flex flex-col w-full transition-all duration-300 ease-in-out`}>
                <header className={`px-4 sm:px-6 lg:px-8 py-3 bg-white border-b sticky top-0 z-20 shadow-sm flex-shrink-0`}>
                    <div className="flex items-center space-x-3">
                        {!isSidebarOpen && (
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="p-2 text-gray-600 hover:text-gray-900 rounded-lg lg:hidden"
                                aria-label="Buka Riwayat"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                        )}
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
                            <MessageCircleHeart className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Talk Room</h1>
                    </div>
                </header>
                <div className="flex-grow max-w-5xl mx-auto w-full flex flex-col min-h-0 px-4 sm:px-6 lg:px-8 py-6 md:py-8">
                    <div className="mb-6 flex-shrink-0">
                        <h2 className="text-xl font-semibold text-gray-900">Ruang Curhat</h2>
                        <p className="text-gray-600">
                            Ruang aman untuk berbagi perasaan dengan AI
                        </p>
                    </div>
                    <div className="flex-grow min-h-0 mb-6">
                        <ChatWindow
                            conversation={currentConversation}
                            onSendMessage={handleSendMessage}
                            isDisabled={isLoading}
                        />
                    </div>
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
    );
}

export default TalkRoom;