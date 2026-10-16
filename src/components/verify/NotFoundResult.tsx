import { motion } from 'framer-motion';
import { SearchX, ArrowLeft, AlertCircle, HelpCircle } from 'lucide-react';
import { Button, Badge } from '../ui';

interface NotFoundResultProps {
  guci: string;
  message?: string;
  onReset: () => void;
  isError?: boolean;
}

export default function NotFoundResult({
  guci,
  message,
  onReset,
  isError = false,
}: NotFoundResultProps) {
  const isNetworkIssue =
    message?.toLowerCase().includes('network') ||
    message?.toLowerCase().includes('unavailable') ||
    message?.toLowerCase().includes('failed to fetch');

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-2xl mx-auto space-y-6"
    >
      {/* ── Status Banner with Ambient Warning Glow ────── */}
      <div className="relative">
        <div
          className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-status-pending/15 via-teal-brand/10 to-status-pending/15 blur-xl -z-10 opacity-70"
          aria-hidden="true"
        />

        <div
          className="bg-surface-card border border-border-main rounded-2xl p-7 sm:p-9 text-center relative z-10"
          style={{
            boxShadow: 'var(--shadow-elevated), var(--inset-card-highlight)',
          }}
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-status-pending-bg to-status-pending-border/30 text-status-pending border border-status-pending-border flex items-center justify-center mx-auto mb-4 shadow-sm">
            {isNetworkIssue ? (
              <AlertCircle size={34} strokeWidth={2.4} />
            ) : (
              <SearchX size={34} strokeWidth={2.4} />
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-content-main mb-2 tracking-tight">
            {isNetworkIssue
              ? 'Verification Service Unavailable'
              : 'Degree Record Not Found'}
          </h2>

          <p className="text-xs sm:text-sm text-content-secondary max-w-lg mx-auto leading-relaxed">
            {isNetworkIssue
              ? 'Unable to communicate with the verification node. This is a temporary connection issue and does not indicate a fraudulent credential.'
              : (
                <>
                  No registered credential was found for GUCI{' '}
                  <span className="font-mono font-bold text-content-main">
                    {guci || 'N/A'}
                  </span>
                  .
                </>
              )}
          </p>

          <div className="mt-5">
            <Badge variant="warning" dot size="md">
              {isNetworkIssue ? 'Connection Error' : 'Record Not Found'}
            </Badge>
          </div>
        </div>
      </div>

      {/* ── Guidance Card ─────────────────────────────── */}
      <div
        className="bg-surface-card border border-border-main rounded-2xl p-6 sm:p-7 space-y-3.5"
        style={{
          boxShadow: 'var(--shadow-card), var(--inset-card-highlight)',
        }}
      >
        <div className="flex items-center gap-2.5 text-content-main">
          <div className="w-7 h-7 rounded-lg bg-surface-teal-subtle text-teal-brand border border-teal-brand/20 flex items-center justify-center shadow-2xs">
            <HelpCircle size={16} strokeWidth={2.2} />
          </div>
          <h3 className="text-sm font-bold tracking-tight">Recommended next steps</h3>
        </div>

        <ul className="text-xs text-content-secondary space-y-2.5 list-disc list-inside leading-relaxed">
          {isNetworkIssue ? (
            <>
              <li>Verify your internet connection and try submitting the verification again.</li>
              <li>The verification network or node might be experiencing brief scheduled maintenance.</li>
            </>
          ) : (
            <>
              <li>Check the student roll number for typographical errors (e.g., uppercase vs lowercase).</li>
              <li>Confirm with the issuing university registrar that this degree has been registered on the blockchain.</li>
              <li>Newly registered credentials may take a few moments to be confirmed by network nodes.</li>
            </>
          )}
        </ul>

        {message && !isNetworkIssue && (
          <div className="mt-4 p-3.5 rounded-xl bg-surface-muted border border-border-subtle text-content-secondary text-xs shadow-2xs font-mono">
            {message}
          </div>
        )}
      </div>

      {/* ── Action ─────────────────────────────────────── */}
      <div className="flex justify-center pt-3">
        <Button
          variant="primary"
          size="md"
          onClick={onReset}
          icon={<ArrowLeft size={16} />}
        >
          {isNetworkIssue ? 'Retry Verification' : 'Search Again'}
        </Button>
      </div>
    </motion.div>
  );
}
