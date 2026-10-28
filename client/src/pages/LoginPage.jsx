import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '../components/common/Alert';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import FieldGroup from '../components/common/FieldGroup';
import FormError from '../components/common/FormError';
import { useAuth } from '../context/AuthContext';
import { resendVerificationEmail } from '../services/authService';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [fieldsInvalid, setFieldsInvalid] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendFeedback, setResendFeedback] = useState(null);
  const [resending, setResending] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setFieldsInvalid(false);
    setNeedsVerification(false);
    setResendFeedback(null);
    setSubmitting(true);
    try {
      await login({ identifier, password });
      navigate('/', { replace: true });
    } catch (err) {
      const code = err.response?.data?.code;
      if (code === 'EMAIL_NOT_VERIFIED') {
        setNeedsVerification(true);
      }
      setError(err.response?.data?.message || 'Sign in failed. Try again.');
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
        <FormError message={error} />
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
            setError('');
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
            setError('');
          }}
        />
        <p className="text-right text-xs">
          <Link to="/forgot-password" className="text-link hover:text-link-hover">
            Forgot password?
          </Link>
        </p>
        {needsVerification ? (
          <Alert variant="warning" title="Email not verified">
            <p>Check your inbox for the verification link, or resend it below.</p>
            {resendFeedback ? (
              <Alert variant={resendFeedback.variant} className="mt-2">
                {resendFeedback.message}
              </Alert>
            ) : null}
            <Button
              type="button"
              variant="secondary"
              className="mt-3"
              fullWidth
              disabled={resending || !identifier.trim()}
              onClick={async () => {
                setResending(true);
                setResendFeedback(null);
                try {
                  const data = await resendVerificationEmail(identifier.trim());
                  setResendFeedback({ variant: 'success', message: data.message });
                } catch (resendErr) {
                  setResendFeedback({
                    variant: 'failure',
                    message: resendErr.response?.data?.message || 'Could not resend email.',
                  });
                } finally {
                  setResending(false);
                }
              }}
            >
              {resending ? 'Sending…' : 'Resend verification email'}
            </Button>
          </Alert>
        ) : null}
        <Button type="submit" fullWidth disabled={submitting}>
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
