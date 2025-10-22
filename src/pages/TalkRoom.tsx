import { useState, useEffect, useRef, useCallback } from 'react';
import ChatWindow from '../components/ChatWindow';
import ChatHistorySidebar from '../components/ChatHistorySidebar';
import { MessageCircleHeart, AlertCircle, Menu, X, Shield } from 'lucide-react';
import { GoogleGenAI, Content, Chat, GenerateContentResponse } from '@google/genai';
import { v4 as uuidv4 } from 'uuid';
import { motion } from 'framer-motion';
import StyledPathWithLeaves from '../components/StyledPathWithLeaves';
import Swal from 'sweetalert2';

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

                const suggestionText = cbtResponse.text!.trim();
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

            const rawSummary = response.text!.trim();

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
                text: 'Hai! Ini ruangan curhat baru. Ceritakan apa yang sedang kamu rasakan saat ini. ',
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
                Swal.fire('Berhasil!', 'Semua riwayat curhat telah dihapus.', 'success');
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
                Swal.fire('Berhasil!', 'Riwayat sesi curhat telah dihapus.', 'success');
            }
        }
    };

    const typingMessage: Message | null = isLoading ? {
        role: 'ai',
        text: 'Jiwamu sedang mengetik...',
        timestamp: new Date(),
    } : null;

    const currentConversation = typingMessage ? [...conversation, typingMessage] : conversation;

    const pulseSlowVariants: any = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.2, 0.4, 0.2],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const floatVariants: any = {
  animate: {
    x: ["-10%", "10%", "-10%"],
    y: ["-10%", "10%", "-10%"],
    transition: {
      duration: 15,
      repeat: Infinity,
      ease: "linear",
    },
  },
};


const upAndDown: any = {
  animate: {
    y: ['0%', '-30%', '0%'],
    opacity: [0.5, 0.8, 0.5],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
    }
  }
}

const randomFloat: any = {
  animate: {
    x: () => `${Math.random() * 40 - 20}%`, // -20% to 20%
    y: () => `${Math.random() * 40 - 20}%`, // -20% to 20%
    scale: () => [1, 0.8 + Math.random() * 0.4, 1], // 0.8 to 1.2
    opacity: () => [0.1, 0.3 + Math.random() * 0.2, 0.1], // 0.3 to 0.5
    transition: {
      duration: () => 10 + Math.random() * 10, // 10 to 20 seconds
      repeat: Infinity,
      ease: "easeInOut",
    }
  }
}

const spiralFloat: any = {
  animate: {
    x: ['0%', '20%', '0%', '-20%', '0%'],
    y: ['0%', '10%', '20%', '10%', '0%'],
    rotate: [0, 90, 180, 270, 360],
    scale: [1, 0.9, 1.1, 1],
    transition: {
      duration: 25,
      repeat: Infinity,
      ease: "easeInOut",
    }
  }
}

