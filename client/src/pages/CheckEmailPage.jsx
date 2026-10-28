import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import FormError from '../components/common/FormError';
import { resendVerificationEmail } from '../services/authService';

export default function CheckEmailPage() {
  const location = useLocation();
  const email = location.state?.email || '';
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleResend() {
    if (!email) {
      setError('Enter your email on the sign-in page and use resend from there.');
      return;
    }
    setError('');
    setStatus('');
    setSubmitting(true);
    try {
      const data = await resendVerificationEmail(email);
      setStatus(data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not resend verification email.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card title="Check your email">
      <p className="mb-4 text-sm text-muted-foreground">
        We sent a verification link
        {email ? (
          <>
            {' '}
            to <span className="font-medium text-foreground">{email}</span>
          </>
        ) : null}
        . Open it to activate your account, then sign in.
      </p>
      <FormError message={error} />
      {status ? (
        <p className="mb-4 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground">
          {status}
        </p>
      ) : null}
      <div className="flex flex-col gap-3">
        {email ? (
          <Button type="button" variant="secondary" disabled={submitting} onClick={handleResend}>
            {submitting ? 'Sending…' : 'Resend verification email'}
          </Button>
        ) : null}
        <Link to="/login" className="text-center text-sm text-link hover:text-link-hover">
          Back to sign in
        </Link>
      </div>
    </Card>
  );
}
