import { motion } from 'framer-motion';

interface LiquidProgressBarProps {
  progress: number;
  successCount: number;
  failureCount: number;
  totalRecords: number;
  className?: string;
}

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
      {/* Top statistics summary */}
      <div className="flex items-center justify-between text-xs mb-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-content-secondary font-medium">
            <span className="w-2 h-2 rounded-full bg-status-verified" />
            <span className="font-bold text-content-main">{successCount}</span> passed
          </span>
          {failureCount > 0 && (
            <span className="flex items-center gap-1.5 text-content-secondary font-medium">
              <span className="w-2 h-2 rounded-full bg-status-error" />
              <span className="font-bold text-status-error">{failureCount}</span> failed
            </span>
          )}
        </div>
        <span className="text-content-muted font-mono font-medium">
          {processed} of {totalRecords} processed ({Math.round(clampedProgress)}%)
        </span>
      </div>

      {/* Progress Track */}
      <div
        role="progressbar"
        aria-valuenow={Math.round(clampedProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        className="w-full h-3 rounded-full bg-surface-muted/90 border border-border-subtle overflow-hidden relative shadow-inner"
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="h-full rounded-full bg-gradient-to-r from-teal-brand via-teal-brand-light to-secondary-blue shadow-xs"
        />
      </div>
    </div>
  );
}
