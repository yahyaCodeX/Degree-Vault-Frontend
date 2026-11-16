import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Hash,
  Calendar,
  ArrowLeft,
  ExternalLink,
  Copy,
  Check,
  FileCheck2,
  Building2,
  QrCode,
  Link,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '../ui';
import { VerifyDegreeResponse } from '../../services/api';
import { DiplomaView } from '../diploma/Parchment';

interface AuthenticResultProps {
  data: VerifyDegreeResponse;
  onReset: () => void;
}

type CopyKey = 'hash' | 'guci' | 'url';

export default function AuthenticResult({ data, onReset }: AuthenticResultProps) {
  const [copied, setCopied] = useState<CopyKey | null>(null);

  const issueDateFormatted = data.issueDate
    ? new Date(data.issueDate * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A';

  const verificationDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  const copyToClipboard = (text: string, key: CopyKey) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied((k) => (k === key ? null : k)), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* ── Verdict ── */}
      <div className="text-center">
        <motion.p
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-status-verified"
        >
          <ShieldCheck size={14} /> Verified on the blockchain
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="font-display text-4xl sm:text-6xl font-semibold text-content-main tracking-tight leading-[1.05] mt-3"
        >
          This degree is <em className="italic text-status-verified">authentic.</em>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="text-sm sm:text-base text-content-secondary mt-4 max-w-lg mx-auto leading-relaxed"
        >
          Every detail reproduces the fingerprint the university wrote to the blockchain. Checked {verificationDate}.
        </motion.p>
        <button
          type="button"
          onClick={() => copyToClipboard(data.globalCredentialId, 'guci')}
          className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-teal-subtle border border-teal-brand/25 text-teal-brand text-xs font-mono font-bold hover:border-teal-brand/50 transition-colors"
          title="Copy credential ID"
        >
          <Hash size={12} />
          {data.globalCredentialId}
          {copied === 'guci' ? <Check size={11} /> : <Copy size={11} />}
        </button>
      </div>

      {/* ── The diploma, revealed ── */}
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-2xl mx-auto"
      >
        <DiplomaView
          universityCode={data.universityCode}
          studentName={data.studentName}
          fatherName={data.fatherName}
          department={data.department}
          rollNo={data.rollNo}
          cgpa={data.cgpa}
          issueDate={data.issueDate ? new Date(data.issueDate * 1000).getFullYear().toString() : undefined}
          stamp="seal"
          stampDelay={0.85}
        />
      </motion.div>

      {/* ── Details + share ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.9 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        <div className="vault-card p-6">
          <h3 className="text-sm font-bold text-content-main mb-5">Record details</h3>
          <div className="space-y-4">
            <InfoItem icon={<User size={15} />} label="Father’s name" value={data.fatherName} />
            <InfoItem icon={<Building2 size={15} />} label="University · Roll number" value={`${data.universityCode} · ${data.rollNo}`} mono />
            <InfoItem icon={<Calendar size={15} />} label="Recorded on the blockchain" value={issueDateFormatted} />
          </div>
        </div>

        {(data.qrCodeBase64 || data.verificationUrl) && (
          <div className="vault-card p-6">
            <h3 className="text-sm font-bold text-content-main mb-4 flex items-center gap-2">
              <QrCode size={16} className="text-teal-brand" /> Share this verification
            </h3>
            <div className="flex items-start gap-4">
              {data.qrCodeBase64 && (
                <img
                  src={`data:image/png;base64,${data.qrCodeBase64}`}
                  alt={`QR code for ${data.globalCredentialId}`}
                  className="w-28 h-28 shrink-0 rounded-xl border border-border-subtle object-contain bg-white p-1"
                />
              )}
              {data.verificationUrl && (
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-content-secondary leading-relaxed">
                    Anyone can scan the code or open the link to run this check themselves.
                  </p>
                  <p className="mt-2 p-2 rounded-lg bg-surface-muted border border-border-subtle font-mono text-[11px] text-content-main break-all">
                    {data.verificationUrl}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(data.verificationUrl, 'url')}
                      className="flex items-center gap-1 text-xs text-teal-brand hover:underline font-semibold"
                    >
                      {copied === 'url' ? <Check size={12} /> : <Copy size={12} />}
                      {copied === 'url' ? 'Copied' : 'Copy link'}
                    </button>
                    <a
                      href={data.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-teal-brand hover:underline font-semibold"
                    >
                      <Link size={12} /> Open
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* ── Official document on IPFS (if available) ── */}
      {data.ipfsCid && data.ipfsCid !== 'N/A' && (
        <div className="vault-card p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-teal-subtle text-teal-brand border border-teal-brand/20 flex items-center justify-center shrink-0">
              <FileCheck2 size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-content-main">Original certificate file</h4>
              <p className="text-xs text-content-secondary">Stored on IPFS, the decentralized file network</p>
            </div>
          </div>
          <a
            href={`https://ipfs.io/ipfs/${data.ipfsCid}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-brand hover:bg-teal-brand-hover text-content-inverse text-xs font-bold transition-colors"
          >
            <ExternalLink size={14} /> View original
          </a>
        </div>
      )}

      {/* ── Technical details (for examiners) ── */}
      <details className="group vault-card p-4">
        <summary className="flex items-center justify-between cursor-pointer text-xs font-semibold text-content-muted hover:text-teal-brand select-none">
          <span className="flex items-center gap-2">
            <Hash size={14} /> Technical details: fingerprint &amp; issuer
          </span>
          <span className="text-[11px] group-open:rotate-180 transition-transform">▼</span>
        </summary>
        <div className="pt-4 mt-3 border-t border-border-subtle space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-medium text-content-secondary">
                On-chain SHA-256 fingerprint{data.hashScheme ? ` (scheme ${data.hashScheme})` : ''}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(data.dataHash, 'hash')}
                className="text-[11px] text-teal-brand hover:underline flex items-center gap-1"
              >
                {copied === 'hash' ? <Check size={11} /> : <Copy size={11} />}
                {copied === 'hash' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="p-2.5 rounded-lg bg-surface-muted border border-border-subtle font-mono text-[11px] text-content-secondary break-all">
              {data.dataHash || 'Unavailable'}
            </div>
          </div>
          {data.issuerAddress && (
            <div>
              <span className="block text-[11px] font-medium text-content-secondary mb-1">Issuing registrar’s blockchain address</span>
              <div className="p-2.5 rounded-lg bg-surface-muted border border-border-subtle font-mono text-[11px] text-content-secondary break-all">
                {data.issuerAddress}
              </div>
            </div>
          )}
        </div>
      </details>

      <div className="flex justify-center pt-2">
        <Button variant="outline" size="md" onClick={onReset} icon={<ArrowLeft size={16} />}>
          Verify another degree
        </Button>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value, mono = false }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-lg bg-surface-muted border border-border-subtle text-content-muted flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <span className="block text-xs text-content-muted">{label}</span>
        <span className={`block text-sm text-content-main font-semibold mt-0.5 truncate ${mono ? 'font-mono text-xs' : ''}`}>
          {value || 'N/A'}
        </span>
      </div>
    </div>
  );
}
