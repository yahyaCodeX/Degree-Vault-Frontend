import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap } from 'lucide-react';
import { GlowingBadge } from '../components/ui';
import VaultDoor from '../components/verify/VaultDoor';
import ProcessingOverlay from '../components/verify/ProcessingOverlay';
import AuthenticResult from '../components/verify/AuthenticResult';
import TamperedResult from '../components/verify/TamperedResult';
import NotFoundResult from '../components/verify/NotFoundResult';
import HexRain from '../components/cyber/HexRain';
import OrbitalRings from '../components/cyber/OrbitalRings';
import SecurityTicker from '../components/cyber/SecurityTicker';
import FloatingParticles from '../components/cyber/FloatingParticles';
import CryptoStatsBar from '../components/cyber/CryptoStatsBar';
import { verifyDegree } from '../services/api';

type VerifyState = 'idle' | 'processing' | 'authentic' | 'tampered' | 'not_found' | 'error';

interface VerifyDegreeResponse {
  degreeId: string;
  status: string;
  message: string;
  studentId: string;
  studentName: string;
  fatherName: string;
  department: string;
  cgpa: string;
  documentHash: string;
  ipfsCid: string;
  issuerAddress: string;
  issueDate: number;
  verified: boolean;
  authentic: boolean;
  tampered: boolean;
  integrityMessage: string;
}

/**
 * VerifyPage — The Public Verification Portal
 * Enhanced with cybersecurity visual effects:
 * - HexRain canvas background
 * - OrbitalRings with security icons
 * - FloatingParticles
 * - SecurityTicker marquee
 * - CryptoStatsBar
 */
