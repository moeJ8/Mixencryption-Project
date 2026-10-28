export const REQUIRED_COLOR_KEYS = [
  'background',
  'surface',
  'card',
  'header',
  'footer',
  'border',
  'input',
  'inputBorder',
  'focusRing',
  'foreground',
  'mutedForeground',
  'subtleForeground',
  'primary',
  'primaryHover',
  'primaryForeground',
  'accent',
  'accentHover',
  'danger',
  'dangerSoft',
  'dangerForeground',
  'link',
  'linkHover',
];

export function tokenToCssVar(tokenKey) {
  const kebab = String(tokenKey)
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();
  return `--color-${kebab}`;
}
