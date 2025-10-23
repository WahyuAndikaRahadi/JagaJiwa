// File: Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  BarChart3,
  BookA,
  BookHeart,
  MessageCircleHeart,
  Sun,
  Moon,
  Menu,
  X,
  Brain,
} from 'lucide-react';

// === Brand Component ===
const Brand = () => (
  <div className="flex items-center space-x-2">
    <div className="w-10 h-10 rounded-xl flex items-center justify-center transform hover:scale-105 transition duration-300 ease-in-out">
      <img src="/public/img/jagaJiwa.png" alt="" />
    </div>
    <span className="text-xl font-extrabold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent tracking-tight dark:from-primary-400 dark:to-secondary-400">
      Jaga Jiwa
    </span>
  </div>
);

// ---

// === Navbar Component ===
function Navbar() {
  const location = useLocation();

  // === State ===
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State untuk menu mobile
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );

  // === Scroll listener ===
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  // === Theme handler ===
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false); // Fungsi untuk menutup menu

  // Close menu when route changes
  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  // === Navigation Items ===
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/about', icon: BookA, label: 'About' },
    { path: '/insight', icon: Brain, label: 'Insight' },
    { path: '/tracker', icon: BarChart3, label: 'Tracker' },
    { path: '/journal', icon: BookHeart, label: 'Journal' },
    { path: '/talkroom', icon: MessageCircleHeart, label: 'Talk' },
  ];

  const isActive = (path) => location.pathname === path;

  // Classes untuk Desktop
  const activeClassDesktop =
    'text-[#50b7f7] dark:text-[#1ff498]';
  const inactiveClassDesktop =
    'text-gray-600 hover:text-[#50b7f7] dark:text-gray-300 dark:hover:text-[#50b7f7]';

  // Classes untuk Mobile
  const activeClassMobile =
    'bg-primary-100/50 dark:bg-gray-700 text-primary-600 dark:text-primary-400 font-bold';
  const inactiveClassMobile =
    'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800';


  const navBackgroundClass = scrolled
    ? 'bg-white/50 backdrop-blur-xl dark:bg-gray-900/50'
    : 'bg-white/75 dark:bg-gray-900';

  return (
    <>
      {/* === Desktop Navigation === */}
      {/* Ganti md:block/sm:block menjadi lg:block */}
      <nav
        className={`hidden lg:block fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300 ${navBackgroundClass} ${
          scrolled ? 'shadow-lg' : ''
        }`}
      >
        <div className="flex items-center h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Brand (Left) */}
          <div className="absolute left-0 pl-4 sm:pl-6 lg:pl-8">
            <Brand />
          </div>

          {/* Nav Items (Center) */}
          {/* Ubah gap-0 menjadi gap-5 untuk tampilan lg */}
          <div className="flex gap-5 mx-auto w-fit p-1 rounded-xl">
            {navItems.map(({ path, icon: Icon, label }) => {
              const active = isActive(path);
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex-shrink-0 px-4 py-2 rounded-full flex items-center justify-center space-x-2 transition-all duration-200 ease-in-out ${
                    active ? activeClassDesktop : inactiveClassDesktop
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-semibold text-sm">{label}</span>
                </Link>
              );
            })}
          </div>

          {/* Dark Mode Button (Right) */}
          <div className="absolute right-0 pr-4 sm:pr-6 lg:pr-8">
            <button
              onClick={toggleDarkMode}
              aria-label={
                isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'
              }
              className="p-2 rounded-full transition-colors duration-200 ease-in-out text-gray-600 hover:bg-gray-100/70 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-primary-400 dark:outline-none dark:ring-2 dark:ring-primary-500"
            >
              {isDarkMode ? (
                <Sun className="w-6 h-6" />
              ) : (
                <Moon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* --- */}

      {/* === Mobile Header & Navigation === */}
      {/* Ganti md:hidden/sm:hidden menjadi lg:hidden */}
      <header
        className={`lg:hidden fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300 ${navBackgroundClass} shadow-lg`}
      >
        <div className="flex items-center justify-between h-full px-4">
          {/* Brand (Left) */}
          <Brand />

          {/* Menu Button (Right) */}
          <button
            onClick={toggleMenu}
            aria-label="Toggle Menu"
            className="p-2 rounded-full transition-colors duration-200 ease-in-out text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 focus:outline-none"
          >
            {isMenuOpen ? (
              <X className="w-7 h-7" />
            ) : (
              <Menu className="w-7 h-7" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {/* Ganti md:hidden/sm:hidden menjadi lg:hidden */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        } bg-black/50 dark:bg-black/70`}
        onClick={closeMenu} // Tutup menu saat klik di luar area menu
      >
        {/* Actual Menu Content */}
        <nav
          className={`fixed top-16 right-0 w-64 h-full bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 ease-out ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()} // Mencegah klik di dalam menu menutup overlay
        >
          <div className="flex flex-col p-4 space-y-2">
            {navItems.map(({ path, icon: Icon, label }) => {
              const active = isActive(path);
              return (
                <Link
                  key={path}
                  to={path}
                  onClick={closeMenu} // Tutup menu setelah navigasi
                  className={`flex items-center space-x-3 p-3 rounded-xl transition-colors duration-200 text-base ${
                    active ? activeClassMobile : inactiveClassMobile
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </Link>
              );
            })}

            <div className="pt-4 border-t border-gray-100 dark:border-gray-700 mt-2">
              {/* Dark Mode Toggle di dalam menu mobile */}
              <button
                onClick={() => {
                  toggleDarkMode();
                  closeMenu(); // Tutup menu setelah toggle
                }}
                className={`flex items-center space-x-3 p-3 w-full rounded-xl transition-colors duration-200 text-base ${inactiveClassMobile}`}
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                )}
                <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}

export default Navbar;