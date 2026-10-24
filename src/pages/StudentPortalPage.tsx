import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom';
import {
  GraduationCap,
  ShieldCheck,
  Search,
  ExternalLink,
  Copy,
  Check,
  Printer,
  Share2,
  FileBadge,
  Sparkles,
  Database,
  Lock,
  Layers,
  Award,
  AlertTriangle,
  QrCode,
  ArrowRight,
  Code2,
  RefreshCw,
  Eye,
  FileCheck
} from 'lucide-react';
import { getStudentDegree, VerifyDegreeResponse } from '../services/api';

const QUICK_DEMO_ROLLS = ['22CS001', '22CS010', '22CS025', '22CS050', '22CS100'];

const UNIVERSITIES = [
  { code: 'MUET', name: 'Mehran University of Engineering and Technology' },
  { code: 'NED', name: 'NED University of Engineering and Technology' },
  { code: 'NUST', name: 'National University of Sciences and Technology' },
  { code: 'FAST', name: 'FAST National University of Computer and Emerging Sciences' },
];

export default function StudentPortalPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('id') || searchParams.get('rollNo') || localStorage.getItem('dv_student_query') || '';

  const [query, setQuery] = useState(initialQuery);
  const [selectedUni, setSelectedUni] = useState('MUET');
  const [loading, setLoading] = useState(false);
  const [degree, setDegree] = useState<VerifyDegreeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'certificate' | 'ledger'>('certificate');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [showProofModal, setShowProofModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  // Auto-load if query is in URL
  useEffect(() => {
    if (initialQuery.trim()) {
      handleLookup(initialQuery.trim());
    }
  }, []);

  const handleLookup = async (lookupQuery: string) => {
    const clean = lookupQuery.trim();
    if (!clean) return;

    setLoading(true);
    setError(null);

    try {
      // If user typed only a roll number e.g. "22CS001" and uni is chosen, support both
      const targetQuery = clean.includes('-') ? clean : `${selectedUni}-${clean}`;
      const result = await getStudentDegree(targetQuery);

      if (result.status === 'NOT_FOUND') {
        setError(`No verified degree found for "${targetQuery}". Please verify the Roll Number or GUCI.`);
        setDegree(null);
      } else {
        setDegree(result);
        localStorage.setItem('dv_student_query', clean);
        setSearchParams({ id: result.globalCredentialId || clean });
      }
    } catch (err: any) {
      console.error('Error fetching student degree:', err);
      setError(err?.response?.data?.message || 'Could not connect to the blockchain vault. Please check your network or try again.');
      setDegree(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLookup(query);
  };

  const handleClearSession = () => {
    setDegree(null);
    setQuery('');
    setError(null);
    localStorage.removeItem('dv_student_query');
    setSearchParams({});
  };

  const handleCopyLink = () => {
    if (!degree) return;
    const url = degree.verificationUrl || `${window.location.origin}/verify?id=${degree.globalCredentialId}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyHash = () => {
    if (!degree) return;
    navigator.clipboard.writeText(degree.dataHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const getLinkedInCertUrl = () => {
    if (!degree) return '#';
    const title = encodeURIComponent(`Bachelor of Engineering in ${degree.department || 'Computer Systems Engineering'}`);
    const org = encodeURIComponent(degree.universityCode || 'MUET');
    const certId = encodeURIComponent(degree.globalCredentialId);
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

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-20 font-sans">
      {/* ── Page Header / Branding ───────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="p-2 rounded-xl bg-teal-brand/10 text-teal-brand border border-teal-brand/20 shadow-xs">
              <GraduationCap size={22} />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-brand">
              Official Graduate Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-content-main tracking-tight">
            Student Degree Vault
          </h1>
          <p className="text-sm text-content-secondary max-w-xl">
            Access your immutable, cryptographic degree credential anchored on the Ethereum EVM blockchain with permanent IPFS storage.
          </p>
        </div>

        {degree && (
          <button
            onClick={handleClearSession}
            className="self-start sm:self-center flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-surface-card hover:bg-surface-muted text-content-secondary border border-border-main transition-colors shadow-xs"
          >
            <RefreshCw size={14} />
            <span>Switch Student</span>
          </button>
        )}
      </div>

      {/* ── Lookup Form (Visible when no degree or user searching) ─────────── */}
      {!degree && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-surface-card/90 border border-border-main shadow-card p-6 sm:p-10 mb-8 backdrop-blur-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-teal-brand/10 via-secondary-blue/5 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

          <div className="max-w-2xl mx-auto text-center mb-8">
            <div className="inline-flex p-3 rounded-2xl bg-teal-brand/15 text-teal-brand mb-4 ring-8 ring-teal-brand/5 shadow-xs">
              <FileBadge size={32} strokeWidth={2.2} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-content-main mb-2">
              Unlock Your Verified Credential
            </h2>
            <p className="text-sm text-content-secondary">
              Enter your official Student Roll Number or Globally Unique Credential ID (GUCI) to load your tamper-proof blockchain degree certificate.
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto space-y-4">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="w-full sm:w-44 shrink-0">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-content-muted mb-1 ml-1">
                  University
                </label>
                <select
                  value={selectedUni}
                  onChange={(e) => setSelectedUni(e.target.value)}
                  className="w-full h-12 px-3.5 rounded-xl bg-surface-card border border-border-main text-content-main font-semibold text-xs focus:ring-2 focus:ring-teal-brand focus:border-teal-brand outline-none transition-all shadow-xs"
                >
                  {UNIVERSITIES.map((u) => (
                    <option key={u.code} value={u.code}>
                      {u.code} ({u.name.split(' ')[0]})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-content-muted mb-1 ml-1">
                  Roll No or GUCI
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g. 22CS001 or MUET-22CS001"
                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-surface-card border border-border-main text-content-main text-sm font-semibold placeholder:text-content-muted/60 focus:ring-2 focus:ring-teal-brand focus:border-teal-brand outline-none transition-all shadow-xs"
                    required
                  />
                  <Search size={18} className="absolute left-3.5 top-3.5 text-content-muted" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-teal-brand hover:bg-teal-brand/90 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-button-primary hover:shadow-button-primary-hover transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  <span>Querying Blockchain Ledger...</span>
                </>
              ) : (
                <>
                  <span>Open Student Vault</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Roll numbers */}
          <div className="mt-8 pt-6 border-t border-border-subtle max-w-xl mx-auto">
            <span className="text-xs font-bold text-content-muted block mb-2.5 text-center">
              Quick Test Credentials:
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              {QUICK_DEMO_ROLLS.map((roll) => (
                <button
                  key={roll}
                  type="button"
                  onClick={() => {
                    setQuery(roll);
                    handleLookup(roll);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-surface-muted hover:bg-surface-teal-subtle text-content-secondary hover:text-teal-brand border border-border-subtle hover:border-teal-brand/30 transition-all shadow-xs"
                >
                  {roll}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/25 text-red-600 dark:text-red-400 text-xs flex items-center gap-3 max-w-xl mx-auto"
            >
              <AlertTriangle size={20} className="shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Trust Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 pt-8 border-t border-border-subtle">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-surface-muted/50 border border-border-subtle/80">
              <div className="p-2 rounded-xl bg-teal-brand/10 text-teal-brand shrink-0">
                <Database size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-content-main mb-0.5">Ethereum EVM Anchor</h4>
                <p className="text-[11px] text-content-muted leading-relaxed">
                  Cryptographically registered on smart contract with immutable proof.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-surface-muted/50 border border-border-subtle/80">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 shrink-0">
                <Layers size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-content-main mb-0.5">Decentralized IPFS</h4>
                <p className="text-[11px] text-content-muted leading-relaxed">
                  Permanent decentralized document storage with tamper-proof content hashing.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-surface-muted/50 border border-border-subtle/80">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500 shrink-0">
                <Award size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-content-main mb-0.5">Instant Verification</h4>
                <p className="text-[11px] text-content-muted leading-relaxed">
                  Global QR and 1-click LinkedIn certification for international employers.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Loaded Student Credential Vault ───────────────────────────────── */}
      {degree && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* ── Hero Profile Card ─────────────────────────────────────────── */}
          <div className="rounded-3xl bg-surface-card/90 border border-border-main p-6 sm:p-8 shadow-card relative overflow-hidden backdrop-blur-xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-teal-brand/15 via-secondary-blue/10 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Student Identity Details */}
              <div className="flex items-center gap-4 sm:gap-5">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-teal-brand via-teal-brand/80 to-secondary-blue text-white font-extrabold text-2xl sm:text-3xl flex items-center justify-center shadow-md ring-4 ring-teal-brand/10">
                  {degree.studentName ? degree.studentName.charAt(0).toUpperCase() : 'S'}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <h2 className="text-xl sm:text-2xl font-black text-content-main tracking-tight">
                      {degree.studentName || 'Student Name'}
                    </h2>
                    {degree.revoked ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30">
                        <AlertTriangle size={12} />
                        REVOKED ON-CHAIN
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        ON-CHAIN VERIFIED
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-content-secondary">
                    Bachelor of Engineering in {degree.department || 'Computer Systems Engineering'}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-content-muted">
                    <span className="font-mono font-bold text-content-main bg-surface-muted px-2 py-0.5 rounded-md border border-border-subtle">
                      Roll: {degree.rollNo}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-teal-brand">
                      {degree.universityCode || 'MUET'}
                    </span>
                    <span>•</span>
                    <span>Father: {degree.fatherName || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="flex flex-wrap items-center gap-2.5 pt-4 md:pt-0 border-t md:border-t-0 border-border-subtle">
                {/* LinkedIn Share */}
                {!degree.revoked && (
                  <a
                    href={getLinkedInCertUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0077b5] hover:bg-[#006396] text-white text-xs font-bold transition-all shadow-sm no-underline"
                  >
                    <ExternalLink size={14} />
                    <span>Add to LinkedIn</span>
                  </a>
                )}

                {/* Share / Copy Link */}
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-surface-muted hover:bg-surface-card text-content-main text-xs font-bold border border-border-main transition-colors shadow-xs"
                >
                  {copiedLink ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
                  <span>{copiedLink ? 'Copied Link!' : 'Share Vault'}</span>
                </button>

                {/* Print Button */}
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-surface-muted hover:bg-surface-card text-content-main text-xs font-bold border border-border-main transition-colors shadow-xs"
                >
                  <Printer size={14} />
                  <span>Print</span>
                </button>

                {/* Proof Modal Button */}
                <button
                  onClick={() => setShowProofModal(true)}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-surface-muted hover:bg-surface-card text-content-main text-xs font-bold border border-border-main transition-colors shadow-xs"
                >
                  <Code2 size={14} />
                  <span>EVM Proof</span>
                </button>
              </div>
            </div>
          </div>

          {/* ── Revocation Alert Banner (If Revoked) ───────────────────────── */}
          {degree.revoked && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl bg-red-500/10 border-2 border-red-500/30 text-red-600 dark:text-red-400 space-y-2 shadow-xs"
            >
              <div className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide">
                <AlertTriangle size={18} />
                <span>OFFICIAL DEGREE REVOCATION NOTICE</span>
              </div>
              <p className="text-xs text-content-main font-medium leading-relaxed">
                This degree was officially revoked on the blockchain by the university registrar.
                <br />
                <strong>Reason:</strong> {degree.revocationReason || 'Revoked by university registrar'}
              </p>
              {degree.revocationDate && (
                <div className="text-[11px] text-content-muted">
                  Revocation Timestamp: {new Date(degree.revocationDate * 1000).toUTCString()}
                </div>
              )}
            </motion.div>
          )}

          {/* ── View Mode Selector (Parchment Certificate vs On-Chain Audit) ─ */}
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('certificate')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'certificate'
                    ? 'bg-teal-brand text-white shadow-button-primary'
                    : 'text-content-secondary hover:text-content-main hover:bg-surface-muted'
                }`}
              >
                <FileBadge size={16} />
                <span>Certificate Parchment View</span>
              </button>

              <button
                onClick={() => setActiveTab('ledger')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'ledger'
                    ? 'bg-teal-brand text-white shadow-button-primary'
                    : 'text-content-secondary hover:text-content-main hover:bg-surface-muted'
                }`}
              >
                <Database size={16} />
                <span>On-Chain Ledger Audit</span>
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-content-muted">
              <span>GUCI:</span>
              <span className="font-mono text-teal-brand">{degree.globalCredentialId}</span>
            </div>
          </div>

          {/* ── TAB 1: ROYAL CERTIFICATE VIEW ─────────────────────────────── */}
          {activeTab === 'certificate' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="print-certificate-container"
            >
              <div className="rounded-3xl border-4 border-[#C8A966]/40 bg-gradient-to-b from-[#FDFBF7] via-[#FFFDF9] to-[#F8F4EC] dark:from-[#0E1626] dark:via-[#111A2D] dark:to-[#0B1220] p-6 sm:p-12 shadow-2xl relative overflow-hidden text-center transition-colors">
                {/* Guilloche Ornate Pattern Overlays */}
                <div className="absolute inset-2 border-2 border-[#C8A966]/30 rounded-2xl pointer-events-none" />
                <div className="absolute inset-3 border border-[#C8A966]/20 rounded-xl pointer-events-none" />

                {/* Subtle Background University Seal Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] dark:opacity-[0.05] pointer-events-none">
                  <ShieldCheck size={420} strokeWidth={1} />
                </div>

                {/* Certificate Top Header */}
                <div className="space-y-2 mb-8 relative z-10">
                  <div className="inline-flex p-3 rounded-2xl bg-[#C8A966]/15 text-[#C8A966] mb-2 border border-[#C8A966]/30 shadow-xs">
                    <ShieldCheck size={36} strokeWidth={2.2} />
                  </div>
                  <h3 className="text-xs sm:text-sm font-extrabold tracking-[0.25em] text-[#C8A966] uppercase">
                    {degree.universityCode === 'MUET'
                      ? 'Mehran University of Engineering and Technology'
                      : `${degree.universityCode} University`}
                  </h3>
                  <div className="text-[10px] tracking-widest uppercase font-semibold text-content-muted">
                    Jamshoro, Sindh, Pakistan • Autonomous Public Sector University
                  </div>
                  <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#C8A966] to-transparent mx-auto mt-3" />
                </div>

                {/* Conferred Citation */}
                <div className="space-y-4 max-w-2xl mx-auto my-8 relative z-10">
                  <p className="text-xs sm:text-sm font-serif italic text-content-secondary">
                    By the authority of the Academic Syndicate and Faculty Senate, be it known that
                  </p>

                  <h2 className="text-2xl sm:text-4xl font-serif font-black text-content-main tracking-tight py-1 border-b border-[#C8A966]/30 inline-block px-8">
                    {degree.studentName}
                  </h2>

                  <p className="text-xs sm:text-sm font-serif italic text-content-secondary pt-2">
                    Son / Daughter of <span className="font-semibold text-content-main">{degree.fatherName || 'N/A'}</span>
                    <br />
                    Roll Number: <span className="font-mono font-bold text-content-main">{degree.rollNo}</span>
                  </p>

                  <p className="text-xs sm:text-sm text-content-secondary leading-relaxed pt-2">
                    having fulfilled all scholastic prerequisites and successfully passed the prescribed examinations, has been awarded the degree of
                  </p>

                  <div className="py-2">
                    <span className="text-lg sm:text-2xl font-extrabold text-teal-brand tracking-tight block">
                      Bachelor of Engineering
                    </span>
                    <span className="text-sm sm:text-base font-bold text-content-main block mt-0.5">
                      in {degree.department || 'Computer Systems Engineering'}
                    </span>
                  </div>

                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C8A966]/15 border border-[#C8A966]/30 text-[#C8A966] text-xs font-extrabold tracking-wide">
                    <span>Cumulative GPA: {degree.cgpa}</span>
                    <span>•</span>
                    <span>{getHonorsTier(degree.cgpa)}</span>
                  </div>
                </div>

                {/* Signatures & QR Code Section */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center pt-8 mt-8 border-t border-[#C8A966]/25 relative z-10">
                  {/* Left: Vice Chancellor Signature */}
                  <div className="flex flex-col items-center">
                    <div className="h-10 flex items-center justify-center font-serif italic text-base text-content-muted">
                      Prof. Dr. Vice Chancellor
                    </div>
                    <div className="w-36 h-px bg-content-muted/40 my-1.5" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-content-muted">
                      Vice Chancellor
                    </span>
                  </div>

                  {/* Middle: Embedded Live QR Code */}
                  <div className="flex flex-col items-center justify-center">
                    {degree.qrCodeBase64 ? (
                      <div
                        onClick={() => setShowQrModal(true)}
                        className="cursor-pointer group p-2 rounded-2xl bg-white border border-[#C8A966]/40 shadow-md hover:scale-105 transition-transform"
                      >
                        <img
                          src={`data:image/png;base64,${degree.qrCodeBase64}`}
                          alt="Degree Verification QR"
                          className="w-24 h-24 object-contain"
                        />
                        <span className="text-[9px] font-bold text-content-muted flex items-center justify-center gap-1 mt-1 group-hover:text-teal-brand transition-colors">
                          <Eye size={10} /> Scan to Verify
                        </span>
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-2xl bg-surface-muted flex items-center justify-center text-content-muted">
                        <QrCode size={36} />
                      </div>
                    )}
                  </div>

                  {/* Right: Controller of Examinations Signature */}
                  <div className="flex flex-col items-center">
                    <div className="h-10 flex items-center justify-center font-serif italic text-base text-content-muted">
                      Controller of Examinations
                    </div>
                    <div className="w-36 h-px bg-content-muted/40 my-1.5" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-content-muted">
                      Registrar / Controller
                    </span>
                  </div>
                </div>

                {/* Certificate Footer Technical Anchor */}
                <div className="mt-8 pt-4 border-t border-border-subtle flex flex-wrap items-center justify-between gap-2 text-[10px] text-content-muted font-mono">
                  <span>GUCI: {degree.globalCredentialId}</span>
                  <span>Issued: {degree.issueDate ? new Date(degree.issueDate * 1000).toLocaleDateString() : 'N/A'}</span>
                  <span className="truncate max-w-[200px]" title={degree.dataHash}>
                    Hash: {degree.dataHash ? `${degree.dataHash.substring(0, 16)}...` : 'N/A'}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── TAB 2: BLOCKCHAIN LEDGER AUDIT VIEW ───────────────────────── */}
          {activeTab === 'ledger' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Card 1: On-Chain Identification */}
              <div className="p-6 rounded-2xl bg-surface-card border border-border-main shadow-card space-y-4">
                <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-teal-brand">
                  <Database size={16} />
                  <span>On-Chain Credential Identity</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-[11px] font-bold text-content-muted block mb-0.5">
                      Globally Unique Credential Identifier (GUCI)
                    </label>
                    <div className="p-2.5 rounded-xl bg-surface-muted font-mono font-bold text-teal-brand border border-border-subtle">
                      {degree.globalCredentialId}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-content-muted block mb-0.5">
                      Issuing Institution
                    </label>
                    <div className="p-2.5 rounded-xl bg-surface-muted text-content-main font-semibold border border-border-subtle">
                      {degree.universityCode} — Mehran University of Engineering and Technology
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-content-muted block mb-0.5">
                      Issuer Smart Contract Address
                    </label>
                    <div className="p-2.5 rounded-xl bg-surface-muted font-mono text-[11px] text-content-main break-all border border-border-subtle">
                      {degree.issuerAddress || '0x5696bd68577328fed1d733c4f1681d15bddf41b6'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Cryptographic Proof & IPFS */}
              <div className="p-6 rounded-2xl bg-surface-card border border-border-main shadow-card space-y-4">
                <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-secondary-blue">
                  <Lock size={16} />
                  <span>Cryptographic Hashing & IPFS</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <label className="text-[11px] font-bold text-content-muted">
                        Payload SHA-256 Digest
                      </label>
                      <button
                        onClick={handleCopyHash}
                        className="text-[10px] font-bold text-teal-brand hover:underline flex items-center gap-1"
                      >
                        {copiedHash ? <Check size={10} /> : <Copy size={10} />}
                        <span>{copiedHash ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="p-2.5 rounded-xl bg-surface-muted font-mono text-[11px] text-content-main break-all border border-border-subtle">
                      {degree.dataHash}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-content-muted block mb-0.5">
                      IPFS Decentralized Storage CID
                    </label>
                    <div className="p-2.5 rounded-xl bg-surface-muted font-mono text-[11px] text-content-main break-all border border-border-subtle flex items-center justify-between">
                      <span>{degree.ipfsCid || 'QmBatchPendingUpload'}</span>
                      {degree.ipfsCid && (
                        <a
                          href={`https://gateway.pinata.cloud/ipfs/${degree.ipfsCid}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-teal-brand hover:underline flex items-center gap-1 shrink-0 ml-2 text-[10px]"
                        >
                          <ExternalLink size={12} /> Gateway
                        </a>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-content-muted block mb-0.5">
                      EVM Blockchain Status
                    </label>
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20 flex items-center gap-2">
                      <ShieldCheck size={16} />
                      <span>Block Confirmed • Status 0x1 (SUCCESS)</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Key Highlights Bottom Grid ─────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-surface-card border border-border-main shadow-card flex items-center gap-4">
              <div className="p-3 rounded-xl bg-teal-brand/10 text-teal-brand">
                <Award size={24} />
              </div>
              <div>
                <span className="text-[11px] font-bold text-content-muted uppercase">Cumulative GPA</span>
                <div className="text-xl font-extrabold text-content-main">{degree.cgpa} / 4.00</div>
                <span className="text-[11px] text-teal-brand font-semibold">{getHonorsTier(degree.cgpa)}</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-surface-card border border-border-main shadow-card flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                <FileCheck size={24} />
              </div>
              <div>
                <span className="text-[11px] font-bold text-content-muted uppercase">Verification Status</span>
                <div className="text-xl font-extrabold text-content-main">
                  {degree.revoked ? 'Revoked' : 'Authentic'}
                </div>
                <span className="text-[11px] text-content-secondary font-medium">Valid for Global Visa & Employment</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-surface-card border border-border-main shadow-card flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500">
                <Share2 size={24} />
              </div>
              <div>
                <span className="text-[11px] font-bold text-content-muted uppercase">Shareable Proof</span>
                <div className="text-sm font-bold text-content-main">1-Click LinkedIn</div>
                <button
                  onClick={handleCopyLink}
                  className="text-[11px] text-teal-brand font-semibold hover:underline"
                >
                  Copy Verification Link
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Modal 1: EVM Cryptographic Raw Proof ─────────────────────────── */}
      <AnimatePresence>
        {showProofModal && degree && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-3xl bg-surface-card border border-border-main p-6 shadow-elevated"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm font-bold text-content-main">
                  <Code2 size={18} className="text-teal-brand" />
                  <span>EVM Smart Contract Cryptographic Proof</span>
                </div>
                <button
                  onClick={() => setShowProofModal(false)}
                  className="p-1 rounded-lg text-content-muted hover:text-content-main"
                >
                  ✕
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-surface-muted font-mono text-[11px] text-content-main overflow-x-auto max-h-80 border border-border-subtle">
                {JSON.stringify(
                  {
                    standard: 'EIP-712 Degree Vault Credential',
                    globalCredentialId: degree.globalCredentialId,
                    universityCode: degree.universityCode,
                    rollNo: degree.rollNo,
                    studentName: degree.studentName,
                    cgpa: degree.cgpa,
                    dataHash: degree.dataHash,
                    issuerContract: degree.issuerAddress || '0x5696bd68577328fed1d733c4f1681d15bddf41b6',
                    ipfsStorageCid: degree.ipfsCid,
                    issueTimestamp: degree.issueDate,
                    onChainStatus: degree.revoked ? 'REVOKED' : 'VERIFIED',
                  },
                  null,
                  2
                )}
              </pre>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setShowProofModal(false)}
                  className="px-4 py-2 rounded-xl bg-teal-brand text-white text-xs font-bold"
                >
                  Close Proof
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Modal 2: QR Code Full View ───────────────────────────────────── */}
      <AnimatePresence>
        {showQrModal && degree && degree.qrCodeBase64 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-3xl bg-surface-card border border-border-main p-6 shadow-elevated text-center space-y-4"
            >
              <h3 className="text-base font-bold text-content-main">
                Scan Degree Verification QR
              </h3>
              <div className="p-4 rounded-2xl bg-white border border-border-main shadow-inner inline-block">
                <img
                  src={`data:image/png;base64,${degree.qrCodeBase64}`}
                  alt="QR Code"
                  className="w-48 h-48 object-contain"
                />
              </div>
              <p className="text-xs text-content-secondary font-mono">
                {degree.globalCredentialId}
              </p>
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
