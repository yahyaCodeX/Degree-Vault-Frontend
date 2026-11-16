import { useEffect, useMemo, useState } from 'react';
import { ParchmentFrame, Signatures, UniversityHeading } from '../diploma/Parchment';
import { RotateCcw, ShieldCheck, ShieldX, Fingerprint, Link2 } from 'lucide-react';

/**
 * Interactive "try to forge it" demo.
 *
 * Mirrors the backend's CredentialHashUtil (v2): the same canonical line and
 * normalisation rules, hashed with SHA-256 in the browser via Web Crypto.
 * The sample graduate is fictional.
 */

interface DemoRecord {
  universityCode: string;
  rollNo: string;
  studentName: string;
  fatherName: string;
  department: string;
  cgpa: string;
}

const ORIGINAL: DemoRecord = {
  universityCode: 'MUET',
  rollNo: '22CS100',
  studentName: 'Ayesha Rahman',
  fatherName: 'Imran Rahman',
  department: 'Computer Systems Engineering',
  cgpa: '2.85',
};

type EditableField = 'studentName' | 'department' | 'cgpa';

const FIELD_ORDER: (keyof DemoRecord)[] = [
  'universityCode', 'rollNo', 'studentName', 'fatherName', 'department', 'cgpa',
];

const normaliseText = (v: string) => v.trim().replace(/\s+/g, ' ').toUpperCase();

const normaliseCgpa = (v: string) => {
  const t = v.trim();
  return /^-?\d+(\.\d+)?$/.test(t) ? Number(t).toFixed(2) : normaliseText(t);
};

const canonicalParts = (r: DemoRecord) =>
  FIELD_ORDER.map((k) => (k === 'cgpa' ? normaliseCgpa(r[k]) : normaliseText(r[k])));

// The backend appends the diploma file fingerprint; the demo has no file, so it is empty.
const canonicalLine = (r: DemoRecord) => ['DV2', ...canonicalParts(r), ''].join('|');

async function sha256Hex(input: string): Promise<string> {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, '0')).join('');
}

const PRESETS: { label: string; field: EditableField; value: string }[] = [
  { label: 'Raise CGPA to 3.85', field: 'cgpa', value: '3.85' },
  { label: 'Swap the department', field: 'department', value: 'Electrical Engineering' },
  { label: 'Retype CGPA as 2.850', field: 'cgpa', value: '2.850' },
];

