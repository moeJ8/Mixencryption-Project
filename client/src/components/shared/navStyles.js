/** Shared header control sizing and theme-token hovers. */
export const NAV_CONTROL_HEIGHT = 'h-9';

export function navLinkClass({ isActive }) {
  const base =
    'inline-flex h-9 items-center rounded-lg px-3 text-sm font-medium transition-all duration-200 ease-out';
  if (isActive) {
    return `${base} bg-surface text-accent shadow-sm ring-1 ring-border`;
  }
  return `${base} text-muted-foreground hover:bg-surface hover:text-accent`;
}

export const navChromeButtonClass =
  'inline-flex h-9 items-center justify-center rounded-lg border border-border bg-input text-foreground transition-all duration-200 ease-out hover:border-primary/50 hover:bg-surface hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-header';

export const navMenuItemClass =
  'flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors duration-200 hover:bg-surface hover:text-accent';

export function mobileNavLinkClass({ isActive }) {
  const base =
    'flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-out';
  if (isActive) {
    return `${base} bg-surface text-accent ring-1 ring-border`;
  }
  return `${base} text-muted-foreground hover:bg-surface hover:text-accent`;
}

/** Fixed panel on small screens so flyouts are not clipped by the header. */
export const headerFlyoutPanelClass =
  'absolute right-0 z-[60] mt-2 w-56 rounded-xl border border-border bg-card shadow-lg shadow-black/25 max-sm:fixed max-sm:left-3 max-sm:right-3 max-sm:top-14 max-sm:mt-1 max-sm:w-auto';
