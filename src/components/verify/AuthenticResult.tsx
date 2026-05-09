import { motion } from 'framer-motion';
import { ShieldCheck, User, GraduationCap, Hash, Globe, Calendar, ArrowLeft, ExternalLink } from 'lucide-react';
import { GlassCard, GlowingBadge, NeonButton } from '../ui';
import CryptoRevealText from './CryptoRevealText';

interface VerifyDegreeResponse {
  degreeId: string;
  status: string;
  message: string;
  studentId: string;
  studentName: string;
  fatherName: string;
  department: string;
  cgpa: string;
  documentHash: string;
  ipfsCid: string;
  issuerAddress: string;
  issueDate: number;
  verified: boolean;
  authentic: boolean;
  tampered: boolean;
  integrityMessage: string;
}

interface AuthenticResultProps {
  data: VerifyDegreeResponse;
  onReset: () => void;
}

/**
 * AuthenticResult — Displayed when a degree is verified as authentic.
 * Features a green glow, verified badge stamps, on-chain hash display,
 * and student metadata — all revealed through CryptoRevealText animation.
 */
export default function AuthenticResult({ data, onReset }: AuthenticResultProps) {
  const issueDate = data.issueDate
    ? new Date(data.issueDate * 1000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full max-w-2xl mx-auto"
    >
      {/* ── Success Header ─────────────────────────────── */}
      <motion.div variants={itemVariants} className="text-center mb-8">
        {/* Verified stamp */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="inline-flex mb-5"
        >
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle, rgba(0, 255, 102, 0.15) 0%, rgba(0, 255, 102, 0.02) 70%)',
              border: '2px solid rgba(0, 255, 102, 0.3)',
              boxShadow: '0 0 40px rgba(0, 255, 102, 0.2), 0 0 80px rgba(0, 255, 102, 0.1), inset 0 0 30px rgba(0, 255, 102, 0.05)',
            }}
          >
            <ShieldCheck size={42} className="text-neon-green" />
          </div>
        </motion.div>

        <h2 className="text-3xl font-extrabold mb-2">
          <span className="gradient-text-green">Authenticity Verified</span>
        </h2>
        <p className="text-sm text-white/40">{data.integrityMessage}</p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-4 mx-auto w-48 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(0, 255, 102, 0.4), transparent)' }}
        />
      </motion.div>

      {/* ── Student Info Card ──────────────────────────── */}
      <motion.div variants={itemVariants}>
        <GlassCard glowColor="green" className="p-6 mb-4" hoverGlow={false}>
          <div className="flex items-center gap-2 mb-5">
            <GlowingBadge variant="green" size="sm" pulse>
              <ShieldCheck size={12} /> VERIFIED ON-CHAIN
            </GlowingBadge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            <InfoRow
              icon={<User size={14} />}
              label="Student Name"
              value={data.studentName}
            />
            <InfoRow
              icon={<User size={14} />}
              label="Father's Name"
              value={data.fatherName}
            />
            <InfoRow
              icon={<Hash size={14} />}
              label="Student ID"
              value={data.studentId}
              mono
            />
            <InfoRow
              icon={<Hash size={14} />}
              label="Degree ID"
              value={data.degreeId}
              mono
            />
            <InfoRow
              icon={<GraduationCap size={14} />}
              label="Department"
              value={data.department}
            />
            <InfoRow
              icon={<GraduationCap size={14} />}
              label="CGPA"
              value={data.cgpa}
            />
            <InfoRow
              icon={<Calendar size={14} />}
              label="Issue Date"
              value={issueDate}
            />
            <InfoRow
              icon={<Globe size={14} />}
              label="Issuer"
              value={data.issuerAddress ? `${data.issuerAddress.slice(0, 8)}...${data.issuerAddress.slice(-6)}` : 'N/A'}
              mono
            />
          </div>
        </GlassCard>
      </motion.div>

      {/* ── Cryptographic Proof Card ───────────────────── */}
      <motion.div variants={itemVariants}>
        <GlassCard className="p-6 mb-6" hoverGlow={false}>
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">
            Cryptographic Proof
          </h3>

          <div className="space-y-4">
            <div>
              <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Document Hash (SHA-256)</p>
              <div className="p-3 rounded-lg" style={{
                background: 'rgba(0, 255, 102, 0.03)',
                border: '1px solid rgba(0, 255, 102, 0.1)',
              }}>
                <CryptoRevealText
                  text={data.documentHash || '0x0000...0000'}
                  active={true}
                  duration={2500}
                  className="text-xs text-neon-green/80 break-all leading-relaxed"
                  mono
                />
              </div>
            </div>

            <div>
              <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">IPFS Content Identifier</p>
              <div className="flex items-center gap-2 p-3 rounded-lg" style={{
                background: 'rgba(0, 240, 255, 0.03)',
                border: '1px solid rgba(0, 240, 255, 0.1)',
              }}>
                <CryptoRevealText
                  text={data.ipfsCid || 'QmUnavailable'}
                  active={true}
                  duration={2000}
                  className="text-xs text-neon-cyan/80 break-all flex-1"
                  mono
                />
                {data.ipfsCid && (
                  <a
                    href={`https://ipfs.io/ipfs/${data.ipfsCid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 text-neon-cyan/40 hover:text-neon-cyan transition-colors"
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* ── Back Button ────────────────────────────────── */}
      <motion.div variants={itemVariants} className="flex justify-center">
        <NeonButton variant="ghost" size="md" onClick={onReset} icon={<ArrowLeft size={16} />}>
          Verify Another Degree
        </NeonButton>
      </motion.div>
    </motion.div>
  );
}

/* ── Reusable Info Row ───────────────────────────────── */
function InfoRow({
  icon,
  label,
  value,
  mono = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-white/20 mt-0.5 flex-shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] text-white/30 uppercase tracking-widest">{label}</p>
        <p className={`text-sm text-white/80 mt-0.5 ${mono ? 'font-mono tracking-wide' : 'font-medium'}`}>
          {value || 'N/A'}
        </p>
      </div>
    </div>
  );
}
