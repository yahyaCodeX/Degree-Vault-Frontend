import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Hash,
  User,
  GraduationCap,
  Calendar,
  AlertTriangle,
  ExternalLink,
  Copy,
  Check,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  X,
  FileCheck2,
  Filter,
} from 'lucide-react';
import { Button, Badge } from '../ui';
import { DegreeRecord, getAllDegrees, searchDegrees, revokeDegree } from '../../services/api';

interface DegreeLedgerProps {
  onRefreshStats?: () => void;
}

export default function DegreeLedger({ onRefreshStats }: DegreeLedgerProps) {
  const [records, setRecords] = useState<DegreeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'revoked'>('all');

  // Revocation Modal state
  const [selectedRecord, setSelectedRecord] = useState<DegreeRecord | null>(null);
  const [revocationReason, setRevocationReason] = useState('');
  const [revoking, setRevoking] = useState(false);
  const [revokeError, setRevokeError] = useState<string | null>(null);
  const [revokeSuccess, setRevokeSuccess] = useState<string | null>(null);

  // Copy feedback state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllDegrees();
      setRecords(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load degree records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Status filter
      if (statusFilter === 'active' && r.revoked) return false;
      if (statusFilter === 'revoked' && !r.revoked) return false;

      // Text query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        r.globalCredentialId.toLowerCase().includes(q) ||
        r.studentName.toLowerCase().includes(q) ||
        r.rollNo.toLowerCase().includes(q) ||
        (r.department && r.department.toLowerCase().includes(q)) ||
        (r.fatherName && r.fatherName.toLowerCase().includes(q)) ||
        r.universityCode.toLowerCase().includes(q)
      );
    });
  }, [records, statusFilter, searchQuery]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openRevokeModal = (record: DegreeRecord) => {
    setSelectedRecord(record);
    setRevocationReason('');
    setRevokeError(null);
    setRevokeSuccess(null);
  };

  const closeRevokeModal = () => {
    setSelectedRecord(null);
    setRevoking(false);
    setRevokeError(null);
    setRevokeSuccess(null);
  };

  const handleConfirmRevoke = async () => {
    if (!selectedRecord) return;
    if (!revocationReason.trim()) {
      setRevokeError('Please provide an official reason for degree revocation.');
      return;
    }

    setRevoking(true);
    setRevokeError(null);

    try {
      const res = await revokeDegree(selectedRecord.globalCredentialId, revocationReason.trim());

      setRevokeSuccess(`Degree ${selectedRecord.globalCredentialId} officially revoked on blockchain!`);

      // Update local state immediately
      setRecords((prev) =>
        prev.map((item) =>
          item.globalCredentialId === selectedRecord.globalCredentialId
            ? {
                ...item,
                revoked: true,
                revocationReason: revocationReason.trim(),
                revocationDate: Math.floor(Date.now() / 1000),
                revocationTxHash: res.transactionHash,
              }
            : item
        )
      );

      if (onRefreshStats) onRefreshStats();

      setTimeout(() => {
        closeRevokeModal();
      }, 1500);
    } catch (err: any) {
      setRevokeError(
        err?.response?.data?.message || err?.message || 'Failed to execute on-chain revocation.'
      );
    } finally {
      setRevoking(false);
    }
  };

  const totalCount = records.length;
  const revokedCount = records.filter((r) => r.revoked).length;
  const activeCount = totalCount - revokedCount;

  return (
    <div className="space-y-6">
      {/* ── Ledger Summary Stats Bar ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-surface-card border border-border-main shadow-xs">
          <span className="block text-xs font-semibold text-content-secondary uppercase tracking-wider">
            Total Uploaded
          </span>
          <span className="text-2xl font-extrabold text-content-main font-mono mt-1 block">
            {totalCount}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-surface-card border border-status-verified-border/40 shadow-xs">
          <span className="block text-xs font-semibold text-status-verified uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck size={14} /> Active Credentials
          </span>
          <span className="text-2xl font-extrabold text-status-verified font-mono mt-1 block">
            {activeCount}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-surface-card border border-status-error-border/40 shadow-xs">
          <span className="block text-xs font-semibold text-status-error uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert size={14} /> Revoked Degrees
          </span>
          <span className="text-2xl font-extrabold text-status-error font-mono mt-1 block">
            {revokedCount}
          </span>
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="bg-surface-card border border-border-main rounded-2xl p-4 sm:p-5 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search bar */}
          <div className="relative w-full sm:w-80">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-content-muted pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, roll no, GUCI..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-surface-page/70 border border-border-subtle text-xs text-content-main placeholder:text-content-muted focus:outline-none focus:border-teal-brand focus:ring-1 focus:ring-teal-brand shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted hover:text-content-main"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter Pills & Refresh */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex p-1 rounded-xl bg-surface-muted/60 border border-border-subtle text-xs">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  statusFilter === 'all'
                    ? 'bg-surface-card text-teal-brand shadow-xs font-bold'
                    : 'text-content-secondary hover:text-content-main'
                }`}
              >
                All ({totalCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('active')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  statusFilter === 'active'
                    ? 'bg-surface-card text-status-verified shadow-xs font-bold'
                    : 'text-content-secondary hover:text-content-main'
                }`}
              >
                Active ({activeCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('revoked')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  statusFilter === 'revoked'
                    ? 'bg-surface-card text-status-error shadow-xs font-bold'
                    : 'text-content-secondary hover:text-content-main'
                }`}
              >
                Revoked ({revokedCount})
              </button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={fetchRecords}
              disabled={loading}
              icon={<RefreshCw size={13} className={loading ? 'animate-spin' : ''} />}
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* ── Table Container ── */}
      <div className="bg-surface-card border border-border-main rounded-2xl shadow-card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-content-muted text-xs space-y-2">
            <RefreshCw size={22} className="animate-spin mx-auto text-teal-brand" />
            <p>Loading university degree records...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-status-error text-xs">
            <AlertTriangle size={22} className="mx-auto mb-2" />
            <p>{error}</p>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="p-12 text-center text-content-muted text-xs">
            <Search size={22} className="mx-auto mb-2 opacity-50" />
            <p>No matching degree records found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-muted/60 text-content-secondary border-b border-border-subtle uppercase tracking-wider text-[11px] font-bold">
                <tr>
                  <th className="py-3 px-4">Credential (GUCI)</th>
                  <th className="py-3 px-4">Student Details</th>
                  <th className="py-3 px-4">Department &amp; Roll No</th>
                  <th className="py-3 px-4">CGPA</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle font-medium text-content-main">
                {filteredRecords.map((r) => {
                  const isRevoked = Boolean(r.revoked);
                  return (
                    <tr
                      key={r.globalCredentialId}
                      className="hover:bg-surface-page/50 transition-colors"
                    >
                      {/* GUCI */}
                      <td className="py-3 px-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-teal-subtle text-teal-brand font-mono font-bold text-xs border border-teal-brand/20">
                          <span>{r.globalCredentialId}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(r.globalCredentialId, r.globalCredentialId)}
                            className="hover:opacity-75 transition-opacity"
                            title="Copy GUCI"
                          >
                            {copiedId === r.globalCredentialId ? (
                              <Check size={11} className="text-status-verified" />
                            ) : (
                              <Copy size={11} />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Student Details */}
                      <td className="py-3 px-4">
                        <span className="block font-bold text-content-main">{r.studentName}</span>
                        {r.fatherName && r.fatherName !== 'N/A' && (
                          <span className="block text-[11px] text-content-muted">
                            S/D/O {r.fatherName}
                          </span>
                        )}
                      </td>

                      {/* Dept & Roll No */}
                      <td className="py-3 px-4">
                        <span className="block text-content-main font-semibold">
                          {r.department && r.department !== 'N/A' ? r.department : r.universityCode}
                        </span>
                        <span className="block text-[11px] text-content-muted font-mono">
                          Roll: {r.rollNo}
                        </span>
                      </td>

                      {/* CGPA */}
                      <td className="py-3 px-4 font-mono font-bold text-content-main">
                        {r.cgpa || 'N/A'}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        {isRevoked ? (
                          <div className="space-y-1">
                            <Badge variant="error" dot size="sm">
                              Revoked
                            </Badge>
                            {r.revocationReason && (
                              <span className="block text-[10px] text-status-error line-clamp-1 max-w-[140px]" title={r.revocationReason}>
                                {r.revocationReason}
                              </span>
                            )}
                          </div>
                        ) : (
                          <Badge variant="success" dot size="sm">
                            Active
                          </Badge>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Verify Link */}
                          <a
                            href={`/verify?id=${encodeURIComponent(r.globalCredentialId)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-surface-muted hover:bg-surface-teal-subtle text-content-secondary hover:text-teal-brand transition-colors"
                            title="Verify in new tab"
                          >
                            <ExternalLink size={14} />
                          </a>

                          {/* IPFS Certificate Document */}
                          {r.ipfsCid && r.ipfsCid !== 'N/A' && (
                            <a
                              href={`https://ipfs.io/ipfs/${r.ipfsCid}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-surface-muted hover:bg-surface-teal-subtle text-content-secondary hover:text-teal-brand transition-colors"
                              title="View Certificate PDF on IPFS"
                            >
                              <FileCheck2 size={14} />
                            </a>
                          )}

                          {/* Revoke Button */}
                          {!isRevoked ? (
                            <button
                              type="button"
                              onClick={() => openRevokeModal(r)}
                              className="px-2.5 py-1 rounded-lg bg-status-error-bg hover:bg-status-error-border/30 text-status-error border border-status-error-border text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1"
                              title="Revoke Degree"
                            >
                              <ShieldAlert size={12} />
                              <span>Revoke</span>
                            </button>
                          ) : (
                            <span className="text-[11px] text-content-muted italic">Revoked</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Revocation Confirmation Modal ── */}
      <AnimatePresence>
        {selectedRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.2 }}
              className="bg-surface-card border border-border-main rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-5"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-status-error-bg text-status-error border border-status-error-border flex items-center justify-center flex-shrink-0">
                    <ShieldAlert size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-content-main">
                      Revoke Credential
                    </h3>
                    <p className="text-xs text-content-secondary">
                      Permanent On-Chain Blockchain Revocation
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeRevokeModal}
                  disabled={revoking}
                  className="text-content-muted hover:text-content-main p-1 rounded-lg"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Warning Notice */}
              <div className="p-3.5 rounded-xl bg-status-error-bg border border-status-error-border text-xs text-status-error-text space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <AlertTriangle size={14} /> Warning: Irreversible Action
                </p>
                <p className="text-[11px] leading-relaxed">
                  This transaction will permanently flag this degree as <strong>REVOKED</strong> on the
                  Ethereum blockchain. Public verifiers scanning this QR code will see a revocation
                  warning.
                </p>
              </div>

              {/* Degree Details summary */}
              <div className="p-3.5 rounded-xl bg-surface-muted/50 border border-border-subtle text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-content-muted">Credential ID:</span>
                  <span className="font-mono font-bold text-content-main">
                    {selectedRecord.globalCredentialId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-content-muted">Student Name:</span>
                  <span className="font-bold text-content-main">{selectedRecord.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-content-muted">Roll Number:</span>
                  <span className="font-mono text-content-main">{selectedRecord.rollNo}</span>
                </div>
              </div>

              {/* Reason Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-content-main">
                  Official Revocation Reason <span className="text-status-error">*</span>
                </label>
                <textarea
                  rows={3}
                  value={revocationReason}
                  onChange={(e) => setRevocationReason(e.target.value)}
                  placeholder="e.g., Falsified high school prerequisites, academic malpractice, or administrative error..."
                  className="w-full p-3 rounded-xl bg-surface-page/70 border border-border-subtle text-xs text-content-main placeholder:text-content-muted focus:outline-none focus:border-status-error focus:ring-1 focus:ring-status-error shadow-2xs resize-none"
                  disabled={revoking}
                />
              </div>

              {/* Error / Success messages */}
              {revokeError && (
                <div className="p-3 rounded-xl bg-status-error-bg border border-status-error-border text-xs text-status-error">
                  {revokeError}
                </div>
              )}
              {revokeSuccess && (
                <div className="p-3 rounded-xl bg-status-verified-bg border border-status-verified-border text-xs text-status-verified font-bold flex items-center gap-1.5">
                  <Check size={14} /> {revokeSuccess}
                </div>
              )}

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={closeRevokeModal}
                  disabled={revoking}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleConfirmRevoke}
                  disabled={revoking || !revocationReason.trim()}
                  className="bg-status-error hover:bg-status-error/90 text-white border-transparent"
                  icon={revoking ? <RefreshCw size={14} className="animate-spin" /> : <ShieldAlert size={14} />}
                >
                  {revoking ? 'Executing On-Chain Revocation...' : 'Confirm Revocation'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
