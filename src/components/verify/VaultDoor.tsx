import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Shield, Upload, FileText, Search, X, Lock } from 'lucide-react';
import { NeonButton } from '../ui';

interface VaultDoorProps {
  onSubmit: (degreeId: string, file: File) => void;
  loading: boolean;
}

/**
 * VaultDoor — The central "vault door" search/upload component.
 * Employers enter a Degree ID and upload a PDF for verification.
 * Features a holographic dropzone with glowing borders and animated states.
 */
export default function VaultDoor({ onSubmit, loading }: VaultDoorProps) {
  const [degreeId, setDegreeId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [focused, setFocused] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    multiple: false,
    disabled: loading,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (degreeId.trim() && file) {
      onSubmit(degreeId.trim(), file);
    }
  };

  const canSubmit = degreeId.trim().length > 0 && file !== null && !loading;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="w-full max-w-2xl mx-auto"
    >
      <form onSubmit={handleSubmit}>
        {/* ── Degree ID Input ──────────────────────────── */}
        <motion.div
          className="relative mb-5"
          animate={focused ? { scale: 1.01 } : { scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
            <Search size={18} className={`transition-colors duration-300 ${
              focused ? 'text-neon-cyan' : 'text-white/25'
            }`} />
          </div>
          <input
            id="degree-id-input"
            type="text"
            value={degreeId}
            onChange={(e) => setDegreeId(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Enter Degree ID (e.g. DEG-2026-001)"
            disabled={loading}
            className="w-full pl-12 pr-5 py-4 rounded-2xl text-sm font-mono tracking-wide
              text-white placeholder-white/20
              outline-none transition-all duration-300
              disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.7), rgba(5, 5, 5, 0.8))',
              backdropFilter: 'blur(16px)',
              border: focused
                ? '1px solid rgba(0, 240, 255, 0.5)'
                : '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: focused
                ? '0 0 20px rgba(0, 240, 255, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                : 'inset 0 1px 0 rgba(255, 255, 255, 0.03)',
            }}
          />
        </motion.div>

        {/* ── Dropzone ─────────────────────────────────── */}
        <motion.div
          {...getRootProps()}
          animate={{
            borderColor: isDragActive
              ? 'rgba(0, 240, 255, 0.7)'
              : file
                ? 'rgba(0, 255, 102, 0.3)'
                : 'rgba(255, 255, 255, 0.06)',
            boxShadow: isDragActive
              ? '0 0 30px rgba(0, 240, 255, 0.2), inset 0 0 30px rgba(0, 240, 255, 0.05)'
              : file
                ? '0 0 15px rgba(0, 255, 102, 0.1)'
                : '0 4px 24px rgba(0, 0, 0, 0.3)',
          }}
          transition={{ duration: 0.3 }}
          className={`
            relative rounded-2xl p-8 text-center cursor-pointer
            transition-colors duration-300 mb-6 overflow-hidden
            ${loading ? 'pointer-events-none opacity-50' : ''}
          `}
          style={{
            background: isDragActive
              ? 'linear-gradient(135deg, rgba(0, 240, 255, 0.05), rgba(15, 23, 42, 0.8))'
              : 'linear-gradient(135deg, rgba(15, 23, 42, 0.5), rgba(5, 5, 5, 0.7))',
            backdropFilter: 'blur(12px)',
            border: '1px dashed',
          }}
        >
          <input {...getInputProps()} />

          {/* Scan line effect on drag */}
          <AnimatePresence>
            {isDragActive && (
              <motion.div
                initial={{ top: '-2px' }}
                animate={{ top: '100%' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                className="absolute left-0 right-0 h-[2px] z-10"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.6), transparent)',
                  boxShadow: '0 0 10px rgba(0, 240, 255, 0.4)',
                }}
              />
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {file ? (
              /* ── File Selected State ────── */
              <motion.div
                key="file-selected"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center gap-3"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0, 255, 102, 0.1), rgba(0, 255, 102, 0.05))',
                    border: '1px solid rgba(0, 255, 102, 0.2)',
                  }}
                >
                  <FileText size={24} className="text-neon-green" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white/80">{file.name}</p>
                  <p className="text-xs text-white/30 mt-0.5">
                    {(file.size / 1024).toFixed(1)} KB • Ready for verification
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  className="flex items-center gap-1 text-xs text-neon-red/60 hover:text-neon-red transition-colors mt-1"
                >
                  <X size={12} /> Remove file
                </button>
              </motion.div>
            ) : isDragActive ? (
              /* ── Drag Active State ──────── */
              <motion.div
                key="drag-active"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3 py-4"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  <Shield size={36} className="text-neon-cyan" />
                </motion.div>
                <p className="text-sm font-semibold text-neon-cyan">
                  Drop to authenticate
                </p>
              </motion.div>
            ) : (
              /* ── Default State ──────────── */
              <motion.div
                key="default"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3 py-4"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01))',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <Upload size={22} className="text-white/30" />
                </div>
                <div>
                  <p className="text-sm text-white/50">
                    <span className="text-white/70 font-medium">Drop a degree PDF</span> or click to browse
                  </p>
                  <p className="text-xs text-white/20 mt-1">
                    PDF files only • Max 50MB
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Submit Button ────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center"
        >
          <NeonButton
            type="submit"
            variant="cyan"
            size="lg"
            disabled={!canSubmit}
            loading={loading}
            icon={<Lock size={18} />}
          >
            Verify Authenticity
          </NeonButton>
        </motion.div>
      </form>
    </motion.div>
  );
}