export default function ForgeDemo() {
  const [record, setRecord] = useState<DemoRecord>(ORIGINAL);
  const [anchoredHash, setAnchoredHash] = useState('');
  const [liveHash, setLiveHash] = useState('');

  useEffect(() => {
    sha256Hex(canonicalLine(ORIGINAL)).then(setAnchoredHash);
  }, []);

  useEffect(() => {
    let cancelled = false;
    sha256Hex(canonicalLine(record)).then((h) => !cancelled && setLiveHash(h));
    return () => { cancelled = true; };
  }, [record]);

  const ready = anchoredHash !== '' && liveHash !== '';
  const authentic = ready && liveHash === anchoredHash;
  const changedChars = ready ? [...liveHash].filter((c, i) => c !== anchoredHash[i]).length : 0;
  const edited = FIELD_ORDER.some((k) => record[k] !== ORIGINAL[k]);

  const originalParts = useMemo(() => canonicalParts(ORIGINAL), []);
  const liveParts = canonicalParts(record);

  const update = (field: EditableField, value: string) =>
    setRecord((r) => ({ ...r, [field]: value }));

  return (
    <section className="w-full max-w-6xl mx-auto py-16 sm:py-24" aria-labelledby="forge-heading">
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-brand mb-3">
          Don’t take our word for it
        </p>
        <h2
          id="forge-heading"
          className="font-display text-3xl sm:text-5xl font-semibold text-content-main tracking-tight leading-[1.1]"
        >
          Go ahead. <em className="italic text-teal-brand">Try to forge it.</em>
        </h2>
        <p className="text-sm sm:text-base text-content-secondary mt-4 leading-relaxed">
          Click any underlined detail on this diploma and change it. Watch the blockchain catch you
          the moment a single character moves.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-6 lg:gap-8 items-stretch">
        {/* ── The diploma (always ivory, in both themes) ── */}
        <ParchmentFrame stamp={authentic || !ready ? 'seal' : 'void'}>
          <UniversityHeading universityCode={record.universityCode} />
          <p className="font-display italic text-xs sm:text-sm text-slate-600 mt-3">
            This is to certify that
          </p>

          <DiplomaField
            value={record.studentName}
            onChange={(v) => update('studentName', v)}
            changed={record.studentName !== ORIGINAL.studentName}
            ariaLabel="Graduate name"
            className="font-display text-2xl sm:text-4xl font-semibold mt-2"
          />

          <p className="font-display italic text-xs sm:text-sm text-slate-600 mt-3">
            has been conferred the degree of Bachelor of Engineering in
          </p>

          <DiplomaField
            value={record.department}
            onChange={(v) => update('department', v)}
            changed={record.department !== ORIGINAL.department}
            ariaLabel="Department"
            className="font-display text-lg sm:text-xl font-semibold mt-1"
          />

          <div className="mt-5 flex items-end justify-center gap-6 sm:gap-10">
            <div className="text-left">
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Roll No.</p>
              <p className="font-mono text-sm font-semibold text-slate-800">{record.rollNo}</p>
            </div>
            <div className="text-left">
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">CGPA</p>
              <DiplomaField
                value={record.cgpa}
                onChange={(v) => update('cgpa', v)}
                changed={record.cgpa !== ORIGINAL.cgpa}
                ariaLabel="CGPA"
                inputMode="decimal"
                widthClass="w-14"
                className="font-mono text-sm font-semibold !text-left"
              />
            </div>
          </div>
          <Signatures />
        </ParchmentFrame>

        {/* ── What the blockchain sees ── */}
        <div className="vault-card p-5 sm:p-7 flex flex-col gap-5">
          <div className="flex items-center gap-2 text-content-main">
            <Link2 size={16} className="text-teal-brand" />
            <h3 className="text-sm font-bold tracking-tight">What the blockchain checks</h3>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-content-muted mb-1.5">
              1 · Details, in standard form
            </p>
            <p className="font-mono text-[11px] sm:text-xs leading-relaxed break-words rounded-xl bg-surface-muted border border-border-subtle p-3 text-content-secondary">
              <span className="text-content-muted">DV2|</span>
              {liveParts.map((part, i) => (
                <span key={i}>
                  <span
                    className={
                      part !== originalParts[i]
                        ? 'text-status-error font-bold bg-status-error-bg rounded px-0.5'
                        : 'text-content-main'
                    }
                  >
                    {part}
                  </span>
                  <span className="text-content-muted">|</span>
                  <wbr />
                </span>
              ))}
            </p>
          </div>

          <div className="space-y-2.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-content-muted">
              2 · SHA-256 fingerprint
            </p>
            <HashRow label="Recomputed now" hash={liveHash} compareTo={anchoredHash} />
            <HashRow label="Anchored on-chain" hash={anchoredHash} locked />
          </div>

          {/* Verdict */}
          <div
            aria-live="polite"
            className={`mt-auto rounded-xl border p-4 flex items-start gap-3 transition-colors ${
              authentic
                ? 'bg-status-verified-bg border-status-verified-border'
                : 'bg-status-error-bg border-status-error-border'
            }`}
          >
            {authentic ? (
              <ShieldCheck size={22} className="text-status-verified shrink-0 mt-0.5" />
            ) : (
              <ShieldX size={22} className="text-status-error shrink-0 mt-0.5" />
            )}
            <div>
              <p className={`text-sm font-bold ${authentic ? 'text-status-verified-text' : 'text-status-error-text'}`}>
                {!ready ? 'Computing…' : authentic ? 'Authentic. Matches the ledger.' : 'Forgery detected.'}
              </p>
              <p className="text-xs text-content-secondary mt-0.5 leading-relaxed">
                {!ready
                  ? 'Hashing the record in your browser.'
                  : authentic
                    ? edited
                      ? 'You changed the formatting, not the facts, so the fingerprint is identical. No false alarms.'
                      : 'Every detail reproduces the fingerprint the university wrote to the blockchain.'
                    : `${changedChars} of 64 fingerprint characters changed. The ledger can’t be edited to match.`}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => update(p.field, p.value)}
                className="text-xs font-semibold px-3 py-1.5 rounded-full border border-border-main bg-surface-card hover:border-teal-brand/50 hover:text-teal-brand text-content-secondary transition-colors"
              >
                {p.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setRecord(ORIGINAL)}
              disabled={!edited}
              className="text-xs font-semibold px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 text-content-muted hover:text-content-main disabled:opacity-40 disabled:cursor-default transition-colors"
            >
              <RotateCcw size={12} /> Reset
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function DiplomaField({
  value, onChange, changed, ariaLabel, className = '', inputMode, widthClass = 'w-full max-w-md mx-auto',
}: {
  value: string;
  onChange: (v: string) => void;
  changed: boolean;
  ariaLabel: string;
  className?: string;
  inputMode?: 'decimal';
  widthClass?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={ariaLabel}
      inputMode={inputMode}
      spellCheck={false}
      className={`block ${widthClass} text-center bg-transparent outline-none border-b-2 border-dashed transition-colors cursor-text
        ${changed ? 'text-red-700 border-red-400' : 'text-slate-950 border-[#C8A966]/50 hover:border-[#C8A966] focus:border-[#1E3A8A]'}
        ${className}`}
    />
  );
}

function HashRow({ label, hash, compareTo, locked }: {
  label: string;
  hash: string;
  compareTo?: string;
  locked?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface-subtle p-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] font-semibold text-content-secondary inline-flex items-center gap-1.5">
          <Fingerprint size={12} className={locked ? 'text-teal-brand' : 'text-content-muted'} />
          {label}
        </span>
        {locked && <span className="text-[10px] font-bold uppercase tracking-wider text-teal-brand">Immutable</span>}
      </div>
      {/* Shown as two rows of 32 so it never wraps with orphans */}
      <p className="font-mono text-[11px] sm:text-xs leading-relaxed tracking-wide">
        {hash
          ? [hash.slice(0, 32), hash.slice(32)].map((row, r) => (
              <span key={r} className="block">
                {[...row].map((c, j) => {
                  const i = r * 32 + j;
                  const diff = compareTo !== undefined && compareTo[i] !== c;
                  return (
                    <span key={j} className={diff ? 'text-status-error font-bold' : 'text-content-main'}>
                      {c}
                    </span>
                  );
                })}
              </span>
            ))
          : <span className="text-content-muted">…</span>}
      </p>
    </div>
  );
}

