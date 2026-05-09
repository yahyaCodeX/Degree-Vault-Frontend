import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import CryptoRevealText, { HEX_CHARS } from './CryptoRevealText';

interface ProcessingOverlayProps {
  degreeId: string;
}

const PROCESSING_STEPS = [
  'Hashing document with SHA-256...',
  'Querying Ethereum smart contract...',
  'Comparing on-chain hash with document...',
  'Verifying issuer signature...',
  'Resolving IPFS content identifier...',
  'Finalizing integrity check...',
];

/**
 * ProcessingOverlay — The "Cryptographic Reveal" animation shown
 * while the verification API call is in progress.
 * Displays sequential processing steps with a hash scramble effect.
 */
export default function ProcessingOverlay({ degreeId }: ProcessingOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [hashPreview, setHashPreview] = useState('');

  // Cycle through processing steps
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % PROCESSING_STEPS.length);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  // Scramble a fake hash rapidly
  useEffect(() => {
    const interval = setInterval(() => {
      const chars = HEX_CHARS;
      let hash = '0x';
      for (let i = 0; i < 40; i++) {
        hash += chars[Math.floor(Math.random() * chars.length)];
      }
      setHashPreview(hash);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="text-center py-12">
        {/* Rotating shield icon */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="inline-flex mb-8"
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle, rgba(0, 240, 255, 0.1) 0%, transparent 70%)',
              border: '2px solid rgba(0, 240, 255, 0.2)',
              boxShadow: '0 0 30px rgba(0, 240, 255, 0.15)',
            }}
          >
            <Shield size={32} className="text-neon-cyan" />
          </div>
        </motion.div>

        {/* Title */}
        <h2 className="text-xl font-bold text-white/80 mb-2">
          Verifying Cryptographic Integrity
        </h2>
        <p className="text-xs text-white/30 font-mono tracking-wide mb-8">
          DEGREE ID: {degreeId}
        </p>

        {/* Processing Steps */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <p className="text-sm text-neon-cyan/80 font-medium">
            {PROCESSING_STEPS[currentStep]}
          </p>
        </motion.div>

        {/* Scrambling Hash Display */}
        <div
          className="mx-auto max-w-md p-4 rounded-xl"
          style={{
            background: 'rgba(0, 240, 255, 0.03)',
            border: '1px solid rgba(0, 240, 255, 0.08)',
          }}
        >
          <p className="text-[10px] text-white/20 uppercase tracking-widest mb-2">
            Active Hash Comparison
          </p>
          <p className="font-mono text-xs text-neon-cyan/50 break-all leading-relaxed">
            {hashPreview}
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-2 h-2 rounded-full bg-neon-cyan"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
