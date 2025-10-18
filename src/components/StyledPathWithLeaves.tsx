import React from 'react';
import { motion } from 'framer-motion';

// Menggunakan tipe yang lebih aman untuk variants framer-motion
interface AnimationVariants {
  initial: { opacity: number; y: number };
  animate: { opacity: number; y: number; transition: { duration: number; ease: string } };
}

interface StyledPathWithLeavesProps {
  className?: string;
}

const StyledPathWithLeaves: React.FC<StyledPathWithLeavesProps> = ({ className = '' }) => {
  // Animation variants for the whole component
  const componentVariants: AnimationVariants = {
    initial: { opacity: 0, scale: 0.9, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  // Varian animasi untuk elemen daun agar muncul secara berurutan
  const leafVariants = {
    initial: { opacity: 0, scale: 0.2, y: 20 },
    animate: (i: number) => ({
      opacity: 1,
      scale: 1.5, // Mengatur skala dasar untuk daun agar lebih terlihat
      y: 0,
      transition: {
        delay: 0.3 + i * 0.05, // Penundaan berurutan untuk efek staggered
        duration: 0.4,
        ease: 'backOut',
      },
    }),
  };
  
  // Data untuk memposisikan dan mentransformasi BANYAK 'daun'
  // Posisi diatur secara acak di sepanjang sumbu X (dari 5% hingga 95%)
  const leavesData = [
    { x: '5%', y: '40%', scale: 1.2, rotate: 0 },
    { x: '15%', y: '15%', scale: 1.5, rotate: 45 },
    { x: '25%', y: '50%', scale: 1.8, rotate: -30 },
    { x: '35%', y: '45%', scale: 1.3, rotate: 90 },
    { x: '45%', y: '30%', scale: 1.6, rotate: -60 },
    { x: '55%', y: '55%', scale: 1.4, rotate: 120 },
    { x: '65%', y: '25%', scale: 1.7, rotate: -15 },
    { x: '75%', y: '40%', scale: 1.9, rotate: 75 },
    { x: '85%', y: '40%', scale: 1.5, rotate: -45 },
    { x: '95%', y: '40%', scale: 2.0, rotate: 135 },
    
    // Tambahan daun untuk membuat lebih ramai
    { x: '10%', y: '50%', scale: 1.3, rotate: -10 },
    { x: '30%', y: '20%', scale: 1.6, rotate: 60 },
    { x: '50%', y: '20%', scale: 1.9, rotate: -90 },
    { x: '70%', y: '45%', scale: 1.4, rotate: 15 },
    { x: '90%', y: '45%', scale: 1.7, rotate: -75 },
  ];

  // Variabel untuk memudahkan penyesuaian dark mode
  const GRADIENT_LIGHT_START = '#40ffaa'; // Hijau muda
  const GRADIENT_LIGHT_END = '#4079ff';   // Biru cerah
  
  // Menggunakan warna yang lebih kontras untuk Dark Mode
  const GRADIENT_DARK_START = '#f8ff40';  // Kuning cerah
  const GRADIENT_DARK_END = '#ff40f8';    // Ungu cerah

  return (
    // Kontainer dengan ukuran kecil (seperti hr) dan overflow hidden. 
    // Tinggi dibuat kecil agar lebih menyerupai HR
    <motion.div
      className={`relative w-full h-16 md:h-20 lg:h-24 overflow-visible my-16 ${className}`} // Mengubah tinggi menjadi kecil dan menambahkan margin vertikal
      variants={componentVariants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.1 }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        // ViewBox diubah agar jalur melengkung tampak penuh
        viewBox="0 0 1000 100" // ViewBox yang lebih rendah untuk fokus pada jalur
        preserveAspectRatio="none" // Penting agar SVG meregang penuh
        width="100%"
        height="100%"
        className='absolute top-0 left-0'
      >
        <defs>
          {/* Gradient untuk Light Mode */}
          <linearGradient id="gradientLight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={GRADIENT_LIGHT_START}/>
            <stop offset="100%" stopColor={GRADIENT_LIGHT_END}/>
          </linearGradient>

          {/* Gradient untuk Dark Mode */}
          <linearGradient id="gradientDark" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={GRADIENT_DARK_START}/>
            <stop offset="100%" stopColor={GRADIENT_DARK_END}/>
          </linearGradient>

          {/* Efek Bayangan */}
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="3" dy="3" stdDeviation="3" floodColor="#000000" floodOpacity="0.2"/>
          </filter>

          {/* Definisi bentuk 'Daun' (kecilkan sedikit) */}
          <path id="leaf" d="M0,0 C1,-4 2,-6 3,-4 C4,-2 3,2 0,4 C-3,2 -4,-2 -3,-4 C-2,-6 -1,-4 0,0 Z"/>
        </defs>

        {/* Gunakan fill/stroke yang berubah tergantung dark mode */}
        <g filter="url(#shadow)">
          {/* Jalur Melengkung Utama: Sekarang membentang dari 0 hingga 1000 (lebar penuh) */}
          <path 
            d="M0,50 C250,10 750,90 1000,50" 
            stroke="url(#gradientLight)" 
            strokeWidth="6" 
            fill="none"
            className="dark:stroke-[url(#gradientDark)]" // Stroke ganti di dark mode
          />
          
          {/* Elemen Daun */}
          {leavesData.map((leaf, index) => (
            <motion.use
              key={index}
              href="#leaf"
              // Menggunakan persentase x, y, dan transform untuk responsif.
              // Posisikan y agar berada di sekitar kurva (y=50)
              x={`${leaf.x}`} 
              y={`${leaf.y}`} 
              fill="url(#gradientLight)"
              transform={`scale(${leaf.scale * 0.7}) rotate(${leaf.rotate})`} // Skala daun disesuaikan agar tidak terlalu besar
              className="dark:fill-[url(#gradientDark)]" // Fill ganti di dark mode
              // Animasi menggunakan framer-motion
              variants={leafVariants}
              custom={index}
            />
          ))}
        </g>
      </svg>
    </motion.div>
  );
};

export default StyledPathWithLeaves;