import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Check,
  Printer,
  AlertTriangle,
  RefreshCw,
  Eye,
  EyeOff,
  LogOut,
  ExternalLink,
  Copy,
} from 'lucide-react';
import { studentLogin, VerifyDegreeResponse } from '../services/api';
import { DiplomaView } from '../components/diploma/Parchment';
import { findUniversity } from '../data/universities';

export default function StudentPortalPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL parameters (e.g. from automated email link: ?id=22CS001&pin=123456)
  const urlId = searchParams.get('id') || searchParams.get('rollNo') || '';
  const urlPin = searchParams.get('pin') || '';

  // Only prefill from an email deep link (id + pin); never remember the last student on a shared device.
  const [identifier, setIdentifier] = useState(urlPin ? urlId : '');
  const [pin, setPin] = useState(urlPin || '');
  const [showPin, setShowPin] = useState(false);

  const [loading, setLoading] = useState(false);
  const [degree, setDegree] = useState<VerifyDegreeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Auto-login if deep-linked with both ID and PIN
  useEffect(() => {
    if (urlId && urlPin) {
      handleAuthenticate(urlId, urlPin);
    } else {
      const saved = sessionStorage.getItem('dv_student_session');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed?.degree) {
            setDegree(parsed.degree);
          }
        } catch {
          sessionStorage.removeItem('dv_student_session');
        }
      }
    }
  }, []);

  const handleAuthenticate = async (targetId: string, targetPin: string) => {
    const cleanId = targetId.trim();
    const cleanPin = targetPin.trim();

    if (!cleanId || !cleanPin) {
      setError('Please provide both your Roll Number / Email and your 6-digit PIN.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await studentLogin(cleanId, cleanPin);

      if (result?.degree?.status === 'NOT_FOUND') {
        setError('Your sign-in worked, but this degree was not found on the blockchain. Please contact your registrar.');
        setDegree(null);
      } else if (result && result.degree && result.degree.status !== 'ERROR') {
        setDegree(result.degree);
        sessionStorage.setItem('dv_student_session', JSON.stringify({ identifier: cleanId, degree: result.degree }));
        setSearchParams({ id: result.degree.globalCredentialId || cleanId });
      } else {
        setError((result as any)?.message || 'Authentication failed. Please verify your credentials.');
        setDegree(null);
      }
    } catch (err: any) {
      console.error('Student Portal login error:', err);
      const msg = err?.response?.data?.message || err?.message || 'Failed to authenticate. Please check your Roll Number and PIN.';
      setError(msg);
      setDegree(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAuthenticate(identifier, pin);
  };

  const handleLogout = () => {
    setDegree(null);
    setPin('');
    setError(null);
    sessionStorage.removeItem('dv_student_session');
    sessionStorage.removeItem('dv_student_token');
    setSearchParams({});
  };

  const verificationUrl = degree
    ? degree.verificationUrl || `${window.location.origin}/verify?id=${degree.globalCredentialId}`
    : '';

  const handleCopyLink = () => {
    if (!degree) return;
    navigator.clipboard.writeText(verificationUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const getLinkedInCertUrl = () => {
    if (!degree) return '#';
    const title = encodeURIComponent(`Bachelor of Engineering in ${degree.department || 'Engineering'}`);
    const org = encodeURIComponent(findUniversity(degree.universityCode)?.name ?? degree.universityCode);
    const certId = encodeURIComponent(degree.globalCredentialId);
    const certUrl = encodeURIComponent(verificationUrl);
    const issueDate = degree.issueDate ? new Date(degree.issueDate * 1000) : new Date();

    return `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${title}&organizationName=${org}&issueYear=${issueDate.getFullYear()}&issueMonth=${issueDate.getMonth() + 1}&certId=${certId}&certUrl=${certUrl}`;
  };

  const firstName = degree?.studentName?.trim().split(/\s+/)[0];
  const universityName = findUniversity(degree?.universityCode)?.name ?? degree?.universityCode;

  return (
    <div className="w-full max-w-5xl mx-auto pb-16 print:pb-0">
      {/* ── Print: exactly one landscape page with just the document ── */}
      <style>{`
        @media print {
          @page { size: A4 landscape; margin: 8mm; }
          html, body, #root, #root > div { background: #fff !important; min-height: 0 !important; height: auto !important; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print-document { break-inside: avoid; }
          .print-document > * { box-shadow: none !important; transform: none !important; }
        }
      `}</style>

      {/* ═══════════════ SIGN IN ═══════════════ */}
      {!degree && (
        <div className="flex items-center justify-center min-h-[70vh] py-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-md"
          >
            <div className="text-center mb-7">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-brand">Graduate access</p>
              <h1 className="font-display text-4xl sm:text-5xl font-semibold text-content-main tracking-tight mt-3">
                Your degree <em className="italic text-teal-brand">vault.</em>
              </h1>
              <p className="text-sm text-content-secondary mt-3 leading-relaxed">
                Sign in with your roll number or email and the 6-digit PIN your registrar sent you.
              </p>
            </div>

            <div className="vault-card-elevated p-6 sm:p-8">
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label htmlFor="vault-id" className="block text-xs font-semibold text-content-secondary mb-1.5">
                    Roll number or email
                  </label>
                  <input
                    id="vault-id"
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. 22CS100"
                    autoComplete="username"
                    className="vault-input w-full h-12 px-3.5 text-sm font-semibold placeholder:text-content-muted placeholder:font-medium"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="vault-pin" className="block text-xs font-semibold text-content-secondary mb-1.5">
                    6-digit PIN
                  </label>
                  <div className="relative">
                    <input
                      id="vault-pin"
                      type={showPin ? 'text' : 'password'}
                      inputMode="numeric"
                      maxLength={6}
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="••••••"
                      autoComplete="current-password"
                      className="vault-input w-full h-12 px-3.5 pr-11 text-base font-mono font-bold tracking-[0.3em] placeholder:tracking-normal placeholder:text-content-muted"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted hover:text-content-main transition-colors p-1"
                      aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
                    >
                      {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    role="alert"
                    className="p-3 rounded-xl bg-status-error-bg border border-status-error-border text-status-error-text text-xs leading-relaxed"
                  >
                    {error}
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={loading || !identifier.trim() || !pin.trim()}
                  className="w-full h-12 rounded-xl bg-teal-brand hover:bg-teal-brand-hover text-content-inverse font-bold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={15} className="animate-spin" /> Opening your vault…
                    </>
                  ) : (
                    'Open my vault'
                  )}
                </button>
              </form>

            </div>
          </motion.div>
        </div>
      )}

      {/* ═══════════════ THE VAULT ═══════════════ */}
      {degree && (
        <div className="space-y-8 print:space-y-0">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 print:hidden"
          >
            <div>
              {degree.revoked ? (
                <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-status-error">
                  <AlertTriangle size={14} /> Degree revoked
                </p>
              ) : (
                <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-status-verified">
                  <ShieldCheck size={14} /> Verified on the blockchain
                </p>
              )}
              <h1 className="font-display text-4xl sm:text-5xl font-semibold text-content-main tracking-tight mt-2">
                Welcome back{firstName ? `, ${firstName}` : ''}.
              </h1>
              <p className="text-sm text-content-secondary mt-2">
                {degree.revoked
                  ? `${universityName} has revoked this degree. The notice below is its official record.`
                  : 'This is your official diploma. Print it, or share the link so anyone can verify it.'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="self-start sm:self-end inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-content-secondary hover:text-content-main border border-border-main hover:bg-surface-card transition-colors"
            >
              <LogOut size={14} /> Sign out
            </button>
          </motion.div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2.5 print:hidden">
            <button
              onClick={() => window.print()}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                degree.revoked
                  ? 'bg-status-error-bg text-status-error-text border border-status-error-border'
                  : 'bg-teal-brand hover:bg-teal-brand-hover text-content-inverse'
              }`}
            >
              <Printer size={16} />
              {degree.revoked ? 'Print revocation notice' : 'Print or save as PDF'}
            </button>
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-surface-card hover:bg-surface-muted text-content-main border border-border-main transition-colors"
            >
              {copiedLink ? <Check size={16} className="text-status-verified" /> : <Copy size={16} />}
              {copiedLink ? 'Link copied' : 'Copy verification link'}
            </button>
            {!degree.revoked && (
              <a
                href={getLinkedInCertUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#0A66C2] hover:bg-[#004182] text-white transition-colors no-underline"
              >
                <LinkedInMark /> Add to LinkedIn
              </a>
            )}
            <Link
              to={`/verify?id=${encodeURIComponent(degree.globalCredentialId)}`}
              className="inline-flex items-center gap-1.5 px-2 py-2.5 text-sm font-semibold text-teal-brand hover:underline no-underline"
            >
              See what employers see <ExternalLink size={14} />
            </Link>
          </div>

          {/* The document */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="print-document max-w-3xl mx-auto print:max-w-[245mm]"
          >
            {degree.revoked ? (
              <RevocationNotice degree={degree} universityName={universityName ?? ''} />
            ) : (
              <DiplomaView
                universityCode={degree.universityCode}
                studentName={degree.studentName}
                fatherName={degree.fatherName}
                department={degree.department}
                rollNo={degree.rollNo}
                cgpa={degree.cgpa}
                issueDate={degree.issueDate ? new Date(degree.issueDate * 1000).getFullYear().toString() : undefined}
                qrCodeBase64={degree.qrCodeBase64}
                stamp="seal"
                stampDelay={0.6}
              />
            )}
          </motion.div>

          {/* Share */}
          <div className="vault-card p-5 sm:p-6 max-w-3xl mx-auto print:hidden">
            <p className="text-sm font-bold text-content-main">Your public verification link</p>
            <p className="text-xs text-content-secondary mt-1">
              Employers and embassies can open this to check your degree against the blockchain. It never shows your PIN or email.
            </p>
            <div className="mt-3 flex flex-col sm:flex-row gap-2">
              <code className="flex-1 min-w-0 px-3 py-2.5 rounded-xl bg-surface-muted border border-border-subtle font-mono text-xs text-content-main truncate">
                {verificationUrl}
              </code>
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-brand hover:bg-teal-brand-hover text-content-inverse text-xs font-bold transition-colors shrink-0"
              >
                {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                {copiedLink ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LinkedInMark() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

/** Official notice shown (and printed) instead of the diploma once a degree is revoked. */
function RevocationNotice({ degree, universityName }: { degree: VerifyDegreeResponse; universityName: string }) {
  return (
    <div className="relative rounded-2xl bg-[#FFF8F8] text-slate-900 border-[6px] border-red-700/80 shadow-elevated p-6 sm:p-12 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
        <span className="font-display text-red-700/10 font-black text-6xl sm:text-8xl tracking-widest -rotate-12">VOID</span>
      </div>

      <div className="relative text-center">
        <p className="font-display text-[11px] sm:text-xs font-semibold tracking-[0.28em] uppercase text-slate-700">{universityName}</p>
        <p className="mt-3 inline-block px-4 py-1.5 rounded-full bg-red-700 text-white font-bold text-xs tracking-wider uppercase">
          Notice of degree revocation
        </p>

        <p className="font-display italic text-sm text-slate-600 mt-6">The degree recorded for</p>
        <p className="font-display text-2xl sm:text-4xl font-semibold text-red-800 mt-1">{degree.studentName}</p>
        <p className="text-xs text-slate-600 mt-2">
          Roll No. <span className="font-mono font-semibold text-slate-900">{degree.rollNo}</span>
          {degree.department && degree.department !== 'N/A' && <> · Bachelor of Engineering in {degree.department}</>}
        </p>
        <p className="font-display italic text-sm text-slate-600 mt-4">has been revoked by the university and is no longer valid.</p>

        <div className="mt-6 max-w-lg mx-auto text-left p-4 rounded-xl bg-white/70 border border-red-200">
          <p className="text-[11px] font-bold uppercase tracking-wider text-red-700">Reason recorded on the blockchain</p>
          <p className="text-sm font-semibold text-slate-900 mt-1">
            “{degree.revocationReason || 'Revoked by the issuing university'}”
          </p>
          {degree.revocationDate ? (
            <p className="text-xs text-slate-500 mt-1">
              Revoked on {new Date(degree.revocationDate * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          ) : null}
        </div>

        <p className="text-xs text-slate-600 mt-6 max-w-lg mx-auto leading-relaxed">
          The revocation is permanent and public on the blockchain registry. Any copy of this degree, on paper or digital, should be treated as void.
        </p>
      </div>
    </div>
  );
}
