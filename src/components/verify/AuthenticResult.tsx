import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  User,
  GraduationCap,
  Hash,
  Globe,
  Calendar,
  ArrowLeft,
  ExternalLink,
  Copy,
  Check,
  FileCheck2,
  Building2,
  QrCode,
  Link,
} from 'lucide-react';
import { Button, Badge } from '../ui';
import { VerifyDegreeResponse } from '../../services/api';

interface AuthenticResultProps {
  data: VerifyDegreeResponse;
  onReset: () => void;
}

export default function AuthenticResult({ data, onReset }: AuthenticResultProps) {
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedCid, setCopiedCid] = useState(false);
  const [copiedGuci, setCopiedGuci] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const issueDateFormatted = data.issueDate
    ? new Date(data.issueDate * 1000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A';

  const verificationDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const copyToClipboard = (text: string, type: 'hash' | 'cid' | 'guci' | 'url') => {
    navigator.clipboard.writeText(text);
    if (type === 'hash') { setCopiedHash(true); setTimeout(() => setCopiedHash(false), 2000); }
    else if (type === 'cid') { setCopiedCid(true); setTimeout(() => setCopiedCid(false), 2000); }
    else if (type === 'guci') { setCopiedGuci(true); setTimeout(() => setCopiedGuci(false), 2000); }
    else { setCopiedUrl(true); setTimeout(() => setCopiedUrl(false), 2000); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-3xl mx-auto space-y-6"
    >
      {/* ── Success Banner ── */}
      <div className="relative">
        <div
          className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-status-verified/15 via-teal-brand/15 to-status-verified/15 blur-xl -z-10 opacity-80"
          aria-hidden="true"
        />
        <div
          className="bg-surface-card border border-status-verified-border rounded-2xl p-7 sm:p-9 text-center relative z-10"
          style={{ boxShadow: 'var(--shadow-elevated), var(--inset-card-highlight)' }}
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-status-verified-bg to-status-verified-border/30 text-status-verified border border-status-verified-border flex items-center justify-center mx-auto mb-4 shadow-sm">
            <CheckCircle2 size={34} strokeWidth={2.4} />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-content-main mb-2 tracking-tight">
            Degree Verified &amp; Authentic ✓
          </h2>
          <p className="text-xs sm:text-sm text-content-secondary max-w-lg mx-auto leading-relaxed">
            This degree is officially verified and authentic. The academic record is genuine and has been validated by the university.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-5">
            <Badge variant="success" dot size="md">
              Officially Verified
            </Badge>
            <span className="text-xs text-content-muted font-medium">
              Verified on {verificationDate}
            </span>
          </div>

          {/* GUCI pill */}
          <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-teal-subtle border border-teal-brand/25 text-teal-brand text-xs font-mono font-bold shadow-sm">
            <Hash size={12} />
            {data.globalCredentialId}
            <button
              type="button"
              onClick={() => copyToClipboard(data.globalCredentialId, 'guci')}
              className="ml-1 hover:opacity-70 transition-opacity"
              title="Copy GUCI"
            >
              {copiedGuci ? <Check size={11} /> : <Copy size={11} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── QR Code + Verification URL ── */}
      {(data.qrCodeBase64 || data.verificationUrl) && (
        <div
          className="bg-surface-card border border-border-main rounded-2xl p-6 sm:p-8"
          style={{ boxShadow: 'var(--shadow-card), var(--inset-card-highlight)' }}
        >
          <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-border-subtle">
            <div className="w-8 h-8 rounded-lg bg-surface-teal-subtle text-teal-brand border border-teal-brand/20 flex items-center justify-center">
              <QrCode size={17} strokeWidth={2.2} />
            </div>
            <h3 className="text-base font-bold text-content-main">Verification QR Code</h3>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* QR image */}
            {data.qrCodeBase64 && (
              <div className="flex-shrink-0">
                <img
                  src={`data:image/png;base64,${data.qrCodeBase64}`}
                  alt={`QR code for ${data.globalCredentialId}`}
                  className="w-36 h-36 rounded-xl border border-border-subtle shadow-xs object-contain bg-white p-1"
                />
              </div>
            )}

            {/* URL + instructions */}
            <div className="flex-1 min-w-0 space-y-3">
              <p className="text-xs text-content-secondary leading-relaxed">
                Scan this QR code or share the link below to let anyone instantly verify this credential.
              </p>
              {data.verificationUrl && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-content-secondary flex items-center gap-1.5">
                      <Link size={12} />
                      Verification URL
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => copyToClipboard(data.verificationUrl, 'url')}
                        className="flex items-center gap-1 text-xs text-teal-brand hover:underline cursor-pointer font-medium"
                      >
                        {copiedUrl ? <Check size={12} /> : <Copy size={12} />}
                        <span>{copiedUrl ? 'Copied' : 'Copy'}</span>
                      </button>
                      <a
                        href={data.verificationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-teal-brand hover:underline font-medium"
                      >
                        <ExternalLink size={12} />
                        <span>Open</span>
                      </a>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-page/70 border border-border-subtle font-mono text-xs text-content-main break-all shadow-2xs">
                    {data.verificationUrl}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Credential Details ── */}
      <div
        className="bg-surface-card border border-border-main rounded-2xl p-6 sm:p-8"
        style={{ boxShadow: 'var(--shadow-card), var(--inset-card-highlight)' }}
      >
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-border-subtle">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-surface-teal-subtle text-teal-brand border border-teal-brand/20 flex items-center justify-center">
              <FileCheck2 size={18} strokeWidth={2.2} />
            </div>
            <h3 className="text-base font-bold text-content-main">Credential Details</h3>
          </div>
          <span className="font-mono text-xs px-3 py-1 rounded-lg bg-surface-muted border border-border-subtle text-content-main font-semibold shadow-2xs">
            {data.universityCode} · {data.rollNo}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8">
          <InfoItem icon={<User size={16} />} label="Student Name" value={data.studentName} />
          <InfoItem icon={<User size={16} />} label="Father's Name" value={data.fatherName} />
          <InfoItem icon={<Building2 size={16} />} label="University Code" value={data.universityCode} mono />
          <InfoItem icon={<Hash size={16} />} label="Roll Number" value={data.rollNo} mono />
          <InfoItem icon={<GraduationCap size={16} />} label="Department" value={data.department} />
          <InfoItem icon={<GraduationCap size={16} />} label="Cumulative GPA" value={data.cgpa} />
          <InfoItem icon={<Calendar size={16} />} label="Issue Date" value={issueDateFormatted} />
        </div>
      </div>

      {/* ── Official Document Access (if available) ── */}
      {data.ipfsCid && data.ipfsCid !== 'N/A' && (
        <div
          className="bg-surface-card border border-border-main rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ boxShadow: 'var(--shadow-card), var(--inset-card-highlight)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-teal-subtle text-teal-brand border border-teal-brand/20 flex items-center justify-center flex-shrink-0">
              <FileCheck2 size={22} strokeWidth={2.2} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-content-main">Official Degree Certificate</h4>
              <p className="text-xs text-content-secondary">Original tamper-proof document stored securely</p>
            </div>
          </div>
          <a
            href={`https://ipfs.io/ipfs/${data.ipfsCid}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-brand hover:bg-teal-brand-dark text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <ExternalLink size={14} />
            <span>View Original Certificate</span>
          </a>
        </div>
      )}

      {/* ── Collapsible Technical Audit Details (Optional for Examiners) ── */}
      <details className="group bg-surface-card border border-border-subtle rounded-2xl p-4 transition-all">
        <summary className="flex items-center justify-between cursor-pointer text-xs font-medium text-content-muted hover:text-teal-brand select-none">
          <span className="flex items-center gap-2">
            <Hash size={14} />
            <span>Technical Audit &amp; Blockchain Details (For Technical Verification)</span>
          </span>
          <span className="text-[11px] font-mono group-open:rotate-180 transition-transform">▼</span>
        </summary>

        <div className="pt-4 mt-3 border-t border-border-subtle space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-medium text-content-secondary">Digital Fingerprint (Data Hash)</span>
              <button
                type="button"
                onClick={() => copyToClipboard(data.dataHash, 'hash')}
                className="text-[11px] text-teal-brand hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedHash ? <Check size={11} /> : <Copy size={11} />}
                <span>{copiedHash ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-2.5 rounded-lg bg-surface-page/70 border border-border-subtle font-mono text-[11px] text-content-muted break-all">
              {data.dataHash || 'Unavailable'}
            </div>
          </div>

          {data.issuerAddress && (
            <div>
              <span className="block text-[11px] font-medium text-content-secondary mb-1">Registrar Blockchain Address</span>
              <div className="p-2.5 rounded-lg bg-surface-page/70 border border-border-subtle font-mono text-[11px] text-content-muted break-all">
                {data.issuerAddress}
              </div>
            </div>
          )}
        </div>
      </details>

      {/* ── Actions ── */}
      <div className="flex justify-center pt-3">
        <Button variant="outline" size="md" onClick={onReset} icon={<ArrowLeft size={16} />}>
          Verify Another Degree
        </Button>
      </div>
    </motion.div>
  );
}

function InfoItem({
  icon,
  label,
  value,
  mono = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-lg bg-surface-muted/60 border border-border-subtle text-content-muted flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
        {icon}
      </div>
      <div className="min-w-0">
        <span className="block text-xs text-content-muted font-medium">{label}</span>
        <span
          className={`block text-sm text-content-main font-bold mt-0.5 truncate ${
            mono ? 'font-mono text-xs font-semibold' : ''
          }`}
        >
          {value || 'N/A'}
        </span>
      </div>
    </div>
  );
}
