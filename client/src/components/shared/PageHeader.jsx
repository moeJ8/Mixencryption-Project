export default function PageHeader({ title, description, eyebrow }) {
  return (
    <div className="mb-6 border-b border-border pb-6 sm:mb-8">
      {eyebrow ? (
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-subtle-foreground">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl md:text-3xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
