const variants = {
  primary:
    'bg-primary text-primary-foreground hover:bg-primary-hover focus-visible:ring-focus',
  secondary:
    'border border-border bg-surface text-foreground hover:bg-card',
  ghost: 'text-muted-foreground hover:bg-surface hover:text-foreground',
};

export default function Button({
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
