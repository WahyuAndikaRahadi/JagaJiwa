// File: Navbar.jsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart3,BookA, BookHeart, MessageCircleHeart } from 'lucide-react';

// === Brand Component ===
const Brand = () => (
  <div className="flex items-center space-x-2 pl-0 lg:pl-4 mr-4">
    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl shadow-lg flex items-center justify-center transform hover:scale-105 transition duration-300 ease-in-out">
      <BookHeart className="w-6 h-6 text-white" fill="white" />
    </div>
    <span className="text-xl font-extrabold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent tracking-tight">
      Jaga Jiwa
    </span>
  </div>
);

// === Navbar Component ===
function Navbar() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/about', icon: BookA, label: 'About' },
    { path: '/tracker', icon: BarChart3, label: 'Tracker' },
    { path: '/journal', icon: BookHeart, label: 'Journal' },
    { path: '/talkroom', icon: MessageCircleHeart, label: 'Talk' },
  ];

  const isActive = (path) => location.pathname === path;

  const activeClass =
    'text-white bg-gradient-to-r from-primary-500 to-secondary-500 shadow-md shadow-primary-200/50';
  const inactiveClass =
    'text-gray-600 hover:bg-gray-100/70 hover:text-primary-600';

  return (
    <>
      {/* === Desktop Navigation (Top Bar) === */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50 h-16 transition-all duration-300">
        <div className="flex items-center h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Brand Logo (Absolute Left) */}
          <div className="absolute left-0 pl-4 sm:pl-6 lg:pl-8">
            <Brand />
          </div>

          {/* Center Navigation */}
          <div className="flex gap-0 lg:gap-5 mx-auto w-fit p-1 rounded-xl ">
            {navItems.map(({ path, icon: Icon, label }) => {
              const active = isActive(path);
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex-shrink-0 px-4 py-2 rounded-full flex items-center justify-center space-x-2 transition-all duration-200 ease-in-out ${
                    active ? activeClass : inactiveClass
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-semibold text-sm">{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* === Mobile Navigation (Bottom Bar) === */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-xl shadow-gray-200/50 border-t border-gray-100 z-50 transition-all duration-300">
        <div className="flex items-center justify-around h-16">
          {navItems.map(({ path, icon: Icon, label }) => {
            const active = isActive(path);
            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center justify-center flex-1 h-full py-1 group transition-colors duration-200 ease-in-out relative ${
                  active
                    ? 'text-primary-600'
                    : 'text-gray-500 hover:text-primary-500'
                }`}
              >
                {/* Active Indicator */}
                {active && (
                  <div className="absolute top-0 w-1.5 h-1.5 rounded-full bg-primary-600 transform -translate-y-1 animate-pulse" />
                )}

                <Icon
                  className={`w-6 h-6 transform transition-transform duration-200 ${
                    active
                      ? 'scale-105 stroke-2 text-primary-600'
                      : 'group-hover:scale-110'
                  }`}
                />
                <span className="text-xs mt-1 font-medium leading-none">
                  {label}
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
