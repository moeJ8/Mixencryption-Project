export default function Input({
  id,
  type = 'text',
  className = '',
  error,
  invalid = false,
  'aria-describedby': ariaDescribedBy,
  ...props
}) {
  const hasError = Boolean(error) || invalid;

  return (
    <input
      id={id}
      type={type}
      className={`w-full rounded-lg border bg-input px-3 py-2 text-sm text-foreground placeholder:text-subtle-foreground focus:outline-none focus:ring-2 ${
        hasError
          ? 'border-danger focus:ring-danger/40'
          : 'border-input-border focus:ring-focus/50'
      } ${className}`}
      aria-invalid={hasError ? 'true' : undefined}
      aria-describedby={ariaDescribedBy}
      {...props}
    />
  );
}
