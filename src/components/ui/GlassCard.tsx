import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  elevated?: boolean;
  glowColor?: 'cyan' | 'green' | 'red' | 'none';
  hoverGlow?: boolean;
  className?: string;
}

export default function GlassCard({
  children,
  elevated = false,
  glowColor = 'none',
  hoverGlow = true,
  className = '',
  ...motionProps
}: GlassCardProps) {
  const glowMap = {
    cyan: 'glow-cyan',
    green: 'glow-green',
    red: 'glow-red',
    none: '',
  };

  const hoverGlowMap = {
    cyan: { boxShadow: '0 0 25px rgba(0, 240, 255, 0.4), 0 0 60px rgba(0, 240, 255, 0.15)' },
    green: { boxShadow: '0 0 25px rgba(0, 255, 102, 0.4), 0 0 60px rgba(0, 255, 102, 0.15)' },
    red: { boxShadow: '0 0 25px rgba(255, 0, 60, 0.4), 0 0 60px rgba(255, 0, 60, 0.15)' },
    none: { boxShadow: '0 0 20px rgba(0, 240, 255, 0.15), 0 0 40px rgba(0, 240, 255, 0.05)' },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={hoverGlow ? {
        ...hoverGlowMap[glowColor],
        borderColor: 'rgba(255, 255, 255, 0.15)',
        scale: 1.005,
        transition: { duration: 0.3 },
      } : undefined}
      className={`${elevated ? 'glass-card-elevated' : 'glass-card'} ${glowMap[glowColor]} ${className}`}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}
