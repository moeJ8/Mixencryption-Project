import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, Shield, X } from 'lucide-react';
import Button from '../common/Button';
import ThemeToggle from './ThemeToggle';
import UserMenu from './UserMenu';
import { mobileNavLinkClass, navLinkClass } from './navStyles';
import { MOBILE_NAV_ANIMATION_MS, useAnimatedOpen } from '../../hooks/useAnimatedOpen';
import { useAuth } from '../../context/AuthContext';

function linkClassName(onNavigate, extra = '') {
  return ({ isActive }) => {
    const base = onNavigate ? mobileNavLinkClass({ isActive }) : navLinkClass({ isActive });
    return extra ? `${base} ${extra}` : base;
  };
}

function NavLinks({ onNavigate, className = '' }) {
  const { user, isAuthenticated } = useAuth();
  const itemExtra = onNavigate ? 'mobile-nav-link-item' : '';

  return (
    <div className={className}>
      <NavLink to="/" className={linkClassName(onNavigate, itemExtra)} end onClick={onNavigate}>
        Home
      </NavLink>
      {isAuthenticated ? (
        <>
          <NavLink to="/workspace" className={linkClassName(onNavigate, itemExtra)} onClick={onNavigate}>
            Workspace
          </NavLink>
          <NavLink to="/vault" className={linkClassName(onNavigate, itemExtra)} onClick={onNavigate}>
            Vault
          </NavLink>
          <NavLink to="/benchmarks" className={linkClassName(onNavigate, itemExtra)} onClick={onNavigate}>
            Benchmarks
          </NavLink>
          {user?.role === 'admin' ? (
            <NavLink to="/dashboard" className={linkClassName(onNavigate, itemExtra)} onClick={onNavigate}>
              Dashboard
            </NavLink>
          ) : null}
        </>
      ) : (
        <>
          <NavLink to="/login" className={linkClassName(onNavigate, itemExtra)} onClick={onNavigate}>
            Sign in
          </NavLink>
          {onNavigate ? (
            <Link to="/register" onClick={onNavigate} className="mobile-nav-link-item block pt-1">
              <Button type="button" className="h-10 w-full">
                Create account
              </Button>
            </Link>
          ) : (
            <Link to="/register" className="inline-flex h-9 items-center">
              <Button type="button" className="h-9 px-3 py-0 text-sm">
                Create account
              </Button>
            </Link>
          )}
        </>
      )}
    </div>
  );
}

export default function Navbar() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileMenu = useAnimatedOpen(mobileOpen, MOBILE_NAV_ANIMATION_MS);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) {
      document.body.style.overflow = '';
      return;
    }
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-header/95 backdrop-blur-sm supports-[padding:max(0px)]:pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-3 sm:gap-3 sm:px-4">
        <Link
          to="/"
          className="group flex min-w-0 shrink items-center gap-2 rounded-lg py-1 pr-1 text-sm font-semibold text-foreground transition-colors duration-200 hover:text-accent sm:pr-2"
        >
          <Shield
            className="size-5 shrink-0 text-primary transition-transform duration-200 group-hover:scale-110 group-hover:text-accent"
            aria-hidden
          />
          <span className="truncate sm:max-w-none">MixEncryption</span>
        </Link>

        <nav className="hidden items-center lg:flex" aria-label="Main">
          <NavLinks className="flex flex-wrap items-center gap-1 lg:gap-1.5" />
          {isAuthenticated ? (
            <div
              className="relative z-50 ml-1 flex shrink-0 items-center gap-2 border-l border-border pl-3"
              aria-label="Account and appearance"
            >
              <UserMenu />
              <ThemeToggle />
            </div>
          ) : (
            <div className="ml-1 border-l border-border pl-3">
              <ThemeToggle />
            </div>
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 lg:hidden">
          {isAuthenticated ? <UserMenu /> : null}
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-input text-muted-foreground transition-colors duration-200 hover:bg-surface hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            aria-expanded={mobileOpen}
            aria-controls="mobile-main-nav"
            onClick={() => setMobileOpen((value) => !value)}
          >
            {mobileOpen ? (
              <X className="size-5" aria-hidden />
            ) : (
              <Menu className="size-5" aria-hidden />
            )}
            <span className="sr-only">{mobileOpen ? 'Close menu' : 'Open menu'}</span>
          </button>
        </div>
      </div>

      {mobileMenu.shouldRender ? (
        <>
          <button
            type="button"
            className={`mobile-nav-backdrop fixed inset-0 top-14 z-30 bg-background/80 backdrop-blur-[2px] lg:hidden ${
              mobileMenu.isShown ? 'mobile-nav-backdrop-open' : ''
            }`}
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <nav
            id="mobile-main-nav"
            className={`mobile-nav-panel relative z-40 border-t border-border bg-header px-3 py-3 shadow-lg shadow-black/20 lg:hidden ${
              mobileMenu.isShown ? 'mobile-nav-panel-open' : ''
            }`}
            aria-label="Main mobile"
            aria-hidden={!mobileOpen}
          >
            <NavLinks
              className="flex flex-col gap-1"
              onNavigate={() => setMobileOpen(false)}
            />
          </nav>
        </>
      ) : null}
    </header>
  );
}
