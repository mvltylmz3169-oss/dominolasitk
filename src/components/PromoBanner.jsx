'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiSparkles, HiBadgeCheck } from 'react-icons/hi';

export default function PromoBanner() {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const items = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 2 + Math.random() * 3,
      size: Math.random() * 4 + 2,
    }));
    setStars(items);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60]">
      {/* Ramazan Kampanyası Banner - En Üst */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-950 text-white h-[38px] px-3 overflow-hidden relative"
      >
        {/* Animated background shine - gold */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/10 to-transparent -skew-x-12"
          animate={{
            x: ['-200%', '200%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2,
            ease: 'easeInOut',
          }}
        />

        {/* Twinkling Stars Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {stars.map((star) => (
            <motion.div
              key={star.id}
              className="absolute text-amber-300/70"
              style={{
                left: `${star.left}%`,
                top: `${10 + Math.random() * 60}%`,
                fontSize: `${star.size}px`,
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: star.duration,
                repeat: Infinity,
                delay: star.delay,
                ease: 'easeInOut',
              }}
            >
              ✦
            </motion.div>
          ))}
        </div>

        {/* Animated Crescent Moon - Left to Right */}
        <motion.div
          className="absolute bottom-0.5 text-lg"
          animate={{
            x: ['-50px', 'calc(100vw + 50px)'],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          🌙
        </motion.div>

        {/* Subtle gold particle lines */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-[1px] bg-gradient-to-r from-transparent via-amber-400/30 to-transparent"
            style={{
              top: `${20 + i * 12}%`,
              width: '25px',
            }}
            animate={{
              x: ['-50px', 'calc(100vw + 50px)'],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'linear',
            }}
          />
        ))}
        
        {/* Content Container */}
        <div className="relative h-full flex items-center justify-center">
          {/* Center - Main Message */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs font-bold tracking-wide bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent">
                RAMAZAN KAMPANYASI
              </span>
              <span className="text-[9px] sm:text-[11px] font-medium text-white/90">
                Tüm Lastiklerde %45'e varan indirim
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Continental Yetkili Satıcısı - Kış Kampanyası ile Navbar Arasında */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-zinc-900 via-neutral-800 to-zinc-900 text-white h-[28px] px-3 overflow-hidden relative"
      >
        {/* Subtle animated shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12"
          animate={{
            x: ['-200%', '200%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 4,
            ease: 'easeInOut',
          }}
        />
        
        <div className="relative h-full flex items-center justify-center gap-2">
          <HiBadgeCheck className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[10px] sm:text-xs font-semibold tracking-wide text-gray-200">
            Continental Yetkili Satıcısı
          </span>
          <HiBadgeCheck className="w-3.5 h-3.5 text-amber-400" />
        </div>
      </motion.div>
    </div>
  );
}
