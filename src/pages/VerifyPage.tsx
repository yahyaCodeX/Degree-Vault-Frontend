import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import VaultDoor from '../components/verify/VaultDoor';
import ProcessingOverlay from '../components/verify/ProcessingOverlay';
import AuthenticResult from '../components/verify/AuthenticResult';
import TamperedResult from '../components/verify/TamperedResult';
import NotFoundResult from '../components/verify/NotFoundResult';
import HowItWorks from '../components/verify/HowItWorks';
import { verifyDegree, VerifyDegreeResponse } from '../services/api';

type VerifyState = 'idle' | 'processing' | 'authentic' | 'tampered' | 'not_found' | 'error';

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
      // Minimum 1.2 s loading animation for better UX
      const [response] = await Promise.all([
        verifyDegree(globalCredentialId),
        new Promise((resolve) => setTimeout(resolve, 1200)),
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

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-card border border-teal-brand/25 text-teal-brand text-xs font-semibold mb-5 shadow-sm"
              >
                <div className="w-4 h-4 rounded-full bg-surface-teal-subtle flex items-center justify-center text-teal-brand">
                  <ShieldCheck size={12} strokeWidth={2.5} />
                </div>
                <span>Immutable Digital Trust</span>
                <span className="w-1 h-1 rounded-full bg-content-muted" />
                <span className="text-content-secondary font-medium">Ethereum &amp; IPFS</span>
              </motion.div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-content-main tracking-tight leading-[1.12]">
                Verify Degree{' '}
                <span className="bg-gradient-to-r from-teal-brand via-teal-brand-light to-secondary-blue bg-clip-text text-transparent">
                  Authenticity
                </span>
              </h1>

              <p className="text-sm sm:text-base text-content-secondary mt-3.5 leading-relaxed max-w-lg mx-auto">
                Enter the University Code and Roll Number to instantly verify a credential
                against the permanent blockchain registry. No document upload required.
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
              message={result?.integrityMessage || result?.message || ''}
              guci={currentGuci}
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
