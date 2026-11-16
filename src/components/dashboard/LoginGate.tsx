import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginGate() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    await login(email.trim(), password);
  };

  return (
    <div className="flex items-center justify-center min-h-[75vh] px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md relative"
      >
        {/* Soft Ambient Glow behind Login Card */}
        <div
          className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-teal-brand/20 via-secondary-blue/15 to-purple-500/10 blur-2xl -z-10 opacity-70"
          aria-hidden="true"
        />

        <div className="bg-surface-card border border-border-main rounded-3xl p-7 sm:p-9 shadow-elevated relative z-10">
          {/* Header */}
          <div className="text-center mb-7">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-brand">Registrar access</p>
            <h1 className="font-display text-4xl font-semibold text-content-main tracking-tight mt-3">
              Issue &amp; manage <em className="italic text-teal-brand">degrees.</em>
            </h1>
            <p className="text-xs text-content-secondary mt-1.5 max-w-xs mx-auto leading-relaxed">
              Authorized sign-in for university registrars, credential issuing officers, and ledger auditors.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-bold uppercase tracking-wider text-content-muted mb-1.5 ml-0.5"
              >
                Administrative Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. admin@muet.edu.pk"
                required
                disabled={loading}
                className="w-full px-3.5 h-11 rounded-xl text-sm font-semibold
                  bg-surface-page/70 border border-border-main text-content-main placeholder:text-content-muted/60
                  focus-visible:ring-2 focus-visible:ring-teal-brand/40 focus-visible:border-teal-brand focus-visible:bg-surface-card
                  disabled:opacity-50 transition-all outline-none shadow-xs"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5 ml-0.5">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-bold uppercase tracking-wider text-content-muted"
                >
                  Password
                </label>
                <span className="text-[10px] text-teal-brand font-medium">
                  Confidential
                </span>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  disabled={loading}
                  className="w-full px-3.5 pr-11 h-11 rounded-xl text-sm font-semibold
                    bg-surface-page/70 border border-border-main text-content-main placeholder:text-content-muted/60
                    focus-visible:ring-2 focus-visible:ring-teal-brand/40 focus-visible:border-teal-brand focus-visible:bg-surface-card
                    disabled:opacity-50 transition-all outline-none shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted hover:text-content-main transition-colors p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                role="alert"
                className="p-3 rounded-xl bg-status-error-bg border border-status-error-border text-status-error-text text-xs shadow-xs"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || !email.trim() || !password.trim()}
                className="w-full h-11 rounded-xl bg-teal-brand hover:bg-teal-brand/90 text-content-inverse font-bold text-sm flex items-center justify-center gap-2 shadow-button-primary hover:shadow-button-primary-hover transition-all duration-200 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw size={15} className="animate-spin" />
                    <span>Authenticating Registrar...</span>
                  </span>
                ) : (
                  <span>Sign In as Administrator</span>
                )}
              </button>
            </div>
          </form>

          {/* Minimal security note */}
          <p className="mt-6 text-center text-[11px] text-content-muted">
            Authorized access only • All administrative actions are cryptographically signed.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
