import { motion } from 'framer-motion';
import { SearchX, ArrowLeft } from 'lucide-react';
import { GlassCard, GlowingBadge, NeonButton } from '../ui';

interface NotFoundResultProps {
  degreeId: string;
  message: string;
  onReset: () => void;
}

/**
 * NotFoundResult — Displayed when the degree ID is not found on-chain.
 * Distinct from Tampered — this means the degree was never issued, not that it was altered.
 */
export default function NotFoundResult({ degreeId, message, onReset }: NotFoundResultProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="inline-flex mb-5"
        >
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle, rgba(255, 184, 0, 0.12) 0%, rgba(255, 184, 0, 0.02) 70%)',
              border: '2px solid rgba(255, 184, 0, 0.25)',
              boxShadow: '0 0 30px rgba(255, 184, 0, 0.12)',
            }}
          >
            <SearchX size={42} className="text-neon-amber" />
          </div>
        </motion.div>

        <h2 className="text-3xl font-extrabold text-neon-amber mb-2">
          Degree Not Found
        </h2>
        <p className="text-sm text-white/40 max-w-md mx-auto">
          {message || 'No degree record was found on the blockchain with this ID.'}
        </p>
      </div>

      <GlassCard className="p-5 mb-6" hoverGlow={false}>
        <div className="flex items-center gap-2 mb-3">
          <GlowingBadge variant="amber" size="sm">NOT FOUND</GlowingBadge>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/30">Queried Degree ID</span>
            <span className="text-xs font-mono text-neon-amber/70">{degreeId}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/30">On-chain Records</span>
            <span className="text-xs font-mono text-white/40">0 matches</span>
          </div>
        </div>

        <div
          className="mt-4 p-3 rounded-lg"
          style={{
            background: 'rgba(255, 184, 0, 0.03)',
            border: '1px solid rgba(255, 184, 0, 0.1)',
          }}
        >
          <p className="text-[11px] text-neon-amber/60 text-center">
            This may indicate a typo in the Degree ID, or the degree has not yet been registered on the blockchain.
          </p>
        </div>
      </GlassCard>

      <div className="flex justify-center">
        <NeonButton variant="ghost" size="md" onClick={onReset} icon={<ArrowLeft size={16} />}>
          Try Again
        </NeonButton>
      </div>
    </motion.div>
  );
}
