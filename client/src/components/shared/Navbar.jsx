import { useCallback, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, Shield, X } from "lucide-react";
import Button from "../common/Button";
import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";
import NavSlideIndicator from "./NavSlideIndicator";
import { mobileNavLinkClass, navLinkClass } from "./navStyles";
import {
  MOBILE_NAV_ANIMATION_MS,
  useAnimatedOpen,
} from "../../hooks/useAnimatedOpen";
import { useAuth } from "../../context/AuthContext";
import ApiStatusIndicator from "./ApiStatusIndicator";

function linkClassName(onNavigate, extra = "") {
  return ({ isActive }) => {
    const base = onNavigate
      ? mobileNavLinkClass({ isActive })
      : navLinkClass({ isActive });
    return extra ? `${base} ${extra}` : base;
  };
}

function NavLinks({ onNavigate, className = "" }) {
  const { user, isAuthenticated } = useAuth();
  const itemExtra = onNavigate ? "mobile-nav-link-item" : "";
  const primaryNav = onNavigate ? {} : { "data-nav-primary": "" };

  return (
    <div className={className}>
      <NavLink
        {...primaryNav}
        to="/"
        className={linkClassName(onNavigate, itemExtra)}
        end
        onClick={onNavigate}
      >
        Home
      </NavLink>
      <NavLink
        {...primaryNav}
        to="/lab"
        className={linkClassName(onNavigate, itemExtra)}
        onClick={onNavigate}
      >
        Crypto lab
      </NavLink>
      {isAuthenticated ? (
        <>
          <NavLink
            {...primaryNav}
            to="/workspace"
            className={linkClassName(onNavigate, itemExtra)}
            onClick={onNavigate}
          >
            Workspace
          </NavLink>
          <NavLink
            {...primaryNav}
            to="/vault"
            className={linkClassName(onNavigate, itemExtra)}
            onClick={onNavigate}
          >
            Vault
          </NavLink>
          <NavLink
            {...primaryNav}
            to="/benchmarks"
            className={linkClassName(onNavigate, itemExtra)}
            onClick={onNavigate}
          >
            Benchmarks
          </NavLink>
        </>
      ) : null}
      <NavLink
        {...primaryNav}
        data-nav-match="prefix"
        to="/docs"
        end={false}
        className={linkClassName(onNavigate, itemExtra)}
        onClick={onNavigate}
      >
        Docs
      </NavLink>
      {isAuthenticated ? (
        <>
          {user?.role === "admin" ? (
            <NavLink
              {...primaryNav}
              to="/dashboard"
              className={linkClassName(onNavigate, itemExtra)}
              onClick={onNavigate}
            >
              Dashboard
            </NavLink>
          ) : null}
        </>
      ) : (
        <>
          <NavLink
            {...primaryNav}
            to="/login"
            className={linkClassName(onNavigate, itemExtra)}
            onClick={onNavigate}
          >
            Sign in
          </NavLink>
          {onNavigate ? (
            <Link
              to="/register"
              onClick={onNavigate}
              className="mobile-nav-link-item block pt-1"
            >
              <Button type="button" fullWidth className="h-10">
                Create account
              </Button>
            </Link>
          ) : (
            <Link to="/register" className="inline-flex h-9 cursor-pointer items-center">
              <Button type="button" size="sm">
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
  const mobileMenuToggleRef = useRef(null);
  const mobileMenu = useAnimatedOpen(mobileOpen, MOBILE_NAV_ANIMATION_MS);

  const closeMobileMenu = useCallback(() => {
    const panel = document.getElementById("mobile-main-nav");
    const active = document.activeElement;
    if (
      panel &&
      active instanceof Node &&
      panel.contains(active) &&
      mobileMenuToggleRef.current
    ) {
      mobileMenuToggleRef.current.focus({ preventScroll: true });
    }
    setMobileOpen(false);
  }, []);

  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname, closeMobileMenu]);

  useEffect(() => {
    if (!mobileOpen) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return undefined;

    const onPointerDown = (event) => {
      const target = event.target;
      if (!(target instanceof Node)) return;

      const panel = document.getElementById("mobile-main-nav");
      if (panel?.contains(target)) return;
      if (mobileMenuToggleRef.current?.contains(target)) return;

      closeMobileMenu();
    };

    const onScroll = () => closeMobileMenu();

    const onWheel = (event) => {
      const panel = document.getElementById("mobile-main-nav");
      if (panel?.contains(event.target)) return;
      closeMobileMenu();
    };

    const onTouchMove = (event) => {
      const panel = document.getElementById("mobile-main-nav");
      if (panel?.contains(event.target)) return;
      closeMobileMenu();
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("scroll", onScroll, { capture: true, passive: true });
    document.addEventListener("scroll", onScroll, { capture: true, passive: true });
    window.addEventListener("wheel", onWheel, { capture: true, passive: true });
    window.addEventListener("touchmove", onTouchMove, { capture: true, passive: true });

    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("scroll", onScroll, true);
      document.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("wheel", onWheel, true);
      window.removeEventListener("touchmove", onTouchMove, true);
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-header/95 backdrop-blur-sm supports-[padding:max(0px)]:pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-3 sm:gap-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
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
          <ApiStatusIndicator variant="pill" className="hidden min-w-0 md:flex" />
        </div>

        <nav className="hidden h-14 items-center lg:flex" aria-label="Main">
          <NavSlideIndicator className="flex flex-wrap items-center gap-0.5 lg:gap-1">
            <NavLinks className="contents" />
          </NavSlideIndicator>
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
          <ApiStatusIndicator variant="compact" className="md:hidden" />
          {isAuthenticated ? <UserMenu /> : null}
          <ThemeToggle />
          <Button
            ref={mobileMenuToggleRef}
            type="button"
            id="mobile-menu-toggle"
            variant="chrome"
            size="icon"
            active={mobileOpen}
            aria-expanded={mobileOpen}
            aria-controls="mobile-main-nav"
            onClick={() => setMobileOpen((value) => !value)}
            className="focus-visible:ring-offset-header lg:hidden"
          >
            {mobileOpen ? (
              <X className="size-5" aria-hidden />
            ) : (
              <Menu className="size-5" aria-hidden />
            )}
            <span className="sr-only">
              {mobileOpen ? "Close menu" : "Open menu"}
            </span>
          </Button>
        </div>
      </div>

      {mobileMenu.shouldRender ? (
        <>
          <button
            type="button"
            className={`mobile-nav-backdrop fixed inset-0 top-14 z-30 bg-background/80 backdrop-blur-[2px] lg:hidden ${
              mobileMenu.isShown ? "mobile-nav-backdrop-open" : ""
            }`}
            aria-label="Close menu"
            onClick={closeMobileMenu}
          />
          <nav
            id="mobile-main-nav"
            className={`mobile-nav-panel relative z-40 border-t border-border bg-header px-3 py-3 shadow-flyout lg:hidden ${
              mobileMenu.isShown ? "mobile-nav-panel-open" : ""
            }`}
            aria-label="Main mobile"
            inert={!mobileOpen}
          >
            <ApiStatusIndicator variant="menu" className="mb-3 md:hidden" />
            <NavLinks
              className="flex flex-col divide-y divide-border overflow-hidden rounded-lg border border-border"
              onNavigate={closeMobileMenu}
            />
          </nav>
        </>
      ) : null}
    </header>
  );
}
