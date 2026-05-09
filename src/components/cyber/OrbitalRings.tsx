import { motion } from 'framer-motion';
import {
  Shield, Lock, Fingerprint, KeyRound, ScanEye,
  ShieldCheck, Binary, Cpu, Network, Waypoints,
} from 'lucide-react';

const ICONS = [
  { Icon: Shield, delay: 0 },
  { Icon: Lock, delay: 0.5 },
  { Icon: Fingerprint, delay: 1.0 },
  { Icon: KeyRound, delay: 1.5 },
  { Icon: ScanEye, delay: 2.0 },
  { Icon: ShieldCheck, delay: 2.5 },
  { Icon: Binary, delay: 3.0 },
  { Icon: Cpu, delay: 3.5 },
  { Icon: Network, delay: 4.0 },
  { Icon: Waypoints, delay: 4.5 },
];

/**
 * OrbitalRings — Animated concentric rings with orbiting security icons
 * around a central point. Creates a radar/sonar-like security scanner effect.
 */
export default function OrbitalRings() {
  return (
    <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 mx-auto">
      {/* ── Concentric pulsing rings ────────────── */}
      {[1, 2, 3].map((ring) => (
        <motion.div
          key={ring}
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.08, 0.15, 0.08],
          }}
          transition={{
            duration: 3 + ring * 0.8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: ring * 0.4,
          }}
          className="absolute rounded-full"
          style={{
            inset: `${ring * 28}px`,
            border: `1px solid rgba(0, 240, 255, ${0.12 - ring * 0.02})`,
            boxShadow: `0 0 ${10 + ring * 4}px rgba(0, 240, 255, ${0.04 - ring * 0.008})`,
          }}
        />
      ))}

      {/* ── Rotating dashed ring ─────────────────── */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="absolute rounded-full"
        style={{
          inset: '15px',
          border: '1px dashed rgba(0, 240, 255, 0.08)',
        }}
      />

      {/* ── Counter-rotating dashed ring ─────────── */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
        className="absolute rounded-full"
        style={{
          inset: '55px',
          border: '1px dashed rgba(0, 255, 102, 0.06)',
        }}
      />

      {/* ── Orbiting security icons ──────────────── */}
      {ICONS.map(({ Icon, delay }, i) => {
        const angle = (360 / ICONS.length) * i;
        const radius = 42; // percentage from center

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + delay * 0.15, duration: 0.5, type: 'spring' }}
            className="absolute"
            style={{
              left: `${50 + radius * Math.cos((angle * Math.PI) / 180)}%`,
              top: `${50 + radius * Math.sin((angle * Math.PI) / 180)}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <motion.div
              animate={{
                y: [0, -3, 0, 3, 0],
                opacity: [0.25, 0.45, 0.25],
              }}
              transition={{
                duration: 3 + i * 0.3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.2,
              }}
              className="p-2 rounded-lg"
              style={{
                background: 'rgba(0, 240, 255, 0.04)',
                border: '1px solid rgba(0, 240, 255, 0.08)',
              }}
            >
              <Icon size={14} className="text-neon-cyan" />
            </motion.div>
          </motion.div>
        );
      })}

      {/* ── Radar sweep line ─────────────────────── */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0"
        style={{ transformOrigin: 'center center' }}
      >
        <div
          className="absolute top-1/2 left-1/2 h-[1px] origin-left"
          style={{
            width: '45%',
            background: 'linear-gradient(90deg, rgba(0, 240, 255, 0.3), transparent)',
            boxShadow: '0 0 8px rgba(0, 240, 255, 0.2)',
          }}
        />
      </motion.div>

      {/* ── Center glow ──────────────────────────── */}
      <div
        className="absolute rounded-full"
        style={{
          inset: '35%',
          background: 'radial-gradient(circle, rgba(0, 240, 255, 0.06), transparent 70%)',
        }}
      />
    </div>
  );
}
