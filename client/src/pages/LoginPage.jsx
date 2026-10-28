import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import FieldGroup from '../components/common/FieldGroup';
import GoogleSignInButton from '../components/auth/GoogleSignInButton';
import { useAuth } from '../context/AuthContext';
import { resendVerificationEmail } from '../services/authService';
import { toastAlert, toastError, toastSuccess } from '../theme/toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [fieldsInvalid, setFieldsInvalid] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resending, setResending] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setFieldsInvalid(false);
    setNeedsVerification(false);
    setSubmitting(true);
    try {
      await login({ identifier, password });
      navigate('/', { replace: true });
    } catch (err) {
      const code = err.response?.data?.code;
      const message = err.response?.data?.message || 'Sign in failed. Try again.';
      if (code === 'EMAIL_NOT_VERIFIED') {
        setNeedsVerification(true);
        toastAlert('Verify your email before signing in.');
      } else {
        toastError(message);
      }
      setFieldsInvalid(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card title="Sign in">
      <p className="mb-6 text-sm text-muted-foreground">
        Use your email or username and password.
      </p>
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <FieldGroup
          id="login-identifier"
          label="Email or username"
          type="text"
          autoComplete="username"
          required
          value={identifier}
          invalid={fieldsInvalid}
          onChange={(e) => {
            setIdentifier(e.target.value);
            setFieldsInvalid(false);
            setNeedsVerification(false);
          }}
        />
        <FieldGroup
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          invalid={fieldsInvalid}
          onChange={(e) => {
            setPassword(e.target.value);
            setFieldsInvalid(false);
            setNeedsVerification(false);
          }}
        />
        <p className="text-right text-xs">
          <Link to="/forgot-password" className="text-link hover:text-link-hover">
            Forgot password?
          </Link>
        </p>
        {needsVerification ? (
          <div className="rounded-lg border border-border bg-muted-surface p-4 text-sm text-muted-foreground">
            <p>Check your inbox for the verification link, or resend it below.</p>
            <Button
              type="button"
              variant="secondary"
              className="mt-3"
              fullWidth
              disabled={resending || !identifier.trim()}
              onClick={async () => {
                setResending(true);
                try {
                  const data = await resendVerificationEmail(identifier.trim());
                  toastSuccess(data.message);
                } catch (resendErr) {
                  toastError(
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
        <Button type="submit" fullWidth disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </Button>
        <div className="flex items-center gap-3 py-1">
          <span className="h-px flex-1 bg-border" aria-hidden />
          <span className="text-xs text-muted-foreground">or</span>
          <span className="h-px flex-1 bg-border" aria-hidden />
        </div>
        <GoogleSignInButton disabled={submitting} />
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
