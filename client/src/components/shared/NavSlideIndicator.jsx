import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const INDICATOR_INSET_X = 10;
const SLIDE_MS = 380;
const PRIMARY_NAV_SELECTOR = 'a[data-nav-primary]';

function measureLink(root, link) {
  const rootRect = root.getBoundingClientRect();
  const linkRect = link.getBoundingClientRect();
  if (linkRect.width <= 0) return null;
  return {
    left: linkRect.left - rootRect.left + INDICATOR_INSET_X,
    width: Math.max(linkRect.width - INDICATOR_INSET_X * 2, 18),
  };
}

function isPrimaryNavLink(node) {
  return node instanceof HTMLAnchorElement && node.matches(PRIMARY_NAV_SELECTOR);
}

function linkMatchesPath(link, pathname) {
  const href = link.getAttribute('href');
  if (!href) return false;
  const mode = link.dataset.navMatch || 'exact';
  if (mode === 'prefix') {
    return pathname === href || pathname.startsWith(`${href}/`);
  }
  return pathname === href;
}

function resolveActiveNavLink(root, pathname) {
  const matches = [...root.querySelectorAll(PRIMARY_NAV_SELECTOR)].filter((link) =>
    linkMatchesPath(link, pathname),
  );
  if (matches.length === 0) return null;
  matches.sort(
    (a, b) =>
      (b.getAttribute('href')?.length ?? 0) - (a.getAttribute('href')?.length ?? 0),
  );
  return matches[0];
}

/**
 * Sliding underline on hover only; snaps instantly to the active route after navigation.
 */
export default function NavSlideIndicator({ children, className = '' }) {
  const rootRef = useRef(null);
  const ignoreHoverRef = useRef(false);
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [indicator, setIndicator] = useState({ left: 0, width: 0, visible: false });
  const [transitionMs, setTransitionMs] = useState(SLIDE_MS);

  const applyToLink = useCallback((link, { animate = true } = {}) => {
    const root = rootRef.current;
    if (!root || !isPrimaryNavLink(link)) return;

    const geometry = measureLink(root, link);
    if (!geometry) return;

    if (animate) {
      setTransitionMs(SLIDE_MS);
    } else {
      setTransitionMs(0);
    }
    setIndicator({ ...geometry, visible: true });
    if (!animate) {
      requestAnimationFrame(() => setTransitionMs(SLIDE_MS));
    }
  }, []);

  const snapToActive = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;

    const target = resolveActiveNavLink(root, location.pathname);
    if (!target) return;

    applyToLink(target, { animate: false });
  }, [applyToLink, location.pathname]);

  useLayoutEffect(() => {
    ignoreHoverRef.current = true;
    snapToActive();
    const frame = requestAnimationFrame(() => snapToActive());
    return () => cancelAnimationFrame(frame);
  }, [location.pathname, isAuthenticated, user?.role, snapToActive]);

  useEffect(() => {
    const onPointerMove = () => {
      ignoreHoverRef.current = false;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, [location.pathname]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const ro = new ResizeObserver(() => snapToActive());
    ro.observe(root);

    const onResize = () => snapToActive();
    window.addEventListener('resize', onResize);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, [snapToActive]);

  const onPointerOver = (event) => {
    if (ignoreHoverRef.current) return;
    const link = event.target.closest(PRIMARY_NAV_SELECTOR);
    if (link && rootRef.current?.contains(link)) {
      applyToLink(link, { animate: true });
    }
  };

  const onPointerLeave = () => {
    ignoreHoverRef.current = false;
    snapToActive();
  };

  const onBlurCapture = (event) => {
    const root = rootRef.current;
    if (!root) return;
    const next = event.relatedTarget;
    if (next instanceof Node && root.contains(next)) return;
    snapToActive();
  };

  return (
    <div
      ref={rootRef}
      className={`relative h-9 shrink-0 items-center ${className}`}
      onMouseOver={onPointerOver}
      onFocusCapture={onPointerOver}
      onMouseLeave={onPointerLeave}
      onBlurCapture={onBlurCapture}
    >
      <span
        aria-hidden
        className="nav-slide-indicator pointer-events-none absolute -bottom-1.5 left-0 h-0.5 rounded-full bg-accent"
        style={{
          width: indicator.width,
          transform: `translateX(${indicator.left}px)`,
          opacity: indicator.visible ? 1 : 0,
          transitionDuration: `${transitionMs}ms`,
        }}
      />
      {children}
    </div>
  );
}
