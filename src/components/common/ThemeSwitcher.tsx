import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme, type Theme } from '../../context/ThemeContext';

interface ThemeSwitcherProps {
  className?: string;
}

export default function ThemeSwitcher({ className = '' }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();

  const options: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Light', icon: <Sun size={13} strokeWidth={2.2} /> },
    { value: 'dark', label: 'Dark', icon: <Moon size={13} strokeWidth={2.2} /> },
    { value: 'system', label: 'System', icon: <Monitor size={13} strokeWidth={2.2} /> },
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Color theme selection"
      className={`inline-flex items-center p-1 rounded-xl bg-surface-muted/80 backdrop-blur-md border border-border-main/80 shadow-xs ${className}`}
    >
      {options.map((opt) => {
        const isSelected = theme === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={`${opt.label} theme`}
            onClick={() => setTheme(opt.value)}
            className={`
              relative flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold
              transition-colors duration-200 cursor-pointer select-none
              ${
                isSelected
                  ? 'text-teal-brand'
                  : 'text-content-secondary hover:text-content-main'
              }
              focus-visible:ring-2 focus-visible:ring-teal-brand outline-none
            `}
          >
            {isSelected && (
              <motion.div
                layoutId="activeThemePill"
                className="absolute inset-0 bg-surface-card rounded-lg shadow-sm border border-border-subtle"
                transition={{ type: 'spring', stiffness: 500, damping: 32 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {opt.icon}
              <span className="hidden sm:inline">{opt.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
