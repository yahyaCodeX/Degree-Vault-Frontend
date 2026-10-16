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
} from 'lucide-react';
import { Button, Badge } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import LoginGate from '../components/dashboard/LoginGate';
import HolographicDropzone from '../components/dashboard/HolographicDropzone';
import SingleIssueForm from '../components/dashboard/SingleIssueForm';
import BatchLedger from '../components/dashboard/BatchLedger';
import { issueBatch, getStats } from '../services/api';

type DashboardView = 'upload' | 'processing';
type IssueMode = 'single' | 'batch';

interface Stats {
  totalDegreesIssued: number;
  maxBatchSize: number;
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
  useEffect(() => {
    if (!isAuthenticated) return;
    let mounted = true;
    const fetchStats = async () => {
      try {
        const data = await getStats();
        if (mounted && data) setStats(data);
      } catch {
        // Silently fail if endpoint is not reachable
      }
    };
    fetchStats();
    return () => {
      mounted = false;
    };
  }, [isAuthenticated]);

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
    getStats()
      .then((data) => setStats(data))
      .catch(() => {});
  }, []);

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
    <div className="w-full max-w-4xl mx-auto space-y-8">
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
            Issue and verify academic credentials on the permanent blockchain registry.
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-surface-card border border-border-main rounded-2xl p-5 transition-all duration-200 flex items-center gap-4.5"
            style={{
              boxShadow: 'var(--shadow-card), var(--inset-card-highlight)',
            }}
          >
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-surface-teal-subtle to-surface-teal-subtle-hover text-teal-brand border border-teal-brand/25 flex items-center justify-center flex-shrink-0 shadow-xs">
              <BarChart3 size={24} strokeWidth={2.2} />
            </div>
            <div>
              <span className="block text-xs font-bold text-content-secondary uppercase tracking-wider">
                Total Credentials Issued
              </span>
              <span className="block text-2xl sm:text-3xl font-extrabold font-mono text-content-main mt-0.5 tracking-tight">
                {stats.totalDegreesIssued.toLocaleString()}
              </span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="bg-surface-card border border-border-main rounded-2xl p-5 transition-all duration-200 flex items-center gap-4.5"
            style={{
              boxShadow: 'var(--shadow-card), var(--inset-card-highlight)',
            }}
          >
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-surface-blue-subtle to-surface-muted text-secondary-blue border border-secondary-blue/20 flex items-center justify-center flex-shrink-0 shadow-xs">
              <Building2 size={24} strokeWidth={2.2} />
            </div>
            <div>
              <span className="block text-xs font-bold text-content-secondary uppercase tracking-wider">
                Max Allowed Batch Size
              </span>
              <span className="block text-2xl sm:text-3xl font-extrabold font-mono text-content-main mt-0.5 tracking-tight">
                {stats.maxBatchSize} <span className="text-xs font-sans font-normal text-content-muted">records/batch</span>
              </span>
            </div>
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
            <div className="flex p-1 rounded-xl bg-surface-muted/80 backdrop-blur-sm border border-border-main w-fit shadow-xs">
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
            </div>

            {/* ── Tab Content Card ─────────────────────── */}
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
