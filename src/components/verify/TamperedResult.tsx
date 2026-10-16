import { motion } from 'framer-motion';
import { ShieldAlert, AlertCircle, ArrowLeft, HelpCircle } from 'lucide-react';
import { Button, Badge } from '../ui';

interface TamperedResultProps {
  message?: string;
  guci: string;
  onReset: () => void;
}

export default function TamperedResult({
  message,
  guci,
  onReset,
}: TamperedResultProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-2xl mx-auto space-y-6"
    >
      {/* ── Status Banner with Ambient Red Glow ────────── */}
      <div className="relative">
        <div
          className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-status-error/15 via-status-error/10 to-status-error/15 blur-xl -z-10 opacity-70"
          aria-hidden="true"
        />

        <div
          className="bg-surface-card border border-status-error-border rounded-2xl p-7 sm:p-9 text-center relative z-10"
          style={{
            boxShadow: 'var(--shadow-elevated), var(--inset-card-highlight)',
          }}
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-status-error-bg to-status-error-border/30 text-status-error border border-status-error-border flex items-center justify-center mx-auto mb-4 shadow-sm">
            <ShieldAlert size={34} strokeWidth={2.4} />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-content-main mb-2 tracking-tight">
            Verification Warning
          </h2>

          <p className="text-xs sm:text-sm text-content-secondary max-w-lg mx-auto leading-relaxed">
            The details provided for credential{' '}
            <span className="font-mono font-bold text-content-main">{guci}</span> do not match the official university record.
            This degree cannot be verified as authentic.
          </p>

          <div className="mt-5">
            <Badge variant="error" dot size="md">
              Record Mismatch
            </Badge>
          </div>
        </div>
      </div>

      {/* ── Possible Reasons & Next Steps ─────────────── */}
      <div
        className="bg-surface-card border border-border-main rounded-2xl p-6 sm:p-7 space-y-4"
        style={{
          boxShadow: 'var(--shadow-card), var(--inset-card-highlight)',
        }}
      >
        <div className="flex items-center gap-2.5 text-content-main">
          <div className="w-7 h-7 rounded-lg bg-surface-pending-bg text-status-pending border border-status-pending-border flex items-center justify-center shadow-2xs">
            <HelpCircle size={16} strokeWidth={2.2} />
          </div>
          <h3 className="text-sm font-bold tracking-tight">What does this mean?</h3>
        </div>

        <div className="space-y-3 text-xs text-content-secondary leading-relaxed">
          <div className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-status-error mt-1.5 flex-shrink-0" />
            <p>
              <strong className="text-content-main">Document Modification:</strong> The PDF may have been re-exported, compressed, cropped, or digitally signed after official issuance.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-status-error mt-1.5 flex-shrink-0" />
            <p>
              <strong className="text-content-main">Incorrect Version:</strong> Ensure you upload the original, unmodified digital certificate issued directly by the university registrar.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-status-error mt-1.5 flex-shrink-0" />
            <p>
              <strong className="text-content-main">Mismatched Student Roll Number:</strong> Confirm that the student roll number entered matches the certificate you uploaded.
            </p>
          </div>
        </div>

        {message && (
          <div className="p-3.5 rounded-xl bg-status-error-bg border border-status-error-border text-status-error-text text-xs shadow-2xs">
            <div className="flex items-center gap-2">
              <AlertCircle size={15} className="flex-shrink-0" />
              <span>{message}</span>
            </div>
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
          Try Another Document
        </Button>
      </div>
    </motion.div>
  );
}
