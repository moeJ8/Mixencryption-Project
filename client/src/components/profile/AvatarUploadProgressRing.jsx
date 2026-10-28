import { useEffect, useRef, useState } from 'react';

const RADIUS = 47;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function useSmoothedProgress(target) {
  const [display, setDisplay] = useState(0);
  const targetRef = useRef(target);
  targetRef.current = target;

  useEffect(() => {
    let frameId = 0;

    const step = () => {
      setDisplay((prev) => {
        const nextTarget = targetRef.current;
        if (Math.abs(nextTarget - prev) < 0.35) {
          return nextTarget;
        }
        return prev + (nextTarget - prev) * 0.12;
      });
      frameId = requestAnimationFrame(step);
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    if (target <= 0) {
      setDisplay(0);
    }
  }, [target]);

  return display;
}

/**
 * Circular upload ring for a size-24 avatar inside a size-32 wrapper.
 */
export default function AvatarUploadProgressRing({
  progress,
  processing = false,
  label = 'Uploading profile photo',
}) {
  const smooth = useSmoothedProgress(progress);
  const clamped = Math.min(100, Math.max(0, smooth));
  const offset = CIRCUMFERENCE * (1 - clamped / 100);
  const rounded = Math.round(clamped);

  return (
    <>
      <svg
        className="pointer-events-none absolute inset-0 size-full -rotate-90"
        viewBox="0 0 100 100"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={rounded}
        aria-label={label}
      >
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          className="stroke-border"
          strokeWidth="3.5"
          opacity="0.55"
        />
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          className={`stroke-primary ${processing ? 'avatar-upload-ring-pulse' : ''}`}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
        />
      </svg>
      <div
        className="pointer-events-none absolute inset-0 flex items-end justify-center pb-0.5"
        aria-hidden
      >
        <span className="rounded-md border border-border bg-card/95 px-1.5 py-0.5 font-mono text-[10px] font-semibold leading-none text-accent tabular-nums shadow-sm">
          {rounded}%
        </span>
      </div>
    </>
  );
}

export { CIRCUMFERENCE, RADIUS };
