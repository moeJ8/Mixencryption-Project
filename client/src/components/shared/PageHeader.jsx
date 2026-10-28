export default function PageHeader({ title, description, eyebrow, actions }) {
  return (
    <div className="mb-6 border-b border-border pb-6 sm:mb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          {eyebrow ? (
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-subtle-foreground">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl md:text-3xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
    </div>
  );
}
