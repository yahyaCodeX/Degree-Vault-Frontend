import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface CryptoRevealTextProps {
  /** The final text to resolve to */
  text: string;
  /** Duration of the scramble effect in ms */
  duration?: number;
  /** Character set to use for scrambling */
  charset?: string;
  /** Whether the animation is active */
  active: boolean;
  /** Callback when reveal completes */
  onComplete?: () => void;
  /** Additional className */
  className?: string;
  /** If true, uses mono font styling */
  mono?: boolean;
}

const HEX_CHARS = '0123456789ABCDEF';
const CRYPTO_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdef#@$%&*!?=+';

/**
 * CryptoRevealText — Animates text by rapidly shuffling through random characters
 * before resolving to the final string, character by character from left to right.
 * Inspired by movie-style decryption sequences.
 */
export default function CryptoRevealText({
  text,
  duration = 2000,
  charset = CRYPTO_CHARS,
  active,
  onComplete,
  className = '',
  mono = true,
}: CryptoRevealTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  const scramble = useCallback(() => {
    if (!active || !text) return;

    setIsComplete(false);
    const length = text.length;
    const intervalMs = 30; // How fast characters shuffle
    const revealInterval = duration / length; // Time between each character locking
    let resolvedCount = 0;
    let iteration = 0;

    const timer = setInterval(() => {
      iteration++;

      // Calculate how many characters should be resolved by now
      const elapsed = iteration * intervalMs;
      resolvedCount = Math.min(
        Math.floor(elapsed / revealInterval),
        length
      );

      // Build display: resolved chars + scrambled remaining
      let result = '';
      for (let i = 0; i < length; i++) {
        if (i < resolvedCount) {
          result += text[i];
        } else {
          result += charset[Math.floor(Math.random() * charset.length)];
        }
      }
      setDisplayText(result);

      // All characters resolved
      if (resolvedCount >= length) {
        clearInterval(timer);
        setDisplayText(text);
        setIsComplete(true);
        onComplete?.();
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [active, text, duration, charset, onComplete]);

  useEffect(() => {
    const cleanup = scramble();
    return cleanup;
  }, [scramble]);

  // Before activation, show placeholder dashes
  if (!active) {
    return (
      <span className={`${mono ? 'font-mono' : ''} ${className}`}>
        {'—'.repeat(Math.min(text.length, 20))}
      </span>
    );
  }

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`${mono ? 'font-mono' : ''} ${className} inline-block`}
    >
      {displayText.split('').map((char, i) => (
        <motion.span
          key={`${i}-${char}`}
          className={`inline-block ${
            i < displayText.length && isComplete
              ? ''
              : 'text-neon-cyan/70'
          }`}
          initial={false}
          animate={
            isComplete && i < text.length
              ? { opacity: 1, color: undefined }
              : { opacity: [0.4, 1, 0.4] }
          }
          transition={
            isComplete
              ? { duration: 0.1 }
              : { duration: 0.15, repeat: Infinity }
          }
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

export { HEX_CHARS, CRYPTO_CHARS };
