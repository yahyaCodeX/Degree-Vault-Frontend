import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  GraduationCap,
  Search,
  Building2,
  CheckCircle2,
  ArrowRight,
  Lock,
  Sparkles,
  ExternalLink,
  Award,
  FileCheck,
  Check,
  MapPin
} from 'lucide-react';

const UNIVERSITIES = [
  {
    code: 'MUET',
    name: 'Mehran University of Engineering & Technology',
    tagline: 'Autonomous Public Sector Center of Excellence in Engineering & Technology',
    location: 'Jamshoro, Sindh',
    established: '1963',
    logo: '/logos/muet.svg',
    accreditation: 'HEC Tier-1 • PEC Washington Accord',
    accentColor: 'from-amber-500/20 via-amber-500/5 to-transparent',
    borderColor: 'hover:border-amber-500/50',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    code: 'NED',
    name: 'NED University of Engineering & Technology',
    tagline: 'One Century of Engineering Heritage and Academic Leadership in Pakistan',
    location: 'Karachi, Sindh',
    established: '1921',
    logo: '/logos/ned.svg',
    accreditation: 'Centenary Institution • PEC Level-II OBE',
    accentColor: 'from-sky-500/20 via-blue-500/5 to-transparent',
    borderColor: 'hover:border-sky-500/50',
    iconColor: 'text-sky-600 dark:text-sky-400',
  },
  {
    code: 'NUST',
    name: 'National University of Sciences & Technology',
    tagline: 'Premier Research Institution & Global Science Innovation Hub',
    location: 'Islamabad, Capital Territory',
    established: '1991',
    logo: '/logos/nust.svg',
    accreditation: 'QS World Rank #353 • National Tech Park',
    accentColor: 'from-emerald-500/20 via-teal-500/5 to-transparent',
    borderColor: 'hover:border-emerald-500/50',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    code: 'FAST',
    name: 'FAST National University (NUCES)',
    tagline: 'Pioneer of Computer Science & Emerging Technologies in Pakistan',
    location: 'Multi-Campus Consortium',
    established: '2000',
    logo: '/logos/fast.svg',
    accreditation: 'NCEAC Top Ranked Computing University',
    accentColor: 'from-indigo-500/20 via-purple-500/5 to-transparent',
    borderColor: 'hover:border-indigo-500/50',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [selectedUni, setSelectedUni] = useState('MUET');
  const [rollNo, setRollNo] = useState('');

  const handleSelectUniversity = (code: string) => {
    setSelectedUni(code);
    const verifyBox = document.getElementById('verify-box');
    if (verifyBox) {
      verifyBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const rollInput = document.getElementById('roll-input');
      if (rollInput) {
        rollInput.focus();
      }
    }
  };

  const handleQuickVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanRoll = rollNo.trim().toUpperCase();
    if (!cleanRoll) return;

    // Route directly to verify with derived ID: e.g. /verify?id=MUET-22CS100
    const guci = `${selectedUni}-${cleanRoll}`;
    navigate(`/verify?id=${encodeURIComponent(guci)}`);
  };

  return (
    <div className="w-full flex flex-col items-center overflow-hidden">
      {/* ═════════════════════════════════════════════════════════════════════
          1. BREATHTAKING HERO SECTION
          ═════════════════════════════════════════════════════════════════════ */}
      <section className="relative w-full max-w-5xl mx-auto pt-4 sm:pt-10 pb-16 sm:pb-24 text-center">
        {/* Atmospheric Glow Meshes */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] sm:w-[800px] h-[360px] rounded-full bg-gradient-to-tr from-teal-500/20 via-blue-500/15 to-purple-500/10 blur-[100px] -z-10 pointer-events-none"
          aria-hidden="true"
        />

        {/* Floating Trust Pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-card/90 border border-teal-brand/30 shadow-xs mb-6 backdrop-blur-md"
        >
          <span className="w-2 h-2 rounded-full bg-teal-brand animate-pulse" />
          <span className="text-xs font-bold text-teal-brand tracking-wide uppercase">
            Official University Degree Registry
          </span>
          <span className="text-content-muted">•</span>
          <span className="text-xs text-content-secondary font-medium">
            100% Tamper-Proof
          </span>
        </motion.div>

        {/* Main Hero Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-[4.2rem] font-black text-content-main tracking-tight leading-[1.08] max-w-4xl mx-auto"
        >
          Official Academic Degrees.{' '}
          <span className="bg-gradient-to-r from-teal-brand via-teal-brand-light to-secondary-blue bg-clip-text text-transparent">
            Permanently Secured.
          </span>{' '}
          Instantly Verified.
        </motion.h1>

        {/* Human-Friendly Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="text-base sm:text-lg text-content-secondary mt-5 max-w-2xl mx-auto leading-relaxed"
        >
          A trusted digital credential vault where graduates own their official university degrees forever,
          and employers, recruiters, and embassies can verify academic authenticity in seconds.
        </motion.p>

        {/* Primary Hero Actions */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.25 }}
          className="flex flex-wrap items-center justify-center gap-3.5 mt-8"
        >
          <Link
            to="/student"
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-teal-brand hover:bg-teal-brand/90 text-white font-bold text-sm shadow-button-primary hover:shadow-button-primary-hover transition-all duration-200 no-underline"
          >
            <GraduationCap size={18} />
            <span>Open Student Vault</span>
            <ArrowRight size={16} />
          </Link>

          <a
            href="#verify-box"
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-surface-card hover:bg-surface-muted text-content-main font-bold text-sm border border-border-main transition-all duration-200 shadow-xs no-underline"
          >
            <Search size={16} className="text-teal-brand" />
            <span>Verify a Degree</span>
          </a>
        </motion.div>

        {/* ── Interactive Instant-Verification Box ──────────────────────── */}
        <motion.div
          id="verify-box"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative max-w-2xl mx-auto mt-12 p-1 rounded-3xl bg-gradient-to-b from-teal-brand/30 via-border-main to-transparent shadow-elevated"
        >
          <div className="rounded-[22px] bg-surface-card/95 p-6 sm:p-8 backdrop-blur-xl text-left border border-border-main/50 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-teal-brand/10 text-teal-brand">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-content-main leading-tight">
                    Instant Credential Verification
                  </h3>
                  <p className="text-xs text-content-secondary">
                    No document upload needed. Verified live against official university records.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleQuickVerify} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* University Select */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-content-muted mb-1 ml-1">
                    University
                  </label>
                  <select
                    value={selectedUni}
                    onChange={(e) => setSelectedUni(e.target.value)}
                    className="w-full h-12 px-3.5 rounded-xl bg-surface-muted border border-border-main text-content-main font-semibold text-xs focus:ring-2 focus:ring-teal-brand outline-none transition-all shadow-xs"
                  >
                    {UNIVERSITIES.map((u) => (
                      <option key={u.code} value={u.code}>
                        {u.code} — {u.name.split(' ')[0]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Roll Number Input */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-content-muted mb-1 ml-1">
                    Student Roll Number
                  </label>
                  <div className="relative">
                    <input
                      id="roll-input"
                      type="text"
                      value={rollNo}
                      onChange={(e) => setRollNo(e.target.value)}
                      placeholder="e.g. 22CS100 or 20CS05"
                      className="w-full h-12 pl-10 pr-4 rounded-xl bg-surface-muted border border-border-main text-content-main text-sm font-semibold placeholder:text-content-muted/60 focus:ring-2 focus:ring-teal-brand outline-none transition-all shadow-xs"
                      required
                    />
                    <Search size={18} className="absolute left-3.5 top-3.5 text-content-muted" />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-teal-brand hover:bg-teal-brand/90 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-button-primary hover:shadow-button-primary-hover transition-all duration-200"
              >
                <Search size={16} />
                <span>Verify Credential Authenticity</span>
                <ArrowRight size={16} />
              </button>
            </form>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-subtle text-[11px] text-content-muted">
              <span className="flex items-center gap-1">
                <Check size={12} className="text-emerald-500" /> Free Public Verification
              </span>
              <span className="flex items-center gap-1">
                <Check size={12} className="text-emerald-500" /> Official Syndicate Records
              </span>
              <span className="flex items-center gap-1">
                <Check size={12} className="text-emerald-500" /> Recognized by Global Employers
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          2. PRESTIGIOUS PARTICIPATING UNIVERSITIES CONSORTIUM
          ═════════════════════════════════════════════════════════════════════ */}
      <section className="w-full max-w-5xl mx-auto py-16 sm:py-20 border-y border-border-main/60">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-brand/10 border border-teal-brand/20 text-teal-brand text-xs font-bold uppercase tracking-wider mb-3">
            <Building2 size={13} />
            <span>National Academic Consortium</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-content-main tracking-tight">
            Accredited Higher Education Institutions
          </h2>
          <p className="text-xs sm:text-sm text-content-secondary mt-2">
            Pioneering engineering and research universities anchoring official graduate diplomas to the sovereign blockchain registry.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {UNIVERSITIES.map((uni) => (
            <motion.div
              key={uni.code}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              onClick={() => handleSelectUniversity(uni.code)}
              className={`rounded-3xl bg-surface-card border border-border-main p-6 shadow-card hover:shadow-2xl transition-all duration-300 relative overflow-hidden group cursor-pointer flex flex-col justify-between ${uni.borderColor}`}
            >
              {/* Background Atmospheric Brand Hue */}
              <div
                className={`absolute -top-12 -right-12 w-36 h-36 rounded-full bg-gradient-to-br ${uni.accentColor} blur-2xl -z-10 group-hover:scale-125 transition-transform duration-500`}
                aria-hidden="true"
              />

              <div>
                {/* Top Header: Official Heraldic University Logo & Node Status */}
                <div className="flex items-center justify-between mb-4">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full p-1 bg-white dark:bg-slate-900 border-2 border-border-main group-hover:border-teal-brand/60 group-hover:scale-110 transition-all duration-300 shadow-sm flex items-center justify-center overflow-hidden">
                      <img
                        src={uni.logo}
                        alt={`${uni.name} official seal`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-teal-brand/15 blur-sm -z-10 group-hover:opacity-100 opacity-0 transition-opacity" />
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active Node
                    </span>
                    <span className="text-[10px] font-mono text-content-muted">
                      Est. {uni.established}
                    </span>
                  </div>
                </div>

                {/* University Name & Tagline */}
                <h3 className="text-sm font-extrabold text-content-main tracking-tight leading-snug group-hover:text-teal-brand transition-colors">
                  {uni.name}
                </h3>
                <p className="text-[11px] text-content-secondary line-clamp-2 mt-1.5 leading-relaxed">
                  {uni.tagline}
                </p>

                {/* Academic Highlights */}
                <div className="mt-4 pt-3 border-t border-border-subtle/80 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] text-content-muted">
                    <MapPin size={12} className="shrink-0 text-teal-brand" />
                    <span className="truncate">{uni.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-content-secondary">
                    <Award size={12} className="shrink-0 text-amber-500" />
                    <span className="truncate">{uni.accreditation}</span>
                  </div>
                </div>
              </div>

              {/* Action Prompt */}
              <div className="mt-5 pt-3 border-t border-border-subtle flex items-center justify-between text-xs font-bold text-teal-brand group-hover:translate-x-1 transition-transform">
                <span>Verify Credentials</span>
                <ArrowRight size={14} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          3. THREE HUMAN PILLARS (Clean, Prestigious, Zero Jargon)
          ═════════════════════════════════════════════════════════════════════ */}
      <section className="w-full max-w-5xl mx-auto py-16 sm:py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-content-main tracking-tight">
            Designed for Graduates, Recruiters & Universities
          </h2>
          <p className="text-xs sm:text-sm text-content-secondary mt-2">
            Eliminating paper forgery and slow embassy verification with instant, trusted digital degrees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: For Students */}
          <div className="p-7 rounded-3xl bg-surface-card border border-border-main shadow-card flex flex-col justify-between group hover:border-teal-brand/40 transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-brand/10 text-teal-brand flex items-center justify-center mb-5 border border-teal-brand/20 group-hover:scale-105 transition-transform">
                <GraduationCap size={24} />
              </div>
              <h3 className="text-base font-bold text-content-main mb-2">
                For Students & Graduates
              </h3>
              <p className="text-xs text-content-secondary leading-relaxed mb-4">
                Access your official ivory parchment degree anytime using your roll number and private PIN.
              </p>
              <ul className="space-y-2 text-xs text-content-muted">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-teal-brand shrink-0" />
                  <span>Download & print official high-res diploma</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-teal-brand shrink-0" />
                  <span>1-Click add to your LinkedIn profile</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-teal-brand shrink-0" />
                  <span>Private vault protected from peer snooping</span>
                </li>
              </ul>
            </div>

            <Link
              to="/student"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-brand hover:underline mt-6 pt-4 border-t border-border-subtle no-underline"
            >
              <span>Access Student Portal</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* Card 2: For Employers */}
          <div className="p-7 rounded-3xl bg-surface-card border border-border-main shadow-card flex flex-col justify-between group hover:border-blue-500/40 transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-5 border border-blue-500/20 group-hover:scale-105 transition-transform">
                <Search size={24} />
              </div>
              <h3 className="text-base font-bold text-content-main mb-2">
                For Employers & Recruiters
              </h3>
              <p className="text-xs text-content-secondary leading-relaxed mb-4">
                Verify applicant degrees instantly without waiting weeks for university registrar callbacks or embassy attestation.
              </p>
              <ul className="space-y-2 text-xs text-content-muted">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-blue-500 shrink-0" />
                  <span>Instant 3-second online verification</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-blue-500 shrink-0" />
                  <span>Scan mobile camera QR code on paper resumes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-blue-500 shrink-0" />
                  <span>Immediate alerts for cancelled or revoked degrees</span>
                </li>
              </ul>
            </div>

            <a
              href="#verify-box"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-500 hover:underline mt-6 pt-4 border-t border-border-subtle no-underline"
            >
              <span>Verify Candidate Degree</span>
              <ArrowRight size={13} />
            </a>
          </div>

          {/* Card 3: For Universities */}
          <div className="p-7 rounded-3xl bg-surface-card border border-border-main shadow-card flex flex-col justify-between group hover:border-purple-500/40 transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-5 border border-purple-500/20 group-hover:scale-105 transition-transform">
                <Building2 size={24} />
              </div>
              <h3 className="text-base font-bold text-content-main mb-2">
                For University Registrars
              </h3>
              <p className="text-xs text-content-secondary leading-relaxed mb-4">
                Automate credential conferral with single and batch CSV graduation issuance while mathematically preventing degree forgery.
              </p>
              <ul className="space-y-2 text-xs text-content-muted">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-purple-500 shrink-0" />
                  <span>Single or bulk batch CSV graduation issuance</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-purple-500 shrink-0" />
                  <span>Automated conferral emails with student PINs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-purple-500 shrink-0" />
                  <span>Instant degree revocation in cases of misconduct</span>
                </li>
              </ul>
            </div>

            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-500 hover:underline mt-6 pt-4 border-t border-border-subtle no-underline"
            >
              <span>Registrar Admin Login</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          4. STATS & SECURITY HIGHLIGHTS STRIP
          ═════════════════════════════════════════════════════════════════════ */}
      <section className="w-full max-w-5xl mx-auto py-10 px-6 rounded-3xl bg-surface-card border border-border-main shadow-card text-center mb-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-teal-brand tracking-tight">
              100%
            </div>
            <span className="text-xs font-semibold text-content-main mt-0.5 block">
              Tamper-Proof
            </span>
            <span className="text-[11px] text-content-muted">
              Mathematically immutable
            </span>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black text-blue-500 tracking-tight">
              &lt; 3s
            </div>
            <span className="text-xs font-semibold text-content-main mt-0.5 block">
              Global Verification
            </span>
            <span className="text-[11px] text-content-muted">
              Available 24/7 worldwide
            </span>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black text-purple-500 tracking-tight">
              Zero
            </div>
            <span className="text-xs font-semibold text-content-main mt-0.5 block">
              Middleman Paperwork
            </span>
            <span className="text-[11px] text-content-muted">
              No manual postal delays
            </span>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-500 tracking-tight">
              Lifelong
            </div>
            <span className="text-xs font-semibold text-content-main mt-0.5 block">
              Graduate Ownership
            </span>
            <span className="text-[11px] text-content-muted">
              Permanent digital credential
            </span>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          5. BOTTOM CALL TO ACTION
          ═════════════════════════════════════════════════════════════════════ */}
      <section className="w-full max-w-5xl mx-auto text-center py-12 px-6 rounded-3xl bg-gradient-to-b from-teal-brand/10 via-surface-card to-surface-card border border-teal-brand/25 shadow-card relative overflow-hidden mb-12">
        <div className="max-w-xl mx-auto space-y-4">
          <div className="inline-flex p-3 rounded-2xl bg-teal-brand/15 text-teal-brand mb-1 shadow-xs">
            <Award size={32} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-content-main tracking-tight">
            Are You a University Graduate?
          </h2>
          <p className="text-xs sm:text-sm text-content-secondary leading-relaxed">
            Sign in to your private Student Credential Vault to access your light ivory parchment diploma,
            share your verification link, or download your official digital certificate.
          </p>
          <div className="pt-2">
            <Link
              to="/student"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-teal-brand hover:bg-teal-brand/90 text-white font-bold text-sm shadow-button-primary hover:shadow-button-primary-hover transition-all duration-200 no-underline"
            >
              <span>Access My Student Vault</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
