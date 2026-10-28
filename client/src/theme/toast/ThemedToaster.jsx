import { Toaster, ToastBar } from 'react-hot-toast';
import { getActiveToastAnimation, getActiveToastPosition } from './applyToastDesign';
import { getDefaultToasterOptions } from './toastApi';
import { getToastBarAnimationStyle } from './toastMotion';
import './toastAnimations.css';

export default function ThemedToaster() {
  const position = getActiveToastPosition();
  const animation = getActiveToastAnimation();
  const toastOptions = getDefaultToasterOptions();

  return (
    <Toaster
      key={`${position}-${animation}`}
      position={position}
      toastOptions={toastOptions}
      containerClassName="toast-container pointer-events-none"
      containerStyle={{ zIndex: 10000 }}
    >
      {(t) => (
        <ToastBar
          toast={t}
          position={position}
          style={{
            ...t.style,
            ...getToastBarAnimationStyle(t, position, animation),
          }}
        />
      )}
    </Toaster>
  );
}
