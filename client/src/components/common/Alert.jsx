import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react';

function joinClasses(...parts) {
  return parts.filter(Boolean).join(' ');
}

const VARIANTS = {
  success: {
    box: 'border-success/40 bg-success-soft',
    text: 'text-success-foreground',
    accent: 'text-success',
    Icon: CheckCircle2,
  },
  warning: {
    box: 'border-warning/40 bg-warning-soft',
    text: 'text-warning-foreground',
    accent: 'text-warning',
    Icon: TriangleAlert,
  },
  error: {
    box: 'border-danger/40 bg-danger-soft',
    text: 'text-danger-foreground',
    accent: 'text-danger',
    Icon: AlertCircle,
  },
  failure: {
    box: 'border-danger/40 bg-danger-soft',
    text: 'text-danger-foreground',
    accent: 'text-danger',
    Icon: AlertCircle,
  },
  info: {
    box: 'border-border bg-muted-surface',
    text: 'text-foreground',
    accent: 'text-primary',
    Icon: Info,
  },
};

const COLOR_ALIASES = {
  blue: 'info',
  green: 'success',
  red: 'error',
  amber: 'warning',
  yellow: 'warning',
  orange: 'warning',
  failure: 'failure',
  error: 'error',
  success: 'success',
  warning: 'warning',
  info: 'info',
};

function resolveVariant(variant, color) {
  if (color && COLOR_ALIASES[color]) {
    return COLOR_ALIASES[color];
  }
  return VARIANTS[variant] ? variant : 'info';
}

/**
 * Rahalatek-style alert: bordered panel, variant color, optional title with icon.
 */
export default function Alert({
  variant = 'info',
  color = null,
  icon: IconOverride = undefined,
  title = null,
  children,
  className = '',
  role,
  /** When set with a title, body copy uses theme foreground instead of the variant tint (Rahalatek danger zone). */
  bodyTone = 'inherit',
}) {
  const resolved = resolveVariant(variant, color);
  const styles = VARIANTS[resolved] || VARIANTS.info;
  const Icon = IconOverride === undefined ? styles.Icon : IconOverride;
  const isAlertRole = role ?? (resolved === 'error' || resolved === 'failure' ? 'alert' : undefined);

  const showLeadingIcon = Icon && !title;

  const bodyToneClass =
    bodyTone === 'foreground'
      ? 'text-foreground'
      : bodyTone === 'muted'
        ? 'text-muted-foreground'
        : styles.text;

  return (
    <div
      className={joinClasses(
        'rounded-lg border p-3 shadow-sm',
        styles.box,
        className,
      )}
      role={isAlertRole}
    >
      <div className={joinClasses('text-sm text-pretty', styles.text)}>
        {title ? (
          <>
            <p className={joinClasses('inline-flex items-center gap-2 font-semibold', styles.accent)}>
              {Icon ? <Icon className="size-4 shrink-0" aria-hidden /> : null}
              <span>{title}</span>
            </p>
            {children ? (
              <div className={joinClasses('mt-1.5 space-y-2 text-pretty', bodyToneClass)}>{children}</div>
            ) : null}
          </>
        ) : (
          <div className={showLeadingIcon ? 'flex items-start gap-2' : undefined}>
            {showLeadingIcon ? (
              <Icon className={joinClasses('mt-0.5 size-4 shrink-0', styles.accent)} aria-hidden />
            ) : null}
            <div className="min-w-0 flex-1">{children}</div>
          </div>
        )}
      </div>
    </div>
  );
}
