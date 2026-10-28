export default function Card({
  title,
  children,
  className = "",
  flat = false,
}) {
  const elevation = flat ? "" : "shadow-card";
  return (
    <section
      className={`rounded-xl border border-border bg-card p-4 sm:p-6 ${elevation} ${className}`}
    >
      {title ? (
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-foreground">
          {title}
        </h2>
      ) : null}
      {children}
    </section>
  );
}
