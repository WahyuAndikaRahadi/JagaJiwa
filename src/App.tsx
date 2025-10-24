import { Routes, Route, useLocation } from 'react-router-dom';
import { useRef, useEffect } from 'react';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import MoodTracker from './pages/MoodTracker';
import JournalMood from './pages/JournalMood';
import TalkRoom from './pages/TalkRoom';
import About from './pages/About';
import Insight from './pages/Insight';
import ArticleDetail from './pages/ArticleDetail';
import Footer from './components/Footer';

function App() {
  const mainContentRef = useRef(null); 
  
  const { pathname } = useLocation();

  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start' 
      }); 
    }
  }, [pathname]); 

  return (
    <div className="min-h-screen bg-gray-50">
      
      <Navbar />
      
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