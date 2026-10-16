import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Clock, Loader2, AlertTriangle, ExternalLink } from 'lucide-react';
import { Badge } from '../ui';
import LiquidProgressBar from './LiquidProgressBar';
import { getBatchStatus } from '../../services/api';

interface BatchUploadResult {
  row: number;
  rollNo: string;       // kept for backward-compat
  degreeId: string;     // GUCI e.g. "MUET-22CS001"
  status: string;
  transactionHash: string | null;
  error: string | null;
  processedAt: string | null;
}

interface BatchStatusResponse {
  batchId: string;
  overallStatus: string;
  totalRecords: number;
  successCount: number;
  failureCount: number;
  results: BatchUploadResult[];
  startedAt: string | null;
  completedAt: string | null;
}

interface BatchLedgerProps {
  batchId: string;
  onComplete?: (status: BatchStatusResponse) => void;
}

export default function BatchLedger({ batchId, onComplete }: BatchLedgerProps) {
  const [status, setStatus] = useState<BatchStatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let mounted = true;

    const poll = async () => {
      try {
        const data = await getBatchStatus(batchId);
        if (!mounted) return;

        setStatus(data);
        setError(null);

        // Stop polling when complete
        if (data.overallStatus === 'COMPLETED' || data.overallStatus === 'PARTIAL_FAILURE') {
          if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
          }
          onComplete?.(data);
        }
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.response?.data?.message || 'Failed to fetch batch processing status');
      }
    };

    poll();
    pollingRef.current = setInterval(poll, 2500);

    return () => {
      mounted = false;
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [batchId, onComplete]);

  if (error && !status) {
    return (
      <div className="bg-surface-card border border-status-error-border rounded-2xl p-6 text-center shadow-card">
        <AlertTriangle size={24} className="text-status-error mx-auto mb-2" />
        <p className="text-xs text-status-error font-medium">{error}</p>
      </div>
    );
  }

  if (!status) {
    return (
      <div
        className="bg-surface-card border border-border-main rounded-2xl p-8 text-center"
        style={{
          boxShadow: 'var(--shadow-card), var(--inset-card-highlight)',
        }}
      >
        <Loader2 size={24} className="text-teal-brand animate-spin mx-auto mb-2" />
        <p className="text-xs text-content-secondary">Initializing batch verification tracker...</p>
      </div>
    );
  }

  const progress =
    status.totalRecords > 0
      ? ((status.successCount + status.failureCount) / status.totalRecords) * 100
      : 0;

  return (
    <div className="space-y-6">
      {/* ── Header Summary Card ─────────────────────── */}
      <div
        className="bg-surface-card border border-border-main rounded-2xl p-6 space-y-4"
        style={{
          boxShadow: 'var(--shadow-card), var(--inset-card-highlight)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border-subtle">
          <div>
            <h3 className="text-base font-bold text-content-main">
              Batch Processing Progress
            </h3>
            <span className="font-mono text-xs text-content-muted">
              Batch ID: {batchId}
            </span>
          </div>

          <div>
            <StatusBadge status={status.overallStatus} />
          </div>
        </div>

        <LiquidProgressBar
          progress={progress}
          successCount={status.successCount}
          failureCount={status.failureCount}
          totalRecords={status.totalRecords}
        />
      </div>

      {/* ── Results Ledger Table ────────────────────── */}
      <div
        className="bg-surface-card border border-border-main rounded-2xl overflow-hidden"
        style={{
          boxShadow: 'var(--shadow-elevated), var(--inset-card-highlight)',
        }}
      >
        <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between bg-surface-card/60 backdrop-blur-sm">
          <h4 className="text-sm font-bold text-content-main">
            Processed Credentials ({status.results?.length || 0})
          </h4>
        </div>

        {status.results && status.results.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-muted/80 border-b border-border-main text-content-secondary uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="py-3 px-4">Row</th>
                  <th className="py-3 px-4">Credential ID (GUCI)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Transaction / Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle font-mono">
                {status.results.map((res, idx) => (
                  <tr key={idx} className="hover:bg-surface-page/60 transition-colors">
                    <td className="py-3 px-4 text-content-muted">{res.row}</td>
                    <td className="py-3 px-4 font-bold text-content-main">{res.degreeId || res.rollNo}</td>
                    <td className="py-3 px-4">
                      {res.status === 'SUCCESS' ? (
                        <span className="inline-flex items-center gap-1 text-status-verified font-sans font-semibold">
                          <CheckCircle2 size={13} strokeWidth={2.2} /> Minted
                        </span>
                      ) : res.status === 'FAILED' ? (
                        <span className="inline-flex items-center gap-1 text-status-error font-sans font-semibold">
                          <XCircle size={13} strokeWidth={2.2} /> Failed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-content-muted font-sans font-medium">
                          <Clock size={13} /> Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-content-muted break-all">
                      {res.transactionHash ? (
                        <span className="text-[11px] text-teal-brand font-medium">
                          {res.transactionHash.slice(0, 10)}...{res.transactionHash.slice(-8)}
                        </span>
                      ) : (
                        <span className="text-status-error font-sans text-xs">
                          {res.error || '—'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-content-muted">
            Waiting for workers to process first record...
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'COMPLETED':
      return <Badge variant="success" dot>Completed</Badge>;
    case 'PARTIAL_FAILURE':
      return <Badge variant="warning" dot>Completed with Errors</Badge>;
    case 'PROCESSING':
    case 'IN_PROGRESS':
      return <Badge variant="teal" pulse>Processing</Badge>;
    case 'FAILED':
      return <Badge variant="error" dot>Failed</Badge>;
    default:
      return <Badge variant="neutral">{status}</Badge>;
  }
}