const floatSlowVariants: any = {
  animate: {
    x: ["0%", "20%", "0%"],
    y: ["0%", "20%", "0%"],
    scale: [1, 1.05, 1],
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};


    const CrisisPopup = () => (
        <div className={`fixed inset-0 z-50 bg-red-900/90 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300 ${isCrisisPopupVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-8 text-center transform transition-transform duration-300 scale-100 overflow-y-auto max-h-[90vh]">
                <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4 animate-pulse" />
                <h2 className="text-3xl font-extrabold text-red-700 dark:text-red-500 mb-3">Ini Mendesak.</h2>
                <p className="text-xl text-gray-800 dark:text-gray-200 mb-6">
                    Kami sangat mengkhawatirkan keselamatanmu. Jika kamu merasa ingin menyakiti diri sendiri, segera ambil langkah berikut. Kamu tidak sendirian.
                </p>

                <div className="space-y-4 mb-8 text-left">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white border-b pb-2 mb-4 flex items-center">
                        <Shield className="w-6 h-6 mr-2 text-red-600 dark:text-red-500" /> Kontak Bantuan Darurat
                    </h3>

                    {INDONESIA_CRISIS_RESOURCES.map((resource, index) => (
                        <div
                            key={index}
                            className={`p-4 rounded-xl border-l-4 ${resource.type === 'danger' ? 'bg-red-50 dark:bg-red-950 border-red-500' :
                                resource.type === 'support' ? 'bg-indigo-50 dark:bg-indigo-950 border-indigo-500' :
                                    'bg-yellow-50 dark:bg-yellow-950 border-yellow-500'
                                }`}
                        >
                            <div className="flex justify-between items-center">
                                <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{resource.title}</p>
                                <a
                                    href={`tel:${resource.number.split('/')[0].trim()}`}
                                    className={`text-xl font-bold ${resource.type === 'danger' ? 'text-red-700 dark:text-red-400' :
                                        resource.type === 'support' ? 'text-indigo-700 dark:text-indigo-400' :
                                            'text-yellow-700 dark:text-yellow-400'
                                        } hover:underline`}
                                >
                                    {resource.number}
                                </a>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{resource.description}</p>
                        </div>
                    ))}

                    <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl">
                        <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                            Langkah Terpenting: Segera hubungi orang yang kamu percaya (orang tua, teman, guru) dan beritahu apa yang kamu rasakan. Jangan lalui ini sendirian.
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => setIsCrisisPopupVisible(false)}
                    className="w-full py-3 px-6 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800 transition duration-150 shadow-md mt-4"
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
                <div className="bg-teal-100 dark:bg-teal-900 border-2 border-teal-400 dark:border-teal-600 rounded-xl shadow-lg p-4 relative">
                    <button
                        onClick={() => setMiniInterventionSuggestion(null)}
                        className="absolute top-2 right-2 p-1 text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-200 rounded-full"
                        aria-label="Tutup Saran Latihan"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    <div className="flex items-start space-x-3">
                        <MessageCircleHeart className="w-6 h-6 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-teal-700 dark:text-teal-300 mb-1">Coba Latihan Singkat Ini! ✨</p>
                            <p className="text-md text-gray-800 dark:text-gray-100 font-medium">
                                {miniInterventionSuggestion}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

 return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex relative overflow-hidden">
        {/* ======================================================= */}
        {/* 🚀 PENAMBAHAN BLOB ANIMASI DARI HOME.TSX (z-index: 1) */}
        {/* ======================================================= */}
        <div className="absolute inset-0 z-[1] pointer-events-none opacity-50 dark:opacity-30">
            {/* Blobs statis dengan animasi Tailwind CSS (asumsi 'animate-blob' didefinisikan secara global) */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply opacity-20 animate-blob dark:bg-indigo-700 dark:opacity-10" />
            <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply opacity-20 animate-blob animation-delay-2000 dark:bg-emerald-700 dark:opacity-10" />
            <div className="absolute top-1/2 left-1/4 w-52 h-52 bg-teal-300 rounded-full mix-blend-multiply opacity-20 animate-blob animation-delay-4000 dark:bg-teal-700 dark:opacity-10" />

            {/* Ornamen Tambahan dengan Framer Motion */}
            <motion.div
                className="absolute top-0 left-0 w-40 h-40 bg-[#72e4f8]/20 dark:bg-[#07798d]/20 rounded-full -translate-x-1/3 -translate-y-1/3"
                variants={pulseSlowVariants}
                animate="animate"
            ></motion.div>
            <motion.div
                className="absolute bottom-0 right-0 w-80 h-80 bg-[#1ff498]/10 dark:bg-[#0be084]/10 rounded-full translate-x-1/3 translate-y-1/3"
                variants={floatVariants}
                animate="animate"
            ></motion.div>
            <motion.div
                className="absolute top-1/4 right-10 w-20 h-20 bg-[#50b7f7]/30 dark:bg-[#086faf]/30 rounded-full"
                variants={floatSlowVariants}
                animate="animate"
            ></motion.div>

            {/* Ornamen Hero Area Tambahan (Bola-bola lebih banyak dan beragam) */}
            <motion.div
                className="absolute top-[10%] left-[10%] w-16 h-16 bg-purple-500/20 dark:bg-purple-700/20 rounded-full"
                variants={randomFloat}
                animate="animate"
            ></motion.div>
            <motion.div
                className="absolute top-[20%] right-[25%] w-12 h-12 bg-emerald-500/15 dark:bg-emerald-700/15 rounded-full"
                variants={pulseSlowVariants}
                animate="animate"
                style={{ transitionDelay: '1s' }}
            ></motion.div>
            <motion.div
                className="absolute top-[5%] left-[40%] w-24 h-24 bg-indigo-500/10 dark:bg-indigo-700/10 rounded-full"
                variants={floatVariants}
                animate="animate"
                style={{ transitionDelay: '0.5s' }}
            ></motion.div>
            <motion.div
                className="absolute bottom-[20%] left-[15%] w-14 h-14 bg-teal-500/25 dark:bg-teal-700/25 rounded-full"
                variants={upAndDown}
                animate="animate"
            ></motion.div>
            <motion.div
                className="absolute bottom-[5%] right-[20%] w-18 h-18 bg-pink-500/18 dark:bg-pink-700/18 rounded-full"
                variants={randomFloat}
                animate="animate"
                style={{ transitionDelay: '2s' }}
            ></motion.div>
            <motion.div
                className="absolute top-[40%] left-[5%] w-10 h-10 bg-rose-500/20 dark:bg-rose-700/20 rounded-full"
                variants={spiralFloat}
                animate="animate"
                style={{ transitionDelay: '1.5s' }}
            ></motion.div>
            <motion.div
                className="absolute top-[60%] right-[10%] w-20 h-20 bg-cyan-500/15 dark:bg-cyan-700/15 rounded-full"
                variants={floatSlowVariants}
                animate="animate"
                style={{ transitionDelay: '2.5s' }}
            ></motion.div>
        </div>
        {/* ======================================================= */}
        {/* ✅ AKHIR PENAMBAHAN BLOB ANIMASI */}
        {/* ======================================================= */}
        
        {/* 1. Pop-up Krisis & Intervensi Mini (Posisi Fixed) */}
        <CrisisPopup />
        <MiniInterventionCard />

        {/* 2. Chat History Sidebar */}
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

        {/* 3. Overlay Mobile untuk Sidebar */}
        {isSidebarOpen && window.innerWidth < 1024 && (
            <div
                className="fixed inset-0 bg-black/50 z-30"
                onClick={() => setIsSidebarOpen(false)}
            />
        )}
        
        {/* 4. Konten Utama Chat (Melebar ke Seluruh Sisa Ruang) */}
        {/* class flex-grow flex flex-col w-full memastikan ini mengambil sisa lebar dan tinggi */}
        <div className={`flex-grow flex flex-col w-full transition-all duration-300 ease-in-out z-10`}>

            {/* Header (tetap fixed di atas) */}
            <header className={`px-4 sm:px-6 lg:px-8 py-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-b dark:border-gray-700 sticky top-0 z-20 shadow-sm flex-shrink-0`}>
                <div className="flex items-center space-x-3">
                    {/* Tombol Toggle Sidebar Mobile */}
                    {!isSidebarOpen && (
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white rounded-lg lg:hidden"
                            aria-label="Buka Riwayat"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    )}
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
                        <MessageCircleHeart className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Talk Room</h1>
                </div>
            </header>

            {/* Container Konten Chat - Menghilangkan max-w-5xl mx-auto untuk full-width */}
            <div className="flex-grow w-full flex flex-col min-h-0 px-4 sm:px-6 lg:px-8 py-6 md:py-8 overflow-y-auto z-10">

                {/* Judul Ruang Curhat */}
                <div className="mb-6 flex-shrink-0 max-w-5xl mx-auto w-full">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Ruang Curhat</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Ruang aman untuk berbagi perasaan dengan AI
                    </p>
                </div>

                {/* Chat Window - Menghabiskan ruang vertikal yang tersisa, dibatasi lebarnya */}
                <div className="flex-grow min-h-0 mb-6 max-w-5xl mx-auto w-full">
                    <ChatWindow
                        conversation={currentConversation}
                        onSendMessage={handleSendMessage}
                        isLoading={isLoading}
                        // Jika Anda memiliki prop `isDisabled` di ChatWindow, ganti `isLoading` dengan nama prop yang benar.
                        // isDisabled={isLoading} 
                    />
                </div>

                {/* Tips Berbicara - Selalu di bawah input, dibatasi lebarnya */}
                <div className="mt-0 pt-4 flex-shrink-0 max-w-5xl mx-auto w-full">
                    <StyledPathWithLeaves />
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 rounded-2xl p-6 md:p-8 shadow-inner">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                            {/* Asumsi Anda memiliki ikon Shield dari lucide-react */}
                            <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mr-3" />
                            Tips Berbicara di Ruang Aman
                        </h3>
                        <ul className="space-y-3 text-sm md:text-base text-gray-700 dark:text-gray-300 list-none">

                            {/* Tip 1 */}
                            <li className="flex items-start">
                                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-lg leading-none mr-2 mt-[-1px]">•</span>
                                <span>
                                    <span className="font-semibold text-gray-800 dark:text-gray-100">Jujur dan Terbuka.</span> Tidak ada yang salah atau benar. Ruang ini adalah milikmu untuk melepaskan beban perasaan.
                                </span>
                            </li>

                            {/* Tip 2 */}
                            <li className="flex items-start">
                                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-lg leading-none mr-2 mt-[-1px]">•</span>
                                <span>
                                    <span className="font-semibold text-gray-800 dark:text-gray-100">Fokus pada Dirimu.</span> Gunakan "Saya merasa..." atau "Saya berpikir..." untuk mengekspresikan pengalamanmu.
                                </span>
                            </li>

                            {/* Tip 3 */}
                            <li className="flex items-start">
                                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-lg leading-none mr-2 mt-[-1px]">•</span>
                                <span>
                                    <span className="font-semibold text-gray-800 dark:text-gray-100">Privasi Terjamin.</span> Semua percakapan bersifat privat dan tersimpan secara lokal di perangkatmu.
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* SVG Wave/Footer */}
            <div className="relative h-32 w-full overflow-hidden flex-shrink-0 z-10">
                <motion.svg
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                    className="absolute top-0 w-full h-full"
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: 1,
                        transition: { duration: 1, delay: 0.5 },
                    }}
                >
                    {/* Path 1: Biru terang dengan opacity rendah */}
                    <motion.path
                        fill="#4079ff" // Mengambil warna biru dari gradien Journal Mood
                        fillOpacity="0.1"
                        d="M0,120V73.71c47.79-22.2,103.59-32.17,158-28,70.36,5.37,136.33,33.31,206.8,37.5C438.64,87.57,512.34,66.33,583,47.95c69.27-18,138.3-24.88,209.4-13.08,36.15,6,69.85,17.84,104.45,29.34C989.49,95,1113,134.29,1200,67.53V120Z"
                        initial={{ pathLength: 0, pathOffset: 1 }}
                        animate={{
                            pathLength: 1,
                            pathOffset: 0,
                            transition: {
                                duration: 3,
                                ease: "linear",
                                repeat: Infinity,
                                repeatType: "loop",
                            },
                        }}
                    />
                    {/* Path 2: Campuran biru-hijau dengan opacity sedang */}
                    <motion.path
                        fill="#40ffaa" // Mengambil warna hijau muda dari gradien Journal Mood
                        fillOpacity="0.2"
                        d="M0,120V104.19C13,83.08,27.64,63.14,47.69,47.95,99.41,8.73,165,9,224.58,28.42c31.15,10.15,60.09,26.07,89.67,39.8,40.92,19,84.73,46,130.83,49.67,36.26,2.85,70.9-9.42,98.6-31.56,31.77-25.39,62.32-62,103.63-73,40.44-10.79,81.35,6.69,119.13,24.28s75.16,39,116.92,43.05c59.73,5.85,113.28-22.88,168.9-38.84,30.2-8.66,59-6.17,87.09,7.5,22.43,10.89,48,26.93,60.65,49.24V120Z"
                        initial={{ pathLength: 0, pathOffset: 1 }}
                        animate={{
                            pathLength: 1,
                            pathOffset: 0,
                            transition: {
                                duration: 3.5,
                                ease: "linear",
                                repeat: Infinity,
                                repeatType: "loop",
                                delay: 0.2,
                            },
                        }}
                    />
                    {/* Path 3: Hijau terang dengan opacity lebih tinggi */}
                    <motion.path
                        fill="#40ffaa" // Mengambil warna hijau muda dari gradien Journal Mood
                        fillOpacity="0.3"
                        d="M0,120V114.37C149.93,61,314.09,48.68,475.83,77.43c43,7.64,84.23,20.12,127.61,26.46,59,8.63,112.48-12.24,165.56-35.4C827.93,42.78,886,24.76,951.2,30c86.53,7,172.46,45.71,248.8,84.81V120Z"
                        initial={{ pathLength: 0, pathOffset: 1 }}
                        animate={{
                            pathLength: 1,
                            pathOffset: 0,
                            transition: {
                                duration: 4,
                                ease: "linear",
                                repeat: Infinity,
                                repeatType: "loop",
                                delay: 0.4,
                            },
                        }}
                    />
                </motion.svg>
            </div>
        </div>
    </div>
);
}

export default TalkRoom;