export default function VerifyPage() {
  const [state, setState] = useState<VerifyState>('idle');
  const [result, setResult] = useState<VerifyDegreeResponse | null>(null);
  const [currentDegreeId, setCurrentDegreeId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (degreeId: string, file: File) => {
    setState('processing');
    setCurrentDegreeId(degreeId);
    setResult(null);
    setErrorMessage('');

    try {
      const [response] = await Promise.all([
        verifyDegree(degreeId, file),
        new Promise((resolve) => setTimeout(resolve, 2500)),
      ]);

      const data = response as VerifyDegreeResponse;
      setResult(data);

      if (data.authentic && !data.tampered) {
        setState('authentic');
      } else if (data.tampered) {
        setState('tampered');
      } else if (data.status === 'NOT_FOUND') {
        setState('not_found');
      } else {
        setState('not_found');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Verification service is unavailable. Please try again later.';
      setErrorMessage(msg);
      setState('error');
    }
  };

  const handleReset = () => {
    setState('idle');
    setResult(null);
    setCurrentDegreeId('');
    setErrorMessage('');
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[75vh]">
      {/* ── Cyber Background Effects (only on idle) ─── */}
      {state === 'idle' && (
        <>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <HexRain />
          </div>
          <FloatingParticles />
        </>
      )}

      <AnimatePresence mode="wait">
        {/* ════════════════════════════════════════════════
            STATE: IDLE — Hero + Cyber Effects + VaultDoor
           ════════════════════════════════════════════════ */}
        {state === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -30, filter: 'blur(8px)' }}
            transition={{ duration: 0.5 }}
            className="w-full flex flex-col items-center gap-4 relative z-10"
          >
            {/* ── Security Ticker (Top) ──────────── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="w-full max-w-4xl"
            >
              <SecurityTicker />
            </motion.div>

            {/* ── Hero Section ────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-center max-w-2xl relative"
            >
              {/* Status badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <GlowingBadge variant="cyan" size="md" pulse className="mb-4">
                  <Zap size={11} /> Blockchain-Secured Verification
                </GlowingBadge>
              </motion.div>

              {/* Main heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 leading-tight">
                <span className="gradient-text-cyan">Verify</span>{' '}
                <span className="text-white/90">Any Degree</span>
              </h1>

              <p className="text-sm sm:text-base text-white/35 leading-relaxed max-w-lg mx-auto mb-2">
                Upload a degree document and enter its ID to cryptographically verify
                authenticity against the Ethereum blockchain.
              </p>

              {/* Crypto Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <CryptoStatsBar />
              </motion.div>
            </motion.div>

            {/* ── Orbital Security Rings ──────────── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative my-2"
            >
              <OrbitalRings />

              {/* Center Shield (inside orbital rings) */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: 'spring', stiffness: 150 }}
              >
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.1), rgba(0, 255, 102, 0.05))',
                      border: '1px solid rgba(0, 240, 255, 0.2)',
                      boxShadow: '0 0 30px rgba(0, 240, 255, 0.15), 0 0 60px rgba(0, 240, 255, 0.06), inset 0 0 20px rgba(0, 240, 255, 0.04)',
                    }}
                  >
                    <Shield size={36} className="text-neon-cyan/70" />
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* ── Scan line divider ───────────────── */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="w-full max-w-2xl h-px my-2 relative"
            >
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.2), transparent)',
                }}
              />
              {/* Traveling pulse on the line */}
              <motion.div
                animate={{ left: ['-10%', '110%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
                className="absolute top-0 h-full w-12"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.6), transparent)',
                  filter: 'blur(1px)',
                }}
              />
            </motion.div>

            {/* ── VaultDoor Search ────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="w-full"
            >
              <VaultDoor onSubmit={handleSubmit} loading={false} />
            </motion.div>

            {/* ── Bottom Security Ticker ──────────── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="w-full max-w-4xl mt-2"
            >
              <div
                className="py-3 px-4 rounded-xl flex items-center justify-center gap-6 flex-wrap"
                style={{
                  background: 'rgba(0, 240, 255, 0.02)',
                  border: '1px solid rgba(0, 240, 255, 0.04)',
                }}
              >
                {[
                  { label: 'PROTOCOL', value: 'TLS 1.3' },
                  { label: 'NETWORK', value: 'ETHEREUM MAINNET' },
                  { label: 'STATUS', value: 'OPERATIONAL', color: 'rgba(0, 255, 102, 0.5)' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-1.5">
                    <span className="text-[8px] text-white/15 uppercase tracking-[0.2em] font-semibold">
                      {item.label}
                    </span>
                    <span
                      className="text-[8px] font-mono uppercase tracking-wider"
                      style={{ color: item.color || 'rgba(0, 240, 255, 0.3)' }}
                    >
                      {item.value}
                    </span>
                    {item.label === 'STATUS' && (
                      <motion.div
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-1.5 h-1.5 rounded-full bg-neon-green"
                      />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ════════════════════════════════════════════════
            STATE: PROCESSING
           ════════════════════════════════════════════════ */}
        {state === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(6px)' }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <ProcessingOverlay degreeId={currentDegreeId} />
          </motion.div>
        )}

        {/* ════════════════════════════════════════════════
            STATE: AUTHENTIC
           ════════════════════════════════════════════════ */}
        {state === 'authentic' && result && (
          <motion.div
            key="authentic"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <AuthenticResult data={result} onReset={handleReset} />
          </motion.div>
        )}

        {/* ════════════════════════════════════════════════
            STATE: TAMPERED
           ════════════════════════════════════════════════ */}
        {state === 'tampered' && (
          <motion.div
            key="tampered"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <TamperedResult
              message={result?.integrityMessage || result?.message || ''}
              degreeId={currentDegreeId}
              onReset={handleReset}
            />
          </motion.div>
        )}

        {/* ════════════════════════════════════════════════
            STATE: NOT FOUND
           ════════════════════════════════════════════════ */}
        {state === 'not_found' && (
          <motion.div
            key="not_found"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <NotFoundResult
              degreeId={currentDegreeId}
              message={result?.message || ''}
              onReset={handleReset}
            />
          </motion.div>
        )}

        {/* ════════════════════════════════════════════════
            STATE: ERROR
           ════════════════════════════════════════════════ */}
        {state === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <NotFoundResult
              degreeId={currentDegreeId}
              message={errorMessage}
              onReset={handleReset}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
