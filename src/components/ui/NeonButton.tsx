import { motion } from 'framer-motion';
import type { ReactNode, ButtonHTMLAttributes } from 'react';

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'cyan' | 'green' | 'red' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
}

const variantStyles = {
  cyan: {
    base: 'bg-neon-cyan/10 border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/20 hover:border-neon-cyan/70',
    glow: '0 0 20px rgba(0, 240, 255, 0.4), 0 0 50px rgba(0, 240, 255, 0.15)',
    shadow: '0 0 10px rgba(0, 240, 255, 0.2)',
  },
  green: {
    base: 'bg-neon-green/10 border-neon-green/40 text-neon-green hover:bg-neon-green/20 hover:border-neon-green/70',
    glow: '0 0 20px rgba(0, 255, 102, 0.4), 0 0 50px rgba(0, 255, 102, 0.15)',
    shadow: '0 0 10px rgba(0, 255, 102, 0.2)',
  },
  red: {
    base: 'bg-neon-red/10 border-neon-red/40 text-neon-red hover:bg-neon-red/20 hover:border-neon-red/70',
    glow: '0 0 20px rgba(255, 0, 60, 0.4), 0 0 50px rgba(255, 0, 60, 0.15)',
    shadow: '0 0 10px rgba(255, 0, 60, 0.2)',
  },
  ghost: {
    base: 'bg-transparent border-white/10 text-white/70 hover:bg-white/5 hover:text-white hover:border-white/20',
    glow: 'none',
    shadow: 'none',
  },
};

const sizeStyles = {
  sm: 'px-4 py-2 text-xs gap-1.5',
  md: 'px-6 py-3 text-sm gap-2',
  lg: 'px-8 py-4 text-base gap-2.5',
};

export default function NeonButton({
  children,
  variant = 'cyan',
  size = 'md',
  loading = false,
  icon,
  className = '',
  disabled,
  ...props
}: NeonButtonProps) {
  const styles = variantStyles[variant];

  return (
    <motion.button
      whileHover={!disabled && !loading ? {
        boxShadow: styles.glow,
        scale: 1.02,
      } : undefined}
      whileTap={!disabled && !loading ? { scale: 0.98 } : undefined}
      transition={{ duration: 0.2 }}
      className={`
        relative inline-flex items-center justify-center font-semibold tracking-wide
        border rounded-xl cursor-pointer
        transition-colors duration-300 ease-out
        disabled:opacity-40 disabled:cursor-not-allowed
        ${styles.base} ${sizeStyles[size]} ${className}
      `}
      disabled={disabled || loading}
      style={{ boxShadow: styles.shadow }}
      {...(props as any)}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </span>
      )}
      <span className={`inline-flex items-center ${sizeStyles[size].split(' ').pop()} ${loading ? 'invisible' : ''}`}>
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </span>
    </motion.button>
  );
}
