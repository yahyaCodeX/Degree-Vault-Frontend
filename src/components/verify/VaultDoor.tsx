import { useState } from 'react';
import { Building2, Hash, Search, ShieldCheck, Info } from 'lucide-react';
import { Button } from '../ui';

interface VaultDoorProps {
  onSubmit: (globalCredentialId: string) => void;
  loading: boolean;
}

/**
 * Verification entry form.
 *
 * Accepts a University Code + Roll Number to derive the GUCI
 * (Globally Unique Credential Identifier) and triggers verification.
 * No file upload is needed — the backend recomputes the data hash
 * deterministically from on-chain fields.
 */
export default function VaultDoor({ onSubmit, loading }: VaultDoorProps) {
  const [universityCode, setUniversityCode] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [guciManual, setGuciManual] = useState('');
  const [mode, setMode] = useState<'split' | 'direct'>('split');
  const [touched, setTouched] = useState(false);

  // Derived GUCI from the two fields (split mode)
  const derivedGuci =
    universityCode.trim() && rollNo.trim()
      ? `${universityCode.trim().toUpperCase()}-${rollNo.trim().toUpperCase()}`
      : '';

  const activeGuci = mode === 'split' ? derivedGuci : guciManual.trim().toUpperCase();
  const canSubmit = activeGuci.length > 0 && !loading;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (canSubmit) {
      onSubmit(activeGuci);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* ── Soft ambient glow ── */}
      <div
        className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-teal-brand/15 via-secondary-blue/10 to-teal-brand/15 blur-2xl -z-10 opacity-70 transition-opacity duration-300"
        aria-hidden="true"
      />

      <div
        className="bg-surface-card border border-border-main rounded-2xl p-7 sm:p-9 transition-colors duration-300 relative z-10"
        style={{ boxShadow: 'var(--shadow-elevated), var(--inset-card-highlight)' }}
      >
        <form onSubmit={handleSubmit} noValidate className="space-y-6">

          {/* ── Mode toggle ── */}
          <div className="flex p-1 rounded-xl bg-surface-muted/80 backdrop-blur-sm border border-border-main w-fit shadow-xs">
            <button
              type="button"
              onClick={() => setMode('split')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer
                ${mode === 'split'
                  ? 'bg-surface-card text-teal-brand shadow-xs border border-border-subtle'
                  : 'text-content-secondary hover:text-content-main border border-transparent'}`}
            >
              <Building2 size={13} />
              <span>University + Roll No</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('direct')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer
                ${mode === 'direct'
                  ? 'bg-surface-card text-teal-brand shadow-xs border border-border-subtle'
                  : 'text-content-secondary hover:text-content-main border border-transparent'}`}
            >
              <Hash size={13} />
              <span>Paste GUCI directly</span>
            </button>
          </div>

          {/* ── SPLIT MODE: University Code + Roll Number ── */}
          {mode === 'split' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* University Code */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="verify-uni-code"
                    className="text-xs font-bold uppercase tracking-wider text-content-main"
                  >
                    University Code <span className="text-teal-brand">*</span>
                  </label>
                </div>
                <div className="relative group">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-content-muted group-focus-within:text-teal-brand transition-colors duration-200 pointer-events-none">
                    <Building2 size={16} />
                  </div>
                  <input
                    id="verify-uni-code"
                    type="text"
                    value={universityCode}
                    onChange={(e) => setUniversityCode(e.target.value)}
                    placeholder="e.g. MUET"
                    disabled={loading}
                    aria-required="true"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-mono tracking-widest uppercase
                      bg-surface-page/70 border border-border-main text-content-main placeholder:text-content-muted/70 placeholder:normal-case placeholder:tracking-normal
                      focus-visible:ring-2 focus-visible:ring-teal-brand focus-visible:border-teal-brand focus-visible:bg-surface-card
                      disabled:opacity-50 transition-all duration-200 outline-none shadow-xs"
                  />
                </div>
                <p className="text-[11px] text-content-muted mt-1.5">
                  Short code of the issuing university (e.g. MUET, UET, NUST, FAST)
                </p>
              </div>

              {/* Roll Number */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="verify-roll-no"
                    className="text-xs font-bold uppercase tracking-wider text-content-main"
                  >
                    Student Roll Number <span className="text-teal-brand">*</span>
                  </label>
                </div>
                <div className="relative group">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-content-muted group-focus-within:text-teal-brand transition-colors duration-200 pointer-events-none">
                    <Hash size={16} />
                  </div>
                  <input
                    id="verify-roll-no"
                    type="text"
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    placeholder="e.g. 22CS001"
                    disabled={loading}
                    aria-required="true"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-mono tracking-wide uppercase
                      bg-surface-page/70 border border-border-main text-content-main placeholder:text-content-muted/70 placeholder:normal-case placeholder:tracking-normal
                      focus-visible:ring-2 focus-visible:ring-teal-brand focus-visible:border-teal-brand focus-visible:bg-surface-card
                      disabled:opacity-50 transition-all duration-200 outline-none shadow-xs"
                  />
                </div>
                <p className="text-[11px] text-content-muted mt-1.5">
                  The roll number printed on the official transcript or degree
                </p>
              </div>
            </div>
          )}

          {/* ── DIRECT MODE: Paste GUCI ── */}
          {mode === 'direct' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="verify-guci"
                  className="text-xs font-bold uppercase tracking-wider text-content-main"
                >
                  Global Credential ID (GUCI) <span className="text-teal-brand">*</span>
                </label>
              </div>
              <div className="relative group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-content-muted group-focus-within:text-teal-brand transition-colors duration-200 pointer-events-none">
                  <Search size={18} />
                </div>
                <input
                  id="verify-guci"
                  type="text"
                  value={guciManual}
                  onChange={(e) => setGuciManual(e.target.value)}
                  placeholder="e.g. MUET-22CS001"
                  disabled={loading}
                  aria-required="true"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-mono tracking-wide uppercase
                    bg-surface-page/70 border border-border-main text-content-main placeholder:text-content-muted/70 placeholder:normal-case placeholder:tracking-normal
                    focus-visible:ring-2 focus-visible:ring-teal-brand focus-visible:border-teal-brand focus-visible:bg-surface-card
                    disabled:opacity-50 transition-all duration-200 outline-none shadow-xs"
                />
              </div>
              <p id="guci-help" className="text-[11px] text-content-muted mt-1.5">
                Paste the GUCI from the QR code or the degree certificate. Format: UNIVERSITYCODE-ROLLNO
              </p>
            </div>
          )}

          {/* ── Live GUCI preview (split mode only) ── */}
          {mode === 'split' && derivedGuci && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-surface-teal-subtle/40 border border-teal-brand/25">
              <div className="w-5 h-5 rounded-md bg-teal-brand/15 text-teal-brand flex items-center justify-center flex-shrink-0">
                <Info size={12} />
              </div>
              <span className="text-xs text-content-secondary">
                Credential ID:{' '}
                <span className="font-mono font-bold text-teal-brand tracking-wider">{derivedGuci}</span>
              </span>
            </div>
          )}

          {/* ── Submit ── */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={!canSubmit}
              loading={loading}
              icon={<ShieldCheck size={19} strokeWidth={2.3} />}
            >
              Verify Degree on Blockchain
            </Button>

            {!canSubmit && touched && (
              <p className="text-xs text-status-pending text-center mt-2.5 font-medium">
                {mode === 'split'
                  ? 'Please enter both the University Code and Roll Number to proceed.'
                  : 'Please enter a valid Credential ID (GUCI) to proceed.'}
              </p>
            )}
          </div>

          {/* ── No file upload needed note ── */}
          <p className="text-[11px] text-content-muted text-center leading-relaxed">
            No document upload required — verification is performed entirely on-chain using the credential's cryptographic hash.
          </p>
        </form>
      </div>
    </div>
  );
}
