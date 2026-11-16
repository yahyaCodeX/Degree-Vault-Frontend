import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { findUniversity } from '../../data/universities';

/**
 * Shared diploma parchment. Always ivory with dark ink, in both themes.
 */

export type StampKind = 'seal' | 'void' | null;

export function ParchmentFrame({
  children,
  stamp,
  stampDelay = 0,
  className = '',
}: {
  children: ReactNode;
  stamp: StampKind;
  /** Seconds to wait before the stamp lands; used for the reveal on /verify. */
  stampDelay?: number;
  className?: string;
}) {
  return (
    <div
      className={`relative rounded-2xl bg-[#FCFAF2] text-slate-900 border-[6px] border-[#C8A966] shadow-elevated p-6 pb-28 sm:p-10 overflow-hidden flex flex-col justify-center ${className}`}
    >
      <div className="absolute inset-2 sm:inset-3 border border-[#C8A966]/60 rounded-lg pointer-events-none" aria-hidden="true" />
      <div className="relative text-center">{children}</div>

      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-20 h-20 sm:w-24 sm:h-24">
        <AnimatePresence mode="wait">
          {stamp === 'seal' && (
            <motion.div
              key="seal"
              initial={{ scale: 0.6, opacity: 0, rotate: -20 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18, delay: stampDelay }}
            >
              <GoldSeal />
            </motion.div>
          )}
          {stamp === 'void' && (
            <motion.div
              key="void"
              initial={{ scale: 2.4, opacity: 0, rotate: -30 }}
              animate={{ scale: 1, opacity: 1, rotate: -14 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 420, damping: 16, delay: stampDelay }}
              className="w-full h-full flex items-center justify-center"
            >
              <VoidStamp />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function UniversityHeading({ universityCode }: { universityCode: string }) {
  const uni = findUniversity(universityCode);
  return (
    <>
      {uni && <img src={uni.logo} alt="" className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 opacity-90" />}
      <p className="font-display text-[11px] sm:text-xs font-semibold tracking-[0.28em] uppercase text-[#1E3A8A]">
        {uni?.name ?? universityCode}
      </p>
    </>
  );
}

export function Signatures() {
  return (
    <div className="mt-8 sm:mt-10 grid grid-cols-2 gap-6 max-w-sm sm:max-w-md sm:pr-20 text-left">
      {['Registrar', 'Vice Chancellor'].map((role) => (
        <div key={role}>
          <div className="h-px bg-slate-400/70 mb-1.5" />
          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">{role}</p>
        </div>
      ))}
    </div>
  );
}

/** Read-only diploma built from a verified record. */
export function DiplomaView({
  universityCode,
  studentName,
  fatherName,
  department,
  rollNo,
  cgpa,
  issueDate,
  qrCodeBase64,
  stamp,
  stampDelay,
}: {
  universityCode: string;
  studentName: string;
  fatherName?: string;
  department?: string;
  rollNo: string;
  cgpa: string;
  issueDate?: string;
  /** When given, a "scan to verify" code is printed on the diploma. */
  qrCodeBase64?: string | null;
  stamp: StampKind;
  stampDelay?: number;
}) {
  return (
    <ParchmentFrame stamp={stamp} stampDelay={stampDelay}>
      <UniversityHeading universityCode={universityCode} />
      <p className="font-display italic text-xs sm:text-sm text-slate-600 mt-3">This is to certify that</p>
      <p className="font-display text-2xl sm:text-4xl font-semibold mt-2 text-slate-950 break-words">{studentName}</p>
      <div className="w-40 h-px bg-gradient-to-r from-transparent via-[#C8A966] to-transparent mx-auto mt-2" />
      {fatherName && fatherName !== 'N/A' && (
        <p className="font-display italic text-xs sm:text-sm text-slate-600 mt-2">
          child of <span className="not-italic font-semibold text-slate-800">{fatherName}</span>
        </p>
      )}
      {department && department !== 'N/A' && (
        <>
          <p className="font-display italic text-xs sm:text-sm text-slate-600 mt-3">
            has been conferred the degree of Bachelor of Engineering in
          </p>
          <p className="font-display text-lg sm:text-xl font-semibold mt-1 text-slate-950">{department}</p>
        </>
      )}
      <div className="mt-5 flex items-end justify-center gap-6 sm:gap-10 text-left">
        <Field label="Roll No." value={rollNo} />
        <Field label="CGPA" value={cgpa} />
        {issueDate && <Field label="Issued" value={issueDate} />}
      </div>
      {qrCodeBase64 && (
        <div className="mt-6 flex flex-col items-center">
          <img
            src={`data:image/png;base64,${qrCodeBase64}`}
            alt="Scan to verify this degree"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-md bg-white p-1 border border-[#C8A966]/50"
          />
          <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500 mt-1.5">Scan to verify</p>
        </div>
      )}
      <Signatures />
    </ParchmentFrame>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="font-mono text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}

export function VoidStamp() {
  return (
    <span className="font-display font-black text-2xl sm:text-3xl tracking-[0.18em] text-red-700 border-[3px] border-red-700 rounded-md px-2 py-0.5 bg-red-50/70 mix-blend-multiply">
      VOID
    </span>
  );
}

export function GoldSeal() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md" role="img" aria-label="Verified seal">
      <defs>
        <radialGradient id="seal-gold" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#F4DE9C" />
          <stop offset="55%" stopColor="#C8A966" />
          <stop offset="100%" stopColor="#8C6D2C" />
        </radialGradient>
        <path id="seal-ring" d="M50,50 m-34,0 a34,34 0 1,1 68,0 a34,34 0 1,1 -68,0" />
      </defs>
      {Array.from({ length: 24 }, (_, i) => (
        <circle
          key={i}
          cx={50 + 44 * Math.cos((i * Math.PI) / 12)}
          cy={50 + 44 * Math.sin((i * Math.PI) / 12)}
          r="6"
          fill="url(#seal-gold)"
        />
      ))}
      <circle cx="50" cy="50" r="42" fill="url(#seal-gold)" />
      <circle cx="50" cy="50" r="27" fill="none" stroke="#7A5C20" strokeWidth="1" opacity="0.6" />
      <text fontSize="8.5" fontWeight="700" letterSpacing="1.6" fill="#5B4314" fontFamily="Georgia, serif">
        <textPath href="#seal-ring">VERIFIED · ON-CHAIN · VERIFIED · ON-CHAIN ·</textPath>
      </text>
      <path d="M40 51 l7 7 l14 -15" fill="none" stroke="#5B4314" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
