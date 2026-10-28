import { CheckCircle2, Clock, User, XCircle } from 'lucide-react';
import {
  DataTable,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from '../common/Table';
import Alert from '../common/Alert';
import Pagination from '../common/Pagination';
import Spinner from '../common/Spinner';
import {
  formatAuditTimestampParts,
  formatAuditUser,
  getAuditActionMeta,
} from '../../utils/auditLogDisplay';

/** @param {{ status: string }} props */
function StatusBadge({ status }) {
  if (status === 'SUCCESS') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-success/40 bg-success-soft px-2 py-px text-[11px] font-medium text-success-foreground">
        <CheckCircle2 className="size-3 shrink-0" aria-hidden />
        Success
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-danger/50 bg-danger-soft px-2 py-px text-[11px] font-medium text-danger-foreground">
      <XCircle className="size-3 shrink-0" aria-hidden />
      Failure
    </span>
  );
}

/** @param {{ action: string }} props */
function ActionCell({ action }) {
  const { label, Icon, accentClass } = getAuditActionMeta(action);
  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-flex size-6 shrink-0 items-center justify-center rounded-md border ${accentClass}`}
        aria-hidden
      >
        <Icon className="size-3" strokeWidth={2} />
      </span>
      <span className="text-xs text-foreground">{label}</span>
    </div>
  );
}

/** @param {{ timestamp: string }} props */
function TimeCell({ timestamp }) {
  const { date, time } = formatAuditTimestampParts(timestamp);
  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-md border border-border bg-background text-subtle-foreground">
        <Clock className="size-3" aria-hidden />
      </span>
      <div className="min-w-0 leading-snug">
        <p className="text-xs text-foreground">{date}</p>
        {time ? <p className="text-[11px] text-subtle-foreground">{time}</p> : null}
      </div>
    </div>
  );
}

/** @param {{ user: object | null | undefined }} props */
function UserCell({ user }) {
  const username = formatAuditUser(user);
  return (
    <div className="flex items-center gap-1.5">
      <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-muted-surface text-accent">
        <User className="size-2.5" aria-hidden />
      </span>
      <span className="font-mono text-[11px] text-accent">@{username}</span>
    </div>
  );
}

/** @param {{ details: string | null | undefined }} props */
function DetailsCell({ details }) {
  if (!details) {
    return <span className="text-[11px] italic text-subtle-foreground/80">Empty</span>;
  }
  return (
    <span className="rounded border border-border bg-background px-1.5 py-px font-mono text-[11px] text-muted-foreground">
      {details}
    </span>
  );
}

/**
 * @param {object} props
 * @param {Array<{ id: string, timestamp: string, action: string, status: string, ipAddress?: string, details?: string, user?: object }>} props.items
 * @param {boolean} props.loading
 * @param {string} [props.error]
 * @param {boolean} [props.showUser]
 * @param {string} [props.emptyMessage]
 * @param {number} [props.page]
 * @param {number} [props.totalPages]
 * @param {(page: number) => void} [props.onPageChange]
 * @param {(page: number) => void} [props.onPrefetchPage]
 * @param {Set<number> | number[]} [props.prefetchingPages]
 * @param {boolean} [props.switching]
 */
export default function AuditLogTable({
  items,
  loading,
  error,
  showUser = false,
  emptyMessage = 'No activity recorded yet.',
  page,
  totalPages,
  onPageChange,
  onPrefetchPage,
  prefetchingPages,
  switching = false,
}) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="failure" className="my-6 text-center">
        {error}
      </Alert>
    );
  }

  const colCount = showUser ? 6 : 5;

  return (
    <DataTable
      minWidth="36rem"
      maxBodyHeight="26rem"
      scrollAriaLabel="Audit log entries"
      bodyBusy={switching}
      footer={
        onPageChange ? (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
            onPrefetchPage={onPrefetchPage}
            prefetchingPages={prefetchingPages}
          />
        ) : null
      }
    >
      <TableHeader sticky>
        <TableRow className="hover:bg-transparent">
          <TableHead>Time</TableHead>
          {showUser ? <TableHead>User</TableHead> : null}
          <TableHead>Action</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>IP</TableHead>
          <TableHead>Details</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody striped>
        {items.length === 0 ? (
          <TableEmpty colSpan={colCount}>{emptyMessage}</TableEmpty>
        ) : (
          items.map((entry) => (
            <TableRow key={entry.id} interactive>
              <TableCell className="min-w-36">
                <TimeCell timestamp={entry.timestamp} />
              </TableCell>
              {showUser ? (
                <TableCell>
                  <UserCell user={entry.user} />
                </TableCell>
              ) : null}
              <TableCell className="min-w-40">
                <ActionCell action={entry.action} />
              </TableCell>
              <TableCell>
                <StatusBadge status={entry.status} />
              </TableCell>
              <TableCell tone="mono" nowrap>
                {entry.ipAddress || 'N/A'}
              </TableCell>
              <TableCell>
                <DetailsCell details={entry.details} />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </DataTable>
  );
}
