export default function Spinner({ className = '' }) {
  return (
    <span
      className={`inline-block size-5 animate-spin rounded-full border-2 border-slate-600 border-t-cyan-400 ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
