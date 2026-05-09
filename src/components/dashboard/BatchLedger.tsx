import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Clock, Loader2, Hash, AlertTriangle } from 'lucide-react';
import { GlassCard, GlowingBadge } from '../ui';
import LiquidProgressBar from './LiquidProgressBar';
import { getBatchStatus } from '../../services/api';

interface BatchUploadResult {
  row: number;
  degreeId: string;
  studentId: string;
  status: string;
  transactionHash: string | null;
  error: string | null;
  processedAt: string | null;
}

interface BatchStatusResponse {
  batchId: string;
  overallStatus: string;
  totalRecords: number;
  successCount: number;
  failureCount: number;
  results: BatchUploadResult[];
  startedAt: string | null;
  completedAt: string | null;
}

interface BatchLedgerProps {
  batchId: string;
  onComplete?: (status: BatchStatusResponse) => void;
}

/**
 * BatchLedger — Real-time polling component that shows batch processing progress.
 * Polls the /status API every 2 seconds and reveals rows with staggered animations.
 */
export default function BatchLedger({ batchId, onComplete }: BatchLedgerProps) {
  const [status, setStatus] = useState<BatchStatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [prevResultCount, setPrevResultCount] = useState(0);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let mounted = true;

    const poll = async () => {
      try {
        const data = await getBatchStatus(batchId);
        if (!mounted) return;

        setStatus(data);
        setError(null);

        // Stop polling when complete
        if (data.overallStatus === 'COMPLETED' || data.overallStatus === 'PARTIAL_FAILURE') {
          if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
          }
          onComplete?.(data);
        }
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.response?.data?.message || 'Failed to fetch batch status');
      }
    };

    // Initial fetch
    poll();

    // Poll every 2 seconds
    pollingRef.current = setInterval(poll, 2000);

    return () => {
      mounted = false;
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [batchId, onComplete]);

  // Track new results for animation
  useEffect(() => {
    if (status?.results) {
      setPrevResultCount(status.results.length);
    }
  }, [status?.results?.length]);

  if (error && !status) {
    return (
      <GlassCard glowColor="red" className="p-6 text-center" hoverGlow={false}>
        <AlertTriangle size={24} className="text-neon-red mx-auto mb-2" />
        <p className="text-sm text-neon-red/80">{error}</p>
      </GlassCard>
    );
  }

  if (!status) {
    return (
      <GlassCard className="p-8 text-center" hoverGlow={false}>
        <Loader2 size={24} className="text-neon-cyan animate-spin mx-auto mb-2" />
        <p className="text-sm text-white/40">Initializing batch tracker...</p>
      </GlassCard>
    );
  }

  const progress =
    status.totalRecords > 0
      ? ((status.successCount + status.failureCount) / status.totalRecords) * 100
      : 0;

  const isComplete = status.overallStatus === 'COMPLETED' || status.overallStatus === 'PARTIAL_FAILURE';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-5"
    >
      {/* ── Header Card ────────────────────────────── */}
      <GlassCard className="p-5" hoverGlow={false}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-semibold text-white/70">Batch Processing</h3>
            <StatusBadge status={status.overallStatus} />
          </div>
          <span className="text-[10px] font-mono text-white/20 hidden sm:inline">
            {batchId.slice(0, 8)}...{batchId.slice(-4)}
          </span>
        </div>

        <LiquidProgressBar
          progress={progress}
          successCount={status.successCount}
          failureCount={status.failureCount}
          totalRecords={status.totalRecords}
        />
      </GlassCard>

      {/* ── Results Ledger ─────────────────────────── */}
      {status.results && status.results.length > 0 && (
        <GlassCard className="p-5 overflow-hidden" hoverGlow={false}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest">
              Processing Ledger
            </h3>
            {!isComplete && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Loader2 size={14} className="text-neon-cyan/40" />
              </motion.div>
            )}
          </div>

          {/* Table header */}
          <div
            className="grid grid-cols-12 gap-2 px-3 py-2 rounded-lg mb-2 text-[10px] font-semibold text-white/25 uppercase tracking-widest"
            style={{ background: 'rgba(255, 255, 255, 0.02)' }}
          >
            <div className="col-span-1">#</div>
            <div className="col-span-3">Degree ID</div>
            <div className="col-span-2">Student</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-5 hidden sm:block">Tx Hash / Error</div>
          </div>

          {/* Rows with staggered animation */}
          <div className="space-y-1 max-h-[400px] overflow-y-auto pr-1">
            <AnimatePresence>
              {status.results.map((result, idx) => (
                <motion.div
                  key={`${result.row}-${result.degreeId}`}
                  initial={idx >= prevResultCount ? { opacity: 0, x: -20, height: 0 } : false}
                  animate={{ opacity: 1, x: 0, height: 'auto' }}
                  transition={{
                    duration: 0.4,
                    delay: idx >= prevResultCount ? (idx - prevResultCount) * 0.08 : 0,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  <LedgerRow result={result} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </GlassCard>
      )}

      {/* ── Completion Summary ─────────────────────── */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <GlassCard
              glowColor={status.failureCount === 0 ? 'green' : 'red'}
              className="p-5 text-center"
              hoverGlow={false}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                {status.failureCount === 0 ? (
                  <CheckCircle2 size={20} className="text-neon-green" />
                ) : (
                  <AlertTriangle size={20} className="text-neon-amber" />
                )}
                <h3 className="text-sm font-semibold text-white/70">
                  {status.overallStatus === 'COMPLETED'
                    ? 'Batch Complete — All Degrees Issued'
                    : `Partial Failure — ${status.failureCount} of ${status.totalRecords} failed`}
                </h3>
              </div>
              <p className="text-xs text-white/30 font-mono">
                {status.successCount} on-chain · {status.failureCount} errors · {status.totalRecords} total
              </p>
              {status.completedAt && (
                <p className="text-[10px] text-white/15 mt-2 font-mono">
                  Completed at {new Date(status.completedAt).toLocaleString()}
                </p>
              )}
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Ledger Row ──────────────────────────────────── */
function LedgerRow({ result }: { result: BatchUploadResult }) {
  const isSuccess = result.status === 'SUCCESS';

  return (
    <div
      className="grid grid-cols-12 gap-2 items-center px-3 py-2.5 rounded-lg transition-colors hover:bg-white/[0.02]"
      style={{
        background: isSuccess
          ? 'rgba(0, 255, 102, 0.015)'
          : result.status === 'FAILED'
            ? 'rgba(255, 0, 60, 0.02)'
            : 'transparent',
      }}
    >
      {/* Row number */}
      <div className="col-span-1 text-xs font-mono text-white/20">
        {result.row}
      </div>

      {/* Degree ID */}
      <div className="col-span-3 text-xs font-mono text-white/60 truncate" title={result.degreeId}>
        {result.degreeId}
      </div>

      {/* Student ID */}
      <div className="col-span-2 text-xs font-mono text-white/40 truncate" title={result.studentId}>
        {result.studentId}
      </div>

      {/* Status icon */}
      <div className="col-span-1">
        {isSuccess ? (
          <CheckCircle2 size={14} className="text-neon-green" />
        ) : result.status === 'FAILED' ? (
          <XCircle size={14} className="text-neon-red" />
        ) : (
          <Clock size={14} className="text-neon-amber" />
        )}
      </div>

      {/* Tx Hash or Error */}
      <div className="col-span-5 hidden sm:block">
        {isSuccess && result.transactionHash ? (
          <div className="flex items-center gap-1.5">
            <Hash size={10} className="text-neon-cyan/30 flex-shrink-0" />
            <span className="text-[10px] font-mono text-neon-cyan/50 truncate" title={result.transactionHash}>
              {result.transactionHash}
            </span>
          </div>
        ) : result.error ? (
          <span className="text-[10px] text-neon-red/60 truncate block" title={result.error}>
            {result.error}
          </span>
        ) : (
          <span className="text-[10px] text-white/15">—</span>
        )}
      </div>
    </div>
  );
}

/* ── Status Badge ───────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { variant: 'cyan' | 'green' | 'red' | 'amber'; label: string }> = {
    PENDING: { variant: 'amber', label: 'PENDING' },
    PROCESSING: { variant: 'cyan', label: 'PROCESSING' },
    COMPLETED: { variant: 'green', label: 'COMPLETED' },
    PARTIAL_FAILURE: { variant: 'red', label: 'PARTIAL FAILURE' },
  };

  const c = config[status] || { variant: 'cyan' as const, label: status };

  return (
    <GlowingBadge variant={c.variant} size="sm" pulse={status === 'PROCESSING'}>
      {c.label}
    </GlowingBadge>
  );
}
