import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Spinner from '../components/common/Spinner';
import PageHeader from '../components/shared/PageHeader';
import { useAuth } from '../context/AuthContext';
import { api, getApiBaseUrl } from '../utils/api';

export default function LandingPage() {
  const { user, isAuthenticated } = useAuth();
  const [health, setHealth] = useState(null);
  const [healthError, setHealthError] = useState('');
  const [healthLoading, setHealthLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    setHealthLoading(true);
    (async () => {
      try {
        const { data } = await api.get('/api/health');
        if (!cancelled) setHealth(data);
      } catch {
        if (!cancelled) {
          setHealthError('API health check failed. Confirm the server is running.');
        }
      } finally {
        if (!cancelled) setHealthLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const apiMode = import.meta.env.DEV
    ? 'Vite proxy to localhost:5000'
    : getApiBaseUrl() || 'Set VITE_API_URL on Vercel';

  return (
    <>
      <PageHeader
        title="Application-layer hybrid encryption"
        description="MixEncryption combines AES-256-GCM payload protection with RSA key wrapping. Auth is live; workspace, vault, and benchmarks are upcoming features."
      />

      {isAuthenticated ? (
        <div className="mb-8 grid gap-6 md:grid-cols-2">
          <Card title="Account">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-4 border-b border-border pb-2">
                <dt className="text-subtle-foreground">Name</dt>
                <dd className="text-foreground">{user?.name}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-border pb-2">
                <dt className="text-subtle-foreground">Username</dt>
                <dd className="font-mono text-foreground">{user?.username}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-border pb-2">
                <dt className="text-subtle-foreground">Role</dt>
                <dd className="capitalize text-foreground">{user?.role}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-subtle-foreground">Crypto keys</dt>
                <dd className="text-foreground">
                  {user?.hasCryptoKeys ? 'Registered' : 'Not set yet'}
                </dd>
              </div>
            </dl>
          </Card>
          <Card title="API status">
            <p className="text-sm text-muted-foreground">
              Signed in as <span className="text-foreground">{user?.email}</span>
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Connection mode:{' '}
              <code className="mt-1 block break-all rounded bg-surface px-1.5 py-0.5 font-mono text-xs text-accent sm:mt-0 sm:inline">
                {apiMode}
              </code>
            </p>
            <div className="mt-4 flex min-h-[2rem] items-center gap-2 text-sm">
              {healthLoading ? (
                <>
                  <Spinner />
                  <span className="text-muted-foreground">Checking /api/health…</span>
                </>
              ) : healthError ? (
                <span className="text-danger">{healthError}</span>
              ) : (
                <span className="text-emerald-400">
                  {health?.service ?? 'mixencryption-api'} is reachable.
                </span>
              )}
            </div>
          </Card>
        </div>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2">
        <Card title="Pipeline (upcoming feature)">
          <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
            <li>Optional deflate compression in the browser</li>
            <li>AES-256-GCM with an ephemeral session key</li>
            <li>RSA-OAEP wrap of the session key</li>
            <li>Envelope stored in MongoDB</li>
          </ol>
        </Card>
        <Card title="Get started">
          <p className="text-sm text-muted-foreground">
            {isAuthenticated
              ? 'Open Workspace, Vault, or Benchmarks from the header. Admins also have a Dashboard for users and audit logs.'
              : 'Create an account or sign in to access the control panel.'}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {isAuthenticated ? (
              <>
                <Link to="/workspace" className="w-full sm:w-auto">
                  <Button type="button" className="w-full sm:w-auto">Workspace</Button>
                </Link>
                <Link to="/profile" className="w-full sm:w-auto">
                  <Button type="button" variant="secondary" className="w-full sm:w-auto">Profile</Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="w-full sm:w-auto">
                  <Button type="button" className="w-full sm:w-auto">Create account</Button>
                </Link>
                <Link to="/login" className="w-full sm:w-auto">
                  <Button type="button" variant="secondary" className="w-full sm:w-auto">Sign in</Button>
                </Link>
              </>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
