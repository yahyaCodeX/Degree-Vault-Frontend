import { motion } from 'framer-motion';

interface LiquidProgressBarProps {
  /** Value between 0 and 100 */
  progress: number;
  successCount: number;
  failureCount: number;
  totalRecords: number;
  className?: string;
}

/**
 * LiquidProgressBar — A premium animated progress bar with a liquid-fill effect.
 * Shows progress percentage with neon gradient fill and a pulsing leading edge.
 */
export default function LiquidProgressBar({
  progress,
  successCount,
  failureCount,
  totalRecords,
  className = '',
}: LiquidProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const processed = successCount + failureCount;

  return (
    <div className={`w-full ${className}`}>
      {/* Stats row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          <span className="text-xs text-white/30">
            <span className="font-mono text-neon-green">{successCount}</span>
            <span className="text-white/15"> passed</span>
          </span>
          {failureCount > 0 && (
            <span className="text-xs text-white/30">
              <span className="font-mono text-neon-red">{failureCount}</span>
              <span className="text-white/15"> failed</span>
            </span>
          )}
        </div>
        <span className="text-xs font-mono text-white/40">
          {processed} / {totalRecords}
        </span>
      </div>

      {/* Bar container */}
      <div
        className="relative w-full h-3 rounded-full overflow-hidden"
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.04)',
        }}
      >
        {/* Success fill */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(successCount / Math.max(totalRecords, 1)) * 100}%` }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute left-0 top-0 h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, rgba(0, 255, 102, 0.6), rgba(0, 240, 255, 0.5))',
            boxShadow: '0 0 10px rgba(0, 255, 102, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
          }}
        />

        {/* Failure fill (stacked after success) */}
        {failureCount > 0 && (
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${(failureCount / Math.max(totalRecords, 1)) * 100}%`,
              left: `${(successCount / Math.max(totalRecords, 1)) * 100}%`,
            }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute top-0 h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, rgba(255, 0, 60, 0.5), rgba(255, 0, 60, 0.7))',
              boxShadow: '0 0 8px rgba(255, 0, 60, 0.2)',
            }}
          />
        )}

        {/* Leading edge glow pulse */}
        {clampedProgress > 0 && clampedProgress < 100 && (
          <motion.div
            animate={{
              opacity: [0.4, 1, 0.4],
              left: `${clampedProgress - 1}%`,
            }}
            transition={{ opacity: { duration: 1, repeat: Infinity }, left: { duration: 0.8 } }}
            className="absolute top-0 h-full w-3"
            style={{
              background: 'radial-gradient(circle, rgba(0, 255, 102, 0.8), transparent)',
              filter: 'blur(3px)',
            }}
          />
        )}
      </div>

      {/* Percentage */}
      <div className="flex justify-end mt-1.5">
        <motion.span
          key={Math.round(clampedProgress)}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[11px] font-mono"
          style={{
            color: clampedProgress >= 100
              ? 'rgba(0, 255, 102, 0.8)'
              : 'rgba(255, 255, 255, 0.3)',
          }}
        >
          {Math.round(clampedProgress)}%
        </motion.span>
      </div>
    </div>
  );
}
