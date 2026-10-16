import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

export interface CardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  elevated?: boolean;
  variant?: 'default' | 'elevated' | 'subtle' | 'teal';
  hoverEffect?: boolean;
  className?: string;
  glowColor?: 'cyan' | 'green' | 'red' | 'none';
  hoverGlow?: boolean;
}

export default function Card({
  children,
  elevated = false,
  variant,
  hoverEffect = false,
  glowColor = 'none',
  hoverGlow,
  className = '',
  ...motionProps
}: CardProps) {
  const resolvedVariant = variant || (elevated ? 'elevated' : 'default');

  const variantStyles = {
    default: 'bg-surface-card border-border-main',
    elevated: 'bg-surface-elevated border-border-main',
    subtle: 'bg-surface-subtle border-border-subtle',
    teal: 'bg-surface-teal-subtle border-teal-brand/25',
  };

  const statusBorderStyles = {
    green: 'border-status-verified-border',
    red: 'border-status-error-border',
    cyan: 'border-teal-brand/40',
    none: '',
  };

  const shouldHover = hoverEffect || hoverGlow === true;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        boxShadow:
          resolvedVariant === 'elevated'
            ? 'var(--shadow-elevated), var(--inset-card-highlight)'
            : 'var(--shadow-card), var(--inset-card-highlight)',
      }}
      whileHover={
        shouldHover
          ? {
              y: -2.5,
              borderColor: 'var(--border-hover)',
              boxShadow: 'var(--shadow-card-hover), var(--inset-card-highlight)',
              transition: { duration: 0.2 },
            }
          : undefined
      }
      className={`
        border rounded-2xl p-6 transition-all duration-200
        ${variantStyles[resolvedVariant]}
        ${statusBorderStyles[glowColor]}
        ${className}
      `}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}

// Keep backward compatible export alias
export { Card as GlassCard };
