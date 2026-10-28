/** Shared header control sizing and theme-token hovers. */
export const NAV_CONTROL_HEIGHT = "h-9";

/** Desktop: text only; sliding bar lives in NavSlideIndicator. */
export function navLinkClass({ isActive }) {
  const base = `relative inline-flex ${NAV_CONTROL_HEIGHT} items-center px-2.5 text-sm font-medium transition-colors duration-200 ease-out`;
  if (isActive) {
    return `${base} text-accent`;
  }
  return `${base} text-muted-foreground hover:text-accent-hover focus-visible:text-accent-hover focus-visible:outline-none`;
}

export const navChromeButtonClass =
  "inline-flex h-9 items-center justify-center rounded-lg border border-border bg-input text-foreground transition-all duration-200 ease-out hover:border-primary/50 hover:bg-surface hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-header";

export const navMenuItemClass =
  "flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors duration-200 hover:bg-surface hover:text-accent";

/** Mobile drawer: fixed rows, left accent border on active (touch only). */
export function mobileNavLinkClass({ isActive }) {
  const base =
    "nav-mobile-link flex h-11 w-full shrink-0 items-center border-l-2 border-transparent pl-3 pr-3 text-sm font-medium transition-[border-color,color] duration-150 ease-out";
  if (isActive) {
    return `${base} border-accent text-accent`;
  }
  return `${base} text-muted-foreground active:text-foreground`;
}

/** Documentation sidebar links (same language as main nav). */
export function sidebarLinkClass({ isActive }) {
  const base =
    "block rounded-lg border border-transparent px-3 py-2 text-sm font-medium transition-colors duration-200";
  if (isActive) {
    return `${base} border-l-2 border-l-primary bg-surface pl-[10px] text-accent`;
  }
  return `${base} text-muted-foreground hover:bg-surface hover:text-foreground`;
}

/** Shared header flyout panel (theme menu, user menu). */
export const headerFlyoutPanelClass =
  "absolute right-0 z-60 mt-2 w-56 rounded-xl border border-border bg-card shadow-flyout max-sm:fixed max-sm:left-3 max-sm:right-3 max-sm:top-14 max-sm:mt-1 max-sm:w-auto";
