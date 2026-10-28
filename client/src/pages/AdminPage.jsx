import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import Card from '../components/common/Card';
import TypeToConfirmModal from '../components/common/TypeToConfirmModal';
import Pagination from '../components/common/Pagination';
import Spinner from '../components/common/Spinner';
import {
  DataTable,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/common/Table';
import AdminEditUserModal from '../components/admin/AdminEditUserModal';
import UpcomingFeatureBanner from '../components/shared/UpcomingFeatureBanner';
import PageHeader from '../components/shared/PageHeader';
import AuditLogTable from '../components/shared/AuditLogTable';
import { useAuth } from '../context/AuthContext';
import { useServerPagination } from '../hooks/useServerPagination';
import { deleteAdminUser, fetchAdminAudit, fetchAdminUsers } from '../services/adminService';

function VerifiedBadge({ verified }) {
  return verified ? (
    <span className="text-muted-foreground">Yes</span>
  ) : (
    <span className="text-danger-foreground">No</span>
  );
}

export default function AdminPage() {
  const { user: currentUser, refreshUser } = useAuth();
  const users = useServerPagination(fetchAdminUsers);
  const audit = useServerPagination(fetchAdminAudit);

  const [editUser, setEditUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [actionError, setActionError] = useState('');
  const [deleting, setDeleting] = useState(false);

  function refreshTables() {
    users.invalidate();
    users.goToPage(users.page);
    audit.invalidate();
  }

  function handleUserSaved(updated) {
    refreshTables();
    if (updated?.id === currentUser?.id) {
      refreshUser();
    }
  }

  async function handleConfirmDelete() {
    if (!deleteUser?.id) return;

    setDeleting(true);
    setActionError('');
    try {
      await deleteAdminUser(deleteUser.id);
      setDeleteUser(null);
      refreshTables();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Could not delete user.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Administration"
        title="Dashboard"
        description="Admin only: user directory and audit feed. No password hashes, wrapped keys, or plaintext."
      />
      <UpcomingFeatureBanner>
        Crypto and payload events will appear in the audit log when those features ship.
      </UpcomingFeatureBanner>
      <div className="grid gap-6">
        <Card title="Users">
          {actionError ? (
            <Alert variant="failure" className="mb-3">
              {actionError}
            </Alert>
          ) : null}
          {users.loading && users.items.length === 0 ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : users.error ? (
            <Alert variant="failure" className="my-6 text-center">
              {users.error}
            </Alert>
          ) : (
            <DataTable
              minWidth="32rem"
              maxBodyHeight="20rem"
              scrollAriaLabel="User directory"
              bodyBusy={users.switching}
              footer={
                <Pagination
                  page={users.page}
                  totalPages={users.totalPages}
                  onPageChange={users.goToPage}
                  onPrefetchPage={users.prefetchPage}
                  prefetchingPages={users.prefetchingPages}
                />
              }
            >
              <TableHeader sticky>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Name</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead align="right" className="w-[1%] whitespace-nowrap">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.items.length === 0 ? (
                  <TableEmpty colSpan={5}>No users yet.</TableEmpty>
                ) : (
                  users.items.map((user) => {
                    const isSelf = user.id === currentUser?.id;
                    return (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell tone="mono">@{user.username}</TableCell>
                        <TableCell className="capitalize">{user.role}</TableCell>
                        <TableCell>
                          <VerifiedBadge verified={user.isEmailVerified} />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              type="button"
                              variant="chrome"
                              size="iconSm"
                              aria-label={`Edit ${user.username}`}
                              onClick={() => {
                                setActionError('');
                                setEditUser(user);
                              }}
                            >
                              <Pencil className="size-3.5" aria-hidden />
                            </Button>
                            <Button
                              type="button"
                              variant="chrome"
                              size="iconSm"
                              aria-label={`Delete ${user.username}`}
                              disabled={isSelf}
                              title={isSelf ? 'You cannot delete your own account' : undefined}
                              onClick={() => {
                                setActionError('');
                                setDeleteUser(user);
                              }}
                              className="hover:border-danger/50 hover:text-danger-foreground"
                            >
                              <Trash2 className="size-3.5" aria-hidden />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </DataTable>
          )}
        </Card>
        <Card title="Audit log">
          <AuditLogTable
            items={audit.items}
            loading={audit.loading && audit.items.length === 0}
            error={audit.error}
            showUser
            emptyMessage="No audit events yet."
            page={audit.page}
            totalPages={audit.totalPages}
            onPageChange={audit.goToPage}
            onPrefetchPage={audit.prefetchPage}
            prefetchingPages={audit.prefetchingPages}
            switching={audit.switching}
          />
        </Card>
      </div>

      <AdminEditUserModal
        open={Boolean(editUser)}
        user={editUser}
        onClose={() => setEditUser(null)}
        onSaved={handleUserSaved}
      />

      <TypeToConfirmModal
        open={Boolean(deleteUser)}
        onClose={() => !deleting && setDeleteUser(null)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        title={deleteUser ? `Delete @${deleteUser.username}?` : 'Delete user?'}
        confirmPhrase={deleteUser ? `delete ${deleteUser.username}` : 'delete user'}
        confirmLabel="Delete user"
      >
        <p>
          This permanently deletes{' '}
          <span className="font-semibold">{deleteUser ? `@${deleteUser.username}` : 'this user'}</span>
          . Their account is removed from the system. This cannot be undone. Audit history may still
          reference this user id.
        </p>
      </TypeToConfirmModal>
    </>
  );
}
