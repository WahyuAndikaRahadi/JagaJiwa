import React from 'react';
import { motion } from 'framer-motion';

interface AnimationVariants {
  initial: { opacity: number; y: number; scale: number };
  animate: { 
    opacity: number; 
    scale: number; 
    y: number; 
    transition: { duration: number; ease: string } 
  };
}

interface StyledPathWithLeavesProps {
  className?: string;
}

const StyledPathWithLeaves: React.FC<StyledPathWithLeavesProps> = ({ className = '' }) => {
  const componentVariants: AnimationVariants = {
    initial: { opacity: 0, scale: 0.9, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const leafVariants: any = {
    initial: { opacity: 0, scale: 0.2, y: 20 },
    animate: (i: number) => ({
      opacity: 1,
      scale: 1.5, 
      y: 0,
      transition: {
        delay: 0.3 + i * 0.05, 
        duration: 0.4,
        ease: 'backOut',
      },
    }),
  };
  
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
    
    { x: '10%', y: '50%', scale: 1.3, rotate: -10 },
    { x: '30%', y: '20%', scale: 1.6, rotate: 60 },
    { x: '50%', y: '20%', scale: 1.9, rotate: -90 },
    { x: '70%', y: '45%', scale: 1.4, rotate: 15 },
    { x: '90%', y: '45%', scale: 1.7, rotate: -75 },
  ];

  const GRADIENT_LIGHT_START = '#40ffaa'; 
  const GRADIENT_LIGHT_END = '#4079ff'; 
  
  const GRADIENT_DARK_START = '#f8ff40'; 
  const GRADIENT_DARK_END = '#ff40f8'; 

  return (
    <motion.div
      className={`relative w-full h-16 md:h-20 lg:h-24 overflow-visible my-16 ${className}`} 
      variants={componentVariants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.1 }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 100" 
        preserveAspectRatio="none" 
        width="100%"
        height="100%"
        className='absolute top-0 left-0'
      >
        <defs>
          <linearGradient id="gradientLight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={GRADIENT_LIGHT_START}/>
            <stop offset="100%" stopColor={GRADIENT_LIGHT_END}/>
          </linearGradient>

          <linearGradient id="gradientDark" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={GRADIENT_DARK_START}/>
            <stop offset="100%" stopColor={GRADIENT_DARK_END}/>
          </linearGradient>

          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="3" dy="3" stdDeviation="3" floodColor="#000000" floodOpacity="0.2"/>
          </filter>

          <path id="leaf" d="M0,0 C1,-4 2,-6 3,-4 C4,-2 3,2 0,4 C-3,2 -4,-2 -3,-4 C-2,-6 -1,-4 0,0 Z"/>
        </defs>

        <g filter="url(#shadow)">
          <path 
            d="M0,50 C250,10 750,90 1000,50" 
            stroke="url(#gradientLight)" 
            strokeWidth="6" 
            fill="none"
            className="dark:stroke-[url(#gradientDark)]" 
          />
          
          {leavesData.map((leaf, index) => (
            <motion.use
              key={index}
              href="#leaf"
              x={`${leaf.x}`} 
              y={`${leaf.y}`} 
              fill="url(#gradientLight)"
              transform={`scale(${leaf.scale * 0.7}) rotate(${leaf.rotate})`} 
              className="dark:fill-[url(#gradientDark)]" 
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