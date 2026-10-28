/** Composable data table styled for MixEncryption theme tokens. */

import ScrollArea from './ScrollArea';

/** @param {...(string | false | undefined | null)} parts */
function joinClasses(...parts) {
  return parts.filter(Boolean).join(' ');
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {'elevated' | 'nested'} [props.variant]
 * @param {import('react').ReactNode} props.children
 */
export function TableContainer({
  className = '',
  variant = 'elevated',
  children,
}) {
  /** @type {Record<'elevated' | 'nested', string>} */
  const variants = {
    elevated:
      'overflow-hidden rounded-xl border border-border bg-card shadow-card',
    nested: 'overflow-hidden rounded-xl border border-border bg-card shadow-card',
  };
  return (
    <div
      className={joinClasses(variants[variant] || variants.elevated, className)}
    >
      {children}
    </div>
  );
}

/** @param {{ className?: string, children: import('react').ReactNode }} props */
export function TableScroll({ className = '', children }) {
  return (
    <div className={joinClasses('-mx-1 overflow-x-auto sm:mx-0', className)}>
      {children}
    </div>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {string | number} [props.minWidth]
 * @param {import('react').ReactNode} props.children
 */
export function Table({ className = '', minWidth, children }) {
  const style =
    minWidth !== undefined
      ? { minWidth: typeof minWidth === 'number' ? `${minWidth}px` : minWidth }
      : undefined;

  return (
    <table
      className={joinClasses(
        'w-full border-collapse text-left text-xs',
        className,
      )}
      style={style}
    >
      {children}
    </table>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {boolean} [props.sticky]
 * @param {import('react').ReactNode} props.children
 */
export function TableHeader({ className = '', sticky = false, children }) {
  return (
    <thead
      className={joinClasses(
        'border-b border-border bg-surface text-foreground',
        sticky &&
          'sticky top-0 z-10 backdrop-blur-sm shadow-[0_1px_0_0_var(--color-border),0_6px_16px_-6px_color-mix(in_srgb,var(--color-foreground)_12%,transparent)]',
        className,
      )}
    >
      {children}
    </thead>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {boolean} [props.striped]
 * @param {import('react').ReactNode} props.children
 */
export function TableBody({ className = '', striped = false, children }) {
  return (
    <tbody
      className={joinClasses(
        'divide-y divide-border',
        striped && '[&>tr:nth-child(even)]:bg-surface',
        className,
      )}
    >
      {children}
    </tbody>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {boolean} [props.interactive]
 * @param {import('react').ReactNode} props.children
 */
export function TableRow({ className = '', interactive = false, children }) {
  return (
    <tr
      className={joinClasses(
        'transition-colors duration-150',
        interactive
          ? 'border-l-2 border-l-transparent hover:border-l-primary hover:bg-surface'
          : 'hover:bg-surface',
        className,
      )}
    >
      {children}
    </tr>
  );
}

/** @type {Record<'left' | 'center' | 'right', string>} */
const headAlign = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('react').ReactNode} props.children
 * @param {'left' | 'center' | 'right'} [props.align]
 * @param {boolean} [props.caps]
 */
export function TableHead({
  className = '',
  children,
  align = 'left',
  caps = true,
}) {
  return (
    <th
      scope="col"
      className={joinClasses(
        'border-b border-border bg-surface px-3 py-2.5 text-[11px] font-semibold text-foreground',
        caps ? 'uppercase tracking-[0.06em]' : 'tracking-normal',
        'first:pl-4 last:pr-4',
        headAlign[align] || headAlign.left,
        className,
      )}
    >
      {children}
    </th>
  );
}

/** @type {Record<string, string>} */
const cellTone = {
  default: 'text-foreground',
  muted: 'text-muted-foreground',
  subtle: 'text-subtle-foreground',
  mono: 'font-mono text-[11px] text-muted-foreground',
  monoStrong: 'font-mono text-[11px] text-foreground',
};

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('react').ReactNode} props.children
 * @param {keyof typeof cellTone | string} [props.tone]
 * @param {'left' | 'center' | 'right'} [props.align]
 * @param {boolean} [props.truncate]
 * @param {string} [props.title]
 * @param {boolean} [props.nowrap]
 * @param {number} [props.colSpan]
 */
export function TableCell({
  className = '',
  children,
  tone = 'default',
  align = 'left',
  truncate = false,
  title,
  nowrap = false,
  colSpan,
}) {
  return (
    <td
      colSpan={colSpan}
      title={title}
      className={joinClasses(
        'px-3 py-2 align-middle first:pl-4 last:pr-4',
        cellTone[tone] || cellTone.default,
        headAlign[align] || headAlign.left,
        truncate && 'max-w-48 truncate',
        nowrap && 'whitespace-nowrap',
        className,
      )}
    >
      {children}
    </td>
  );
}

/**
 * @param {object} props
 * @param {number} props.colSpan
 * @param {import('react').ReactNode} props.children
 * @param {string} [props.className]
 */
export function TableEmpty({ colSpan, children, className = '' }) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell
        colSpan={colSpan}
        tone="muted"
        align="center"
        className={joinClasses('py-8 text-xs', className)}
      >
        {children}
      </TableCell>
    </TableRow>
  );
}

/**
 * @param {object} props
 * @param {string | number} [props.minWidth]
 * @param {string} [props.className]
 * @param {import('react').ReactNode} props.children
 * @param {import('react').ReactNode} [props.footer]
 * @param {string} [props.maxBodyHeight]
 * @param {string} [props.scrollAriaLabel]
 * @param {boolean} [props.bodyBusy]
 * @param {'elevated' | 'nested'} [props.variant]
 */
export function DataTable({
  minWidth,
  className = '',
  children,
  footer,
  maxBodyHeight,
  scrollAriaLabel = 'Table body',
  bodyBusy = false,
  variant = 'nested',
}) {
  const table = <Table minWidth={minWidth}>{children}</Table>;

  const scrollContent = maxBodyHeight ? (
    <ScrollArea
      maxHeight={maxBodyHeight}
      ariaLabel={scrollAriaLabel}
      className={
        bodyBusy
          ? "opacity-50 transition-opacity duration-150"
          : "transition-opacity duration-150"
      }
    >
      {table}
    </ScrollArea>
  ) : (
    table
  );

  return (
    <TableContainer className={className} variant={variant}>
      <TableScroll>{scrollContent}</TableScroll>
      {footer}
    </TableContainer>
  );
}
