import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, KeyRound, AlertCircle, Shield } from 'lucide-react';
import { NeonButton } from '../ui';
import { useAuth } from '../../context/AuthContext';

/**
 * LoginGate — Full-screen authentication wall for the admin dashboard.
 * Shows a glassmorphic login card with email/password fields.
 * On success, the parent component grants access.
 */
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
    <div className="flex items-center justify-center min-h-[75vh]">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div
          className="rounded-3xl p-8 sm:p-10"
          style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.7), rgba(5, 5, 5, 0.85))',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            boxShadow: '0 16px 48px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
              className="inline-flex mb-4"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.1), rgba(168, 85, 247, 0.08))',
                  border: '1px solid rgba(0, 240, 255, 0.2)',
                  boxShadow: '0 0 25px rgba(0, 240, 255, 0.12)',
                }}
              >
                <Shield size={28} className="text-neon-cyan" />
              </div>
            </motion.div>

            <h2 className="text-2xl font-extrabold gradient-text-cyan mb-1">
              Admin Access
            </h2>
            <p className="text-sm text-white/30">
              University registrar credentials required
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                <Mail size={16} className="text-white/20" />
              </div>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@university.edu"
                required
                disabled={loading}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm
                  text-white placeholder-white/20 outline-none
                  transition-all duration-300
                  focus:border-neon-cyan/50
                  disabled:opacity-50"
                style={{
                  background: 'rgba(5, 5, 5, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                <KeyRound size={16} className="text-white/20" />
              </div>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                disabled={loading}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm
                  text-white placeholder-white/20 outline-none
                  transition-all duration-300
                  focus:border-neon-cyan/50
                  disabled:opacity-50"
                style={{
                  background: 'rgba(5, 5, 5, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              />
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl"
                style={{
                  background: 'rgba(255, 0, 60, 0.06)',
                  border: '1px solid rgba(255, 0, 60, 0.15)',
                }}
              >
                <AlertCircle size={14} className="text-neon-red flex-shrink-0" />
                <p className="text-xs text-neon-red/80">{error}</p>
              </motion.div>
            )}

            {/* Submit */}
            <div className="pt-2">
              <NeonButton
                type="submit"
                variant="cyan"
                size="lg"
                loading={loading}
                disabled={!email.trim() || !password.trim()}
                icon={<Lock size={16} />}
                className="w-full"
              >
                Authenticate
              </NeonButton>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
