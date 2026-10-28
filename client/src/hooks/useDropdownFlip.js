import { useCallback, useLayoutEffect, useRef, useState } from 'react';

/** Above Modal (z-100). */
export const PORTAL_MENU_Z = 110;

const HEADER_OFFSET = 64;
const MENU_GAP = 4;

function getScrollParents(node) {
  const parents = [];
  if (!node) return [window];

  let el = node.parentElement;
  while (el && el !== document.body) {
    const style = window.getComputedStyle(el);
    const overflow = `${style.overflow} ${style.overflowX} ${style.overflowY}`;
    if (/(auto|scroll|overlay)/.test(overflow)) {
      parents.push(el);
    }
    el = el.parentElement;
  }

  parents.push(window);
  return parents;
}

function shouldPortalMenu(triggerEl) {
  if (!triggerEl) return false;

  let el = triggerEl.parentElement;
  while (el && el !== document.body) {
    const style = window.getComputedStyle(el);
    const overflow = `${style.overflow} ${style.overflowX} ${style.overflowY}`;
    if (/(hidden|clip)/.test(overflow)) {
      return true;
    }
    if (
      style.transform !== 'none' ||
      style.perspective !== 'none' ||
      (style.filter && style.filter !== 'none') ||
      style.contain === 'paint' ||
      style.contain === 'strict' ||
      style.contain === 'content'
    ) {
      return true;
    }
    el = el.parentElement;
  }

  return false;
}

function estimateMenuHeight({
  optionCount = 0,
  itemHeight = 36,
  extraChrome = 8,
  maxMenuHeight = 192,
}) {
  if (optionCount === 0) return 48;
  return Math.min(optionCount * itemHeight + extraChrome, maxMenuHeight);
}

function resolveMenuHeight(menuRef, estimateOpts) {
  const measured = menuRef?.current?.offsetHeight;
  if (measured && measured > 0) return measured;
  return estimateMenuHeight(estimateOpts);
}

function getDropdownBoundaries(triggerEl) {
  const dialog = triggerEl?.closest?.('[role="dialog"]');
  if (!dialog) {
    return { footerTop: null, bodyTop: null };
  }

  const footer = dialog.querySelector('[data-modal-footer]');
  const body = dialog.querySelector('[data-modal-body]');

  return {
    footerTop: footer?.getBoundingClientRect().top ?? null,
    bodyTop: body?.getBoundingClientRect().top ?? null,
  };
}

function computeOpenUpward(triggerEl, menuHeight, { headerOffset = HEADER_OFFSET, gap = MENU_GAP } = {}) {
  const rect = triggerEl.getBoundingClientRect();
  const { footerTop, bodyTop } = getDropdownBoundaries(triggerEl);

  let spaceBelow = window.innerHeight - rect.bottom - gap;
  if (footerTop != null) {
    spaceBelow = Math.min(spaceBelow, Math.max(0, footerTop - rect.bottom - gap));
  }

  let spaceAbove = rect.top - headerOffset - gap;
  if (bodyTop != null) {
    spaceAbove = Math.min(spaceAbove, Math.max(0, rect.top - bodyTop - gap));
  }

  const fitsBelow = spaceBelow >= menuHeight;
  const fitsAbove = spaceAbove >= menuHeight;

  if (fitsBelow) return false;
  if (fitsAbove) return true;

  return spaceAbove > spaceBelow && spaceAbove >= 72;
}

function computePortalStyle(triggerEl, openUpward, { gap = MENU_GAP } = {}) {
  const rect = triggerEl.getBoundingClientRect();
  return {
    position: 'fixed',
    top: openUpward ? rect.top - gap : rect.bottom + gap,
    left: rect.left,
    width: rect.width,
    transform: openUpward ? 'translateY(-100%)' : undefined,
    zIndex: PORTAL_MENU_Z,
  };
}

export function dropdownMenuPositionClass(openUpward) {
  return openUpward ? 'bottom-full mb-1' : 'top-full mt-1';
}

/**
 * Flip dropdown above/below the trigger; portal when inside clipping containers (modals).
 */
export function useDropdownFlip(
  triggerRef,
  isOpen,
  {
    menuRef,
    optionCount = 0,
    itemHeight = 36,
    extraChrome = 8,
    maxMenuHeight = 192,
    headerOffset = HEADER_OFFSET,
    portalMenu = false,
  } = {},
) {
  const [openUpward, setOpenUpward] = useState(false);
  const [shouldPortal, setShouldPortal] = useState(false);
  const [portalStyle, setPortalStyle] = useState(null);
  const [isPositioned, setIsPositioned] = useState(false);
  const rafRef = useRef(null);

  const updateFlip = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;

    const menuHeight = resolveMenuHeight(menuRef, {
      optionCount,
      itemHeight,
      extraChrome,
      maxMenuHeight,
    });
    const upward = computeOpenUpward(el, menuHeight, { headerOffset });
    const portal = portalMenu || shouldPortalMenu(el);

    setShouldPortal(portal);
    setOpenUpward(upward);
    setPortalStyle(portal ? computePortalStyle(el, upward) : null);
    setIsPositioned(true);
  }, [
    triggerRef,
    menuRef,
    optionCount,
    itemHeight,
    extraChrome,
    maxMenuHeight,
    headerOffset,
    portalMenu,
  ]);

  const scheduleUpdate = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(updateFlip);
  }, [updateFlip]);

  useLayoutEffect(() => {
    if (!isOpen) {
      setOpenUpward(false);
      setShouldPortal(false);
      setPortalStyle(null);
      setIsPositioned(false);
      return undefined;
    }

    updateFlip();
    const remeasureRaf = requestAnimationFrame(() => updateFlip());

    const scrollParents = getScrollParents(triggerRef.current);
    scrollParents.forEach((parent) => {
      parent.addEventListener('scroll', scheduleUpdate, { passive: true, capture: true });
    });
    window.addEventListener('resize', scheduleUpdate, { passive: true });

    let resizeObserver;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(scheduleUpdate);
      if (menuRef?.current) resizeObserver.observe(menuRef.current);
      if (triggerRef.current) resizeObserver.observe(triggerRef.current);
    }

    return () => {
      cancelAnimationFrame(remeasureRaf);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      scrollParents.forEach((parent) => {
        parent.removeEventListener('scroll', scheduleUpdate, { capture: true });
      });
      window.removeEventListener('resize', scheduleUpdate);
      resizeObserver?.disconnect();
    };
  }, [isOpen, scheduleUpdate, updateFlip, triggerRef, menuRef]);

  return { openUpward, shouldPortal, portalStyle, isPositioned };
}
