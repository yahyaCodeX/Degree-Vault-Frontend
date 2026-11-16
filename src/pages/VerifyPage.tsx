import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import VaultDoor from '../components/verify/VaultDoor';
import ProcessingOverlay from '../components/verify/ProcessingOverlay';
import AuthenticResult from '../components/verify/AuthenticResult';
import TamperedResult from '../components/verify/TamperedResult';
import NotFoundResult from '../components/verify/NotFoundResult';
import RevokedResult from '../components/verify/RevokedResult';
import HowItWorks from '../components/verify/HowItWorks';
import { verifyDegree, VerifyDegreeResponse } from '../services/api';

type VerifyState = 'idle' | 'processing' | 'authentic' | 'tampered' | 'not_found' | 'error' | 'revoked';

export default function VerifyPage() {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState<VerifyState>('idle');
  const [result, setResult] = useState<VerifyDegreeResponse | null>(null);
  const [currentGuci, setCurrentGuci] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-verify if QR code or verification link contains ?id=GUCI
  useEffect(() => {
    const idParam = searchParams.get('id');
    if (idParam && idParam.trim()) {
      handleSubmit(idParam.trim().toUpperCase());
    }
  }, [searchParams]);

  /**
   * Called by VaultDoor with the derived/entered GUCI.
   * Hits GET /api/v1/degrees/verify/{guci} — no file upload needed.
   */
  const handleSubmit = async (globalCredentialId: string) => {
    setState('processing');
    setCurrentGuci(globalCredentialId);
    setResult(null);
    setErrorMessage('');

    try {
      // Long enough for ProcessingOverlay's three steps (3 × 500 ms) to tick off
      const [response] = await Promise.all([
        verifyDegree(globalCredentialId),
        new Promise((resolve) => setTimeout(resolve, 1900)),
      ]);

      const data = response as VerifyDegreeResponse;
      setResult(data);

      if (data.revoked || data.status === 'REVOKED') {
        setState('revoked');
      } else if (data.authentic && !data.tampered) {
        setState('authentic');
      } else if (data.tampered || data.status === 'INCOMPLETE') {
        setState('tampered');
      } else if (data.status === 'NOT_FOUND') {
        setState('not_found');
      } else {
        setState('not_found');
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Verification service is currently unavailable. Please verify your connection or try again later.';
      setErrorMessage(msg);
      setState('error');
    }
  };

  const handleReset = () => {
    setState('idle');
    setResult(null);
    setCurrentGuci('');
    setErrorMessage('');
  };

  return (
    <div className="w-full flex flex-col items-center">
      <AnimatePresence mode="wait">
        {/* ═══════════════ IDLE — Hero + Form ═══════════════ */}
        {state === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="w-full flex flex-col items-center"
          >
            {/* ── Hero Section ── */}
            <div className="text-center max-w-2xl mx-auto mb-10 relative">
              <div
                className="absolute -top-12 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full bg-gradient-to-r from-teal-brand/12 to-secondary-blue/12 blur-3xl -z-10 pointer-events-none"
                aria-hidden="true"
              />

              <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-teal-brand">
                <ShieldCheck size={14} /> Public verification
              </p>

              <h1 className="font-display text-4xl sm:text-6xl font-semibold text-content-main tracking-tight leading-[1.05] mt-4">
                Check any degree
                <br />
                <em className="italic text-teal-brand">in seconds.</em>
              </h1>

              <p className="text-sm sm:text-base text-content-secondary mt-4 leading-relaxed max-w-lg mx-auto">
                Enter the university and roll number, or paste the credential ID from a QR code.
                The record is checked live against the blockchain. No upload, no sign-up.
              </p>
            </div>

            {/* ── Verification Form ── */}
            <VaultDoor onSubmit={handleSubmit} loading={false} />

            {/* ── How It Works ── */}
            <HowItWorks />
          </motion.div>
        )}

        {/* ═══════════════ PROCESSING ═══════════════ */}
        {state === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            <ProcessingOverlay guci={currentGuci} />
          </motion.div>
        )}

        {/* ═══════════════ AUTHENTIC ═══════════════ */}
        {state === 'authentic' && result && (
          <motion.div
            key="authentic"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full"
          >
            <AuthenticResult data={result} onReset={handleReset} />
          </motion.div>
        )}

        {/* ═══════════════ REVOKED ═══════════════ */}
        {state === 'revoked' && result && (
          <motion.div
            key="revoked"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full"
          >
            <RevokedResult data={result} onReset={handleReset} />
          </motion.div>
        )}

        {/* ═══════════════ TAMPERED ═══════════════ */}
        {state === 'tampered' && (
          <motion.div
            key="tampered"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full"
          >
            <TamperedResult
              data={result}
              message={result?.integrityMessage || result?.message || ''}
              guci={result?.globalCredentialId || currentGuci}
              onReset={handleReset}
            />
          </motion.div>
        )}

        {/* ═══════════════ NOT FOUND ═══════════════ */}
        {state === 'not_found' && (
          <motion.div
            key="not_found"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full"
          >
            <NotFoundResult
              guci={currentGuci}
              message={result?.message || ''}
              onReset={handleReset}
            />
          </motion.div>
        )}

        {/* ═══════════════ ERROR ═══════════════ */}
        {state === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full"
          >
            <NotFoundResult
              guci={currentGuci}
              message={errorMessage}
              onReset={handleReset}
              isError={true}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
