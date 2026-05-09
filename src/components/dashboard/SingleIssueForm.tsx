import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  User, Hash, GraduationCap, FileText, Upload,
  X, CheckCircle2, AlertCircle, ExternalLink, Copy, Check,
} from 'lucide-react';
import { GlassCard, NeonButton, GlowingBadge } from '../ui';
import { issueSingleDegree } from '../../services/api';

interface FormData {
  degreeId: string;
  studentId: string;
  studentName: string;
  fatherName: string;
  department: string;
  cgpa: string;
}

const INITIAL_FORM: FormData = {
  degreeId: '',
  studentId: '',
  studentName: '',
  fatherName: '',
  department: '',
  cgpa: '',
};

interface TransactionResult {
  transactionHash: string;
  status: string;
  message: string;
  issuerAddress: string | null;
}

/**
 * SingleIssueForm — Form for issuing a single degree on-chain.
 * Admin enters student metadata + uploads a PDF file.
 * On success, shows the blockchain transaction hash.
 */
export default function SingleIssueForm() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TransactionResult | null>(null);
  const [copied, setCopied] = useState(false);

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted.length > 0) setFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    multiple: false,
    disabled: loading,
  });

  const updateField = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return (
      form.degreeId.trim() &&
      form.studentId.trim() &&
      form.studentName.trim() &&
      form.fatherName.trim() &&
      form.department.trim() &&
      form.cgpa.trim() &&
      file !== null
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid() || !file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await issueSingleDegree(file, {
        degreeId: form.degreeId.trim(),
        studentId: form.studentId.trim(),
        studentName: form.studentName.trim(),
        fatherName: form.fatherName.trim(),
        department: form.department.trim(),
        cgpa: form.cgpa.trim(),
      });
      setResult(response);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to issue degree. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setFile(null);
    setError(null);
    setResult(null);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Success State ─────────────────────────────
  if (result && result.status === 'SUCCESS') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <GlassCard glowColor="green" className="p-6 sm:p-8" hoverGlow={false}>
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="inline-flex mb-4"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background: 'radial-gradient(circle, rgba(0, 255, 102, 0.12), transparent 70%)',
                  border: '2px solid rgba(0, 255, 102, 0.25)',
                  boxShadow: '0 0 30px rgba(0, 255, 102, 0.15)',
                }}
              >
                <CheckCircle2 size={30} className="text-neon-green" />
              </div>
            </motion.div>

            <h3 className="text-xl font-bold gradient-text-green mb-1">
              Degree Issued Successfully
            </h3>
            <p className="text-sm text-white/40">{result.message}</p>
          </div>

          {/* Transaction Details */}
          <div className="space-y-3 mb-6">
            <div
              className="p-4 rounded-xl"
              style={{
                background: 'rgba(0, 255, 102, 0.03)',
                border: '1px solid rgba(0, 255, 102, 0.08)',
              }}
            >
              <p className="text-[10px] text-white/25 uppercase tracking-widest mb-1.5">
                Transaction Hash
              </p>
              <div className="flex items-center gap-2">
                <p className="font-mono text-xs text-neon-green/70 break-all flex-1">
                  {result.transactionHash}
                </p>
                <button
                  onClick={() => handleCopy(result.transactionHash)}
                  className="flex-shrink-0 p-1.5 rounded-lg text-white/20 hover:text-neon-cyan transition-colors"
                  style={{ background: 'rgba(255, 255, 255, 0.03)' }}
                  title="Copy hash"
                >
                  {copied ? <Check size={14} className="text-neon-green" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl" style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.04)',
              }}>
                <p className="text-[10px] text-white/20 uppercase tracking-widest mb-1">Degree ID</p>
                <p className="text-xs font-mono text-white/60">{form.degreeId}</p>
              </div>
              <div className="p-3 rounded-xl" style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.04)',
              }}>
                <p className="text-[10px] text-white/20 uppercase tracking-widest mb-1">Student</p>
                <p className="text-xs text-white/60">{form.studentName}</p>
              </div>
            </div>

            {result.issuerAddress && (
              <div className="p-3 rounded-xl" style={{
                background: 'rgba(0, 240, 255, 0.02)',
                border: '1px solid rgba(0, 240, 255, 0.06)',
              }}>
                <p className="text-[10px] text-white/20 uppercase tracking-widest mb-1">Issuer Address</p>
                <p className="text-xs font-mono text-neon-cyan/50 break-all">{result.issuerAddress}</p>
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <NeonButton variant="cyan" size="md" onClick={handleReset} icon={<Upload size={14} />}>
              Issue Another Degree
            </NeonButton>
          </div>
        </GlassCard>
      </motion.div>
    );
  }

  // ── Form State ────────────────────────────────
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-5">
        {/* ── Student Information ───────────────── */}
        <div>
          <h3 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3 flex items-center gap-2">
            <User size={12} /> Student Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormInput
              id="single-degree-id"
              icon={<Hash size={14} />}
              label="Degree ID"
              placeholder="DEG-2026-001"
              value={form.degreeId}
              onChange={(v) => updateField('degreeId', v)}
              mono
              disabled={loading}
            />
            <FormInput
              id="single-student-id"
              icon={<Hash size={14} />}
              label="Student ID"
              placeholder="STU-001"
              value={form.studentId}
              onChange={(v) => updateField('studentId', v)}
              mono
              disabled={loading}
            />
            <FormInput
              id="single-student-name"
              icon={<User size={14} />}
              label="Student Name"
              placeholder="John Doe"
              value={form.studentName}
              onChange={(v) => updateField('studentName', v)}
              disabled={loading}
            />
            <FormInput
              id="single-father-name"
              icon={<User size={14} />}
              label="Father's Name"
              placeholder="James Doe"
              value={form.fatherName}
              onChange={(v) => updateField('fatherName', v)}
              disabled={loading}
            />
            <FormInput
              id="single-department"
              icon={<GraduationCap size={14} />}
              label="Department"
              placeholder="Computer Science"
              value={form.department}
              onChange={(v) => updateField('department', v)}
              disabled={loading}
            />
            <FormInput
              id="single-cgpa"
              icon={<GraduationCap size={14} />}
              label="CGPA"
              placeholder="3.85"
              value={form.cgpa}
              onChange={(v) => updateField('cgpa', v)}
              mono
              disabled={loading}
            />
          </div>
        </div>

        {/* ── PDF Upload ───────────────────────── */}
        <div>
          <h3 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3 flex items-center gap-2">
            <FileText size={12} /> Degree Document
          </h3>

          <motion.div
            {...getRootProps()}
            animate={{
              borderColor: isDragActive
                ? 'rgba(0, 240, 255, 0.7)'
                : file
                  ? 'rgba(0, 255, 102, 0.25)'
                  : 'rgba(255, 255, 255, 0.06)',
              boxShadow: isDragActive
                ? '0 0 25px rgba(0, 240, 255, 0.15), inset 0 0 20px rgba(0, 240, 255, 0.03)'
                : 'none',
            }}
            transition={{ duration: 0.3 }}
            className="relative rounded-xl p-5 text-center cursor-pointer overflow-hidden"
            style={{
              background: isDragActive
                ? 'linear-gradient(135deg, rgba(0, 240, 255, 0.04), rgba(15, 23, 42, 0.8))'
                : 'rgba(5, 5, 5, 0.4)',
              border: '1px dashed',
            }}
          >
            <input {...getInputProps()} />

            <AnimatePresence mode="wait">
              {file ? (
                <motion.div
                  key="file"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center gap-3"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: 'rgba(0, 255, 102, 0.06)',
                      border: '1px solid rgba(0, 255, 102, 0.15)',
                    }}
                  >
                    <FileText size={18} className="text-neon-green" />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-sm text-white/70 font-medium truncate">{file.name}</p>
                    <p className="text-[10px] text-white/25">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="flex-shrink-0 p-1.5 text-neon-red/40 hover:text-neon-red transition-colors"
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center gap-3 py-2"
                >
                  <Upload size={18} className="text-white/20" />
                  <div className="text-left">
                    <p className="text-sm text-white/40">
                      <span className="text-white/60 font-medium">Upload degree PDF</span> or drop here
                    </p>
                    <p className="text-[10px] text-white/15">PDF files only</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* ── Error ────────────────────────────── */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl"
              style={{
                background: 'rgba(255, 0, 60, 0.05)',
                border: '1px solid rgba(255, 0, 60, 0.12)',
              }}
            >
              <AlertCircle size={14} className="text-neon-red flex-shrink-0" />
              <p className="text-xs text-neon-red/80">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Submit ───────────────────────────── */}
        <div className="flex justify-center pt-1">
          <NeonButton
            type="submit"
            variant="green"
            size="lg"
            disabled={!isFormValid()}
            loading={loading}
            icon={<Upload size={18} />}
          >
            Issue Degree On-Chain
          </NeonButton>
        </div>
      </div>
    </form>
  );
}

/* ── Reusable Form Input ──────────────────────────── */
function FormInput({
  id,
  icon,
  label,
  placeholder,
  value,
  onChange,
  mono = false,
  disabled = false,
}: {
  id: string;
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  mono?: boolean;
  disabled?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-[10px] text-white/25 uppercase tracking-widest mb-1 block">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/15">
          {icon}
        </div>
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-sm
            text-white placeholder-white/15 outline-none
            transition-all duration-300
            focus:border-neon-cyan/40
            disabled:opacity-40
            ${mono ? 'font-mono tracking-wide' : ''}`}
          style={{
            background: 'rgba(5, 5, 5, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        />
      </div>
    </div>
  );
}
