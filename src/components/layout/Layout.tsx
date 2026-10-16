import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-page text-content-main transition-colors duration-300 relative overflow-hidden">
      {/* ── Background Layer 1 & 2: Atmospheric Lighting Meshes ── */}
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        aria-hidden="true"
      >
        {/* Top-center ambient teal glow */}
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[480px] rounded-full blur-[120px] opacity-70 transition-opacity duration-300"
          style={{
            background:
              'radial-gradient(circle, var(--primary-teal) 0%, rgba(37, 99, 235, 0.4) 50%, transparent 75%)',
            opacity: 'var(--glow-opacity, 0.08)',
          }}
        />

        {/* Top-right secondary blue glow */}
        <div
          className="absolute -top-20 -right-20 w-[540px] h-[420px] rounded-full blur-[100px] transition-opacity duration-300"
          style={{
            background:
              'radial-gradient(circle, var(--secondary-blue) 0%, transparent 70%)',
            opacity: '0.07',
          }}
        />

        {/* Subtle mid-page accent glow */}
        <div
          className="absolute top-[40%] -left-32 w-[500px] h-[400px] rounded-full blur-[110px] transition-opacity duration-300"
          style={{
            background:
              'radial-gradient(circle, var(--accent-violet) 0%, transparent 65%)',
            opacity: '0.04',
          }}
        />

        {/* ── Background Layer 3: Faint Geometric Dot Pattern ── */}
        <div
          className="absolute inset-0 opacity-100"
          style={{
            backgroundImage:
              'radial-gradient(var(--pattern-dot-color) 1.2px, transparent 1.2px)',
            backgroundSize: '28px 28px',
            maskImage:
              'linear-gradient(to bottom, black 25%, rgba(0, 0, 0, 0.4) 65%, transparent 95%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, black 25%, rgba(0, 0, 0, 0.4) 65%, transparent 95%)',
          }}
        />
      </div>

      {/* ── Navigation ── */}
      <Navbar />

      {/* ── Main Content Area ── */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-1 py-10 px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </motion.main>

      {/* ── Trust-Centered Footer ──────────────────────────── */}
      <footer className="border-t border-border-main bg-surface-card/80 backdrop-blur-md py-8 px-4 sm:px-6 lg:px-8 mt-auto relative z-10 transition-colors duration-200">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-content-secondary">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-surface-teal-subtle text-teal-brand flex items-center justify-center border border-teal-brand/20 shadow-xs">
              <ShieldCheck size={14} strokeWidth={2.2} />
            </div>
            <span className="font-semibold text-content-main">Degree Vault</span>
            <span className="text-content-muted">•</span>
            <span className="text-content-secondary">Tamper-Proof Academic Credential Verification</span>
          </div>

          <div className="flex items-center gap-6 text-content-muted">
            <span className="hover:text-content-secondary transition-colors">Blockchain Registry</span>
            <span className="hover:text-content-secondary transition-colors">IPFS Distributed Storage</span>
            <span className="hover:text-content-secondary transition-colors">Cryptographic Proof</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
