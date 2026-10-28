import Alert from '../common/Alert';

export default function UpcomingFeatureBanner({ children, variant = 'info' }) {
  const alertVariant = variant === 'warn' ? 'warning' : 'info';

  return (
    <Alert variant={alertVariant} title="Upcoming feature" className="mb-6">
      <p className="text-sm leading-relaxed text-muted-foreground">{children}</p>
    </Alert>
  );
}
