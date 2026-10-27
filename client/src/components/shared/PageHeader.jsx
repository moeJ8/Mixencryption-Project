export default function PageHeader({ title, description }) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-2 max-w-2xl text-sm text-slate-400">{description}</p>
      ) : null}
    </div>
  );
}
