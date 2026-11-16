import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Search, ArrowRight, GraduationCap } from 'lucide-react';
import ForgeDemo from '../components/home/ForgeDemo';
import HowItWorksFlow from '../components/home/HowItWorksFlow';
import { UNIVERSITIES } from '../data/universities';


const EXAMPLE_ROLL = '22CS001';

export default function HomePage() {
  const navigate = useNavigate();
  const [selectedUni, setSelectedUni] = useState('MUET');
  const [rollNo, setRollNo] = useState('');

  const focusVerifyBox = (code: string) => {
    setSelectedUni(code);
    document.getElementById('verify-box')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    document.getElementById('roll-input')?.focus({ preventScroll: true });
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanRoll = rollNo.trim().toUpperCase();
    if (!cleanRoll) return;
    navigate(`/verify?id=${encodeURIComponent(`${selectedUni}-${cleanRoll}`)}`);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* ═══════════════ 1. HERO ═══════════════ */}
      <section className="relative w-full max-w-4xl mx-auto pt-6 sm:pt-14 pb-8 text-center">
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] sm:w-[820px] h-[380px] rounded-full bg-gradient-to-tr from-teal-500/20 via-blue-500/10 to-transparent blur-[100px] -z-10 pointer-events-none"
          aria-hidden="true"
        />

        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-xs font-bold uppercase tracking-[0.22em] text-teal-brand"
        >
          Blockchain-secured degree registry
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="font-display text-5xl sm:text-7xl lg:text-[5.5rem] font-semibold text-content-main tracking-tight leading-[1.02] mt-5"
        >
          Degrees that
          <br />
          <em className="italic bg-gradient-to-r from-teal-brand via-teal-brand-light to-secondary-blue bg-clip-text text-transparent pr-2">
            can’t be faked.
          </em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="text-base sm:text-lg text-content-secondary mt-6 max-w-xl mx-auto leading-relaxed"
        >
          Universities record every degree on a blockchain. Anyone can check one in seconds, and any
          edit, even a single digit, is caught.
        </motion.p>

        {/* Verify box: the primary action */}
        <motion.form
          id="verify-box"
          onSubmit={handleVerify}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24 }}
          className="mt-10 max-w-2xl mx-auto vault-card-elevated p-2 sm:p-2.5 flex flex-col sm:flex-row gap-2 text-left"
        >
          <label className="sr-only" htmlFor="uni-select">University</label>
          <select
            id="uni-select"
            value={selectedUni}
            onChange={(e) => setSelectedUni(e.target.value)}
            className="h-12 sm:w-32 px-3.5 rounded-xl bg-surface-muted border border-border-subtle text-content-main font-bold text-sm outline-none focus:ring-2 focus:ring-teal-brand"
          >
            {UNIVERSITIES.map((u) => (
              <option key={u.code} value={u.code}>{u.code}</option>
            ))}
          </select>

          <div className="relative flex-1">
            <label className="sr-only" htmlFor="roll-input">Student roll number</label>
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-content-muted pointer-events-none" />
            <input
              id="roll-input"
              type="text"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              placeholder="Student roll number"
              autoComplete="off"
              className="w-full h-12 pl-10 pr-4 rounded-xl bg-surface-muted border border-border-subtle text-content-main text-sm font-semibold placeholder:text-content-muted placeholder:font-medium outline-none focus:ring-2 focus:ring-teal-brand"
              required
            />
          </div>

          <button
            type="submit"
            className="h-12 px-6 rounded-xl bg-teal-brand hover:bg-teal-brand-hover text-content-inverse font-bold text-sm inline-flex items-center justify-center gap-2 shadow-button-primary hover:shadow-button-primary-hover transition-all"
          >
            Verify
            <ArrowRight size={16} />
          </button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.34 }}
          className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-2 text-xs text-content-muted"
        >
          <span>
            No roll number handy?{' '}
            <button
              type="button"
              onClick={() => { setSelectedUni('MUET'); setRollNo(EXAMPLE_ROLL); }}
              className="font-semibold text-teal-brand hover:underline"
            >
              Try {EXAMPLE_ROLL}
            </button>
          </span>
          <span className="hidden sm:inline text-border-hover" aria-hidden="true">•</span>
          <span>Free · No sign-up · Checked live against the ledger</span>
        </motion.div>
      </section>

      {/* ═══════════════ 2. FORGE DEMO ═══════════════ */}
      <ForgeDemo />

      {/* ═══════════════ 3. HOW IT WORKS ═══════════════ */}
      <section className="w-full max-w-5xl mx-auto pt-4 sm:pt-8 pb-16 sm:pb-24" aria-labelledby="how-heading">
        <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-brand mb-3">How it works</p>
          <h2 id="how-heading" className="font-display text-3xl sm:text-5xl font-semibold text-content-main tracking-tight leading-[1.1]">
            Three steps.
            <br />
            <em className="italic text-teal-brand">Zero trust needed.</em>
          </h2>
        </div>

        <HowItWorksFlow />
      </section>

      {/* ═══════════════ 4. UNIVERSITIES ═══════════════ */}
      <section className="w-full max-w-5xl mx-auto py-14 sm:py-16 border-t border-border-main/70" aria-labelledby="uni-heading">
        <h2 id="uni-heading" className="text-center text-xs font-bold uppercase tracking-[0.2em] text-content-muted mb-8">
          Participating universities
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {UNIVERSITIES.map((uni) => (
            <button
              key={uni.code}
              type="button"
              onClick={() => focusVerifyBox(uni.code)}
              className="group flex flex-col items-center text-center gap-3 p-5 rounded-2xl border border-transparent hover:border-border-main hover:bg-surface-card hover:shadow-card transition-all"
            >
              <div className="w-16 h-16 rounded-full p-1 bg-white border border-border-main shadow-sm grayscale-[35%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300">
                <img src={uni.logo} alt="" className="w-full h-full object-contain" />
              </div>
              <div>
                <p className="text-sm font-bold text-content-main">{uni.code}</p>
                <p className="text-[11px] text-content-muted mt-0.5 leading-snug line-clamp-2">{uni.name}</p>
                <p className="text-[11px] text-content-muted">{uni.city}</p>
              </div>
              <span className="text-xs font-semibold text-teal-brand opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity inline-flex items-center gap-1">
                Verify a graduate <ArrowRight size={12} />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ═══════════════ 5. GRADUATE CTA ═══════════════ */}
      <section className="w-full max-w-5xl mx-auto mb-12 rounded-3xl border border-teal-brand/25 bg-gradient-to-br from-teal-brand/10 via-surface-card to-surface-card shadow-card px-6 py-10 sm:px-12 sm:py-12 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-content-main tracking-tight">
            Graduated from a participating university?
          </h2>
          <p className="text-sm text-content-secondary mt-2 max-w-lg">
            Your official diploma is waiting in your vault. Print it, share its verification link,
            or add it to LinkedIn.
          </p>
        </div>
        <Link
          to="/student"
          className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-teal-brand hover:bg-teal-brand-hover text-content-inverse font-bold text-sm shadow-button-primary hover:shadow-button-primary-hover transition-all no-underline"
        >
          <GraduationCap size={18} />
          Open my degree vault
        </Link>
      </section>
    </div>
  );
}
