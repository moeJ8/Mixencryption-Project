export default function Spinner({ className = '' }) {
  return (
    <span
      className={`inline-block size-5 animate-spin rounded-full border-2 border-border border-t-accent ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
