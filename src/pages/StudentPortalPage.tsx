import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import {
  GraduationCap,
  ShieldCheck,
  Check,
  Printer,
  Share2,
  FileBadge,
  Lock,
  Award,
  AlertTriangle,
  QrCode,
  ArrowRight,
  RefreshCw,
  Eye,
  EyeOff,
  FileCheck,
  KeyRound,
  Mail,
  UserCheck,
  LogOut,
  ExternalLink,
  Copy,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { studentLogin, VerifyDegreeResponse } from '../services/api';

const UNIVERSITIES = [
  { code: 'MUET', name: 'Mehran UET', fullName: 'Mehran University of Engineering & Technology', logo: '/logos/muet.svg' },
  { code: 'NED', name: 'NED UET', fullName: 'NED University of Engineering & Technology', logo: '/logos/ned.svg' },
  { code: 'NUST', name: 'NUST', fullName: 'National University of Sciences & Technology', logo: '/logos/nust.svg' },
  { code: 'FAST', name: 'FAST-NU', fullName: 'FAST National University of Computer & Emerging Sciences', logo: '/logos/fast.svg' },
];

export default function StudentPortalPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL parameters (e.g. from automated email link: ?id=22CS001&pin=123456)
  const urlId = searchParams.get('id') || searchParams.get('rollNo') || '';
  const urlPin = searchParams.get('pin') || '';

  const [identifier, setIdentifier] = useState(urlId || localStorage.getItem('dv_student_identifier') || '');
  const [pin, setPin] = useState(urlPin || '');
  const [showPin, setShowPin] = useState(false);
  const [selectedUni, setSelectedUni] = useState('MUET');

  const [loading, setLoading] = useState(false);
  const [degree, setDegree] = useState<VerifyDegreeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPin, setCopiedPin] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

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

      if (result && result.degree && result.degree.status !== 'ERROR') {
        setDegree(result.degree);
        localStorage.setItem('dv_student_identifier', cleanId);
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

  const handleCopyLink = () => {
    if (!degree) return;
    const url = degree.verificationUrl || `${window.location.origin}/verify?id=${degree.globalCredentialId}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyPin = () => {
    if (!degree?.studentPin) return;
    navigator.clipboard.writeText(degree.studentPin);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const getLinkedInCertUrl = () => {
    if (!degree) return '#';
    const title = encodeURIComponent(`Bachelor of Engineering in ${degree.department || 'Computer Systems Engineering'}`);
    const org = encodeURIComponent(degree.universityCode || 'MUET');
    const certId = encodeURIComponent(degree.rollNo || degree.globalCredentialId);
    const certUrl = encodeURIComponent(degree.verificationUrl || `${window.location.origin}/verify?id=${degree.globalCredentialId}`);

    const issueDate = degree.issueDate ? new Date(degree.issueDate * 1000) : new Date();
    const year = issueDate.getFullYear();
    const month = issueDate.getMonth() + 1;

    return `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${title}&organizationName=${org}&issueYear=${year}&issueMonth=${month}&certId=${certId}&certUrl=${certUrl}`;
  };

  const getHonorsTier = (cgpaStr: string) => {
    const cgpa = parseFloat(cgpaStr);
    if (isNaN(cgpa)) return 'Degree Awarded';
    if (cgpa >= 3.75) return 'First Class with Distinction';
    if (cgpa >= 3.00) return 'First Class Honors';
    if (cgpa >= 2.50) return 'Second Class Honors';
    return 'Graduated';
  };

  const getUniversityFullName = (code?: string) => {
    switch (code) {
      case 'MUET':
        return 'Mehran University of Engineering & Technology';
      case 'NED':
        return 'NED University of Engineering & Technology';
      case 'NUST':
        return 'National University of Sciences & Technology';
      case 'FAST':
        return 'FAST National University of Computer & Emerging Sciences';
      default:
        return `${code || 'University'} Academic Senate`;
    }
  };

  const getUniversityLocation = (code?: string) => {
    switch (code) {
      case 'MUET':
        return 'Jamshoro, Sindh, Pakistan';
      case 'NED':
        return 'Karachi, Sindh, Pakistan';
      case 'NUST':
        return 'Islamabad, Pakistan';
      case 'FAST':
        return 'Islamabad, Pakistan';
      default:
        return 'Pakistan';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-20 font-sans">
      {/* ── Print Stylesheet ─────────────────────────────────────────────── */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-certificate-container, .print-certificate-container * {
            visibility: visible;
          }
          .print-certificate-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
            box-shadow: none !important;
            border: 4px solid #C8A966 !important;
          }
        }
      `}</style>

      {/* ── Page Header (Only visible once authenticated) ──────────────────── */}
      {degree && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 print:hidden">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-teal-brand/10 text-teal-brand border border-teal-brand/20">
                <GraduationCap size={20} />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-brand">
                Official University Credentials
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-content-main tracking-tight">
              Student Degree Portal
            </h1>
            <p className="text-sm text-content-secondary max-w-xl">
              Access, download, print, and share your official university degree certificate.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="self-start sm:self-center flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-surface-card hover:bg-surface-muted text-red-500 border border-border-main transition-colors shadow-xs"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      )}

      {/* ── Graduate Sign In Form (Shown when not authenticated) ─────────── */}
      {!degree && (
        <div className="flex items-center justify-center min-h-[72vh] py-4 print:hidden">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md relative"
          >
            {/* Ambient Background Glow */}
            <div
              className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-teal-brand/20 via-secondary-blue/15 to-purple-500/10 blur-2xl -z-10 opacity-70"
              aria-hidden="true"
            />

            <div className="bg-surface-card border border-border-main rounded-3xl p-7 sm:p-9 shadow-elevated">
              {/* Clean Header */}
              <div className="text-center mb-7">
                <h1 className="text-2xl font-black text-content-main tracking-tight">
                  Student Degree Vault
                </h1>
                <p className="text-xs text-content-secondary mt-1.5 max-w-xs mx-auto leading-relaxed">
                  Sign in with your university credentials to view, download, and share your verified degree.
                </p>
              </div>

              {/* Quick Demo Helper */}
              <div className="mb-5 p-2.5 rounded-xl bg-surface-muted/60 border border-border-subtle flex items-center justify-between gap-3 text-xs">
                <span className="text-content-secondary text-[11px] truncate">
                  Testing? Demo Student: <strong className="text-content-main">22CS100</strong> (PIN: <strong className="text-content-main">294027</strong>)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedUni('MUET');
                    setIdentifier('22CS100');
                    setPin('294027');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-teal-brand/10 hover:bg-teal-brand/20 text-teal-brand text-[11px] font-bold transition-colors cursor-pointer shrink-0"
                >
                  Auto-fill
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* University Select */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-content-muted mb-1.5 ml-0.5">
                    Issuing University
                  </label>
                  <div className="relative">
                    <select
                      value={selectedUni}
                      onChange={(e) => setSelectedUni(e.target.value)}
                      className="w-full h-11 px-3.5 pr-10 rounded-xl bg-surface-page/70 border border-border-main text-content-main text-xs font-semibold focus:ring-2 focus:ring-teal-brand/40 focus:border-teal-brand outline-none transition-all cursor-pointer appearance-none shadow-xs"
                    >
                      {UNIVERSITIES.map((u) => (
                        <option key={u.code} value={u.code} className="bg-surface-card text-content-main">
                          {u.fullName} ({u.code})
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-content-muted pointer-events-none" />
                  </div>
                </div>

                {/* Roll Number or Email */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-content-muted mb-1.5 ml-0.5">
                    Student Roll Number or Email
                  </label>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. 22CS100 or student@muet.edu.pk"
                    className="w-full h-11 px-3.5 rounded-xl bg-surface-page/70 border border-border-main text-content-main text-sm font-semibold placeholder:text-content-muted/60 focus:ring-2 focus:ring-teal-brand/40 focus:border-teal-brand outline-none transition-all shadow-xs"
                    required
                  />
                </div>

                {/* 6-Digit PIN */}
                <div>
                  <div className="flex items-center justify-between mb-1.5 ml-0.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-content-muted">
                      6-Digit PIN
                    </label>
                    <span className="text-[10px] text-teal-brand font-medium">
                      From university registrar
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPin ? 'text' : 'password'}
                      maxLength={6}
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="••••••"
                      className="w-full h-11 px-3.5 pr-11 rounded-xl bg-surface-page/70 border border-border-main text-content-main text-base font-mono font-bold tracking-widest placeholder:tracking-normal placeholder:text-content-muted/60 focus:ring-2 focus:ring-teal-brand/40 focus:border-teal-brand outline-none transition-all shadow-xs"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted hover:text-content-main transition-colors p-1"
                      aria-label={showPin ? "Hide PIN" : "Show PIN"}
                    >
                      {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3 rounded-xl bg-status-error-bg border border-status-error-border text-status-error-text text-xs shadow-xs"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading || !identifier.trim() || !pin.trim()}
                    className="w-full h-11 rounded-xl bg-teal-brand hover:bg-teal-brand/90 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-button-primary hover:shadow-button-primary-hover transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw size={15} className="animate-spin" />
                        <span>Verifying Credentials...</span>
                      </span>
                    ) : (
                      <span>Sign In to Vault</span>
                    )}
                  </button>
                </div>
              </form>

              {/* Minimal Clean Guarantee */}
              <p className="mt-6 text-center text-[11px] text-content-muted">
                Degrees are cryptographically verified on the decentralized ledger.
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── Authenticated Student Degree View ────────────────────────────── */}
      {degree && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* ── Student Information & Action Bar ─────────────────────────── */}
          <div className="rounded-2xl bg-surface-card border border-border-main p-5 sm:p-6 shadow-sm print:hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Student Overview */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-teal-brand/10 text-teal-brand font-black text-2xl flex items-center justify-center border border-teal-brand/20">
                  {degree.studentName ? degree.studentName.charAt(0).toUpperCase() : 'S'}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className="text-lg sm:text-xl font-bold text-content-main">
                      {degree.studentName}
                    </h2>
                    {degree.revoked ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30">
                        <AlertTriangle size={12} />
                        REVOKED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        <Check size={12} />
                        Verified Authentic
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-medium text-content-secondary">
                    Bachelor of Engineering in {degree.department || 'Computer Systems Engineering'}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-content-muted">
                    <span className="font-mono font-semibold text-content-main">
                      Roll No: {degree.rollNo}
                    </span>
                    <span>•</span>
                    <span>{degree.universityCode || 'MUET'}</span>
                    <span>•</span>
                    <span>Father: {degree.fatherName || 'N/A'}</span>
                    {degree.studentPin && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-mono text-teal-brand">
                          PIN: {degree.studentPin}
                          <button
                            onClick={handleCopyPin}
                            className="p-0.5 hover:text-content-main"
                            title="Copy PIN"
                          >
                            {copiedPin ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                          </button>
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-border-subtle">
                {/* Print / Download Button */}
                {!degree.revoked ? (
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-brand hover:bg-teal-brand/90 text-white text-xs font-bold transition-all shadow-xs"
                  >
                    <Printer size={14} />
                    <span>Print / Download</span>
                  </button>
                ) : (
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600/10 text-red-600 border border-red-500/30 text-xs font-bold transition-all shadow-xs"
                  >
                    <Printer size={14} />
                    <span>Print Revocation Notice</span>
                  </button>
                )}

                {/* Share Link Button */}
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-muted hover:bg-surface-card text-content-main text-xs font-semibold border border-border-main transition-colors shadow-xs"
                >
                  {copiedLink ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
                  <span>{copiedLink ? 'Link Copied!' : 'Share Link'}</span>
                </button>

                {/* LinkedIn Share (Only for active degrees) */}
                {!degree.revoked && (
                  <a
                    href={getLinkedInCertUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0077b5] hover:bg-[#006396] text-white text-xs font-semibold transition-all shadow-xs no-underline"
                  >
                    <ExternalLink size={14} />
                    <span>Add to LinkedIn</span>
                  </a>
                )}

                {/* QR Code Button (Only for active degrees) */}
                {!degree.revoked && degree.qrCodeBase64 && (
                  <button
                    onClick={() => setShowQrModal(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-muted hover:bg-surface-card text-content-main text-xs font-semibold border border-border-main transition-colors shadow-xs"
                  >
                    <QrCode size={14} />
                    <span>QR Code</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════
              REVOKED DEGREE STATE VS ACTIVE DEGREE CERTIFICATE
              ═══════════════════════════════════════════════════════════════════ */}
          {degree.revoked ? (
            /* ── OFFICIAL NOTICE OF DEGREE REVOCATION ──────────────────────── */
            <div className="print-certificate-container flex justify-center w-full">
              <div className="w-full max-w-4xl bg-[#FFF8F8] text-slate-900 rounded-2xl shadow-xl p-8 sm:p-14 border-[6px] border-red-500/80 relative overflow-hidden select-none">
                {/* Diagonal REVOKED Watermark across background */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
                  <span className="text-red-500/10 font-black text-6xl sm:text-8xl tracking-widest -rotate-12 uppercase">
                    REVOKED • VOID
                  </span>
                </div>

                <div className="relative z-10 space-y-6 text-center">
                  {/* University Seal & Revocation Header */}
                  <div className="border-b-2 border-red-500/30 pb-6">
                    <div className="inline-flex p-3 rounded-2xl bg-red-500/15 text-red-600 mb-3 border border-red-500/30 shadow-xs">
                      <AlertTriangle size={36} strokeWidth={2.4} />
                    </div>

                    <h3 className="text-base sm:text-xl font-serif font-black tracking-widest text-slate-900 uppercase">
                      {getUniversityFullName(degree.universityCode)}
                    </h3>

                    <p className="text-xs uppercase tracking-wider text-slate-600 font-semibold mt-0.5">
                      Office of the Registrar & Controller of Examinations • {getUniversityLocation(degree.universityCode)}
                    </p>

                    <div className="mt-3 inline-block px-4 py-1.5 rounded-full bg-red-600 text-white font-extrabold text-xs tracking-wider uppercase shadow-xs">
                      Official Notice of Degree Revocation
                    </div>
                  </div>

                  {/* Formal Cancellation Statement */}
                  <div className="max-w-2xl mx-auto space-y-4 text-center sm:text-left text-sm leading-relaxed">
                    <p className="font-serif italic text-slate-700">
                      To whom it may concern and to the holder of this academic record:
                    </p>

                    <p className="text-slate-800">
                      Be formally advised that pursuant to the decision of the Academic Syndicate and Executive Board, the academic credential previously recorded under this identity:
                    </p>

                    <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 space-y-1.5 text-center">
                      <div className="text-xl sm:text-2xl font-serif font-black text-red-700">
                        {degree.studentName}
                      </div>
                      <div className="text-xs text-slate-700 font-medium">
                        Father Name: <span className="font-bold text-slate-900">{degree.fatherName || 'N/A'}</span> • Roll Number: <span className="font-mono font-bold text-red-600">{degree.rollNo}</span>
                      </div>
                      <div className="text-xs text-slate-700">
                        Conferred Program: Bachelor of Engineering in {degree.department || 'Computer Systems Engineering'}
                      </div>
                    </div>

                    {/* Official Reason */}
                    <div className="p-4 rounded-xl bg-slate-100 border border-slate-300 space-y-1.5">
                      <div className="text-xs font-bold uppercase tracking-wider text-red-700 flex items-center gap-1.5">
                        <AlertTriangle size={15} />
                        <span>Official Ground for Revocation:</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-900">
                        "{degree.revocationReason || 'Revoked by order of the Academic Syndicate & University Registrar'}"
                      </p>
                      {degree.revocationDate && (
                        <p className="text-xs text-slate-500">
                          Date of Executive Order: {new Date(degree.revocationDate * 1000).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed pt-2">
                      <strong>Legal & Accreditation Notice:</strong> This degree has been irrevocably cancelled on the university blockchain registry. It is no longer recognized by the University, the Higher Education Commission (HEC), or any employer or embassy worldwide. Any paper diploma or transcript bearing this record is null and void.
                    </p>
                  </div>

                  {/* Signatures */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-red-500/20 text-center">
                    <div>
                      <div className="font-serif italic text-sm text-slate-800 font-medium">
                        Prof. Dr. Vice Chancellor
                      </div>
                      <div className="w-32 h-px bg-red-300 mx-auto my-1" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Vice Chancellor & Syndicate Chair
                      </span>
                    </div>

                    <div>
                      <div className="font-serif italic text-sm text-slate-800 font-medium">
                        Office of Examinations
                      </div>
                      <div className="w-32 h-px bg-red-300 mx-auto my-1" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Controller of Examinations
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ── OFFICIAL DEGREE CERTIFICATE PARCHMENT (ACTIVE ONLY) ────────── */
            <div className="print-certificate-container flex justify-center w-full">
              <div className="w-full max-w-4xl bg-[#FCFAF2] text-slate-900 rounded-2xl shadow-xl p-8 sm:p-14 border-[6px] border-[#C8A966] relative overflow-hidden select-none transition-all">
                {/* Inner Decorative Borders (Standard Certificate Framing) */}
                <div className="absolute inset-2.5 sm:inset-3 border-2 border-[#C8A966]/60 rounded-xl pointer-events-none" />
                <div className="absolute inset-4 sm:inset-5 border border-[#C8A966]/30 rounded-lg pointer-events-none" />

                {/* Corner Accents */}
                <div className="absolute top-3.5 left-3.5 w-6 h-6 border-t-2 border-l-2 border-[#A16207] pointer-events-none" />
                <div className="absolute top-3.5 right-3.5 w-6 h-6 border-t-2 border-r-2 border-[#A16207] pointer-events-none" />
                <div className="absolute bottom-3.5 left-3.5 w-6 h-6 border-b-2 border-l-2 border-[#A16207] pointer-events-none" />
                <div className="absolute bottom-3.5 right-3.5 w-6 h-6 border-b-2 border-r-2 border-[#A16207] pointer-events-none" />

                {/* Subtle University Shield Watermark in Background */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none">
                  <ShieldCheck size={380} strokeWidth={1} color="#A16207" />
                </div>

                {/* Certificate Content (Z-Index above watermark) */}
                <div className="relative z-10 text-center">
                  {/* University Seal & Crest Header */}
                  <div className="space-y-1 mb-6">
                    <div className="inline-flex p-2.5 rounded-2xl bg-[#C8A966]/15 text-[#92400E] mb-2 border border-[#C8A966]/30 shadow-xs">
                      <ShieldCheck size={36} strokeWidth={2.2} />
                    </div>

                    <h3 className="text-base sm:text-xl font-serif font-black tracking-[0.18em] text-[#1E3A8A] uppercase">
                      {getUniversityFullName(degree.universityCode)}
                    </h3>

                    <div className="text-[11px] sm:text-xs tracking-widest uppercase font-semibold text-slate-600">
                      {getUniversityLocation(degree.universityCode)}
                    </div>

                    <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-[#C8A966] to-transparent mx-auto mt-2" />
                  </div>

                  {/* Conferral Statement */}
                  <div className="space-y-4 max-w-2xl mx-auto my-6">
                    <p className="text-xs sm:text-sm font-serif italic text-slate-700">
                      By the authority of the Syndicate and the Academic Senate, be it known that
                    </p>

                    {/* Graduate Student Name */}
                    <div className="py-1">
                      <h2 className="text-2xl sm:text-4xl font-serif font-black tracking-tight text-slate-950 inline-block px-6 py-1 border-b-2 border-[#C8A966]/50">
                        {degree.studentName}
                      </h2>
                    </div>

                    {/* Parentage & Roll Number */}
                    <p className="text-xs sm:text-sm font-serif text-slate-700">
                      Son / Daughter of <span className="font-semibold text-slate-900">{degree.fatherName || 'N/A'}</span>
                      <br />
                      Roll Number: <span className="font-mono font-bold text-slate-900">{degree.rollNo}</span>
                    </p>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-1">
                      having successfully fulfilled all prescribed academic conditions and examinations, has been conferred the degree of
                    </p>

                    {/* Degree Name */}
                    <div className="py-2">
                      <span className="text-xl sm:text-3xl font-serif font-black text-[#0F766E] tracking-tight block">
                        Bachelor of Engineering
                      </span>
                      <span className="text-sm sm:text-base font-semibold text-slate-800 block mt-0.5">
                        in {degree.department || 'Computer Systems Engineering'}
                      </span>
                    </div>

                    {/* Honors & CGPA */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-bold tracking-wide shadow-xs">
                      <span>Cumulative GPA: {degree.cgpa}</span>
                      <span>•</span>
                      <span>{getHonorsTier(degree.cgpa)}</span>
                    </div>
                  </div>

                  {/* Signatures & Verification QR Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center pt-6 mt-6 border-t border-[#C8A966]/30">
                    {/* Left: Vice Chancellor Signature */}
                    <div className="flex flex-col items-center">
                      <div className="h-9 flex items-center justify-center font-serif italic text-base text-slate-900 font-medium">
                        Prof. Dr. Vice Chancellor
                      </div>
                      <div className="w-36 h-px bg-[#C8A966]/50 my-1" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                        Vice Chancellor
                      </span>
                    </div>

                    {/* Center: Live Verification QR Code */}
                    <div className="flex flex-col items-center justify-center">
                      {degree.qrCodeBase64 ? (
                        <div
                          onClick={() => setShowQrModal(true)}
                          className="cursor-pointer group p-1.5 rounded-xl bg-white border border-[#C8A966]/40 shadow-sm hover:scale-105 transition-transform"
                        >
                          <img
                            src={`data:image/png;base64,${degree.qrCodeBase64}`}
                            alt="Verification QR"
                            className="w-20 h-20 object-contain"
                          />
                          <span className="text-[9px] font-bold text-slate-600 flex items-center justify-center gap-1 mt-0.5 group-hover:text-teal-brand transition-colors">
                            <Eye size={10} /> Scan to Verify
                          </span>
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                          <QrCode size={30} />
                        </div>
                      )}
                    </div>

                    {/* Right: Controller of Examinations Signature */}
                    <div className="flex flex-col items-center">
                      <div className="h-9 flex items-center justify-center font-serif italic text-base text-slate-900 font-medium">
                        Controller of Examinations
                      </div>
                      <div className="w-36 h-px bg-[#C8A966]/50 my-1" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                        Controller / Registrar
                      </span>
                    </div>
                  </div>

                  {/* Clean Footer */}
                  <div className="mt-6 pt-3 border-t border-[#C8A966]/20 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500 font-medium">
                    <span>Credential ID: {degree.rollNo}</span>
                    <span>Conferral Date: {degree.issueDate ? new Date(degree.issueDate * 1000).toLocaleDateString() : 'N/A'}</span>
                    <span>Official University Degree</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Simple Quick-Share Card ────────────────────────────────────── */}
          <div className="p-5 rounded-2xl bg-surface-card border border-border-main shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-content-muted">
                Public Verification Link
              </span>
              <p className="text-xs text-content-secondary mt-0.5">
                Share this link with employers, visa officers, or embassies for instant degree verification.
              </p>
            </div>

            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-brand hover:bg-teal-brand/90 text-white text-xs font-bold transition-all shadow-xs shrink-0"
            >
              {copiedLink ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedLink ? 'Link Copied to Clipboard!' : 'Copy Verification Link'}</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* ── QR Code Modal ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showQrModal && degree && degree.qrCodeBase64 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-3xl bg-surface-card border border-border-main p-6 shadow-elevated text-center space-y-4"
            >
              <h3 className="text-base font-bold text-content-main">
                Degree Verification QR Code
              </h3>
              <p className="text-xs text-content-secondary">
                Anyone can scan this QR code with their mobile phone camera to verify your official degree.
              </p>
              <div className="p-4 rounded-2xl bg-white border border-border-main shadow-inner inline-block">
                <img
                  src={`data:image/png;base64,${degree.qrCodeBase64}`}
                  alt="QR Code"
                  className="w-48 h-48 object-contain"
                />
              </div>
              <div className="text-xs font-semibold text-content-main">
                Roll No: {degree.rollNo}
              </div>
              <button
                onClick={() => setShowQrModal(false)}
                className="w-full py-2.5 rounded-xl bg-surface-muted hover:bg-surface-card border border-border-main text-xs font-bold text-content-main transition-colors"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
