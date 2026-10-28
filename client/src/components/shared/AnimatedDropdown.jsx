import { forwardRef } from 'react';

/**
 * @typedef {import('react').HTMLAttributes<HTMLDivElement> & {
 *   shouldRender: boolean;
 *   isShown: boolean;
 *   className?: string;
 *   style?: import('react').CSSProperties;
 *   children?: import('react').ReactNode;
 * }} AnimatedDropdownProps
 */

/** @type {import('react').ForwardRefExoticComponent<AnimatedDropdownProps & import('react').RefAttributes<HTMLDivElement>>} */
const AnimatedDropdown = forwardRef(function AnimatedDropdown(
  { shouldRender, isShown, className = '', style, children, ...props },
  ref,
) {
  if (!shouldRender) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={`dropdown-flyout ${isShown ? 'dropdown-flyout-open' : ''} ${className}`.trim()}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
});

AnimatedDropdown.displayName = 'AnimatedDropdown';

export default AnimatedDropdown;
