export default function AnimatedDropdown({
  shouldRender,
  isShown,
  className = '',
  children,
  ...props
}) {
  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className={`dropdown-flyout ${isShown ? 'dropdown-flyout-open' : ''} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}
