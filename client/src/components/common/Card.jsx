export default function Card({ title, children, className = '' }) {
  return (
    <section
      className={`rounded-xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg shadow-black/20 ${className}`}
    >
      {title ? (
        <h2 className="mb-4 text-lg font-semibold text-slate-100">{title}</h2>
      ) : null}
      {children}
    </section>
  );
}
