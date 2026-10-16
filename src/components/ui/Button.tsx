import { motion } from 'framer-motion';
import type { ReactNode, ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'cyan' | 'green' | 'red';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  // Normalize legacy neon variants
  const normalizedVariant =
    variant === 'cyan' ? 'primary' :
    variant === 'green' ? 'secondary' :
    variant === 'red' ? 'danger' :
    variant;

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-teal-brand to-[#0F766E] dark:from-teal-brand dark:to-[#14B8A6] text-white dark:text-[#080F1D] font-bold shadow-[var(--shadow-button-primary)] hover:shadow-[var(--shadow-button-primary-hover)] hover:-translate-y-0.5 active:translate-y-0 border border-teal-brand/30',
    secondary:
      'bg-surface-teal-subtle text-teal-brand hover:bg-teal-brand/15 border border-teal-brand/25 font-semibold shadow-xs hover:-translate-y-0.5 active:translate-y-0',
    outline:
      'bg-surface-card/60 backdrop-blur-sm border border-border-main text-content-main hover:bg-surface-muted hover:border-border-hover shadow-xs hover:-translate-y-0.5 active:translate-y-0 font-semibold',
    ghost:
      'bg-transparent border border-transparent text-content-secondary hover:text-content-main hover:bg-surface-muted font-medium',
    danger:
      'bg-status-error text-white hover:opacity-95 border border-transparent font-semibold shadow-sm hover:-translate-y-0.5 active:translate-y-0',
  };

  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-xs rounded-xl gap-1.5 min-h-[36px]',
    md: 'px-5 py-2.5 text-sm rounded-xl gap-2 min-h-[42px]',
    lg: 'px-6 py-3.5 text-base rounded-xl gap-2.5 min-h-[48px]',
  };

  return (
    <motion.button
      whileTap={!disabled && !loading ? { scale: 0.985 } : undefined}
      transition={{ duration: 0.15 }}
      className={`
        relative inline-flex items-center justify-center font-medium
        transition-all duration-200 ease-out cursor-pointer select-none
        disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:transform-none
        focus-visible:ring-2 focus-visible:ring-teal-brand focus-visible:outline-none
        ${variantStyles[normalizedVariant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...(props as any)}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <Loader2 size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} className="animate-spin text-current" />
          <span>{children}</span>
        </span>
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </motion.button>
  );
}

// Keep backward compatible export alias
export { Button as NeonButton };
