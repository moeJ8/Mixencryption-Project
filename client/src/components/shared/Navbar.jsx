import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link
          to="/"
          className="flex items-center gap-2 font-semibold text-slate-100"
        >
          <Shield className="size-5 text-cyan-400" aria-hidden />
          MixEncryption
        </Link>
        <nav className="text-sm text-slate-400">Phase 1 — UI scaffold</nav>
      </div>
    </header>
  );
}
