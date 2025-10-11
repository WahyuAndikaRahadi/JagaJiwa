import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart3, BookHeart, MessageCircleHeart } from 'lucide-react';

// Komponen Logo/Brand
const Brand = () => (
  <div className="flex items-center space-x-2 pl-4">
    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl shadow-lg flex items-center justify-center transform hover:scale-105 transition duration-300 ease-in-out">
      <BookHeart className="w-6 h-6 text-white" fill="white" />
    </div>
    <span className="text-xl font-extrabold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent tracking-tight">
      Jaga Jiwa
    </span>
  </div>
);

function Navbar() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/tracker', icon: BarChart3, label: 'Tracker' },
    { path: '/journal', icon: BookHeart, label: 'Journal' },
    { path: '/talkroom', icon: MessageCircleHeart, label: 'Talk' },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Kelas Tailwind untuk state aktif dan tidak aktif
  const activeClass =
    'text-white bg-gradient-to-r from-primary-500 to-secondary-500 shadow-md shadow-primary-200/50';
  const inactiveClass =
    'text-gray-600 hover:bg-gray-100/70 hover:text-primary-600';

  return (
    <>
      {/* Desktop Navigation (Top Bar) */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50 transition-all duration-300 h-16">
        {/* Container utama navbar */}
        <div className="flex items-center justify-between h-full max-w-7xl mx-auto">
          {/* Kiri: Brand Logo */}
          <Brand />

          {/* Kanan: Navigasi */}
          <div className="flex space-x-1 p-1 rounded-xl bg-gray-50/50 border border-gray-100 mr-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex-grow px-4 py-2 rounded-lg flex items-center justify-center space-x-2
                    transition-all duration-200 ease-in-out
                    ${active ? activeClass : inactiveClass}
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-semibold text-sm">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation (Bottom Bar) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-xl shadow-gray-200/50 border-t border-gray-100 z-50 transition-all duration-300">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex flex-col items-center justify-center flex-1 h-full py-1 group
                  transition-colors duration-200 ease-in-out relative
                  ${active ? 'text-primary-600' : 'text-gray-500 hover:text-primary-500'}
                `}
              >
                {/* Titik indikator aktif */}
                {active && (
                  <div className="absolute top-0 w-1.5 h-1.5 rounded-full bg-primary-600 transform -translate-y-1 animate-pulse" />
                )}

                <Icon
                  className={`
                    w-6 h-6 transform transition-transform duration-200
                    ${active ? 'scale-105 stroke-2 text-primary-600' : 'group-hover:scale-110'}
                  `}
                />
                <span className="text-xs mt-1 font-medium leading-none">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

export default Navbar;



