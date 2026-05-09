import { motion } from 'framer-motion';

/**
 * FloatingParticles — Animated glowing orbs that float around the page.
 * Creates a "digital atmosphere" with subtle depth and motion.
 */
export default function FloatingParticles() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 4,
    duration: 8 + Math.random() * 12,
    delay: Math.random() * 5,
    color: i % 3 === 0
      ? 'rgba(0, 240, 255, VAR)'
      : i % 3 === 1
        ? 'rgba(0, 255, 102, VAR)'
        : 'rgba(168, 85, 247, VAR)',
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            x: `${p.x}vw`,
            y: `${p.y}%`,
            opacity: 0,
          }}
          animate={{
            x: [`${p.x}vw`, `${p.x + (Math.random() - 0.5) * 20}vw`, `${p.x}vw`],
            y: [`${p.y}%`, `${p.y - 15 - Math.random() * 20}%`, `${p.y}%`],
            opacity: [0, 0.4, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            background: p.color.replace('VAR', '0.6'),
            boxShadow: `0 0 ${p.size * 3}px ${p.color.replace('VAR', '0.3')}, 0 0 ${p.size * 6}px ${p.color.replace('VAR', '0.1')}`,
          }}
        />
      ))}
    </div>
  );
}
