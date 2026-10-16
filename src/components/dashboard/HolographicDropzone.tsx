import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  FileSpreadsheet,
  FileArchive,
  UploadCloud,
  X,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { Button } from '../ui';

interface HolographicDropzoneProps {
  onFilesReady: (csvFile: File, zipFile: File) => void;
  loading: boolean;
  disabled?: boolean;
}

export default function HolographicDropzone({
  onFilesReady,
  loading,
  disabled = false,
}: HolographicDropzoneProps) {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [zipFile, setZipFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const ext = file.name.toLowerCase().split('.').pop();
      if (ext === 'csv') setCsvFile(file);
      if (ext === 'zip') setZipFile(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/zip': ['.zip'],
      'application/x-zip-compressed': ['.zip'],
    },
    maxFiles: 2,
    disabled: loading || disabled,
  });

  const handleSubmit = () => {
    if (csvFile && zipFile) {
      onFilesReady(csvFile, zipFile);
    }
  };

  const handleRemove = (type: 'csv' | 'zip', e: React.MouseEvent) => {
    e.stopPropagation();
    if (type === 'csv') setCsvFile(null);
    else setZipFile(null);
  };

  const bothReady = csvFile !== null && zipFile !== null;

  return (
    <div className="space-y-6">
      {/* ── Dropzone Box ────────────────────────────── */}
      <div
        {...getRootProps()}
        className={`
          p-8 sm:p-10 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all duration-200
          ${
            isDragActive
              ? 'border-teal-brand bg-surface-teal-subtle/50 scale-[1.01]'
              : bothReady
              ? 'border-status-verified-border bg-status-verified-bg/30'
              : 'border-border-main hover:border-teal-brand/60 bg-surface-page/40 hover:bg-surface-teal-subtle/20'
          }
          ${loading || disabled ? 'pointer-events-none opacity-50' : ''}
          focus-visible:ring-2 focus-visible:ring-teal-brand outline-none
        `}
      >
        <input {...getInputProps()} />

        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-surface-teal-subtle to-surface-blue-subtle border border-teal-brand/20 flex items-center justify-center mx-auto mb-3 text-teal-brand shadow-xs">
          <UploadCloud size={24} strokeWidth={2.2} />
        </div>

        <p className="text-sm font-bold text-content-main">
          {isDragActive
            ? 'Drop the files here'
            : 'Drag & drop batch files, or click to browse'}
        </p>

        <p className="text-xs text-content-secondary mt-1 max-w-sm mx-auto">
          Requires one metadata CSV spreadsheet and one compressed ZIP archive containing student PDF certificates.
        </p>
      </div>

      {/* ── File Status Indicators ─────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* CSV Status Card */}
        <div
          className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
            csvFile
              ? 'bg-surface-card border-status-verified-border shadow-xs'
              : 'bg-surface-page/60 border-border-main'
          }`}
          style={csvFile ? { boxShadow: 'var(--shadow-card), var(--inset-card-highlight)' } : undefined}
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-2xs ${
                csvFile
                  ? 'bg-gradient-to-br from-status-verified-bg to-status-verified-border/20 text-status-verified border border-status-verified-border'
                  : 'bg-surface-muted text-content-muted border border-border-subtle'
              }`}
            >
              <FileSpreadsheet size={20} strokeWidth={2.2} />
            </div>
            <div className="min-w-0">
              <span className="block text-xs font-bold text-content-main truncate">
                {csvFile ? csvFile.name : 'Metadata CSV'}
              </span>
              <span className="block text-[11px] text-content-muted mt-0.5">
                {csvFile
                  ? `${(csvFile.size / 1024).toFixed(1)} KB • Ready`
                  : 'Pending upload (.csv)'}
              </span>
            </div>
          </div>

          {csvFile && (
            <button
              type="button"
              onClick={(e) => handleRemove('csv', e)}
              className="p-1 rounded-md text-content-muted hover:text-status-error transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* ZIP Status Card */}
        <div
          className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
            zipFile
              ? 'bg-surface-card border-status-verified-border shadow-xs'
              : 'bg-surface-page/60 border-border-main'
          }`}
          style={zipFile ? { boxShadow: 'var(--shadow-card), var(--inset-card-highlight)' } : undefined}
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-2xs ${
                zipFile
                  ? 'bg-gradient-to-br from-status-verified-bg to-status-verified-border/20 text-status-verified border border-status-verified-border'
                  : 'bg-surface-muted text-content-muted border border-border-subtle'
              }`}
            >
              <FileArchive size={20} strokeWidth={2.2} />
            </div>
            <div className="min-w-0">
              <span className="block text-xs font-bold text-content-main truncate">
                {zipFile ? zipFile.name : 'Certificates ZIP'}
              </span>
              <span className="block text-[11px] text-content-muted mt-0.5">
                {zipFile
                  ? `${(zipFile.size / (1024 * 1024)).toFixed(2)} MB • Ready`
                  : 'Pending upload (.zip)'}
              </span>
            </div>
          </div>

          {zipFile && (
            <button
              type="button"
              onClick={(e) => handleRemove('zip', e)}
              className="p-1 rounded-md text-content-muted hover:text-status-error transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* ── Action Button ──────────────────────────── */}
      <div className="pt-2">
        <Button
          type="button"
          variant="primary"
          size="lg"
          fullWidth
          disabled={!bothReady || loading}
          loading={loading}
          onClick={handleSubmit}
          icon={<ArrowRight size={17} strokeWidth={2.2} />}
        >
          Start Batch Issuance
        </Button>
      </div>
    </div>
  );
}
