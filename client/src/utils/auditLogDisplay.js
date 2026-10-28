import {
  AlertTriangle,
  Key,
  KeyRound,
  Lock,
  LogIn,
  LogOut,
  Mail,
  ShieldAlert,
  UserPlus,
} from 'lucide-react';

const ACTION_LABELS = {
  SIGNUP: 'Sign up',
  LOGIN: 'Sign in',
  LOGOUT: 'Sign out',
  LOGIN_FAILURE: 'Sign in failed',
  EMAIL_VERIFICATION_SENT: 'Verification email sent',
  EMAIL_VERIFIED: 'Email verified',
  PASSWORD_RESET_REQUESTED: 'Password reset requested',
  PASSWORD_RESET: 'Password reset',
  USER_ROLE_CHANGED: 'User role changed',
  USER_UPDATED: 'User updated',
  USER_DELETED: 'User deleted',
  KEY_REGISTER: 'Crypto keys registered',
  ENCRYPT_PAYLOAD: 'Payload encrypted',
  DECRYPT_PAYLOAD: 'Payload decrypted',
  TAMPER_DETECTED: 'Tamper detected',
};

const ACTION_META = {
  SIGNUP: { Icon: UserPlus, accent: 'auth' },
  LOGIN: { Icon: LogIn, accent: 'auth' },
  LOGOUT: { Icon: LogOut, accent: 'neutral' },
  LOGIN_FAILURE: { Icon: ShieldAlert, accent: 'danger' },
  EMAIL_VERIFICATION_SENT: { Icon: Mail, accent: 'auth' },
  EMAIL_VERIFIED: { Icon: Mail, accent: 'success' },
  PASSWORD_RESET_REQUESTED: { Icon: KeyRound, accent: 'warn' },
  PASSWORD_RESET: { Icon: KeyRound, accent: 'success' },
  USER_ROLE_CHANGED: { Icon: ShieldAlert, accent: 'warn' },
  USER_UPDATED: { Icon: ShieldAlert, accent: 'neutral' },
  USER_DELETED: { Icon: ShieldAlert, accent: 'danger' },
  KEY_REGISTER: { Icon: Key, accent: 'crypto' },
  ENCRYPT_PAYLOAD: { Icon: Lock, accent: 'crypto' },
  DECRYPT_PAYLOAD: { Icon: Lock, accent: 'crypto' },
  TAMPER_DETECTED: { Icon: AlertTriangle, accent: 'danger' },
};

/** Tailwind classes keyed by semantic accent (uses theme tokens). */
export const ACCENT_BOX = {
  auth: 'border-primary/35 bg-muted-surface text-accent',
  success: 'border-success/40 bg-success-soft text-success-foreground',
  crypto: 'border-border bg-surface text-accent',
  neutral: 'border-border bg-muted-surface text-muted-foreground',
  warn: 'border-warning/40 bg-warning-soft text-warning-foreground',
  danger: 'border-danger/45 bg-danger-soft text-danger-foreground',
};

export function formatAuditAction(action) {
  if (!action) return 'Unknown';
  return ACTION_LABELS[action] || action.replace(/_/g, ' ').toLowerCase();
}

export function getAuditActionMeta(action) {
  const label = formatAuditAction(action);
  const meta = ACTION_META[action];
  if (!meta) {
    return { label, Icon: ShieldAlert, accentClass: ACCENT_BOX.neutral };
  }
  return {
    label,
    Icon: meta.Icon,
    accentClass: ACCENT_BOX[meta.accent] || ACCENT_BOX.neutral,
  };
}

export function formatAuditTimestampParts(value) {
  if (!value) {
    return { date: 'N/A', time: '' };
  }
  try {
    const d = new Date(value);
    return {
      date: d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      time: d.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  } catch {
    return { date: 'N/A', time: '' };
  }
}

export function formatAuditTimestamp(value) {
  const { date, time } = formatAuditTimestampParts(value);
  return time ? `${date}, ${time}` : date;
}

export function formatAuditUser(user) {
  if (!user?.username) return 'Unknown account';
  return user.username;
}
