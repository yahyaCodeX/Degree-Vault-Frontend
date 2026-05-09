import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Main content area with top padding for fixed navbar */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </motion.main>

      {/* Footer */}
      <footer className="relative py-6 px-4 text-center">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.2), transparent)',
          }}
        />
        <p className="text-xs text-white/20 tracking-widest uppercase">
          Secured by Ethereum Smart Contracts &bull; IPFS Distributed Storage
        </p>
      </footer>
    </div>
  );
}
