import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { Landmark, Link2, ScanSearch, Check, Lock } from 'lucide-react';

const STEPS = [
  {
    icon: Landmark,
    title: 'The university issues',
    body: 'The registrar issues a degree. Its details are turned into a SHA-256 fingerprint: a 64-character code unique to that exact record.',
  },
  {
    icon: Link2,
    title: 'The blockchain remembers',
    body: 'The fingerprint is written to the blockchain ledger. From then on nobody can edit it, not even the university. A degree can only be publicly revoked.',
  },
  {
    icon: ScanSearch,
    title: 'Anyone verifies',
    body: 'An employer enters a roll number or scans the QR code. The record is fingerprinted again and compared. Same fingerprint means authentic.',
  },
];

// Same record and fingerprint as the "Try to forge it" demo above.
const FINGERPRINT = '900f3221…31d78fd';

/**
 * Animation phases, looped while the section is on screen:
 *   travel → the diploma moves from the university into the chain
 *   hash   → it comes out as a fingerprint, scrambling until it settles
 *   scan   → the verifier scans the fingerprint
 *   match  → the fingerprint is confirmed
 */
type Phase = 'rest' | 'travel' | 'hash' | 'scan' | 'match';
const TIMELINE: [Phase, number][] = [
  ['rest', 500],
  ['travel', 1500],
  ['hash', 1100],
  ['scan', 900],
  ['match', 1800],
];

const CAPTIONS: Record<Phase, string> = {
  rest: 'A degree is issued at the university.',
  travel: 'Its details are sent to the blockchain…',
  hash: '…where they become a SHA-256 fingerprint, locked forever.',
  scan: 'An employer recomputes the fingerprint from the record…',
  match: 'Fingerprints match. The degree is authentic.',
};

const ACTIVE_STEP: Record<Phase, number> = { rest: 0, travel: 0, hash: 1, scan: 2, match: 2 };

const HEX = '0123456789abcdef';
const scramble = () =>
  FINGERPRINT.replace(/[0-9a-f]/g, () => HEX[Math.floor(Math.random() * 16)]);

export default function HowItWorksFlow() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-120px' });
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>('match');
  const [hashText, setHashText] = useState(FINGERPRINT);

  // Drive the timeline only while visible; a still "match" frame otherwise.
  useEffect(() => {
    if (!inView || reduceMotion) {
      setPhase('match');
      return;
    }
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const next = () => {
      const [p, ms] = TIMELINE[i];
      setPhase(p);
      i = (i + 1) % TIMELINE.length;
      timer = setTimeout(next, ms);
    };
    next();
    return () => clearTimeout(timer);
  }, [inView, reduceMotion]);

  // Scramble the fingerprint while it is being computed.
  useEffect(() => {
    if (phase !== 'hash') {
      setHashText(FINGERPRINT);
      return;
    }
    const id = setInterval(() => setHashText(scramble()), 60);
    const settle = setTimeout(() => { clearInterval(id); setHashText(FINGERPRINT); }, 750);
    return () => { clearInterval(id); clearTimeout(settle); };
  }, [phase]);

  const showHash = phase === 'hash' || phase === 'scan' || phase === 'match';
  const active = ACTIVE_STEP[phase];

  return (
    <div ref={ref}>
      <ol className="relative grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
        {/* Track between the step icons (desktop). Steps render after it, so icons cover it. */}
        <div className="hidden md:block absolute top-7 left-[16.6%] right-[16.6%] h-px" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-brand/0 via-teal-brand/40 to-teal-brand/0" />

          {/* 1 → 2: the diploma travels into the chain */}
          <AnimatePresence>
            {phase === 'travel' && (
              <motion.div
                key="doc"
                className="absolute top-0 -translate-x-1/2 -translate-y-1/2"
                initial={{ left: '0%', opacity: 0 }}
                animate={{ left: '50%', opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ left: { duration: 1.4, ease: 'easeInOut' }, opacity: { duration: 0.2 } }}
              >
                <MiniDiploma />
              </motion.div>
            )}
          </AnimatePresence>

          {/* 2 → parked between 2 and 3: the fingerprint */}
          <AnimatePresence>
            {showHash && (
              <motion.div
                key="hash"
                className="absolute top-0 -translate-x-1/2 -translate-y-1/2"
                initial={{ left: '50%', opacity: 0, scale: 0.6 }}
                animate={{ left: '72%', opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-mono text-[11px] font-semibold whitespace-nowrap shadow-card transition-colors duration-300 ${
                    phase === 'match'
                      ? 'bg-status-verified-bg border-status-verified-border text-status-verified-text'
                      : 'bg-surface-card border-teal-brand/40 text-teal-brand'
                  }`}
                >
                  {phase === 'match' ? <Check size={12} strokeWidth={3} /> : <Lock size={11} />}
                  {hashText}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 3 → fingerprint: the verifier's scan beam */}
          <AnimatePresence>
            {phase === 'scan' && (
              <motion.div
                key="scan"
                className="absolute -top-px h-[3px] rounded-full bg-gradient-to-l from-teal-brand to-teal-brand/0"
                initial={{ left: '100%', width: '0%' }}
                animate={{ left: '84%', width: '16%' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              />
            )}
          </AnimatePresence>
        </div>

        {STEPS.map((step, i) => {
          const isActive = i === active;
          return (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.45, delay: i * 0.12 }}
              className="relative text-center px-2"
            >
              <div
                className={`relative mx-auto w-14 h-14 rounded-full bg-surface-card border flex items-center justify-center transition-all duration-300 ${
                  isActive ? 'border-teal-brand shadow-[var(--shadow-button-primary-hover)] scale-110' : 'border-teal-brand/30 shadow-card'
                }`}
              >
                {isActive && !reduceMotion && (
                  <motion.span
                    key={phase}
                    className="absolute inset-0 rounded-full border-2 border-teal-brand"
                    initial={{ scale: 1, opacity: 0.6 }}
                    animate={{ scale: 1.6, opacity: 0 }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                    aria-hidden="true"
                  />
                )}
                <step.icon size={22} className="text-teal-brand" />
                <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-teal-brand text-content-inverse text-[11px] font-bold flex items-center justify-center shadow-sm">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-semibold text-content-main mt-5 tracking-tight">
                {step.title}
              </h3>
              <p className="text-sm text-content-secondary mt-2.5 leading-relaxed max-w-xs mx-auto">
                {step.body}
              </p>
            </motion.li>
          );
        })}
      </ol>

      {/* Narration of the animation (desktop, where the animation runs) */}
      <div className="hidden md:flex justify-center mt-10 h-6" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.p
            key={phase}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className={`text-sm font-semibold ${phase === 'match' ? 'text-status-verified' : 'text-content-secondary'}`}
          >
            {CAPTIONS[phase]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

/** A tiny ivory diploma with a gold border, used as the travelling document. */
function MiniDiploma() {
  return (
    <span className="block w-9 h-11 rounded-[3px] bg-[#FCFAF2] border-2 border-[#C8A966] shadow-card p-1">
      <span className="block h-[3px] w-4 mx-auto rounded bg-[#1E3A8A]/70" />
      <span className="block h-[2px] w-5 mx-auto mt-1.5 rounded bg-slate-400/70" />
      <span className="block h-[2px] w-4 mx-auto mt-1 rounded bg-slate-400/70" />
      <span className="block w-2.5 h-2.5 rounded-full bg-[#C8A966] ml-auto mt-1.5" />
    </span>
  );
}
