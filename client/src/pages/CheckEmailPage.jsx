import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { resendVerificationEmail } from '../services/authService';
import { toastAlert, toastError, toastSuccess } from '../theme/toast';

export default function CheckEmailPage() {
  const location = useLocation();
  const email = location.state?.email || '';
  const [submitting, setSubmitting] = useState(false);

  async function handleResend() {
    if (!email) {
      toastAlert('Use resend on the sign-in page if you did not arrive here from registration.');
      return;
    }
    setSubmitting(true);
    try {
      const data = await resendVerificationEmail(email);
      toastSuccess(data.message);
    } catch (err) {
      toastError(err.response?.data?.message || 'Could not resend verification email.');
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
