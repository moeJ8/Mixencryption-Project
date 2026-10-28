import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Spinner from '../components/common/Spinner';
import { verifyEmail } from '../services/authService';

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
        }
      } catch (err) {
        if (!cancelled) {
          setMessage(err.response?.data?.message || 'Verification failed.');
          setPhase('error');
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
          className={`text-sm ${phase === 'success' ? 'text-foreground' : 'text-danger'}`}
          role={phase === 'error' ? 'alert' : undefined}
        >
          {message}
        </p>
      ) : null}
      <div className="mt-6">
        <Link to="/login">
          <Button type="button" className="w-full">Go to sign in</Button>
        </Link>
      </div>
    </Card>
  );
}
