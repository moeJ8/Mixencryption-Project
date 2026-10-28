import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import FieldGroup from '../components/common/FieldGroup';
import FormError from '../components/common/FormError';
import { useAuth } from '../context/AuthContext';
import { resendVerificationEmail } from '../services/authService';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendStatus, setResendStatus] = useState('');
  const [resending, setResending] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setNeedsVerification(false);
    setResendStatus('');
    setSubmitting(true);
    try {
      await login({ email, password });
      navigate('/', { replace: true });
    } catch (err) {
      const code = err.response?.data?.code;
      if (code === 'EMAIL_NOT_VERIFIED') {
        setNeedsVerification(true);
      }
      setError(err.response?.data?.message || 'Sign in failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card title="Sign in">
      <p className="mb-6 text-sm text-muted-foreground">
        Use your email and password. The session is stored in an HttpOnly cookie.
      </p>
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <FormError message={error} />
        <FieldGroup
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FieldGroup
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="text-right text-xs">
          <Link to="/forgot-password" className="text-link hover:text-link-hover">
            Forgot password?
          </Link>
        </p>
        {needsVerification ? (
          <div className="rounded-lg border border-border bg-surface p-3 text-sm">
            <p className="text-muted-foreground">
              Check your inbox for the verification link, or resend it below.
            </p>
            {resendStatus ? (
              <p className="mt-2 text-foreground">{resendStatus}</p>
            ) : null}
            <Button
              type="button"
              variant="secondary"
              className="mt-3 w-full"
              disabled={resending || !email}
              onClick={async () => {
                setResending(true);
                setResendStatus('');
                try {
                  const data = await resendVerificationEmail(email);
                  setResendStatus(data.message);
                } catch (resendErr) {
                  setResendStatus(
                    resendErr.response?.data?.message || 'Could not resend email.',
                  );
                } finally {
                  setResending(false);
                }
              }}
            >
              {resending ? 'Sending…' : 'Resend verification email'}
            </Button>
          </div>
        ) : null}
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-subtle-foreground">
        No account?{' '}
        <Link to="/register" className="text-link hover:text-link-hover">
          Create one
        </Link>
      </p>
    </Card>
  );
}
