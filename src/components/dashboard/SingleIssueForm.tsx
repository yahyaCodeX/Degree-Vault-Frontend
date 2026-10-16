import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  FileText,
  UploadCloud,
  X,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ArrowLeft,
  Send,
  Building2,
  Hash,
  Info,
  QrCode,
  ExternalLink,
  Link,
} from 'lucide-react';
import { Button, Badge } from '../ui';
import { issueSingleDegree, IssueTransactionResponse } from '../../services/api';

interface FormData {
  universityCode: string;
  rollNo: string;
  studentName: string;
  fatherName: string;
  department: string;
  cgpa: string;
}

const INITIAL_FORM: FormData = {
  universityCode: '',
  rollNo: '',
  studentName: '',
  fatherName: '',
  department: '',
  cgpa: '',
};

export default function SingleIssueForm() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<IssueTransactionResponse | null>(null);
  const [copiedTx, setCopiedTx] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

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

  // Live GUCI preview
  const derivedGuci =
    form.universityCode.trim() && form.rollNo.trim()
      ? `${form.universityCode.trim().toUpperCase()}-${form.rollNo.trim().toUpperCase()}`
      : '';

  const isFormValid = () =>
    form.universityCode.trim() &&
    form.rollNo.trim() &&
    form.studentName.trim() &&
    form.fatherName.trim() &&
    form.department.trim() &&
    form.cgpa.trim() &&
    file !== null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid() || !file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await issueSingleDegree(file, {
        universityCode: form.universityCode.trim(),
        rollNo: form.rollNo.trim(),
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
        'Failed to issue credential. Please ensure the backend is connected and try again.';
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

  const copyToClipboard = (text: string, type: 'tx' | 'url') => {
    navigator.clipboard.writeText(text);
    if (type === 'tx') { setCopiedTx(true); setTimeout(() => setCopiedTx(false), 2000); }
    else { setCopiedUrl(true); setTimeout(() => setCopiedUrl(false), 2000); }
  };

  // ── Success State ──────────────────────────────────────────
  if (result && result.status === 'SUCCESS') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="space-y-6"
      >
        {/* Banner */}
        <div className="relative">
          <div
            className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-status-verified/15 via-teal-brand/15 to-status-verified/15 blur-xl -z-10 opacity-70"
            aria-hidden="true"
          />
          <div
            className="bg-surface-card border border-status-verified-border rounded-2xl p-7 sm:p-8 text-center relative z-10"
            style={{ boxShadow: 'var(--shadow-elevated), var(--inset-card-highlight)' }}
          >
            <div className="w-15 h-15 rounded-2xl bg-gradient-to-br from-status-verified-bg to-status-verified-border/30 text-status-verified border border-status-verified-border flex items-center justify-center mx-auto mb-3.5 shadow-sm">
              <CheckCircle2 size={32} strokeWidth={2.4} />
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-content-main mb-1.5 tracking-tight">
              Degree Issued Successfully
            </h3>
            <p className="text-xs sm:text-sm text-content-secondary max-w-md mx-auto mb-4 leading-relaxed">
              {result.message || 'The credential has been permanently registered on the blockchain.'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Badge variant="success" dot size="md">Registered On-Chain</Badge>
              {result.globalCredentialId && (
                <span className="font-mono text-xs px-3 py-1 rounded-full bg-surface-teal-subtle border border-teal-brand/25 text-teal-brand font-bold">
                  {result.globalCredentialId}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* QR Code + Verification URL */}
        {(result.qrCodeBase64 || result.verificationUrl) && (
          <div
            className="bg-surface-card border border-border-main rounded-2xl p-6"
            style={{ boxShadow: 'var(--shadow-card), var(--inset-card-highlight)' }}
          >
            <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-border-subtle">
              <div className="w-8 h-8 rounded-lg bg-surface-teal-subtle text-teal-brand border border-teal-brand/20 flex items-center justify-center">
                <QrCode size={17} strokeWidth={2.2} />
              </div>
              <h4 className="text-sm font-bold text-content-main">Verification QR Code</h4>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {result.qrCodeBase64 && (
                <div className="flex-shrink-0">
                  <img
                    src={`data:image/png;base64,${result.qrCodeBase64}`}
                    alt={`QR code for ${result.globalCredentialId}`}
                    className="w-32 h-32 rounded-xl border border-border-subtle shadow-xs object-contain bg-white p-1"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0 space-y-3">
                <p className="text-xs text-content-secondary">
                  Share this QR code or link with employers, institutions, or anyone who needs to verify this degree.
                </p>
                {result.verificationUrl && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-content-secondary flex items-center gap-1">
                        <Link size={11} />
                        Verification Link
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => copyToClipboard(result.verificationUrl, 'url')}
                          className="flex items-center gap-1 text-xs text-teal-brand hover:underline cursor-pointer font-medium"
                        >
                          {copiedUrl ? <Check size={12} /> : <Copy size={12} />}
                          <span>{copiedUrl ? 'Copied' : 'Copy'}</span>
                        </button>
                        <a
                          href={result.verificationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-teal-brand hover:underline font-medium"
                        >
                          <ExternalLink size={12} />
                          <span>Open</span>
                        </a>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-surface-page/70 border border-border-subtle font-mono text-xs text-content-main break-all shadow-2xs">
                      {result.verificationUrl}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Transaction Details */}
        <div
          className="bg-surface-card border border-border-main rounded-2xl p-6 space-y-4"
          style={{ boxShadow: 'var(--shadow-card), var(--inset-card-highlight)' }}
        >
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-content-secondary">
                Blockchain Transaction Hash
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(result.transactionHash, 'tx')}
                className="flex items-center gap-1 text-xs text-teal-brand hover:underline cursor-pointer font-medium"
              >
                {copiedTx ? <Check size={12} /> : <Copy size={12} />}
                <span>{copiedTx ? 'Copied' : 'Copy Hash'}</span>
              </button>
            </div>
            <div className="p-3.5 rounded-xl bg-surface-page/70 border border-border-subtle font-mono text-xs text-content-main break-all shadow-2xs">
              {result.transactionHash || '0x...'}
            </div>
          </div>

          {result.issuerAddress && (
            <div>
              <span className="block text-xs font-bold text-content-secondary mb-1.5">
                Registrar Authority Address
              </span>
              <div className="p-3.5 rounded-xl bg-surface-page/70 border border-border-subtle font-mono text-xs text-content-muted break-all shadow-2xs">
                {result.issuerAddress}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center pt-3">
          <Button
            variant="outline"
            size="md"
            onClick={handleReset}
            icon={<ArrowLeft size={16} />}
          >
            Issue Another Degree
          </Button>
        </div>
      </motion.div>
    );
  }

  // ── Input Form ────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* 2-Column Grid for Metadata */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5">

        {/* University Code */}
        <div>
          <label
            htmlFor="issue-uni-code"
            className="block text-xs font-bold uppercase tracking-wider text-content-main mb-1.5"
          >
            University Code <span className="text-teal-brand">*</span>
          </label>
          <div className="relative group">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-content-muted group-focus-within:text-teal-brand transition-colors pointer-events-none">
              <Building2 size={15} />
            </div>
            <input
              id="issue-uni-code"
              type="text"
              value={form.universityCode}
              onChange={(e) => updateField('universityCode', e.target.value)}
              placeholder="e.g. MUET"
              disabled={loading}
              required
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl text-sm font-mono uppercase tracking-widest
                bg-surface-page/70 border border-border-main text-content-main placeholder:text-content-muted/70 placeholder:normal-case placeholder:tracking-normal
                focus-visible:ring-2 focus-visible:ring-teal-brand focus-visible:border-teal-brand focus-visible:bg-surface-card
                disabled:opacity-50 transition-all duration-150 outline-none shadow-xs"
            />
          </div>
          <p className="text-[11px] text-content-muted mt-1">e.g. MUET, UET, NUST, FAST, IBA</p>
        </div>

        {/* Roll Number */}
        <div>
          <label
            htmlFor="issue-roll-no"
            className="block text-xs font-bold uppercase tracking-wider text-content-main mb-1.5"
          >
            Student Roll Number <span className="text-teal-brand">*</span>
          </label>
          <div className="relative group">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-content-muted group-focus-within:text-teal-brand transition-colors pointer-events-none">
              <Hash size={15} />
            </div>
            <input
              id="issue-roll-no"
              type="text"
              value={form.rollNo}
              onChange={(e) => updateField('rollNo', e.target.value)}
              placeholder="e.g. 22CS001"
              disabled={loading}
              required
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl text-sm font-mono uppercase tracking-wide
                bg-surface-page/70 border border-border-main text-content-main placeholder:text-content-muted/70 placeholder:normal-case placeholder:tracking-normal
                focus-visible:ring-2 focus-visible:ring-teal-brand focus-visible:border-teal-brand focus-visible:bg-surface-card
                disabled:opacity-50 transition-all duration-150 outline-none shadow-xs"
            />
          </div>
        </div>

        {/* Student Name */}
        <div>
          <label
            htmlFor="issue-student-name"
            className="block text-xs font-bold uppercase tracking-wider text-content-main mb-1.5"
          >
            Full Student Name <span className="text-teal-brand">*</span>
          </label>
          <input
            id="issue-student-name"
            type="text"
            value={form.studentName}
            onChange={(e) => updateField('studentName', e.target.value)}
            placeholder="e.g. Ahmed Ali Khan"
            disabled={loading}
            required
            className="w-full px-3.5 py-2.5 rounded-xl text-sm
              bg-surface-page/70 border border-border-main text-content-main placeholder:text-content-muted/70
              focus-visible:ring-2 focus-visible:ring-teal-brand focus-visible:border-teal-brand focus-visible:bg-surface-card
              disabled:opacity-50 transition-all duration-150 outline-none shadow-xs"
          />
        </div>

        {/* Father Name */}
        <div>
          <label
            htmlFor="issue-father-name"
            className="block text-xs font-bold uppercase tracking-wider text-content-main mb-1.5"
          >
            Father's Name <span className="text-teal-brand">*</span>
          </label>
          <input
            id="issue-father-name"
            type="text"
            value={form.fatherName}
            onChange={(e) => updateField('fatherName', e.target.value)}
            placeholder="e.g. Muhammad Ali Khan"
            disabled={loading}
            required
            className="w-full px-3.5 py-2.5 rounded-xl text-sm
              bg-surface-page/70 border border-border-main text-content-main placeholder:text-content-muted/70
              focus-visible:ring-2 focus-visible:ring-teal-brand focus-visible:border-teal-brand focus-visible:bg-surface-card
              disabled:opacity-50 transition-all duration-150 outline-none shadow-xs"
          />
        </div>

        {/* Department */}
        <div>
          <label
            htmlFor="issue-department"
            className="block text-xs font-bold uppercase tracking-wider text-content-main mb-1.5"
          >
            Department / Program <span className="text-teal-brand">*</span>
          </label>
          <input
            id="issue-department"
            type="text"
            value={form.department}
            onChange={(e) => updateField('department', e.target.value)}
            placeholder="e.g. Computer Systems Engineering"
            disabled={loading}
            required
            className="w-full px-3.5 py-2.5 rounded-xl text-sm
              bg-surface-page/70 border border-border-main text-content-main placeholder:text-content-muted/70
              focus-visible:ring-2 focus-visible:ring-teal-brand focus-visible:border-teal-brand focus-visible:bg-surface-card
              disabled:opacity-50 transition-all duration-150 outline-none shadow-xs"
          />
        </div>

        {/* CGPA */}
        <div>
          <label
            htmlFor="issue-cgpa"
            className="block text-xs font-bold uppercase tracking-wider text-content-main mb-1.5"
          >
            Cumulative GPA (CGPA) <span className="text-teal-brand">*</span>
          </label>
          <input
            id="issue-cgpa"
            type="text"
            value={form.cgpa}
            onChange={(e) => updateField('cgpa', e.target.value)}
            placeholder="e.g. 3.85"
            disabled={loading}
            required
            className="w-full px-3.5 py-2.5 rounded-xl text-sm
              bg-surface-page/70 border border-border-main text-content-main placeholder:text-content-muted/70
              focus-visible:ring-2 focus-visible:ring-teal-brand focus-visible:border-teal-brand focus-visible:bg-surface-card
              disabled:opacity-50 transition-all duration-150 outline-none shadow-xs"
          />
        </div>
      </div>

      {/* Live GUCI Preview */}
      {derivedGuci && (
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-surface-teal-subtle/40 border border-teal-brand/25">
          <div className="w-5 h-5 rounded-md bg-teal-brand/15 text-teal-brand flex items-center justify-center flex-shrink-0">
            <Info size={12} />
          </div>
          <span className="text-xs text-content-secondary">
            Global Credential ID (GUCI):{' '}
            <span className="font-mono font-bold text-teal-brand tracking-wider">{derivedGuci}</span>
          </span>
        </div>
      )}

      {/* PDF Upload */}
      <div>
        <label
          id="issue-pdf-label"
          className="block text-xs font-bold uppercase tracking-wider text-content-main mb-1.5"
        >
          Official Degree Certificate PDF <span className="text-teal-brand">*</span>
        </label>

        {file ? (
          <div className="flex items-center justify-between p-4 rounded-xl bg-surface-page/80 border border-teal-brand/30 shadow-xs">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-surface-teal-subtle text-teal-brand border border-teal-brand/20 flex items-center justify-center flex-shrink-0 shadow-2xs">
                <FileText size={20} strokeWidth={2.2} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-content-main truncate">{file.name}</p>
                <p className="text-xs text-content-muted mt-0.5">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setFile(null)}
              disabled={loading}
              className="p-1.5 rounded-lg text-content-muted hover:text-status-error transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <div
            {...getRootProps()}
            className={`p-7 rounded-xl border-2 border-dashed text-center cursor-pointer transition-all duration-200 ${
              isDragActive
                ? 'border-teal-brand bg-surface-teal-subtle/50 scale-[1.01]'
                : 'border-border-main hover:border-teal-brand/60 bg-surface-page/40 hover:bg-surface-teal-subtle/20'
            }`}
          >
            <input {...getInputProps()} />
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-surface-teal-subtle to-surface-blue-subtle border border-teal-brand/20 flex items-center justify-center mx-auto mb-2.5 text-teal-brand shadow-xs">
              <UploadCloud size={22} strokeWidth={2.2} />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-content-main">
              {isDragActive
                ? 'Drop the degree PDF here'
                : 'Drag and drop certificate PDF here, or click to browse'}
            </p>
            <p className="text-xs text-content-muted mt-1">PDF file format only • Max 50MB</p>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 p-3.5 rounded-xl bg-status-error-bg border border-status-error-border text-status-error-text text-xs shadow-2xs"
        >
          <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Submit */}
      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={!isFormValid()}
          loading={loading}
          icon={<Send size={17} strokeWidth={2.2} />}
        >
          Issue Degree on Blockchain
        </Button>
      </div>
    </form>
  );
}
