import { getActiveToastAnimation } from './applyToastDesign';

const ENTER_EASE = 'cubic-bezier(0.21, 1.02, 0.73, 1)';
const EXIT_EASE = 'cubic-bezier(0.06, 0.71, 0.55, 1)';

function isTopPosition(position = '') {
  return String(position).startsWith('top');
}

export function resolveToastBarAnimation(animationType, position, visible) {
  const anim = animationType || getActiveToastAnimation() || 'slide-fade';

  if (anim === 'slide') {
    return null;
  }

  const top = isTopPosition(position);

  switch (anim) {
    case 'fade':
      return visible
        ? `rht-toast-fade-in 0.28s ${ENTER_EASE} forwards`
        : `rht-toast-fade-out 0.32s ${EXIT_EASE} forwards`;
    case 'slide-fade':
      if (top) {
        return visible
          ? `rht-toast-slide-fade-in-top 0.32s ${ENTER_EASE} forwards`
          : `rht-toast-slide-fade-out-top 0.36s ${EXIT_EASE} forwards`;
      }
      return visible
        ? `rht-toast-slide-fade-in-bottom 0.32s ${ENTER_EASE} forwards`
        : `rht-toast-slide-fade-out-bottom 0.36s ${EXIT_EASE} forwards`;
    default:
      return null;
  }
}

export function getToastBarAnimationStyle(toast, fallbackPosition, animationType) {
  if (!toast.height) {
    return { opacity: 0 };
  }

  const position = toast.position || fallbackPosition || 'bottom-center';
  const animation = resolveToastBarAnimation(
    animationType,
    position,
    toast.visible,
  );

  if (!animation) {
    return {};
  }

  return { animation };
}
