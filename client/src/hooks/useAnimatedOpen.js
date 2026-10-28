import { useEffect, useState } from 'react';

export const DROPDOWN_ANIMATION_MS = 180;
export const MOBILE_NAV_ANIMATION_MS = 240;

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
