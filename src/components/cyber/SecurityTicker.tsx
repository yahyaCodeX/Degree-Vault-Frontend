import { motion } from 'framer-motion';

const PROTOCOL_LINES = [
  'SHA-256 HASH VERIFICATION ENGINE ONLINE',
  '◆ ETHEREUM MAINNET CONNECTED',
  'IPFS DISTRIBUTED STORAGE ACTIVE',
  '◆ ZERO-KNOWLEDGE PROOF LAYER INITIALIZED',
  'BLOCKCHAIN CONSENSUS: VERIFIED',
  '◆ SMART CONTRACT ABI LOADED',
  'CRYPTOGRAPHIC SEAL: INTACT',
  '◆ DECENTRALIZED NODE SYNC: 100%',
  'TAMPER DETECTION PROTOCOL: ARMED',
  '◆ DIGITAL SIGNATURE VALIDATION: READY',
  'WEB3 GATEWAY: OPERATIONAL',
  '◆ ON-CHAIN INTEGRITY CHECK: ENABLED',
];

/**
 * SecurityTicker — A scrolling marquee of cybersecurity protocol messages.
 * Creates a "mission control" / military-grade UI feel.
 */
export default function SecurityTicker() {
  const text = PROTOCOL_LINES.join('     ●     ');
  // Duplicate for seamless loop
  const fullText = `${text}     ●     ${text}`;

  return (
    <div className="relative w-full overflow-hidden py-3" style={{ maskImage: 'linear-gradient(90deg, transparent, black 10%, black 90%, transparent)' }}>
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        className="whitespace-nowrap"
      >
        <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-neon-cyan/15">
          {fullText}
        </span>
      </motion.div>
    </div>
  );
}
