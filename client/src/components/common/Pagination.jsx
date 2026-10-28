import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { buildPageItems } from '../../hooks/useServerPagination';
import Button from './Button';

function joinClasses(...parts) {
  return parts.filter(Boolean).join(' ');
}

function NavCircleButton({
  children,
  disabled,
  onClick,
  onMouseEnter,
  ariaLabel,
  active = false,
  prefetching = false,
}) {
  return (
    <Button
      type="button"
      variant={active ? 'primary' : 'secondary'}
      size="iconSm"
      shape="circle"
      disabled={disabled}
      aria-label={ariaLabel}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={joinClasses(
        'focus-visible:ring-offset-card',
        prefetching && !active && 'border-primary/40 text-accent',
      )}
    >
      {children}
    </Button>
  );
}

function PageNumberButton({ page, current, onPageChange, onPrefetchPage, prefetching }) {
  const isActive = page === current;
  return (
    <NavCircleButton
      active={isActive}
      prefetching={prefetching}
      ariaLabel={`Page ${page}`}
      onClick={() => onPageChange(page)}
      onMouseEnter={() => onPrefetchPage?.(page)}
    >
      {page}
    </NavCircleButton>
  );
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  onPrefetchPage,
  prefetchingPages,
  className = '',
}) {
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  const items = buildPageItems(page, totalPages);
  const prefetchSet = prefetchingPages instanceof Set ? prefetchingPages : new Set();

  const prefetch = (target) => {
    if (target >= 1 && target <= totalPages && target !== page) {
      onPrefetchPage?.(target);
    }
  };

  return (
    <nav
      className={joinClasses(
        'flex flex-wrap items-center justify-center gap-1.5 border-t border-border bg-surface/50 px-3 py-3',
        className,
      )}
      aria-label="Pagination"
    >
      <NavCircleButton
        ariaLabel="First page"
        disabled={page <= 1}
        onClick={() => onPageChange(1)}
        onMouseEnter={() => prefetch(1)}
      >
        <ChevronsLeft className="size-4" aria-hidden />
      </NavCircleButton>
      <NavCircleButton
        ariaLabel="Previous page"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        onMouseEnter={() => prefetch(page - 1)}
      >
        <ChevronLeft className="size-4" aria-hidden />
      </NavCircleButton>

      {items.map((item, index) =>
        item.type === 'ellipsis' ? (
          <span
            key={item.key || `ellipsis-${index}`}
            className="inline-flex size-8 items-center justify-center text-xs text-subtle-foreground"
            aria-hidden
          >
            …
          </span>
        ) : (
          <PageNumberButton
            key={item.page}
            page={item.page}
            current={page}
            onPageChange={onPageChange}
            onPrefetchPage={onPrefetchPage}
            prefetching={prefetchSet.has(item.page)}
          />
        ),
      )}

      <NavCircleButton
        ariaLabel="Next page"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        onMouseEnter={() => prefetch(page + 1)}
      >
        <ChevronRight className="size-4" aria-hidden />
      </NavCircleButton>
      <NavCircleButton
        ariaLabel="Last page"
        disabled={page >= totalPages}
        onClick={() => onPageChange(totalPages)}
        onMouseEnter={() => prefetch(totalPages)}
      >
        <ChevronsRight className="size-4" aria-hidden />
      </NavCircleButton>
    </nav>
  );
}
