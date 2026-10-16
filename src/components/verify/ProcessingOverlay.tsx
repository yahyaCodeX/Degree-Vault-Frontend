import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Loader2 } from 'lucide-react';

interface ProcessingOverlayProps {
  guci: string;
}

const VERIFICATION_STEPS = [
  'Querying blockchain registry for credential...',
  'Recomputing deterministic data hash from on-chain fields...',
  'Comparing credential hash against registered record...',
  'Verifying issuer signature and GUCI integrity...',
  'Finalizing credential authenticity report...',
];

export default function ProcessingOverlay({ guci }: ProcessingOverlayProps) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < VERIFICATION_STEPS.length - 1 ? prev + 1 : prev));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-xl mx-auto py-12">
      {/* ── Ambient Glow behind processing card ── */}
      <div
        className="absolute inset-0 rounded-3xl bg-gradient-to-r from-teal-brand/12 via-secondary-blue/12 to-teal-brand/12 blur-2xl -z-10 opacity-70"
        aria-hidden="true"
      />

      <div
        className="bg-surface-card border border-border-main rounded-2xl p-8 sm:p-10 text-center relative z-10"
        style={{
          boxShadow: 'var(--shadow-elevated), var(--inset-card-highlight)',
        }}
      >
        {/* Animated shield spinner */}
        <div className="relative w-18 h-18 mx-auto mb-6 flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-surface-teal-subtle to-surface-blue-subtle text-teal-brand border border-teal-brand/25 flex items-center justify-center shadow-xs">
            <Shield size={30} strokeWidth={2.3} />
          </div>
          <div className="absolute -inset-1.5 border-2 border-teal-brand/20 border-t-teal-brand rounded-full animate-spin" />
        </div>

        {/* Heading */}
        <h2 className="text-xl sm:text-2xl font-extrabold text-content-main mb-1.5 tracking-tight">
          Verifying Credential
        </h2>
        <p className="text-xs font-mono text-content-secondary mb-6">
          Querying record for <span className="text-content-main font-bold">{guci}</span>
        </p>

        {/* Current status step */}
        <div className="p-3.5 rounded-xl bg-surface-page/70 border border-border-subtle max-w-md mx-auto mb-6 shadow-2xs">
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center gap-2"
          >
            <Loader2 size={15} className="animate-spin text-teal-brand" />
            <span className="text-xs font-semibold text-content-main">
              {VERIFICATION_STEPS[stepIndex]}
            </span>
          </motion.div>
        </div>

        {/* Progress indicator bars */}
        <div className="flex items-center justify-center gap-1.5">
          {VERIFICATION_STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i <= stepIndex
                  ? 'w-7 bg-teal-brand'
                  : 'w-1.5 bg-border-main'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
