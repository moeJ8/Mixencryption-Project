export default function PageHeader({ title, description }) {
  return (
    <div className="mb-6 sm:mb-8">
      <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl md:text-3xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
