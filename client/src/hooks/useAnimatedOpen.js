import { useEffect, useState } from 'react';

export const DROPDOWN_ANIMATION_MS = 180;
export const MOBILE_NAV_ANIMATION_MS = 240;
/** Dialog backdrop + panel; keep in sync with `.modal-*` transitions in index.css */
export const MODAL_ANIMATION_MS = 420;

/**
 * Keeps the node mounted through the close transition.
 * isShown drives the open visual state (opacity / transform).
 */
export function useAnimatedOpen(open, closeDurationMs = DROPDOWN_ANIMATION_MS) {
  const [shouldRender, setShouldRender] = useState(open);
  const [isShown, setIsShown] = useState(open);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsShown(true));
      });
      return () => cancelAnimationFrame(frame);
    }

    setIsShown(false);
    const timer = window.setTimeout(() => {
      setShouldRender(false);
    }, closeDurationMs);
    return () => window.clearTimeout(timer);
  }, [open, closeDurationMs]);

  return { shouldRender, isShown };
}

/**
 * Modal enter needs a painted closed frame before isShown (especially on mobile).
 */
export function useModalAnimatedOpen(open, closeDurationMs = MODAL_ANIMATION_MS) {
  const [shouldRender, setShouldRender] = useState(open);
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      setIsShown(false);
      const enterTimer = window.setTimeout(() => {
        setIsShown(true);
      }, 16);
      return () => window.clearTimeout(enterTimer);
    }

    setIsShown(false);
    const exitTimer = window.setTimeout(() => {
      setShouldRender(false);
    }, closeDurationMs);
    return () => window.clearTimeout(exitTimer);
  }, [open, closeDurationMs]);

  return { shouldRender, isShown };
}
