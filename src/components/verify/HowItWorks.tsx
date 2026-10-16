import { Building2, Cpu, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Enter University Code & Roll Number',
      description: "Provide the issuing university's short code (e.g. MUET, NUST) and the student roll number. No document upload needed.",
      icon: <Building2 size={20} className="text-teal-brand" strokeWidth={2.2} />,
      color: 'from-teal-brand/15 to-secondary-blue/10',
    },
    {
      number: '02',
      title: 'On-chain hash recomputation',
      description: 'The system recomputes the deterministic SHA-256 credential hash from on-chain fields and compares it with the registered record.',
      icon: <Cpu size={20} className="text-secondary-blue" strokeWidth={2.2} />,
      color: 'from-secondary-blue/15 to-teal-brand/10',
    },
    {
      number: '03',
      title: 'View verification result',
      description: 'Instantly see whether the credential is authentic, tampered, or unregistered — backed by the immutable blockchain registry.',
      icon: <CheckCircle size={20} className="text-status-verified" strokeWidth={2.2} />,
      color: 'from-status-verified/15 to-teal-brand/10',
    },
  ];

  return (
    <section aria-labelledby="how-it-works-heading" className="w-full max-w-4xl mx-auto mt-20 pt-12 border-t border-border-main">
      <div className="text-center mb-10">
        <h2 id="how-it-works-heading" className="text-2xl font-extrabold text-content-main tracking-tight">
          How verification works
        </h2>
        <p className="text-xs sm:text-sm text-content-secondary mt-1.5 max-w-md mx-auto">
          Tamper-proof academic credential validation in three simple steps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step, idx) => (
          <motion.div
            key={step.number}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="group relative flex flex-col p-6 rounded-2xl bg-surface-card border border-border-main hover:border-border-hover transition-all duration-200"
            style={{
              boxShadow: 'var(--shadow-card), var(--inset-card-highlight)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${step.color} border border-border-subtle flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-200`}>
                {step.icon}
              </div>
              <span className="font-mono text-xs font-bold text-content-muted group-hover:text-teal-brand transition-colors">
                {step.number}
              </span>
            </div>

            <h3 className="text-sm font-bold text-content-main mb-1.5 tracking-tight">
              {step.title}
            </h3>
            <p className="text-xs text-content-secondary leading-relaxed">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
