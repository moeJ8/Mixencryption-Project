import toast from 'react-hot-toast';
import { TOAST_ICONS } from './toastIcons';

function toastClassName(kind = 'default') {
  return `rht-app-toast rht-app-toast--${kind}`;
}

function getToastStyle() {
  return {
    background: 'transparent',
    border: 'none',
    boxShadow: 'none',
    padding: 0,
    maxWidth: 'var(--toast-max-width)',
  };
}

function durationFor(kind, override) {
  if (override != null) return override;
  return kind === 'failure' ? 4000 : 3000;
}

export function getDefaultToasterOptions() {
  const shell = getToastStyle();
  return {
    className: toastClassName('default'),
    style: shell,
    success: {
      style: shell,
      className: toastClassName('success'),
      icon: TOAST_ICONS.success,
    },
    error: {
      style: shell,
      className: toastClassName('failure'),
      icon: TOAST_ICONS.failure,
    },
  };
}

export function toastSuccess(message, options = {}) {
  const { style, duration, icon, className, ...rest } = options;
  return toast.success(message, {
    duration: durationFor('success', duration),
    className: className || toastClassName('success'),
    icon: icon ?? TOAST_ICONS.success,
    style: { ...getToastStyle(), ...style },
    ...rest,
  });
}

export function toastError(message, options = {}) {
  const { style, duration, icon, className, ...rest } = options;
  return toast.error(message, {
    duration: durationFor('failure', duration),
    className: className || toastClassName('failure'),
    icon: icon ?? TOAST_ICONS.failure,
    style: { ...getToastStyle(), ...style },
    ...rest,
  });
}

export function toastAlert(message, options = {}) {
  const { style, duration, icon, className, ...rest } = options;
  return toast(message, {
    duration: durationFor('alert', duration),
    className: className || toastClassName('alert'),
    icon: icon ?? TOAST_ICONS.alert,
    style: { ...getToastStyle(), ...style },
    ...rest,
  });
}
