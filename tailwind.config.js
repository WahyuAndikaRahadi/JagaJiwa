/** @type {import('tailwindcss').Config} */
module.exports = {
  // Pastikan mode gelap diatur ke 'class'
  darkMode: 'class', 
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    // tambahkan path file Anda yang lain
  ],
  theme: {
    extend: {
      colors: {
        // === Definisi Warna Kustom ===
        // Atur palet warna Anda di sini
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          dark: '#0be084',
        },
        secondary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          dark: '#07798d',
        }
        // Anda juga harus mendefinisikan warna-warna lain
        // seperti indigo dan rose jika belum ada di palet default.
      },
      // ... animasi kustom, dll.
    },
  },
  plugins: [],
};