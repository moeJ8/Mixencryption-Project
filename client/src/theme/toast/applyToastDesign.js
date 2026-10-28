/** Apply MixEncryption theme-glass toast chrome on :root. */
export function applyToastDesign(target = document.documentElement) {
  if (!target?.dataset) return;
  target.dataset.toastSurface = 'theme-glass';
  target.dataset.toastAnimation = 'slide-fade';
}

export function getActiveToastPosition() {
  return 'bottom-center';
}

export function getActiveToastAnimation() {
  if (typeof document === 'undefined') return 'slide-fade';
  return document.documentElement.dataset.toastAnimation || 'slide-fade';
}
