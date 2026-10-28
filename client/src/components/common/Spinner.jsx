/**
 * Arc spinner (Rahalatek-style): rotating ring with a single accent border segment.
 *
 * @param {'xs'|'sm'|'md'|'lg'} [size]
 * @param {'default'|'accent'|'current'} [variant]
 * @param {string} [color] - Tailwind border-* class override
 * @param {string} [className]
 */
export default function Spinner({
  size = 'md',
  variant = 'default',
  color,
  className = '',
}) {
  const sizeClasses = {
    xs: 'size-3.5 border-b-2',
    sm: 'size-4 border-b-2',
    md: 'size-8 border-b-2',
    lg: 'size-12 border-b-2',
  };

  const colorVariants = {
    default: 'border-accent',
    accent: 'border-accent',
    current: 'border-current',
  };

  const colorClass = color || colorVariants[variant] || colorVariants.default;

  return (
    <span
      className={`inline-block animate-spin rounded-full ${sizeClasses[size] || sizeClasses.md} ${colorClass} ${className}`.trim()}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading</span>
    </span>
  );
}
