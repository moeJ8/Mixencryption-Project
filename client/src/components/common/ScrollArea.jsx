/**
 * Scroll container with theme-styled scrollbars (see .me-scroll-area in index.css).
 *
 * @param {object} props
 * @param {import('react').ReactNode} props.children
 * @param {string} [props.className]
 * @param {string | number | false | null} [props.maxHeight] Pass false or null for flex-fill (e.g. modal body).
 * @param {string | number} [props.maxWidth]
 * @param {string} [props.ariaLabel]
 */
export default function ScrollArea({
  children,
  className = '',
  maxHeight = '26rem',
  maxWidth,
  ariaLabel,
}) {
  /** @type {import('react').CSSProperties} */
  const style = {
    maxWidth: maxWidth || undefined,
  };
  if (maxHeight !== false && maxHeight != null) {
    style.maxHeight = maxHeight;
  }

  return (
    <div
      className={`me-scroll-area overflow-auto ${className}`.trim()}
      style={style}
      tabIndex={0}
      role="region"
      aria-label={ariaLabel || 'Scrollable content'}
    >
      {children}
    </div>
  );
}
