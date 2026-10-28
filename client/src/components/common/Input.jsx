export default function Input({
  id,
  type = 'text',
  className = '',
  error,
  ...props
}) {
  return (
    <input
      id={id}
      type={type}
      className={`w-full rounded-lg border bg-input px-3 py-2 text-sm text-foreground placeholder:text-subtle-foreground focus:outline-none focus:ring-2 focus:ring-focus/50 ${
        error ? 'border-danger' : 'border-input-border'
      } ${className}`}
      aria-invalid={error ? 'true' : undefined}
      {...props}
    />
  );
}
