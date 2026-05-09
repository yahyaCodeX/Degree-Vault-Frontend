import { useEffect, useRef } from 'react';

/**
 * HexRain — Subtle matrix-style floating hex characters that drift upward.
 * Uses canvas for performance. Creates a "data-in-motion" cybersecurity feel.
 */
export default function HexRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    const chars = '0123456789ABCDEF';
    const particles: {
      x: number;
      y: number;
      char: string;
      speed: number;
      opacity: number;
      size: number;
      fadeDir: number;
    }[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const createParticle = () => ({
      x: Math.random() * canvas.offsetWidth,
      y: canvas.offsetHeight + 20,
      char: chars[Math.floor(Math.random() * chars.length)],
      speed: 0.3 + Math.random() * 0.8,
      opacity: 0,
      size: 10 + Math.random() * 6,
      fadeDir: 1,
    });

    // Initialize particles
    resize();
    for (let i = 0; i < 35; i++) {
      const p = createParticle();
      p.y = Math.random() * canvas.offsetHeight;
      p.opacity = Math.random() * 0.15;
      particles.push(p);
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      particles.forEach((p, i) => {
        // Move upward
        p.y -= p.speed;

        // Fade in/out
        p.opacity += p.fadeDir * 0.003;
        if (p.opacity >= 0.18) p.fadeDir = -1;
        if (p.opacity <= 0) p.fadeDir = 1;

        // Occasionally change character
        if (Math.random() < 0.02) {
          p.char = chars[Math.floor(Math.random() * chars.length)];
        }

        // Reset when off screen
        if (p.y < -30) {
          particles[i] = createParticle();
        }

        // Draw
        ctx.font = `${p.size}px 'JetBrains Mono', monospace`;
        ctx.fillStyle = `rgba(0, 240, 255, ${Math.max(p.opacity, 0)})`;
        ctx.fillText(p.char, p.x, p.y);
      });

      animFrame = requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
}
