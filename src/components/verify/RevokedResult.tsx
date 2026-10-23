import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Ban,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  FileX,
  User,
  GraduationCap,
  Building2,
  Hash,
  Copy,
  Check,
  ShieldAlert,
} from 'lucide-react';
import { Button, Badge } from '../ui';
import { VerifyDegreeResponse } from '../../services/api';

interface RevokedResultProps {
  data: VerifyDegreeResponse;
  onReset: () => void;
}

export default function RevokedResult({ data, onReset }: RevokedResultProps) {
  const [copiedGuci, setCopiedGuci] = useState(false);
  const [copiedTx, setCopiedTx] = useState(false);

  const revocationDateFormatted = data.revocationDate
    ? new Date(data.revocationDate * 1000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Recorded On-Chain';

  const copyToClipboard = (text: string, type: 'guci' | 'tx') => {
    navigator.clipboard.writeText(text);
    if (type === 'guci') {
      setCopiedGuci(true);
      setTimeout(() => setCopiedGuci(false), 2000);
    } else {
      setCopiedTx(true);
      setTimeout(() => setCopiedTx(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-2xl mx-auto space-y-6"
    >
      {/* ── Status Banner with Ambient Crimson Glow ────────── */}
      <div className="relative">
        <div
          className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-red-600/20 via-rose-500/15 to-red-600/20 blur-xl -z-10 opacity-80"
          aria-hidden="true"
        />

        <div
          className="bg-surface-card border border-red-500/30 rounded-2xl p-7 sm:p-9 text-center relative z-10"
          style={{
            boxShadow: 'var(--shadow-elevated), var(--inset-card-highlight)',
          }}
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/10 text-red-500 border border-red-500/30 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Ban size={34} strokeWidth={2.4} />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-content-main mb-2 tracking-tight">
            Degree Officially Revoked
          </h2>

          <p className="text-xs sm:text-sm text-content-secondary max-w-lg mx-auto leading-relaxed">
            This academic credential was formally{' '}
            <strong className="text-red-400 font-semibold">revoked and invalidated</strong>{' '}
            by the university authority. It is no longer recognized as an active qualification.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-5">
            <Badge variant="error" dot size="md">
              Status: Revoked on Blockchain
            </Badge>
          </div>

          {/* GUCI pill */}
          <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-mono font-bold shadow-sm">
            <Hash size={12} />
            {data.globalCredentialId}
            <button
              type="button"
              onClick={() => copyToClipboard(data.globalCredentialId, 'guci')}
              className="ml-1 hover:opacity-70 transition-opacity"
              title="Copy Identifier"
            >
              {copiedGuci ? <Check size={11} /> : <Copy size={11} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Official Revocation Reason Card ─────────────── */}
      <div
        className="bg-surface-card border border-red-500/20 rounded-2xl p-6 sm:p-7 space-y-4"
        style={{
          boxShadow: 'var(--shadow-card), var(--inset-card-highlight)',
        }}
      >
        <div className="flex items-center gap-2.5 pb-3 border-b border-border-subtle">
          <div className="w-7 h-7 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center">
            <FileX size={15} strokeWidth={2.2} />
          </div>
          <h3 className="text-sm font-bold text-content-main">Official Revocation Statement</h3>
        </div>

        <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/15">
          <span className="block text-[11px] font-bold text-red-400 uppercase tracking-wider mb-1">
            Stated Reason for Revocation
          </span>
          <p className="text-sm font-medium text-content-main leading-relaxed">
            "{data.revocationReason || 'Revoked per registrar administrative directive.'}"
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-surface-muted/60 border border-border-subtle">
            <span className="block text-[10px] font-bold text-content-muted uppercase tracking-wider mb-0.5">
              Revocation Date
            </span>
            <span className="font-semibold text-content-main flex items-center gap-1.5">
              <Calendar size={13} className="text-content-muted" />
              {revocationDateFormatted}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-surface-muted/60 border border-border-subtle">
            <span className="block text-[10px] font-bold text-content-muted uppercase tracking-wider mb-0.5">
              Authorized Authority
            </span>
            <span className="font-semibold text-content-main flex items-center gap-1.5">
              <ShieldAlert size={13} className="text-red-400" />
              University Registrar Authority
            </span>
          </div>
        </div>

        {data.revocationTxHash && (
          <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-xs">
            <span className="text-content-muted font-mono">Tx: {data.revocationTxHash.slice(0, 14)}...{data.revocationTxHash.slice(-10)}</span>
            <button
              type="button"
              onClick={() => copyToClipboard(data.revocationTxHash!, 'tx')}
              className="inline-flex items-center gap-1 text-teal-brand hover:underline font-mono text-[11px]"
            >
              {copiedTx ? <Check size={11} /> : <Copy size={11} />}
              <span>{copiedTx ? 'Copied' : 'Copy Tx Hash'}</span>
            </button>
          </div>
        )}
      </div>

      {/* ── Candidate Record Snapshot (Watermarked Invalid) ── */}
      {data.studentName && (
        <div
          className="bg-surface-card border border-border-main rounded-2xl p-6 sm:p-7 relative overflow-hidden"
          style={{
            boxShadow: 'var(--shadow-card), var(--inset-card-highlight)',
          }}
        >
          {/* Diagonal INVALID watermark */}
          <div
            className="absolute -right-8 top-8 select-none pointer-events-none transform rotate-12 px-10 py-1 bg-red-600/10 text-red-500 border border-red-500/20 text-xs font-black tracking-widest uppercase opacity-75"
          >
            REVOKED RECORD
          </div>

          <h3 className="text-xs font-bold text-content-secondary uppercase tracking-wider mb-3">
            Original Candidate Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-surface-muted/40">
              <User size={14} className="text-content-muted" />
              <div>
                <span className="block text-[10px] text-content-muted">Student Name</span>
                <span className="font-semibold text-content-main">{data.studentName}</span>
              </div>
            </div>

            {data.fatherName && (
              <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-surface-muted/40">
                <User size={14} className="text-content-muted" />
                <div>
                  <span className="block text-[10px] text-content-muted">Father's Name</span>
                  <span className="font-semibold text-content-main">{data.fatherName}</span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-surface-muted/40">
              <Building2 size={14} className="text-content-muted" />
              <div>
                <span className="block text-[10px] text-content-muted">University</span>
                <span className="font-semibold text-content-main">{data.universityCode}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-surface-muted/40">
              <GraduationCap size={14} className="text-content-muted" />
              <div>
                <span className="block text-[10px] text-content-muted">Department</span>
                <span className="font-semibold text-content-main">{data.department || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Reset Button ──────────────────────────────── */}
      <div className="flex justify-center pt-2">
        <Button
          variant="outline"
          size="md"
          onClick={onReset}
          icon={<ArrowLeft size={16} />}
        >
          Verify Another Degree
        </Button>
      </div>
    </motion.div>
  );
}
