export default function UpcomingFeatureBanner({ children }) {
  return (
    <div className="mb-6 rounded-lg border border-border bg-surface px-4 py-3">
      <p className="text-sm font-medium text-foreground">Upcoming feature</p>
      <p className="mt-1 text-sm text-muted-foreground">{children}</p>
    </div>
  );
}
