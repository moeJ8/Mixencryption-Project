import { useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import PageHeader from '../components/shared/PageHeader';
import { useAuth } from '../context/AuthContext';
import { resendVerificationEmail } from '../services/authService';
import { getUserAvatarUrl } from '../utils/userAvatar';

function formatDate(value) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return '—';
  }
}

function VerificationBadge({ verified }) {
  if (verified) {
    return (
      <span className="inline-flex items-center rounded-md border border-border bg-surface px-2 py-0.5 text-xs font-medium text-muted-foreground">
        Verified
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-md border border-danger/50 bg-danger-soft px-2 py-0.5 text-xs font-medium text-danger-foreground">
      Unverified
    </span>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [resendStatus, setResendStatus] = useState('');
  const [resending, setResending] = useState(false);

  async function handleResend() {
    if (!user?.email) return;
    setResending(true);
    setResendStatus('');
    try {
      const data = await resendVerificationEmail(user.email);
      setResendStatus(data.message);
    } catch (err) {
      setResendStatus(err.response?.data?.message || 'Could not send email.');
    } finally {
      setResending(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Profile"
        description="Account details from your MixEncryption session."
      />
      <div className="grid gap-6 md:grid-cols-[minmax(0,16rem)_1fr]">
        <Card className="flex flex-col items-center text-center">
          <div className="relative">
            <img
              src={getUserAvatarUrl(user)}
              alt=""
              className="size-24 rounded-full border border-border object-cover"
              width={96}
              height={96}
              referrerPolicy="no-referrer"
            />
            {!user?.isEmailVerified ? (
              <span
                className="absolute -right-1 -top-1 size-3.5 rounded-full border-2 border-card bg-danger"
                title="Email not verified"
                aria-hidden
              />
            ) : null}
          </div>
          <h2 className="mt-4 text-lg font-semibold text-foreground">{user?.name}</h2>
          <p className="text-sm text-muted-foreground">@{user?.username}</p>
          <div className="mt-3">
            <VerificationBadge verified={user?.isEmailVerified} />
          </div>
        </Card>

        <Card title="Account information">
          {!user?.isEmailVerified ? (
            <div className="mb-6 rounded-lg border border-danger/40 bg-danger-soft px-4 py-3">
              <p className="text-sm font-medium text-danger-foreground">
                Your email is not verified
              </p>
              <p className="mt-1 text-sm text-danger-foreground/90">
                Open the link we sent to {user?.email}, or resend it below.
              </p>
              {resendStatus ? (
                <p className="mt-2 text-sm text-foreground">{resendStatus}</p>
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
            </div>
          ) : null}

          <dl className="space-y-3 text-sm">
            <div className="flex flex-col gap-1 border-b border-border pb-3 sm:flex-row sm:justify-between sm:items-center">
              <dt className="text-subtle-foreground">Full name</dt>
              <dd className="font-medium text-foreground">{user?.name}</dd>
            </div>
            <div className="flex flex-col gap-1 border-b border-border pb-3 sm:flex-row sm:justify-between">
              <dt className="text-subtle-foreground">Username</dt>
              <dd className="font-mono text-foreground">{user?.username}</dd>
            </div>
            <div className="flex flex-col gap-1 border-b border-border pb-3 sm:flex-row sm:justify-between">
              <dt className="text-subtle-foreground">Email</dt>
              <dd className="text-foreground">{user?.email}</dd>
            </div>
            <div className="flex flex-col gap-1 border-b border-border pb-3 sm:flex-row sm:justify-between sm:items-center">
              <dt className="text-subtle-foreground">Email verified</dt>
              <dd>
                <VerificationBadge verified={user?.isEmailVerified} />
              </dd>
            </div>
            <div className="flex flex-col gap-1 border-b border-border pb-3 sm:flex-row sm:justify-between">
              <dt className="text-subtle-foreground">Role</dt>
              <dd className="capitalize text-foreground">{user?.role}</dd>
            </div>
            <div className="flex flex-col gap-1 border-b border-border pb-3 sm:flex-row sm:justify-between">
              <dt className="text-subtle-foreground">Crypto keys</dt>
              <dd className="text-foreground">
                {user?.hasCryptoKeys ? 'Registered' : 'Not set yet'}
              </dd>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
              <dt className="text-subtle-foreground">Member since</dt>
              <dd className="text-foreground">{formatDate(user?.createdAt)}</dd>
            </div>
          </dl>
        </Card>
      </div>
    </>
  );
}
