import { Routes, Route, useLocation } from 'react-router-dom'; // Menambahkan useLocation di sini
import React, { useRef, useEffect } from 'react'; // Menambahkan useEffect
// Hapus import ScrollToTop
import Navbar from './components/Navbar';
// ... (Import komponen lainnya)
import Home from './pages/Home';
import MoodTracker from './pages/MoodTracker';
import JournalMood from './pages/JournalMood';
import TalkRoom from './pages/TalkRoom';
import About from './pages/About';
import Insight from './pages/Insight';
import ArticleDetail from './pages/ArticleDetail';
import Footer from './components/Footer';

function App() {
  // 1. Buat Ref untuk elemen <main>
  const mainContentRef = useRef(null); 
  
  // 2. Ambil pathname dari useLocation
  const { pathname } = useLocation();

  // 3. Pindahkan logika scroll ke dalam useEffect di App
  useEffect(() => {
    // Memastikan elemen target tersedia
    if (mainContentRef.current) {
      // Menggunakan scrollIntoView pada elemen <main>
      // 'block: "start"' memastikan elemen berada di bagian atas viewport (tepat di bawah Navbar)
      mainContentRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start' 
      }); 
    }
  }, [pathname]); // Efek dipanggil setiap kali rute (pathname) berubah

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hapus pemanggilan ScrollToTop */}
      
      <Navbar />
      {/* Pasang Ref ke elemen <main> */}
      <main ref={mainContentRef} className="pt-16 md:pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/tracker" element={<MoodTracker />} />
          <Route path="/journal" element={<JournalMood />} />
          <Route path="/talkroom" element={<TalkRoom />} />
          <Route path="/insight" element={<Insight />} />
          <Route path="/insight/artikel/:articleId" element={<ArticleDetail />} />
        </Routes>
        <Footer />
      </main>
    </div>
  );
}

export default App;
