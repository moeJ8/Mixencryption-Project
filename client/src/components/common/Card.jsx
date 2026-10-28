export default function Card({ title, children, className = '' }) {
  return (
    <section
      className={`rounded-xl border border-border bg-card p-4 shadow-lg shadow-black/10 sm:p-6 ${className}`}
    >
      {title ? (
        <h2 className="mb-4 text-lg font-semibold text-foreground">{title}</h2>
      ) : null}
      {children}
    </section>
  );
}
