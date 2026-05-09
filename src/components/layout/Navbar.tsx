import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Blocks, Menu, X, Activity } from 'lucide-react';
import { GlowingBadge } from '../ui';
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
        if (mounted) setTotalDegrees(stats.totalDegreesIssued);
      } catch {
        // Stats endpoint requires admin auth — silently fail for public pages
        if (mounted) setTotalDegrees(null);
      }
    };
    fetchStats();
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { to: '/', label: 'Verify', icon: <Shield size={16} /> },
    { to: '/admin', label: 'Dashboard', icon: <Blocks size={16} /> },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="mt-3 flex items-center justify-between rounded-2xl px-5 py-3"
          style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.75), rgba(5, 5, 5, 0.85))',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          }}
        >
          {/* ── Logo ─────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-3 group no-underline">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400 }}
              className="relative"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.15), rgba(0, 255, 102, 0.1))',
                  border: '1px solid rgba(0, 240, 255, 0.3)',
                  boxShadow: '0 0 12px rgba(0, 240, 255, 0.2)',
                }}
              >
                <Shield size={18} className="text-neon-cyan" />
              </div>
            </motion.div>
            <div className="hidden sm:block">
              <span className="text-sm font-bold tracking-wide gradient-text-cyan">
                DEGREE VAULT
              </span>
              <p className="text-[10px] text-white/30 tracking-widest uppercase -mt-0.5">
                Blockchain Verified
              </p>
            </div>
          </Link>

          {/* ── Desktop Nav Links ────────────────────── */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                  transition-all duration-300 no-underline
                  ${isActive(link.to)
                    ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/5 border border-transparent'
                  }
                `}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>

          {/* ── Stats Badge + Mobile Toggle ──────────── */}
          <div className="flex items-center gap-3">
            {totalDegrees !== null && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <GlowingBadge variant="green" size="sm" pulse icon={<Activity size={12} />}>
                  {totalDegrees.toLocaleString()} Issued
                </GlowingBadge>
              </motion.div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-white/50 hover:text-white/80 transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ────────────────────────────── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-2 rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(5, 5, 5, 0.95))',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <div className="p-3 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                      transition-all duration-300 no-underline
                      ${isActive(link.to)
                        ? 'bg-neon-cyan/10 text-neon-cyan'
                        : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                      }
                    `}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
