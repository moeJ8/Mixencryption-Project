import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import FieldGroup from '../components/common/FieldGroup';
import FormError from '../components/common/FormError';
import { resetPassword } from '../services/authService';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!token) {
      setError('Reset token is missing. Use the link from your email.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await resetPassword({ token, password });
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not reset password.');
    } finally {
      setSubmitting(false);
    }
  }

  if (!token) {
    return (
      <Card title="Reset password">
        <p className="text-sm text-muted-foreground">
          Open the reset link from your email to set a new password.
        </p>
        <p className="mt-6 text-center text-sm">
          <Link to="/forgot-password" className="text-link hover:text-link-hover">
            Request a new link
          </Link>
        </p>
      </Card>
    );
  }

  return (
    <Card title="Reset password">
      {done ? (
        <p className="text-sm text-foreground">
          Password updated. You can sign in with your new password.
        </p>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <FormError message={error} />
          <FieldGroup
            id="password"
            label="New password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="text-xs text-subtle-foreground">At least 8 characters.</p>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Saving…' : 'Update password'}
          </Button>
        </form>
      )}
      <p className="mt-6 text-center text-sm text-subtle-foreground">
        <Link to="/login" className="text-link hover:text-link-hover">
          Sign in
        </Link>
      </p>
    </Card>
  );
}
