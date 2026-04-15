'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Background3D from '@/components/Background3D';
import { Amiri } from 'next/font/google';

const amiri = Amiri({ 
  weight: ['400', '700'], 
  subsets: ['arabic'], 
  display: 'swap' 
});

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { delayChildren: 0.3, staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.5, y: 30, rotateX: 45 },
  show: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    rotateX: 0,
    transition: { type: 'spring' as const, stiffness: 200, damping: 15 } 
  }
};

// Extraction du minuteur dans un composant enfant 
// pour éviter que toute la page (et la 3D) ne se recharge chaque seconde.
function CountdownWidget() {
  const targetDate = new Date('2027-11-26T00:00:00Z').getTime();
  const [timeLeft, setTimeLeft] = useState({  
    mois: 0, semaines: 0, jours: 0, heures: 0, minutes: 0, secondes: 0 
  });
  const [totals, setTotals] = useState({
    totalSemaines: 0, totalJours: 0, totalHeures: 0, totalMinutes: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      const now = new Date().getTime();
      let d = targetDate - now;

      if (d > 0) {
        const msMois = 2629800000; 
        const msSemaine = 604800000; 
        const msJour = 86400000; 
        const msHeure = 3600000; 
        const msMinute = 60000; 

        setTotals({
          totalSemaines: Math.floor((targetDate - now) / msSemaine),
          totalJours: Math.floor((targetDate - now) / msJour),
          totalHeures: Math.floor((targetDate - now) / msHeure),
          totalMinutes: Math.floor((targetDate - now) / msMinute),
        });

        const mois = Math.floor(d / msMois); d -= mois * msMois;
        const semaines = Math.floor(d / msSemaine); d -= semaines * msSemaine;
        const jours = Math.floor(d / msJour); d -= jours * msJour;
        const heures = Math.floor(d / msHeure); d -= heures * msHeure;
        const minutes = Math.floor(d / msMinute); d -= minutes * msMinute;
        const secondes = Math.floor(d / 1000);

        setTimeLeft({ mois, semaines, jours, heures, minutes, secondes });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!mounted) return null;

  return (
    <>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap lg:justify-center gap-4 md:gap-6 mb-10"
      >
        {Object.entries(timeLeft).map(([unit, value]) => (
          <motion.div 
            key={unit} 
            variants={itemVariants}
            whileHover={{ 
              scale: 1.1, 
              translateY: -10, 
              rotateX: 10,
              rotateY: -10,
              boxShadow: "0 20px 40px -10px rgba(245,158,11,0.4)" 
            }}
            className="flex flex-col items-center justify-center p-4 md:p-6 bg-neutral-950/80 rounded-2xl border border-amber-900/40 shadow-inner shadow-amber-900/20 w-full lg:w-32 transform-style-3d"
          >
            <div className="relative h-12 md:h-16 w-full flex items-center justify-center overflow-hidden mb-2">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={value}
                  initial={{ y: 30, opacity: 0, rotateX: -90 }}
                  animate={{ y: 0, opacity: 1, rotateX: 0 }}
                  exit={{ y: -30, opacity: 0, rotateX: 90 }}
                  transition={{ type: "spring" as const, stiffness: 400, damping: 25 }}
                  className="absolute text-4xl md:text-5xl font-mono text-transparent bg-clip-text bg-gradient-to-br from-amber-100 via-amber-300 to-amber-600"
                >
                  {value.toString().padStart(2, '0')}
                </motion.span>
              </AnimatePresence>
            </div>
            
            <span className="text-xs md:text-sm text-amber-500/80 uppercase tracking-widest font-semibold z-10 relative">
              {unit}
            </span>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 30, filter: "blur(5px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ delay: 0.8, duration: 1, type: "spring" as const }}
        className="pt-8 border-t border-amber-900/30 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12"
      >
        <motion.div whileHover={{ scale: 1.1, color: "#fbbf24" }} className="flex flex-col cursor-default">
          <span className="text-2xl md:text-3xl font-mono text-amber-400 transition-colors duration-300">{totals.totalSemaines}</span>
          <span className="text-xs text-neutral-500 uppercase tracking-wider mt-1 transition-colors duration-300">Semaines au total</span>
        </motion.div>
        <div className="hidden sm:block w-px h-10 bg-amber-900/30"></div>
        <motion.div whileHover={{ scale: 1.1, color: "#fbbf24" }} className="flex flex-col cursor-default">
          <span className="text-2xl md:text-3xl font-mono text-amber-400 transition-colors duration-300">{totals.totalJours}</span>
          <span className="text-xs text-neutral-500 uppercase tracking-wider mt-1 transition-colors duration-300">Jours au total</span>
        </motion.div>
        <div className="hidden sm:block w-px h-10 bg-amber-900/30"></div>
        <motion.div whileHover={{ scale: 1.1, color: "#fbbf24" }} className="flex flex-col cursor-default">
          <span className="text-2xl md:text-3xl font-mono text-amber-400 transition-colors duration-300">{totals.totalHeures}</span>
          <span className="text-xs text-neutral-500 uppercase tracking-wider mt-1 transition-colors duration-300">Heures au total</span>
        </motion.div>
        <div className="hidden sm:block w-px h-10 bg-amber-900/30"></div>
        <motion.div whileHover={{ scale: 1.1, color: "#fbbf24" }} className="flex flex-col cursor-default">
          <span className="text-2xl md:text-3xl font-mono text-amber-400 transition-colors duration-300">{totals.totalMinutes}</span>
          <span className="text-xs text-neutral-500 uppercase tracking-wider mt-1 transition-colors duration-300">Minutes au total</span>
        </motion.div>
      </motion.div>
    </>
  );
}

// Le composant parent reste statique et très performant.
export default function ContractCountdown() {
  return (
    <div className="relative min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4 text-white font-sans selection:bg-amber-500 selection:text-white overflow-hidden perspective-[1000px]">
      
      <Background3D />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-5xl"
      >
        <motion.div
           animate={{ 
             y: [0, -5, 0],
             boxShadow: [
               "0 0 40px -15px rgba(245,158,11,0.2)",
               "0 0 60px -10px rgba(245,158,11,0.3)",
               "0 0 40px -15px rgba(245,158,11,0.2)"
             ]
           }}
           // Optimisation du breathing : plus lent, ombres allégées
           transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
           className="bg-neutral-900/40 backdrop-blur-2xl border border-amber-900/30 p-6 md:p-10 rounded-3xl text-center shadow-2xl transform-gpu"
        >
          
          <motion.h1 
            initial={{ y: -30, opacity: 0, filter: "blur(10px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{ delay: 0.2, duration: 1, type: "spring" as const }}
            whileHover={{ scale: 1.05, textShadow: "0px 0px 30px rgba(253,230,138,0.8)" }}
            className={`text-6xl md:text-8xl lg:text-[10rem] font-bold mb-12 tracking-normal text-transparent bg-clip-text bg-gradient-to-br from-amber-100 via-amber-300 to-amber-600 drop-shadow-sm leading-tight cursor-default origin-center ${amiri.className}`}
          >
            إن شاء الله
          </motion.h1>

          {/* Le minuteur s'occupe de ses propres re-rendus isolés */}
          <CountdownWidget />
          
        </motion.div>
      </motion.div>
    </div>
  );
}
