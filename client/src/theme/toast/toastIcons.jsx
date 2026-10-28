import { AlertTriangle, Check, X } from 'lucide-react';

function ToastIconWell({ kind, children }) {
  return (
    <span className={`rht-toast-icon rht-toast-icon--${kind}`} aria-hidden>
      {children}
    </span>
  );
}

export function ToastSuccessIcon() {
  return (
    <ToastIconWell kind="success">
      <Check className="size-3.5 stroke-[2.5]" />
    </ToastIconWell>
  );
}

export function ToastFailureIcon() {
  return (
    <ToastIconWell kind="failure">
      <X className="size-3.5 stroke-[2.5]" />
    </ToastIconWell>
  );
}

export function ToastAlertIcon() {
  return (
    <ToastIconWell kind="alert">
      <AlertTriangle className="size-3.5 stroke-[2.5]" />
    </ToastIconWell>
  );
}

export const TOAST_ICONS = {
  success: <ToastSuccessIcon />,
  failure: <ToastFailureIcon />,
  alert: <ToastAlertIcon />,
};
