import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useModalAnimatedOpen } from '../../hooks/useAnimatedOpen';
import ScrollArea from './ScrollArea';

/**
 * @param {object} props
 * @param {boolean} props.open
 * @param {() => void} props.onClose
 * @param {import('react').ReactNode} props.title
 * @param {import('react').ReactNode} [props.description]
 * @param {import('react').ReactNode} props.children
 * @param {import('react').ReactNode} [props.footer]
 * @param {string} [props.maxWidthClass]
 * @param {string} [props.labelledById]
 * @param {string} [props.scrollAriaLabel]
 */
export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidthClass = 'max-w-md',
  labelledById = 'modal-title',
  scrollAriaLabel = 'Dialog content',
}) {
  const anim = useModalAnimatedOpen(open);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    /** @param {KeyboardEvent} event */
    function onKeyDown(event) {
      if (event.key === 'Escape') {
        onCloseRef.current();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!anim.shouldRender) {
    return null;
  }

  const backdropClass = anim.isShown ? 'modal-backdrop-open' : '';
  const panelClass = anim.isShown ? 'modal-panel-open' : '';

  return createPortal(
    <div
      className={`modal-backdrop fixed inset-0 z-100 flex items-end justify-center p-0 sm:items-center sm:p-4 ${backdropClass}`}
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledById}
        className={`modal-panel flex max-h-[min(92dvh,640px)] w-full flex-col rounded-t-xl border border-border border-b-0 bg-card shadow-flyout sm:max-h-[min(90vh,640px)] sm:rounded-xl sm:border-b ${maxWidthClass} ${panelClass}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border px-4 py-3 sm:px-6 sm:py-4">
          <div className="min-w-0">
            <h2 id={labelledById} className="text-lg font-semibold text-foreground">
              {title}
            </h2>
            {description ? (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-transparent text-muted-foreground transition-colors hover:border-border hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            aria-label="Close"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>

        <div
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
          data-modal-body
        >
          <ScrollArea
            maxHeight={false}
            className="min-h-0 flex-1"
            ariaLabel={scrollAriaLabel}
          >
            <div className="px-4 py-4 sm:px-6">{children}</div>
          </ScrollArea>
        </div>

        {footer ? (
          <div
            data-modal-footer
            className="shrink-0 border-t border-border px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-4 sm:pb-4"
          >
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
