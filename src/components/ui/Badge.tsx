import type { ReactNode } from 'react';

export interface BadgeProps {
  children: ReactNode;
  variant?: 'teal' | 'success' | 'warning' | 'error' | 'neutral' | 'cyan' | 'green' | 'red' | 'amber' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  pulse?: boolean;
  icon?: ReactNode;
  className?: string;
}

export default function Badge({
  children,
  variant = 'teal',
  size = 'md',
  dot = false,
  pulse = false,
  icon,
  className = '',
}: BadgeProps) {
  // Normalize legacy neon variants
  const normalizedVariant =
    variant === 'cyan' ? 'teal' :
    variant === 'green' ? 'success' :
    variant === 'amber' ? 'warning' :
    variant === 'red' ? 'error' :
    variant === 'purple' ? 'neutral' :
    variant;

  const variantStyles = {
    teal: {
      container: 'bg-surface-teal-subtle text-teal-brand border-teal-brand/25',
      dot: 'bg-teal-brand',
    },
    success: {
      container: 'bg-status-verified-bg text-status-verified-text border-status-verified-border',
      dot: 'bg-status-verified',
    },
    warning: {
      container: 'bg-status-pending-bg text-status-pending-text border-status-pending-border',
      dot: 'bg-status-pending',
    },
    error: {
      container: 'bg-status-error-bg text-status-error-text border-status-error-border',
      dot: 'bg-status-error',
    },
    neutral: {
      container: 'bg-surface-muted text-content-secondary border-border-main',
      dot: 'bg-content-muted',
    },
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  const currentStyle = variantStyles[normalizedVariant];

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full border select-none
        ${currentStyle.container}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {(dot || pulse) && (
        <span className="relative flex h-1.5 w-1.5">
          {pulse && (
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${currentStyle.dot}`}
            />
          )}
          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${currentStyle.dot}`} />
        </span>
      )}
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}

// Keep backward compatible export alias
export { Badge as GlowingBadge };
