import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '../ui';
import { VerifyDegreeResponse } from '../../services/api';
import { DiplomaView } from '../diploma/Parchment';
import { findUniversity } from '../../data/universities';

interface TamperedResultProps {
  data?: VerifyDegreeResponse | null;
  message?: string;
  guci: string;
  onReset: () => void;
}

export default function TamperedResult({ data, message, guci, onReset }: TamperedResultProps) {
  const incomplete = data?.status === 'INCOMPLETE';
  const universityName = findUniversity(data?.universityCode)?.name ?? 'the issuing university';

  const reasons = incomplete
    ? [
        'The degree exists on the blockchain, but the university’s own record of it is missing.',
        'Without that record, the full details can’t be recomputed and compared with the on-chain fingerprint.',
      ]
    : [
        'The university’s stored record was changed after the degree was issued, for example a CGPA or name was edited.',
        'The fingerprint on the blockchain can’t be changed, so the edited record no longer matches it.',
      ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* ── Verdict ── */}
      <div className="text-center">
        <motion.p
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-status-error"
        >
          <ShieldAlert size={14} /> Verification failed
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="font-display text-4xl sm:text-6xl font-semibold text-content-main tracking-tight leading-[1.05] mt-3"
        >
          {incomplete ? (
            <>This degree <em className="italic text-status-error">can’t be confirmed.</em></>
          ) : (
            <>This record was <em className="italic text-status-error">tampered with.</em></>
          )}
        </motion.h2>
        <p className="text-sm sm:text-base text-content-secondary mt-4 max-w-lg mx-auto leading-relaxed">
          Credential <span className="font-mono font-semibold text-content-main">{guci}</span> does not match the
          fingerprint the university wrote to the blockchain. Do not accept it until {universityName} confirms it.
        </p>
      </div>

      {/* ── Diploma with VOID ── */}
      {data?.studentName && (
        <motion.figure
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl mx-auto"
        >
          <DiplomaView
            universityCode={data.universityCode}
            studentName={data.studentName}
            department={data.department}
            rollNo={data.rollNo}
            cgpa={data.cgpa}
            stamp="void"
            stampDelay={0.85}
          />
          <figcaption className="text-xs text-content-muted text-center mt-3">
            Name and CGPA shown are the original values recorded on the blockchain at issuance.
          </figcaption>
        </motion.figure>
      )}

      {/* ── What this means ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.9 }}
        className="vault-card p-6 max-w-2xl mx-auto"
      >
        <h3 className="text-sm font-bold text-content-main mb-4">What does this mean?</h3>
        <ul className="space-y-3 text-sm text-content-secondary leading-relaxed">
          {reasons.map((r) => (
            <li key={r} className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-status-error mt-2 shrink-0" />
              <span>{r}</span>
            </li>
          ))}
        </ul>
        {message && (
          <p className="mt-5 p-3 rounded-xl bg-status-error-bg border border-status-error-border text-status-error-text text-xs leading-relaxed">
            {message}
          </p>
        )}
      </motion.div>

      <div className="flex justify-center pt-2">
        <Button variant="outline" size="md" onClick={onReset} icon={<ArrowLeft size={16} />}>
          Verify another degree
        </Button>
      </div>
    </div>
  );
}
