import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, FileCheck2, LayoutDashboard, GraduationCap, Menu, X } from 'lucide-react';
import ThemeSwitcher from '../common/ThemeSwitcher';
import { getStats } from '../../services/api';

export default function Navbar() {
  const [totalDegrees, setTotalDegrees] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    const fetchStats = async () => {
      try {
        const stats = await getStats();
        if (mounted && typeof stats?.totalDegreesIssued === 'number') {
          setTotalDegrees(stats.totalDegreesIssued);
        }
      } catch {
        // Public users won't have admin access to stats endpoint; fail silently
        if (mounted) setTotalDegrees(null);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 60000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/' || location.pathname === '/verify';
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { to: '/', label: 'Verify Degree', icon: <FileCheck2 size={16} /> },
    { to: '/student', label: 'Student Vault', icon: <GraduationCap size={16} /> },
    { to: '/admin', label: 'Admin Portal', icon: <LayoutDashboard size={16} /> },
  ];

  return (
    <header className="sticky top-3 z-50 px-4 sm:px-6 lg:px-8 w-full max-w-6xl mx-auto transition-all duration-300">
      <div className="rounded-2xl bg-surface-card/85 backdrop-blur-xl border border-border-main shadow-card transition-colors duration-300 px-4 sm:px-6 py-2.5">
        <div className="flex items-center justify-between h-12">
          {/* ── Brand Logo ─────────────────────────────────── */}
          <Link
            to="/"
            className="flex items-center gap-3 group no-underline focus-visible:ring-2 focus-visible:ring-teal-brand rounded-xl p-1"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-brand/20 via-surface-teal-subtle to-secondary-blue/15 border border-teal-brand/35 flex items-center justify-center text-teal-brand group-hover:scale-105 transition-transform duration-200 shadow-xs">
                <ShieldCheck size={22} strokeWidth={2.3} />
              </div>
              <div className="absolute inset-0 rounded-xl bg-teal-brand/20 blur-md -z-10 opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="flex flex-col">
              <span className="text-base font-extrabold text-content-main tracking-tight leading-tight">
                Degree Vault
              </span>
              <span className="text-[11px] text-content-muted leading-tight font-medium">
                Trusted credential verification
              </span>
            </div>
          </Link>

          {/* ── Desktop Navigation ─────────────────────────── */}
          <nav className="hidden md:flex items-center gap-1.5" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`
                    flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold
                    transition-all duration-200 no-underline select-none
                    ${
                      active
                        ? 'bg-surface-teal-subtle text-teal-brand border border-teal-brand/25 shadow-xs'
                        : 'text-content-secondary hover:text-content-main hover:bg-surface-muted border border-transparent'
                    }
                    focus-visible:ring-2 focus-visible:ring-teal-brand outline-none
                  `}
                >
                  <span className={active ? 'text-teal-brand' : 'text-content-muted'}>
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* ── Right Actions: Theme Switcher & Stats ──────── */}
          <div className="flex items-center gap-3">
            {totalDegrees !== null && (
              <span className="hidden lg:inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-surface-muted text-content-secondary border border-border-subtle shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-status-verified mr-1.5 animate-pulse" />
                {totalDegrees.toLocaleString()} registered
              </span>
            )}

            <div className="hidden sm:block">
              <ThemeSwitcher />
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="md:hidden p-2 rounded-xl text-content-secondary hover:text-content-main hover:bg-surface-muted transition-colors focus-visible:ring-2 focus-visible:ring-teal-brand outline-none"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu Dropdown ────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mt-2 rounded-2xl border border-border-main bg-surface-card/95 backdrop-blur-xl p-4 shadow-elevated space-y-3"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const active = isActive(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`
                      flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold
                      transition-colors no-underline
                      ${
                        active
                          ? 'bg-surface-teal-subtle text-teal-brand border border-teal-brand/20'
                          : 'text-content-secondary hover:text-content-main hover:bg-surface-muted'
                      }
                    `}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-2 border-t border-border-subtle flex items-center justify-between">
              <span className="text-xs text-content-muted font-medium">Appearance</span>
              <ThemeSwitcher />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
