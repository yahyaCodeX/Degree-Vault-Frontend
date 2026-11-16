import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';

interface ProcessingOverlayProps {
  guci: string;
}

// The three things the backend actually does for a verification.
const STEPS = [
  'Looking up the credential on the blockchain ledger',
  'Recomputing the fingerprint from the university record',
  'Comparing it with the fingerprint anchored on-chain',
];

// The overlay mounts ~350 ms after VerifyPage starts its 1.9 s minimum wait,
// so 3 × 500 ms lets every step tick off before the result appears.
const STEP_MS = 500;
const HEX = '0123456789abcdef';

const randomHex = (n: number) => Array.from({ length: n }, () => HEX[Math.floor(Math.random() * 16)]).join('');

export default function ProcessingOverlay({ guci }: ProcessingOverlayProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [fingerprint, setFingerprint] = useState(() => randomHex(64));

  useEffect(() => {
    const steps = setInterval(() => setStepIndex((i) => Math.min(i + 1, STEPS.length)), STEP_MS);
    const scramble = setInterval(() => setFingerprint(randomHex(64)), 70);
    return () => { clearInterval(steps); clearInterval(scramble); };
  }, []);

  return (
    <div className="relative w-full max-w-xl mx-auto py-10 sm:py-16" role="status" aria-live="polite">
      <div className="text-center mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-brand">Verifying</p>
        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-content-main tracking-tight mt-2">
          {guci}
        </h2>
      </div>

      <div className="vault-card-elevated p-6 sm:p-8">
        <ol className="space-y-4">
          {STEPS.map((label, i) => {
            const done = i < stepIndex;
            const active = i === stepIndex;
            return (
              <motion.li
                key={label}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: done || active ? 1 : 0.4, x: 0 }}
                transition={{ duration: 0.25, delay: i * 0.05 }}
                className="flex items-center gap-3"
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                    done
                      ? 'bg-teal-brand border-teal-brand text-content-inverse'
                      : active
                        ? 'border-teal-brand/50 text-teal-brand'
                        : 'border-border-main text-content-muted'
                  }`}
                >
                  {done ? <Check size={14} strokeWidth={3} /> : active ? <Loader2 size={13} className="animate-spin" /> : <span className="text-[11px] font-bold">{i + 1}</span>}
                </span>
                <span className={`text-sm ${done || active ? 'text-content-main font-semibold' : 'text-content-muted'}`}>
                  {label}
                </span>
              </motion.li>
            );
          })}
        </ol>

        <div className="mt-7 pt-5 border-t border-border-subtle">
          <p className="text-[11px] font-bold uppercase tracking-wider text-content-muted mb-2">SHA-256 fingerprint</p>
          <p className="font-mono text-[11px] sm:text-xs leading-relaxed text-teal-brand/80 select-none" aria-hidden="true">
            <span className="block">{fingerprint.slice(0, 32)}</span>
            <span className="block">{fingerprint.slice(32)}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
