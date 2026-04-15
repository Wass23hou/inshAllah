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
  // Référence locale : 15/04/2026 à 15h21 (Paris, UTC+2 en été)
  // Cible finale   : 27/11/2027 à 23h59 (Paris, UTC+1 en hiver)
  const targetDate = new Date('2027-11-27T23:59:00+01:00').getTime();
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
            className="flex flex-col items-center justify-center p-4 md:p-6 bg-neutral-950/80 rounded-2xl border border-amber-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] w-full lg:w-32 transform-style-3d relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
            <div className="relative h-12 md:h-16 w-full flex items-center justify-center overflow-hidden mb-2">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={value}
                  initial={{ y: 30, opacity: 0, rotateX: -90 }}
                  animate={{ y: 0, opacity: 1, rotateX: 0 }}
                  exit={{ y: -30, opacity: 0, rotateX: 90 }}
                  transition={{ type: "spring" as const, stiffness: 400, damping: 25 }}
                  className="absolute text-4xl md:text-5xl font-mono text-transparent bg-clip-text bg-gradient-to-br from-amber-200 via-amber-400 to-amber-700 font-bold"
                >
                  {value.toString().padStart(2, '0')}
                </motion.span>
              </AnimatePresence>
            </div>
            
            <span className="text-xs md:text-[10px] text-amber-500/90 uppercase tracking-[0.2em] font-bold z-10 relative">
              {unit}
            </span>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 30, filter: "blur(5px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ delay: 0.8, duration: 1, type: "spring" as const }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full mt-6"
      >
        {[
          { value: totals.totalSemaines, label: "Semaines" },
          { value: totals.totalJours,    label: "Jours" },
          { value: totals.totalHeures,   label: "Heures" },
          { value: totals.totalMinutes,  label: "Minutes" },
        ].map(({ value, label }) => (
          <motion.div
            key={label}
            whileHover={{ 
              scale: 1.05, 
              translateY: -8,
              boxShadow: "0 20px 40px -10px rgba(245,158,11,0.35)"
            }}
            className="flex flex-col items-center justify-center p-6 md:p-10 bg-neutral-950/80 rounded-2xl border border-amber-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] relative overflow-hidden cursor-default min-h-[140px] md:min-h-[180px]"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
            <span className="text-3xl md:text-5xl font-mono text-transparent bg-clip-text bg-gradient-to-br from-amber-200 via-amber-400 to-amber-700 font-bold relative z-10 leading-none tabular-nums">
              {value.toLocaleString('fr-FR')}
            </span>
            <span className="text-[10px] md:text-xs text-amber-500/90 uppercase tracking-[0.3em] font-bold mt-4 relative z-10">
              {label}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}

// Le composant parent reste statique et très performant.
export default function ContractCountdown() {
  return (
    <div className="relative min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4 text-white font-sans selection:bg-amber-600 selection:text-white overflow-hidden perspective-[1000px]">
      
      <Background3D />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-5xl"
      >
        <motion.div
           animate={{ 
             y: [0, -8, 0],
             boxShadow: [
               "0 0 50px -15px rgba(245,158,11,0.15)",
               "0 0 70px -10px rgba(245,158,11,0.28)",
               "0 0 50px -15px rgba(245,158,11,0.15)"
             ]
           }}
           transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
           className="bg-neutral-950/60 backdrop-blur-3xl border border-amber-900/40 p-8 md:p-12 rounded-[2rem] text-center shadow-2xl transform-gpu relative overflow-hidden"
        >
          {/* Accent lumineux en haut */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
          <motion.h1 
            initial={{ y: -30, opacity: 0, filter: "blur(10px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{ delay: 0.2, duration: 1, type: "spring" as const }}
            whileHover={{ scale: 1.02, textShadow: "0px 0px 40px rgba(253,230,138,0.6)" }}
            className={`text-xl md:text-3xl lg:text-4xl font-bold mb-12 pt-6 tracking-normal text-transparent bg-clip-text bg-gradient-to-br from-amber-100 via-amber-300 to-amber-700 drop-shadow-lg leading-loose cursor-default origin-center ${amiri.className}`}
          >
            لَا إِلَهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ
          </motion.h1>

          {/* Le minuteur s'occupe de ses propres re-rendus isolés */}
          <CountdownWidget />
          
        </motion.div>
      </motion.div>
    </div>
  );
}
