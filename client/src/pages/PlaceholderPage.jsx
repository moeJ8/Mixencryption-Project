import { useEffect, useState } from 'react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Spinner from '../components/common/Spinner';
import PageHeader from '../components/shared/PageHeader';
import { api, getApiBaseUrl } from '../utils/api';

export default function PlaceholderPage() {
  const [health, setHealth] = useState(null);
  const [healthError, setHealthError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function checkHealth() {
      setLoading(true);
      setHealthError(null);
      try {
        const { data } = await api.get('/api/health');
        if (!cancelled) setHealth(data);
      } catch (err) {
        if (!cancelled) {
          setHealthError(
            err.response?.data?.message ||
              err.message ||
              'Could not reach the API. Is the server running on port 5000?',
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    checkHealth();
    return () => {
      cancelled = true;
    };
  }, []);

  const apiMode = import.meta.env.DEV
    ? 'Vite proxy → localhost:5000'
    : getApiBaseUrl() || '(set VITE_API_URL on Vercel)';

  return (
    <>
      <PageHeader
        title="MixEncryption"
        description="Full-stack hybrid encryption workspace. Auth, vault, and Web Crypto pipeline will be wired in upcoming sprints."
      />
      <Card title="API connection">
        <p className="text-sm text-slate-400">
          Mode:{' '}
          <code className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-cyan-300">
            {apiMode}
          </code>
        </p>
        <div className="mt-4 flex min-h-[2rem] items-center gap-2 text-sm">
          {loading ? (
            <>
              <Spinner />
              <span className="text-slate-400">Checking /api/health…</span>
            </>
          ) : healthError ? (
            <span className="text-red-400">{healthError}</span>
          ) : (
            <span className="text-emerald-400">
              API OK — {health?.service ?? 'connected'}
            </span>
          )}
        </div>
      </Card>
      <Card title="Placeholder" className="mt-6">
        <p className="text-sm leading-relaxed text-slate-400">
          Use{' '}
          <code className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-cyan-300">
            import {'{ api }'} from &apos;../utils/api&apos;
          </code>{' '}
          for all backend calls. Local dev uses relative{' '}
          <code className="font-mono text-slate-300">/api</code> paths through
          the Vite proxy.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button type="button" disabled>
            Encrypt (soon)
          </Button>
          <Button type="button" variant="secondary" disabled>
            Open vault (soon)
          </Button>
        </div>
      </Card>
    </>
  );
}
