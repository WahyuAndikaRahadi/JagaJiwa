import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MoodTracker from './pages/MoodTracker';
import JournalMood from './pages/JournalMood';
import TalkRoom from './pages/TalkRoom';
import About from './pages/About';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-16 md:pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/tracker" element={<MoodTracker />} />
          <Route path="/journal" element={<JournalMood />} />
          <Route path="/talkroom" element={<TalkRoom />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
