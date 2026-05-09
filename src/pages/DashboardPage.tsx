import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Blocks, LogOut, BarChart3, Upload, RefreshCw, FileText, Layers } from 'lucide-react';
import { GlassCard, GlowingBadge, NeonButton } from '../components/ui';
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

/**
 * DashboardPage — The protected admin issuance dashboard.
 *
 * Flow:
 * 1. Not authenticated → LoginGate
 * 2. Authenticated → Tabbed upload view (Single Issue / Batch Issue) + stats
 * 3. After batch upload → Processing view (real-time batch ledger)
 */
export default function DashboardPage() {
  const { isAuthenticated, logout } = useAuth();
  const [view, setView] = useState<DashboardView>('upload');
  const [issueMode, setIssueMode] = useState<IssueMode>('single');
  const [batchId, setBatchId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);

  // Fetch stats on auth
  useEffect(() => {
    if (!isAuthenticated) return;
    let mounted = true;
    const fetchStats = async () => {
      try {
        const data = await getStats();
        if (mounted) setStats(data);
      } catch {
        // silently fail
      }
    };
    fetchStats();
    return () => { mounted = false; };
  }, [isAuthenticated]);

  const handleBatchFilesReady = async (csvFile: File, zipFile: File) => {
    setUploading(true);
    setUploadError(null);

    try {
      const response = await issueBatch(csvFile, zipFile);
      setBatchId(response.batchId);
      setView('processing');
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to initiate batch upload.';
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

  // ── Not authenticated → Login Gate ────────────
  if (!isAuthenticated) {
    return <LoginGate />;
  }

  // ── Authenticated Dashboard ───────────────────
  return (
    <div className="max-w-4xl mx-auto">
      {/* ── Dashboard Header ─────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <GlowingBadge variant="green" size="sm" pulse>ADMIN CONNECTED</GlowingBadge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              <span className="gradient-text-cyan">Issuance</span>{' '}
              <span className="text-white/90">Dashboard</span>
            </h1>
          </div>

          <NeonButton variant="ghost" size="sm" onClick={logout} icon={<LogOut size={14} />}>
            Sign Out
          </NeonButton>
        </div>

        {/* Stats cards */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 gap-4 mb-2"
          >
            <GlassCard className="p-4" hoverGlow={false}>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'rgba(0, 255, 102, 0.06)',
                    border: '1px solid rgba(0, 255, 102, 0.12)',
                  }}
                >
                  <BarChart3 size={18} className="text-neon-green" />
                </div>
                <div>
                  <p className="text-[10px] text-white/25 uppercase tracking-widest">Total Issued</p>
                  <p className="text-xl font-bold font-mono text-white/80">
                    {stats.totalDegreesIssued.toLocaleString()}
                  </p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-4" hoverGlow={false}>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'rgba(0, 240, 255, 0.06)',
                    border: '1px solid rgba(0, 240, 255, 0.12)',
                  }}
                >
                  <Blocks size={18} className="text-neon-cyan" />
                </div>
                <div>
                  <p className="text-[10px] text-white/25 uppercase tracking-widest">Max Batch Size</p>
                  <p className="text-xl font-bold font-mono text-white/80">
                    {stats.maxBatchSize}
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </motion.div>

      {/* ── Main Content ─────────────────────────── */}
      <AnimatePresence mode="wait">
        {view === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* ── Mode Tabs ──────────────────────── */}
            <div className="flex gap-2 mb-5">
              <TabButton
                active={issueMode === 'single'}
                onClick={() => setIssueMode('single')}
                icon={<FileText size={15} />}
                label="Single Issue"
              />
              <TabButton
                active={issueMode === 'batch'}
                onClick={() => setIssueMode('batch')}
                icon={<Layers size={15} />}
                label="Batch Issue"
              />
            </div>

            {/* ── Tab Content ────────────────────── */}
            <AnimatePresence mode="wait">
              {issueMode === 'single' ? (
                <motion.div
                  key="single"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ duration: 0.3 }}
                >
                  <GlassCard elevated className="p-6 sm:p-8" hoverGlow={false}>
                    <div className="flex items-center gap-3 mb-6">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                          background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.1), rgba(0, 255, 102, 0.05))',
                          border: '1px solid rgba(0, 240, 255, 0.15)',
                        }}
                      >
                        <FileText size={18} className="text-neon-cyan" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-white/80">Single Degree Issuance</h2>
                        <p className="text-xs text-white/30">Enter student details and upload the degree PDF</p>
                      </div>
                    </div>

                    <SingleIssueForm />
                  </GlassCard>
                </motion.div>
              ) : (
                <motion.div
                  key="batch"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.3 }}
                >
                  <GlassCard elevated className="p-6 sm:p-8" hoverGlow={false}>
                    <div className="flex items-center gap-3 mb-6">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(0, 240, 255, 0.05))',
                          border: '1px solid rgba(168, 85, 247, 0.15)',
                        }}
                      >
                        <Layers size={18} className="text-neon-purple" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-white/80">Batch Degree Issuance</h2>
                        <p className="text-xs text-white/30">Upload CSV records and ZIP archive to issue degrees on-chain</p>
                      </div>
                    </div>

                    <HolographicDropzone
                      onFilesReady={handleBatchFilesReady}
                      loading={uploading}
                    />

                    {/* Upload Error */}
                    <AnimatePresence>
                      {uploadError && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 px-4 py-3 rounded-xl"
                          style={{
                            background: 'rgba(255, 0, 60, 0.05)',
                            border: '1px solid rgba(255, 0, 60, 0.15)',
                          }}
                        >
                          <p className="text-xs text-neon-red/80">{uploadError}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {view === 'processing' && batchId && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex justify-end mb-4">
              <NeonButton
                variant="ghost"
                size="sm"
                onClick={handleNewBatch}
                icon={<RefreshCw size={14} />}
              >
                New Batch
              </NeonButton>
            </div>

            <BatchLedger batchId={batchId} onComplete={handleBatchComplete} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Tab Button Component ───────────────────────── */
function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
        transition-all duration-300 cursor-pointer
        border
        ${active
          ? 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/25'
          : 'bg-transparent text-white/35 border-white/5 hover:text-white/60 hover:border-white/10 hover:bg-white/[0.02]'
        }
      `}
      style={active ? {
        boxShadow: '0 0 12px rgba(0, 240, 255, 0.12)',
      } : undefined}
    >
      {icon}
      {label}
    </motion.button>
  );
}
