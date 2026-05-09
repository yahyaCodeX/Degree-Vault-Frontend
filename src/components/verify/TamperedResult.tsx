import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, AlertTriangle, ArrowLeft, Skull } from 'lucide-react';
import { GlassCard, GlowingBadge, NeonButton } from '../ui';

interface TamperedResultProps {
  message: string;
  degreeId: string;
  onReset: () => void;
}

/**
 * TamperedResult — Displayed when a degree is detected as tampered.
 * Features violent UI shake, red screen tint, and a glitch-effect warning.
 * The entire screen briefly flashes red, then settles into a danger state.
 */
export default function TamperedResult({ message, degreeId, onReset }: TamperedResultProps) {
  const [showFlash, setShowFlash] = useState(true);
  const [glitchActive, setGlitchActive] = useState(true);

  useEffect(() => {
    // Red flash fades after 600ms
    const flashTimer = setTimeout(() => setShowFlash(false), 600);
    // Glitch effect runs for 3 seconds then calms down
    const glitchTimer = setTimeout(() => setGlitchActive(false), 3000);

    return () => {
      clearTimeout(flashTimer);
      clearTimeout(glitchTimer);
    };
  }, []);

  return (
    <>
      {/* ── Red Screen Flash Overlay ──────────────────── */}
      <motion.div
        initial={{ opacity: 0.4 }}
        animate={{ opacity: showFlash ? 0.15 : 0 }}
        transition={{ duration: 0.6 }}
        className="fixed inset-0 z-40 pointer-events-none"
        style={{ background: 'radial-gradient(circle at center, #FF003C, transparent 70%)' }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-2xl mx-auto relative z-10"
      >
        {/* ── Shake Container ─────────────────────────── */}
        <motion.div
          animate={{
            x: [0, -8, 8, -6, 6, -4, 4, -2, 2, 0],
            rotate: [0, -0.5, 0.5, -0.3, 0.3, -0.2, 0.2, 0, 0, 0],
          }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          {/* ── Warning Header ─────────────────────────── */}
          <div className="text-center mb-8">
            {/* Danger icon with pulse */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 12 }}
              className="inline-flex mb-5"
            >
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(255, 0, 60, 0.3), 0 0 60px rgba(255, 0, 60, 0.1)',
                    '0 0 40px rgba(255, 0, 60, 0.5), 0 0 80px rgba(255, 0, 60, 0.2)',
                    '0 0 20px rgba(255, 0, 60, 0.3), 0 0 60px rgba(255, 0, 60, 0.1)',
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{
                  background: 'radial-gradient(circle, rgba(255, 0, 60, 0.2) 0%, rgba(255, 0, 60, 0.03) 70%)',
                  border: '2px solid rgba(255, 0, 60, 0.4)',
                }}
              >
                <ShieldAlert size={42} className="text-neon-red" />
              </motion.div>
            </motion.div>

            {/* ── Glitch Text ──────────────────────────── */}
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neon-red text-glow-red">
                CRYPTOGRAPHIC MISMATCH
              </h2>

              {/* Glitch duplicate layers */}
              {glitchActive && (
                <>
                  <motion.h2
                    animate={{
                      x: [-2, 2, -1, 1, 0],
                      opacity: [0, 0.8, 0, 0.6, 0],
                    }}
                    transition={{ duration: 0.15, repeat: Infinity, repeatType: 'mirror' }}
                    className="absolute inset-0 text-2xl sm:text-3xl font-extrabold text-neon-cyan"
                    style={{ clipPath: 'inset(0 0 65% 0)' }}
                    aria-hidden
                  >
                    CRYPTOGRAPHIC MISMATCH
                  </motion.h2>
                  <motion.h2
                    animate={{
                      x: [2, -2, 1, -1, 0],
                      opacity: [0, 0.6, 0, 0.8, 0],
                    }}
                    transition={{ duration: 0.12, repeat: Infinity, repeatType: 'mirror' }}
                    className="absolute inset-0 text-2xl sm:text-3xl font-extrabold text-neon-red/50"
                    style={{ clipPath: 'inset(60% 0 0 0)' }}
                    aria-hidden
                  >
                    CRYPTOGRAPHIC MISMATCH
                  </motion.h2>
                </>
              )}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-sm text-neon-red/60 mt-3 uppercase tracking-widest font-mono"
            >
              DETECTED
            </motion.p>
          </div>

          {/* ── Warning Details Card ───────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard glowColor="red" className="p-6 mb-4" hoverGlow={false}>
              <div className="flex items-start gap-4">
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center mt-0.5"
                  style={{
                    background: 'rgba(255, 0, 60, 0.1)',
                    border: '1px solid rgba(255, 0, 60, 0.2)',
                  }}
                >
                  <AlertTriangle size={20} className="text-neon-red" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <GlowingBadge variant="red" size="sm" pulse>
                      <Skull size={10} /> INTEGRITY FAILURE
                    </GlowingBadge>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed">
                    {message || 'The document hash does not match the on-chain record. This document may have been altered after issuance.'}
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* ── Technical Details ──────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <GlassCard className="p-5 mb-6" hoverGlow={false}>
              <h3 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">
                Incident Report
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/30">Degree ID</span>
                  <span className="text-xs font-mono text-neon-red/70">{degreeId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/30">Verification Status</span>
                  <span className="text-xs font-mono text-neon-red">FAILED — TAMPERED</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/30">Timestamp</span>
                  <span className="text-xs font-mono text-white/40">{new Date().toISOString()}</span>
                </div>
              </div>

              {/* Warning banner */}
              <motion.div
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mt-4 p-3 rounded-lg text-center"
                style={{
                  background: 'rgba(255, 0, 60, 0.05)',
                  border: '1px solid rgba(255, 0, 60, 0.15)',
                }}
              >
                <p className="text-[11px] text-neon-red/70 font-semibold tracking-wide">
                  ⚠ DO NOT ACCEPT THIS DOCUMENT — Contact the issuing institution immediately
                </p>
              </motion.div>
            </GlassCard>
          </motion.div>
        </motion.div>

        {/* ── Back Button ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center"
        >
          <NeonButton variant="ghost" size="md" onClick={onReset} icon={<ArrowLeft size={16} />}>
            Verify Another Degree
          </NeonButton>
        </motion.div>
      </motion.div>
    </>
  );
}
