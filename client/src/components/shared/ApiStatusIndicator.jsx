import { Loader2 } from 'lucide-react';
import { useApiStatus } from '../../context/ApiStatusContext';
import Button from '../common/Button';

const STATUS_COPY = {
  checking: { label: 'Checking API', tone: 'muted' },
  waking: { label: 'API starting', tone: 'warning' },
  ready: { label: 'API ready', tone: 'primary' },
  unavailable: { label: 'API offline', tone: 'danger' },
};

function toneClasses(tone) {
  if (tone === 'primary') {
    return 'border-primary/40 bg-surface text-accent';
  }
  if (tone === 'warning') return 'text-warning-foreground bg-warning-soft border-warning/30';
  if (tone === 'danger') return 'text-danger-foreground bg-danger-soft border-danger/30';
  return 'text-muted-foreground bg-surface border-border';
}

function Dot({ tone, pulse, size = 'sm' }) {
  const sizeClass = size === 'md' ? 'size-2.5' : 'size-2';
  const dotColor =
    tone === 'primary'
      ? 'bg-primary'
      : tone === 'warning'
        ? 'bg-warning'
        : tone === 'danger'
          ? 'bg-danger'
          : 'bg-muted-foreground';

  return (
    <span
      className={`relative inline-flex shrink-0 rounded-full ${sizeClass} ${dotColor} ${
        pulse ? 'animate-pulse' : ''
      }`}
      aria-hidden
    />
  );
}

function statusTitle(status, label) {
  if (status === 'waking') {
    return 'Free hosting may take up to a minute to wake the API.';
  }
  return label;
}

/**
 * @param {{ variant?: 'pill' | 'compact' | 'menu'; className?: string }} props
 */
export default function ApiStatusIndicator({ variant = 'pill', className = '' }) {
  const { status, retry } = useApiStatus();
  const copy = STATUS_COPY[status] ?? STATUS_COPY.checking;
  const showSpinner = status === 'checking' || status === 'waking';
  const title = statusTitle(status, copy.label);

  if (variant === 'compact') {
    return (
      <Button
        type="button"
        variant="chrome"
        size="iconSm"
        className={className}
        title={title}
        aria-label={copy.label}
        onClick={status === 'unavailable' ? retry : undefined}
      >
        {showSpinner ? (
          <Loader2 className="size-4 animate-spin text-accent" aria-hidden />
        ) : (
          <Dot tone={copy.tone} size="md" pulse={status === 'waking'} />
        )}
      </Button>
    );
  }

  if (variant === 'menu') {
    return (
      <div
        className={`flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-3 py-2.5 ${className}`.trim()}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="flex min-w-0 items-center gap-2">
          {showSpinner ? (
            <Loader2 className="size-4 shrink-0 animate-spin text-accent" aria-hidden />
          ) : (
            <Dot tone={copy.tone} size="md" />
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">{copy.label}</p>
            {status === 'waking' ? (
              <p className="text-xs text-muted-foreground">Render free tier may take up to a minute.</p>
            ) : null}
          </div>
        </div>
        {status === 'unavailable' ? (
          <Button type="button" variant="secondary" size="sm" className="h-8 shrink-0" onClick={retry}>
            Retry
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={`flex min-w-0 items-center gap-2 ${className}`.trim()}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        className={`flex min-w-0 items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium ${toneClasses(copy.tone)}`}
        title={title}
      >
        {showSpinner ? (
          <Loader2 className="size-3 shrink-0 animate-spin text-accent opacity-80" aria-hidden />
        ) : (
          <Dot tone={copy.tone} pulse={status === 'waking'} />
        )}
        <span className="truncate">{copy.label}</span>
      </div>
      {status === 'unavailable' ? (
        <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={retry}>
          Retry
        </Button>
      ) : null}
    </div>
  );
}
