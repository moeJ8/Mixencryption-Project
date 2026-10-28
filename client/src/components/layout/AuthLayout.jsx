import { Link, Outlet } from 'react-router-dom';
import { Shield } from 'lucide-react';
import Footer from '../shared/Footer';
import ThemeToggle from '../shared/ThemeToggle';

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-header/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-3 sm:px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold text-foreground">
            <Shield className="size-5 text-primary" aria-hidden />
            MixEncryption
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-3 py-8 sm:px-4 sm:py-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
