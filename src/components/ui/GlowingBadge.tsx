import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface GlowingBadgeProps {
  children: ReactNode;
  variant?: 'cyan' | 'green' | 'red' | 'amber' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  icon?: ReactNode;
  className?: string;
}

const variantStyles = {
  cyan: {
    bg: 'bg-neon-cyan/10',
    border: 'border-neon-cyan/30',
    text: 'text-neon-cyan',
    dot: 'bg-neon-cyan',
    glow: '0 0 8px rgba(0, 240, 255, 0.3)',
  },
  green: {
    bg: 'bg-neon-green/10',
    border: 'border-neon-green/30',
    text: 'text-neon-green',
    dot: 'bg-neon-green',
    glow: '0 0 8px rgba(0, 255, 102, 0.3)',
  },
  red: {
    bg: 'bg-neon-red/10',
    border: 'border-neon-red/30',
    text: 'text-neon-red',
    dot: 'bg-neon-red',
    glow: '0 0 8px rgba(255, 0, 60, 0.3)',
  },
  amber: {
    bg: 'bg-neon-amber/10',
    border: 'border-neon-amber/30',
    text: 'text-neon-amber',
    dot: 'bg-neon-amber',
    glow: '0 0 8px rgba(255, 184, 0, 0.3)',
  },
  purple: {
    bg: 'bg-neon-purple/10',
    border: 'border-neon-purple/30',
    text: 'text-neon-purple',
    dot: 'bg-neon-purple',
    glow: '0 0 8px rgba(168, 85, 247, 0.3)',
  },
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-3 py-1 text-xs',
  lg: 'px-4 py-1.5 text-sm',
};

export default function GlowingBadge({
  children,
  variant = 'cyan',
  size = 'md',
  pulse = false,
  icon,
  className = '',
}: GlowingBadgeProps) {
  const styles = variantStyles[variant];

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`
        inline-flex items-center gap-1.5 font-semibold tracking-wider uppercase
        border rounded-full
        ${styles.bg} ${styles.border} ${styles.text}
        ${sizeStyles[size]}
        ${className}
      `}
      style={{ boxShadow: styles.glow }}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${styles.dot} opacity-50`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${styles.dot}`} />
        </span>
      )}
      {children}
    </motion.span>
  );
}
