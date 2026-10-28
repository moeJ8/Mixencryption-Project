import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Spinner from '../components/common/Spinner';
import { verifyEmail } from '../services/authService';
import { toastError, toastSuccess } from '../theme/toast';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [phase, setPhase] = useState(token ? 'loading' : 'missing');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await verifyEmail(token);
        if (!cancelled) {
          setMessage(data.message);
          setPhase('success');
          toastSuccess(data.message);
        }
      } catch (err) {
        if (!cancelled) {
          const msg = err.response?.data?.message || 'Verification failed.';
          setMessage(msg);
          setPhase('error');
          toastError(msg);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <Card title="Email verification">
      {phase === 'loading' ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Spinner />
          Verifying your email…
        </div>
      ) : null}
      {phase === 'missing' ? (
        <p className="text-sm text-muted-foreground">
          This page needs a verification token from your email link.
        </p>
      ) : null}
      {(phase === 'success' || phase === 'error') && message ? (
        <p
          className={`text-sm ${phase === 'success' ? 'text-muted-foreground' : 'text-danger-foreground'}`}
        >
          {message}
        </p>
      ) : null}
      <div className="mt-6">
        <Link to="/login">
          <Button type="button" fullWidth>
            Go to sign in
          </Button>
        </Link>
      </div>
    </Card>
  );
}
