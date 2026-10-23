import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut,
  BarChart3,
  RefreshCw,
  FileText,
  Layers,
  ShieldCheck,
  Building2,
  Sparkles,
  Database,
  CheckCircle2,
  Ban,
} from 'lucide-react';
import { Button, Badge } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import LoginGate from '../components/dashboard/LoginGate';
import HolographicDropzone from '../components/dashboard/HolographicDropzone';
import SingleIssueForm from '../components/dashboard/SingleIssueForm';
import BatchLedger from '../components/dashboard/BatchLedger';
import DegreeLedger from '../components/dashboard/DegreeLedger';
import { issueBatch, getStats } from '../services/api';

type DashboardView = 'upload' | 'processing';
type IssueMode = 'single' | 'batch' | 'ledger';

interface Stats {
  totalDegreesIssued: number;
  maxBatchSize: number;
  activeDegrees?: number;
  totalRevoked?: number;
}

export default function DashboardPage() {
  const { isAuthenticated, logout } = useAuth();
  const [view, setView] = useState<DashboardView>('upload');
  const [issueMode, setIssueMode] = useState<IssueMode>('single');
  const [batchId, setBatchId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);

  // Fetch real statistics when authenticated
  const fetchStats = useCallback(async () => {
    try {
      const data = await getStats();
      if (data) setStats(data);
    } catch {
      // Silently fail if endpoint is not reachable
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchStats();
  }, [isAuthenticated, fetchStats]);

  const handleBatchFilesReady = async (csvFile: File, zipFile: File) => {
    setUploading(true);
    setUploadError(null);

    try {
      const response = await issueBatch(csvFile, zipFile);
      setBatchId(response.batchId);
      setView('processing');
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to initiate batch upload. Please check file format and try again.';
      setUploadError(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleBatchComplete = useCallback(() => {
    fetchStats();
  }, [fetchStats]);

  const handleNewBatch = () => {
    setView('upload');
    setBatchId(null);
    setUploadError(null);
  };

  // ── Unauthenticated State: Login Gate ─────────
  if (!isAuthenticated) {
    return <LoginGate />;
  }

  // ── Authenticated Registrar Dashboard ─────────
  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* ── Dashboard Header ───────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-main">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="success" dot size="sm">
              Registrar Authorized
            </Badge>
            <span className="text-xs text-content-muted">•</span>
            <span className="text-xs text-content-secondary font-medium">Session Active</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-content-main tracking-tight">
            Credential{' '}
            <span className="bg-gradient-to-r from-teal-brand via-teal-brand-light to-secondary-blue bg-clip-text text-transparent">
              Management
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-content-secondary mt-1">
            Issue, search, verify and audit academic credentials on the permanent blockchain registry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            icon={<LogOut size={14} />}
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* ── Key Real Metric Cards ──────────────────── */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-surface-card border border-border-main rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between"
            style={{
              boxShadow: 'var(--shadow-card), var(--inset-card-highlight)',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-content-secondary uppercase tracking-wider">
                Total Issued
              </span>
              <div className="w-8 h-8 rounded-xl bg-surface-teal-subtle text-teal-brand border border-teal-brand/20 flex items-center justify-center">
                <BarChart3 size={16} strokeWidth={2.2} />
              </div>
            </div>
            <span className="text-2xl font-extrabold font-mono text-content-main tracking-tight">
              {stats.totalDegreesIssued.toLocaleString()}
            </span>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="bg-surface-card border border-border-main rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between"
            style={{
              boxShadow: 'var(--shadow-card), var(--inset-card-highlight)',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-content-secondary uppercase tracking-wider">
                Active &amp; Valid
              </span>
              <div className="w-8 h-8 rounded-xl bg-status-verified-bg text-status-verified border border-status-verified-border flex items-center justify-center">
                <CheckCircle2 size={16} strokeWidth={2.2} />
              </div>
            </div>
            <span className="text-2xl font-extrabold font-mono text-status-verified tracking-tight">
              {(stats.activeDegrees ?? (stats.totalDegreesIssued - (stats.totalRevoked || 0))).toLocaleString()}
            </span>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="bg-surface-card border border-border-main rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between"
            style={{
              boxShadow: 'var(--shadow-card), var(--inset-card-highlight)',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-content-secondary uppercase tracking-wider">
                Revoked
              </span>
              <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 flex items-center justify-center">
                <Ban size={16} strokeWidth={2.2} />
              </div>
            </div>
            <span className={`text-2xl font-extrabold font-mono tracking-tight ${(stats.totalRevoked || 0) > 0 ? 'text-red-400' : 'text-content-muted'}`}>
              {(stats.totalRevoked || 0).toLocaleString()}
            </span>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="bg-surface-card border border-border-main rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between"
            style={{
              boxShadow: 'var(--shadow-card), var(--inset-card-highlight)',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-content-secondary uppercase tracking-wider">
                Batch Capacity
              </span>
              <div className="w-8 h-8 rounded-xl bg-surface-blue-subtle text-secondary-blue border border-secondary-blue/20 flex items-center justify-center">
                <Building2 size={16} strokeWidth={2.2} />
              </div>
            </div>
            <span className="text-2xl font-extrabold font-mono text-content-main tracking-tight">
              {stats.maxBatchSize} <span className="text-xs font-sans font-normal text-content-muted">/batch</span>
            </span>
          </motion.div>
        </div>
      )}

      {/* ── Main Work Area ─────────────────────────── */}
      <AnimatePresence mode="wait">
        {view === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* ── Mode Selection Tabs ──────────────────── */}
            <div className="flex flex-wrap p-1 rounded-xl bg-surface-muted/80 backdrop-blur-sm border border-border-main w-fit shadow-xs gap-1">
              <button
                type="button"
                onClick={() => setIssueMode('single')}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold
                  transition-all duration-200 cursor-pointer
                  ${
                    issueMode === 'single'
                      ? 'bg-surface-card text-teal-brand shadow-xs border border-border-subtle'
                      : 'text-content-secondary hover:text-content-main border border-transparent'
                  }
                `}
              >
                <FileText size={15} />
                <span>Single Issuance</span>
              </button>

              <button
                type="button"
                onClick={() => setIssueMode('batch')}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold
                  transition-all duration-200 cursor-pointer
                  ${
                    issueMode === 'batch'
                      ? 'bg-surface-card text-teal-brand shadow-xs border border-border-subtle'
                      : 'text-content-secondary hover:text-content-main border border-transparent'
                  }
                `}
              >
                <Layers size={15} />
                <span>Batch Processing</span>
              </button>

              <button
                type="button"
                onClick={() => setIssueMode('ledger')}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold
                  transition-all duration-200 cursor-pointer
                  ${
                    issueMode === 'ledger'
                      ? 'bg-surface-card text-teal-brand shadow-xs border border-border-subtle'
                      : 'text-content-secondary hover:text-content-main border border-transparent'
                  }
                `}
              >
                <Database size={15} />
                <span>Degree Ledger &amp; Search</span>
              </button>
            </div>

            {/* ── Tab Content ─────────────────────── */}
            {issueMode === 'ledger' ? (
              <DegreeLedger onRefreshStats={fetchStats} />
            ) : (
              <div
                className="bg-surface-card border border-border-main rounded-2xl p-6 sm:p-8"
                style={{
                  boxShadow: 'var(--shadow-elevated), var(--inset-card-highlight)',
                }}
              >
                {issueMode === 'single' ? (
                  <div>
                    <div className="flex items-center gap-3 pb-4 mb-6 border-b border-border-subtle">
                      <div className="w-9 h-9 rounded-xl bg-surface-teal-subtle text-teal-brand border border-teal-brand/20 flex items-center justify-center shadow-xs">
                        <FileText size={19} strokeWidth={2.2} />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-content-main">
                          Individual Degree Issuance
                        </h2>
                        <p className="text-xs text-content-muted">
                          Enter student details and upload the official PDF document
                        </p>
                      </div>
                    </div>
                    <SingleIssueForm />
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-3 pb-4 mb-6 border-b border-border-subtle">
                      <div className="w-9 h-9 rounded-xl bg-surface-blue-subtle text-secondary-blue border border-secondary-blue/20 flex items-center justify-center shadow-xs">
                        <Layers size={19} strokeWidth={2.2} />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-content-main">
                          Batch Degree Processing
                        </h2>
                        <p className="text-xs text-content-muted">
                          Upload CSV records with corresponding ZIP archive of PDF certificates
                        </p>
                      </div>
                    </div>

                    <HolographicDropzone
                      onFilesReady={handleBatchFilesReady}
                      loading={uploading}
                    />

                    {uploadError && (
                      <div className="mt-4 p-3.5 rounded-xl bg-status-error-bg border border-status-error-border text-status-error-text text-xs shadow-2xs">
                        {uploadError}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {view === 'processing' && batchId && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleNewBatch}
                icon={<RefreshCw size={14} />}
              >
                Start New Batch
              </Button>
            </div>

            <BatchLedger batchId={batchId} onComplete={handleBatchComplete} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
