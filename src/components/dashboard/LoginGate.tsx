import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, KeyRound, AlertCircle, ShieldCheck } from 'lucide-react';
import { Button } from '../ui';
import { useAuth } from '../../context/AuthContext';

export default function LoginGate() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    await login(email.trim(), password);
  };

  return (
    <div className="flex items-center justify-center min-h-[65vh] px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md relative"
      >
        {/* Soft Ambient Glow behind Login Card */}
        <div
          className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-teal-brand/12 via-secondary-blue/10 to-teal-brand/12 blur-xl -z-10 opacity-70"
          aria-hidden="true"
        />

        <div
          className="bg-surface-card border border-border-main rounded-2xl p-7 sm:p-9 transition-colors duration-200 relative z-10"
          style={{
            boxShadow: 'var(--shadow-elevated), var(--inset-card-highlight)',
          }}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-surface-teal-subtle to-surface-blue-subtle text-teal-brand border border-teal-brand/25 flex items-center justify-center mx-auto mb-3.5 shadow-sm">
              <ShieldCheck size={26} strokeWidth={2.3} />
            </div>

            <h2 className="text-xl font-bold text-content-main tracking-tight">
              Registrar Portal Access
            </h2>
            <p className="text-xs text-content-secondary mt-1">
              Authorized university administrators only
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-bold uppercase tracking-wider text-content-main mb-1.5"
              >
                Administrative Email
              </label>
              <div className="relative group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-content-muted group-focus-within:text-teal-brand transition-colors pointer-events-none">
                  <Mail size={16} />
                </div>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="registrar@university.edu"
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm
                    bg-surface-page/70 border border-border-main text-content-main placeholder:text-content-muted/70
                    focus-visible:ring-2 focus-visible:ring-teal-brand focus-visible:border-teal-brand focus-visible:bg-surface-card
                    disabled:opacity-50 transition-all duration-150 outline-none shadow-xs"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="login-password"
                className="block text-xs font-bold uppercase tracking-wider text-content-main mb-1.5"
              >
                Password
              </label>
              <div className="relative group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-content-muted group-focus-within:text-teal-brand transition-colors pointer-events-none">
                  <KeyRound size={16} />
                </div>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm
                    bg-surface-page/70 border border-border-main text-content-main placeholder:text-content-muted/70
                    focus-visible:ring-2 focus-visible:ring-teal-brand focus-visible:border-teal-brand focus-visible:bg-surface-card
                    disabled:opacity-50 transition-all duration-150 outline-none shadow-xs"
                />
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2.5 p-3 rounded-xl bg-status-error-bg border border-status-error-border text-status-error-text text-xs shadow-2xs"
              >
                <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                loading={loading}
                disabled={!email.trim() || !password.trim()}
                icon={<Lock size={16} strokeWidth={2.2} />}
              >
                Sign In
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
