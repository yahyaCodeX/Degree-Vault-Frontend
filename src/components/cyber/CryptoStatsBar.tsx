import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const STATS = [
  { label: 'ENCRYPTION', value: 'AES-256-GCM' },
  { label: 'HASH', value: 'SHA-256' },
  { label: 'CHAIN', value: 'ETHEREUM' },
  { label: 'CONSENSUS', value: 'POS' },
  { label: 'STORAGE', value: 'IPFS' },
  { label: 'KEY SIZE', value: '4096-BIT' },
];

/**
 * CryptoStatsBar — A horizontal bar showing cryptographic protocol parameters.
 * Adds a technical/secure feel to the UI.
 */
export default function CryptoStatsBar() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % STATS.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
    >
      {STATS.map((stat, i) => (
        <motion.div
          key={stat.label}
          animate={{
            opacity: i === activeIndex ? 1 : 0.3,
            scale: i === activeIndex ? 1.05 : 1,
          }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-1.5"
        >
          <span className="text-[9px] text-white/20 uppercase tracking-[0.15em] font-semibold">
            {stat.label}
          </span>
          <span
            className="text-[9px] font-mono uppercase tracking-wider"
            style={{
              color: i === activeIndex ? 'rgba(0, 240, 255, 0.7)' : 'rgba(0, 240, 255, 0.2)',
            }}
          >
            {stat.value}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}
