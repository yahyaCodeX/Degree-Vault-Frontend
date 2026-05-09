import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { FileSpreadsheet, FileArchive, Upload, X, CheckCircle2, Sparkles } from 'lucide-react';
import { NeonButton } from '../ui';

interface HolographicDropzoneProps {
  onFilesReady: (csvFile: File, zipFile: File) => void;
  loading: boolean;
  disabled?: boolean;
}

/**
 * HolographicDropzone — Large dual-file upload area for batch issuance.
 * Accepts exactly one .csv and one .zip file.
 * Glows Cyber Blue and pulses when files are dragged over.
 */
export default function HolographicDropzone({
  onFilesReady,
  loading,
  disabled = false,
}: HolographicDropzoneProps) {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [zipFile, setZipFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        const ext = file.name.toLowerCase().split('.').pop();
        if (ext === 'csv') setCsvFile(file);
        if (ext === 'zip') setZipFile(file);
      });
    },
    []
  );

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
    <div className="w-full">
      {/* ── Dropzone Area ───────────────────────────── */}
      <motion.div
        {...getRootProps()}
        animate={{
          borderColor: isDragActive
            ? 'rgba(0, 240, 255, 0.8)'
            : bothReady
              ? 'rgba(0, 255, 102, 0.3)'
              : 'rgba(255, 255, 255, 0.06)',
          boxShadow: isDragActive
            ? '0 0 40px rgba(0, 240, 255, 0.25), 0 0 80px rgba(0, 240, 255, 0.1), inset 0 0 40px rgba(0, 240, 255, 0.05)'
            : bothReady
              ? '0 0 20px rgba(0, 255, 102, 0.1), inset 0 0 20px rgba(0, 255, 102, 0.02)'
              : '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
        transition={{ duration: 0.3 }}
        className={`
          relative rounded-2xl p-10 text-center cursor-pointer
          transition-colors duration-300 overflow-hidden
          ${loading || disabled ? 'pointer-events-none opacity-50' : ''}
        `}
        style={{
          background: isDragActive
            ? 'linear-gradient(135deg, rgba(0, 240, 255, 0.04), rgba(15, 23, 42, 0.8))'
            : 'linear-gradient(135deg, rgba(15, 23, 42, 0.5), rgba(5, 5, 5, 0.7))',
          backdropFilter: 'blur(16px)',
          border: '2px dashed',
        }}
      >
        <input {...getInputProps()} />

        {/* Pulsing border glow on drag */}
        <AnimatePresence>
          {isDragActive && (
            <>
              {/* Scan line */}
              <motion.div
                initial={{ top: '-2px' }}
                animate={{ top: '100%' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                className="absolute left-0 right-0 h-[2px] z-10"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.7), transparent)',
                  boxShadow: '0 0 15px rgba(0, 240, 255, 0.5)',
                }}
              />
              {/* Corner glows */}
              <motion.div
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute top-0 left-0 w-20 h-20 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at top left, rgba(0, 240, 255, 0.15), transparent 70%)',
                }}
              />
              <motion.div
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.75 }}
                className="absolute bottom-0 right-0 w-20 h-20 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at bottom right, rgba(0, 240, 255, 0.15), transparent 70%)',
                }}
              />
            </>
          )}
        </AnimatePresence>

        {/* Content */}
        <AnimatePresence mode="wait">
          {isDragActive ? (
            <motion.div
              key="drag"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-6"
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Sparkles size={42} className="text-neon-cyan mx-auto mb-3" />
              </motion.div>
              <p className="text-lg font-semibold text-neon-cyan">
                Drop to upload
              </p>
              <p className="text-xs text-neon-cyan/40 mt-1">
                CSV + ZIP files accepted
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-4"
            >
              {/* File status icons */}
              <div className="flex items-center justify-center gap-6 mb-6">
                <FileSlot
                  file={csvFile}
                  icon={<FileSpreadsheet size={24} />}
                  label="CSV File"
                  expectedExt=".csv"
                  color="cyan"
                  onRemove={(e) => handleRemove('csv', e)}
                />

                <div className="text-white/10 text-2xl font-light">+</div>

                <FileSlot
                  file={zipFile}
                  icon={<FileArchive size={24} />}
                  label="ZIP Archive"
                  expectedExt=".zip"
                  color="purple"
                  onRemove={(e) => handleRemove('zip', e)}
                />
              </div>

              {!csvFile && !zipFile && (
                <>
                  <p className="text-sm text-white/50 mb-1">
                    <span className="text-white/70 font-medium">Drop files here</span>{' '}
                    or click to browse
                  </p>
                  <p className="text-xs text-white/20">
                    One CSV file (student records) + One ZIP archive (degree PDFs)
                  </p>
                </>
              )}

              {(csvFile || zipFile) && !bothReady && (
                <p className="text-xs text-neon-amber/60 mt-2">
                  {!csvFile ? '⚠ CSV file still needed' : '⚠ ZIP archive still needed'}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Submit Button ──────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center mt-6"
      >
        <NeonButton
          variant="green"
          size="lg"
          disabled={!bothReady || loading}
          loading={loading}
          onClick={handleSubmit}
          icon={<Upload size={18} />}
        >
          Issue Batch to Blockchain
        </NeonButton>
      </motion.div>
    </div>
  );
}

/* ── FileSlot — Individual file indicator ─────────── */
function FileSlot({
  file,
  icon,
  label,
  expectedExt,
  color,
  onRemove,
}: {
  file: File | null;
  icon: React.ReactNode;
  label: string;
  expectedExt: string;
  color: 'cyan' | 'purple';
  onRemove: (e: React.MouseEvent) => void;
}) {
  const colors = {
    cyan: {
      border: file ? 'rgba(0, 240, 255, 0.3)' : 'rgba(255, 255, 255, 0.06)',
      bg: file ? 'rgba(0, 240, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
      icon: file ? 'text-neon-cyan' : 'text-white/20',
      glow: file ? '0 0 15px rgba(0, 240, 255, 0.15)' : 'none',
    },
    purple: {
      border: file ? 'rgba(168, 85, 247, 0.3)' : 'rgba(255, 255, 255, 0.06)',
      bg: file ? 'rgba(168, 85, 247, 0.05)' : 'rgba(255, 255, 255, 0.02)',
      icon: file ? 'text-neon-purple' : 'text-white/20',
      glow: file ? '0 0 15px rgba(168, 85, 247, 0.15)' : 'none',
    },
  };

  const c = colors[color];

  return (
    <motion.div
      layout
      className="flex flex-col items-center gap-2 min-w-[120px]"
    >
      <motion.div
        animate={file ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.5 }}
        className="relative w-16 h-16 rounded-xl flex items-center justify-center"
        style={{
          background: c.bg,
          border: `1px solid ${c.border}`,
          boxShadow: c.glow,
        }}
      >
        <span className={c.icon}>{icon}</span>
        {file && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1.5 -right-1.5"
          >
            <CheckCircle2 size={16} className="text-neon-green" />
          </motion.div>
        )}
      </motion.div>

      {file ? (
        <div className="text-center">
          <p className="text-xs text-white/60 font-medium truncate max-w-[140px]">
            {file.name}
          </p>
          <p className="text-[10px] text-white/25">
            {(file.size / 1024).toFixed(1)} KB
          </p>
          <button
            onClick={onRemove}
            className="flex items-center gap-0.5 text-[10px] text-neon-red/50 hover:text-neon-red transition-colors mt-1 mx-auto"
          >
            <X size={10} /> Remove
          </button>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-xs text-white/30">{label}</p>
          <p className="text-[10px] text-white/15">{expectedExt}</p>
        </div>
      )}
    </motion.div>
  );
}
