import { useCallback, useEffect, useRef, useState } from 'react';
import { Camera, Check, X } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Alert from '../components/common/Alert';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Spinner from '../components/common/Spinner';
import AdminEditUserModal from '../components/admin/AdminEditUserModal';
import AuditLogTable from '../components/shared/AuditLogTable';
import PageHeader from '../components/shared/PageHeader';
import { useAuth } from '../context/AuthContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useServerPagination } from '../hooks/useServerPagination';
import { fetchAdminUser, fetchAdminUserActivity, removeAdminUserAvatar, uploadAdminUserAvatar } from '../services/adminService';
import { resendVerificationEmail, fetchMyActivity } from '../services/authService';
import { removeProfileAvatar, uploadProfileAvatar } from '../services/profileService';
import { toastError, toastSuccess } from '../theme/toast';
import { getUserAvatarUrl } from '../utils/userAvatar';
import AvatarUploadProgressRing from '../components/profile/AvatarUploadProgressRing';

function formatDate(value) {
  if (!value) return 'N/A';
  try {
    return new Date(value).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return 'N/A';
  }
}

function formatMemberSince(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function VerificationBadge({ verified }) {
  if (verified) {
    return (
      <span className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-0.5 text-xs font-medium text-muted-foreground">
        <Check className="size-3 shrink-0 text-success" strokeWidth={2.5} aria-hidden />
        Verified
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-danger/50 bg-danger-soft px-2 py-0.5 text-xs font-medium text-danger-foreground">
      <X className="size-3 shrink-0" strokeWidth={2.5} aria-hidden />
      Unverified
    </span>
  );
}

export default function ProfilePage() {
  const { userId: routeUserId } = useParams();
  const { user: sessionUser, refreshUser } = useAuth();
  const fileInputRef = useRef(null);
  const [resendFeedback, setResendFeedback] = useState(null);
  const [resending, setResending] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarUploadProgress, setAvatarUploadProgress] = useState(0);
  const [avatarProcessing, setAvatarProcessing] = useState(false);
  const [avatarRemoving, setAvatarRemoving] = useState(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [adminEditOpen, setAdminEditOpen] = useState(false);
  const [viewedUser, setViewedUser] = useState(null);
  const [profileLoadError, setProfileLoadError] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  const isOwnProfile = !routeUserId || routeUserId === sessionUser?.id;
  const isAdminView = Boolean(routeUserId && !isOwnProfile && sessionUser?.role === 'admin');
  const canManagePhoto = isOwnProfile || isAdminView;

  const profileDocumentTitle =
    isAdminView && viewedUser?.username ? `@${viewedUser.username}` : 'Profile';
  useDocumentTitle(profileDocumentTitle);

  const activityFetch = useCallback(
    (page) => {
      if (isOwnProfile) {
        return fetchMyActivity(page);
      }
      return fetchAdminUserActivity(routeUserId, page);
    },
    [isOwnProfile, routeUserId],
  );
  const activity = useServerPagination(activityFetch);

  useEffect(() => {
    if (isOwnProfile) {
      setViewedUser(null);
      setProfileLoadError('');
      setProfileLoading(false);
      return undefined;
    }

    let cancelled = false;
    setProfileLoading(true);
    setProfileLoadError('');
    fetchAdminUser(routeUserId)
      .then((data) => {
        if (!cancelled) setViewedUser(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setProfileLoadError(err.response?.data?.message || 'Could not load profile.');
        }
      })
      .finally(() => {
        if (!cancelled) setProfileLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isOwnProfile, routeUserId]);

  if (routeUserId && routeUserId !== sessionUser?.id && sessionUser?.role !== 'admin') {
    return <Navigate to="/profile" replace />;
  }

  const profileUser = isOwnProfile ? sessionUser : viewedUser;
  const hasCustomPhoto = Boolean(profileUser?.profileImageUrl);

  if (profileLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center gap-2 text-muted-foreground">
        <Spinner />
        <span className="text-sm">Loading profile…</span>
      </div>
    );
  }

  if (profileLoadError) {
    return (
      <Alert variant="failure" title="Profile unavailable">
        {profileLoadError}
        <div className="mt-3">
          <Link to="/dashboard" className="text-sm text-link hover:text-link-hover">
            Back to admin dashboard
          </Link>
        </div>
      </Alert>
    );
  }

  if (!profileUser) {
    return null;
  }

  async function handleAvatarPick(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setAvatarUploading(true);
    setAvatarProcessing(false);
    setAvatarUploadProgress(2);

    let processingTimer = null;

    const bumpProcessing = () => {
      setAvatarProcessing(true);
      processingTimer = window.setInterval(() => {
        setAvatarUploadProgress((prev) => {
          if (prev >= 92) return prev;
          return prev + 1;
        });
      }, 140);
    };

    try {
      const uploadHandlers = {
        onUploadProgress: (uploadPercent) => {
          const mapped = 2 + Math.round(uploadPercent * 0.58);
          setAvatarUploadProgress((prev) => Math.max(prev, Math.min(60, mapped)));
        },
        onUploadBytesComplete: bumpProcessing,
      };

      const data = isAdminView
        ? await uploadAdminUserAvatar(routeUserId, file, uploadHandlers)
        : await uploadProfileAvatar(file, uploadHandlers);

      if (processingTimer) {
        window.clearInterval(processingTimer);
        processingTimer = null;
      }

      setAvatarUploadProgress(94);
      setAvatarProcessing(false);
      if (isAdminView) {
        setViewedUser(data.user);
      } else {
        await refreshUser();
      }
      setAvatarUploadProgress(100);
      await new Promise((resolve) => {
        window.setTimeout(resolve, 220);
      });
      setAvatarModalOpen(false);
      toastSuccess(data.message || 'Profile photo updated.');
    } catch (err) {
      toastError(err.response?.data?.message || 'Could not upload photo.');
    } finally {
      if (processingTimer) {
        window.clearInterval(processingTimer);
      }
      setAvatarProcessing(false);
      setAvatarUploading(false);
      setAvatarUploadProgress(0);
    }
  }

  async function handleRemoveAvatar() {
    setAvatarRemoving(true);
    try {
      const data = isAdminView
        ? await removeAdminUserAvatar(routeUserId)
        : await removeProfileAvatar();
      if (isAdminView) {
        setViewedUser(data.user);
      } else {
        await refreshUser();
      }
      setAvatarModalOpen(false);
      toastSuccess(data.message || 'Profile photo removed.');
    } catch (err) {
      toastError(err.response?.data?.message || 'Could not remove photo.');
    } finally {
      setAvatarRemoving(false);
    }
  }

  function handleAvatarClick() {
    if (avatarUploading || avatarRemoving) return;
    if (hasCustomPhoto) {
      setAvatarModalOpen(true);
      return;
    }
    fileInputRef.current?.click();
  }

  function openFilePickerFromModal() {
    setAvatarModalOpen(false);
    fileInputRef.current?.click();
  }

  async function handleResend() {
    if (!profileUser?.email) return;
    setResending(true);
    setResendFeedback(null);
    try {
      const data = await resendVerificationEmail(profileUser.email);
      setResendFeedback({ variant: 'success', message: data.message });
      toastSuccess(data.message);
      activity.invalidate();
      activity.goToPage(activity.page);
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not send email.';
      setResendFeedback({
        variant: 'failure',
        message: msg,
      });
      toastError(msg);
    } finally {
      setResending(false);
    }
  }

  function handleAdminUserSaved(updated) {
    if (updated?.id === sessionUser?.id) {
      refreshUser();
    }
    if (updated && isAdminView) {
      setViewedUser(updated);
    }
    setAdminEditOpen(false);
    activity.invalidate();
    activity.goToPage(activity.page);
  }

  return (
    <>
      {canManagePhoto ? (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={handleAvatarPick}
        />
      ) : null}
      {canManagePhoto ? (
        <Modal
        open={avatarModalOpen}
        onClose={() => setAvatarModalOpen(false)}
        title="Profile photo"
        description="JPEG, PNG, or WebP. Max 2 MB."
        maxWidthClass="max-w-md"
        labelledById="profile-photo-modal-title"
        footer={
          <div className="modal-footer-actions">
            {hasCustomPhoto ? (
              <Button
                type="button"
                variant="dangerOutline"
                disabled={avatarUploading || avatarRemoving}
                loading={avatarRemoving}
                onClick={handleRemoveAvatar}
              >
                Remove photo
              </Button>
            ) : null}
            <Button
              type="button"
              variant="primary"
              disabled={avatarUploading || avatarRemoving}
              loading={avatarUploading}
              onClick={openFilePickerFromModal}
            >
              Change photo
            </Button>
          </div>
        }
      >
        <div className="flex justify-center py-2">
          <img
            src={getUserAvatarUrl(profileUser)}
            alt=""
            className="size-28 rounded-full border border-border object-cover"
            width={112}
            height={112}
            referrerPolicy="no-referrer"
          />
        </div>
      </Modal>
      ) : null}
      <PageHeader
        title={isAdminView ? `@${profileUser.username}` : 'Profile'}
        description={
          isAdminView
            ? 'Admin view. You can update this user’s photo; other fields are edited via Edit user.'
            : 'Account details and your recent security activity.'
        }
        actions={
          isAdminView ? (
            <Button type="button" variant="secondary" onClick={() => setAdminEditOpen(true)}>
              Edit user
            </Button>
          ) : null
        }
      />
      {isAdminView ? (
        <p className="-mt-2 mb-6 text-sm text-muted-foreground sm:-mt-4">
          <Link to="/dashboard" className="text-link hover:text-link-hover">
            Back to admin dashboard
          </Link>
        </p>
      ) : null}
      <AdminEditUserModal
        open={adminEditOpen}
        user={profileUser}
        onClose={() => setAdminEditOpen(false)}
        onSaved={handleAdminUserSaved}
      />
      <div className="grid gap-6 md:grid-cols-[minmax(0,16rem)_1fr]">
        <Card className="flex h-full flex-col p-0 sm:p-0">
          <div className="flex flex-1 flex-col items-center px-4 pt-4 pb-8 text-center sm:px-6 sm:pt-6">
            <div className="relative flex size-32 items-center justify-center">
              {canManagePhoto && avatarUploading ? (
                <AvatarUploadProgressRing
                  progress={avatarUploadProgress}
                  processing={avatarProcessing}
                />
              ) : null}
              {canManagePhoto ? (
                <button
                  type="button"
                  className="group relative size-24 cursor-pointer rounded-full transition-transform duration-200 ease-out hover:scale-105 active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-card disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
                  onClick={handleAvatarClick}
                  disabled={avatarUploading || avatarRemoving}
                  aria-busy={avatarUploading || undefined}
                  aria-label={
                    avatarUploading
                      ? `Uploading profile photo, ${avatarUploadProgress} percent`
                      : hasCustomPhoto
                        ? 'Manage profile photo'
                        : 'Upload profile photo'
                  }
                >
                  <img
                    src={getUserAvatarUrl(profileUser)}
                    alt=""
                    className={`size-24 rounded-full border object-cover transition duration-200 ${
                      avatarUploading
                        ? 'border-primary/40 brightness-95 saturate-90'
                        : 'border-border group-hover:border-primary/60 group-hover:brightness-[0.82] group-focus-visible:border-primary/60 group-focus-visible:brightness-[0.82]'
                    }`}
                    width={96}
                    height={96}
                    referrerPolicy="no-referrer"
                  />
                  {!avatarUploading ? (
                    <span
                      className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-0.5 rounded-full bg-primary/25 opacity-0 ring-2 ring-inset ring-primary/0 transition-all duration-200 group-hover:opacity-100 group-hover:ring-primary/40 group-focus-visible:opacity-100 group-focus-visible:ring-primary/40"
                      aria-hidden
                    >
                      <Camera
                        className="size-7 text-foreground drop-shadow-sm transition-transform duration-200 group-hover:scale-110 group-focus-visible:scale-110"
                        strokeWidth={1.75}
                      />
                      <span className="text-[10px] font-medium uppercase tracking-wide text-foreground drop-shadow-sm">
                        Edit
                      </span>
                    </span>
                  ) : null}
                </button>
              ) : null}
            </div>
            <h2 className="mt-4 text-lg font-semibold text-foreground">{profileUser?.name}</h2>
            <p className="text-sm text-muted-foreground">@{profileUser?.username}</p>
            <div className="mt-3">
              <VerificationBadge verified={profileUser?.isEmailVerified} />
            </div>
          </div>
          <div className="mt-auto w-full border-t border-border px-4 py-4 text-center sm:px-6">
            <p className="text-xs text-subtle-foreground">Member since</p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {formatMemberSince(profileUser?.createdAt)}
            </p>
          </div>
        </Card>

        <Card title="Account information">
          {isOwnProfile && !profileUser?.isEmailVerified ? (
            <Alert variant="warning" title="Your email is not verified" className="mb-6">
              <p>Open the link we sent to {profileUser?.email}, or resend it below.</p>
              {resendFeedback ? (
                <Alert variant={resendFeedback.variant} className="mt-2">
                  {resendFeedback.message}
                </Alert>
              ) : null}
              <Button
                type="button"
                variant="secondary"
                className="mt-3"
                disabled={resending}
                onClick={handleResend}
              >
                {resending ? 'Sending…' : 'Resend verification email'}
              </Button>
            </Alert>
          ) : null}

          <dl className="space-y-3 text-sm">
            <div className="flex flex-col gap-1 border-b border-border pb-3 sm:flex-row sm:justify-between sm:items-center">
              <dt className="text-subtle-foreground">Full name</dt>
              <dd className="font-medium text-foreground">{profileUser?.name}</dd>
            </div>
            <div className="flex flex-col gap-1 border-b border-border pb-3 sm:flex-row sm:justify-between">
              <dt className="text-subtle-foreground">Username</dt>
              <dd className="font-mono text-foreground">{profileUser?.username}</dd>
            </div>
            <div className="flex flex-col gap-1 border-b border-border pb-3 sm:flex-row sm:justify-between">
              <dt className="text-subtle-foreground">Email</dt>
              <dd className="text-foreground">{profileUser?.email}</dd>
            </div>
            <div className="flex flex-col gap-1 border-b border-border pb-3 sm:flex-row sm:justify-between sm:items-center">
              <dt className="text-subtle-foreground">Email verified</dt>
              <dd>
                <VerificationBadge verified={profileUser?.isEmailVerified} />
              </dd>
            </div>
            <div className="flex flex-col gap-1 border-b border-border pb-3 sm:flex-row sm:justify-between">
              <dt className="text-subtle-foreground">Role</dt>
              <dd className="capitalize text-foreground">{profileUser?.role}</dd>
            </div>
            <div className="flex flex-col gap-1 border-b border-border pb-3 sm:flex-row sm:justify-between">
              <dt className="text-subtle-foreground">Crypto keys</dt>
              <dd className="text-foreground">
                {profileUser?.hasCryptoKeys ? 'Registered' : 'Not set yet'}
              </dd>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
              <dt className="text-subtle-foreground">Member since</dt>
              <dd className="text-foreground">{formatDate(profileUser?.createdAt)}</dd>
            </div>
          </dl>
        </Card>
      </div>

      <Card title={isAdminView ? 'Activity' : 'Your activity'} className="mt-6">
        <p className="mb-4 text-sm text-muted-foreground">
          {isAdminView
            ? 'Sign-in, account, and security events for this user.'
            : 'Sign-in, account, and security events tied to your account. Failed sign-in attempts on other accounts are not shown here.'}
        </p>
        <AuditLogTable
          items={activity.items}
          loading={activity.loading && activity.items.length === 0}
          error={activity.error}
          emptyMessage={
            isAdminView
              ? 'No activity recorded for this user yet.'
              : 'No activity recorded for your account yet.'
          }
          page={activity.page}
          totalPages={activity.totalPages}
          onPageChange={activity.goToPage}
          onPrefetchPage={activity.prefetchPage}
          prefetchingPages={activity.prefetchingPages}
          switching={activity.switching}
        />
      </Card>
    </>
  );
}
