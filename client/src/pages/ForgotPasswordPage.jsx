import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import FieldGroup from '../components/common/FieldGroup';
import FormError from '../components/common/FormError';
import { requestPasswordReset } from '../services/authService';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setStatus('');
    setSubmitting(true);
    try {
      const data = await requestPasswordReset(email);
      setStatus(data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Request failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card title="Forgot password">
      <p className="mb-6 text-sm text-muted-foreground">
        Enter your account email. If it exists, we will send a reset link (expires in 1 hour).
      </p>
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <FormError message={error} />
        {status ? (
          <p className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground">
            {status}
          </p>
        ) : null}
        <FieldGroup
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? 'Sending…' : 'Send reset link'}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-subtle-foreground">
        <Link to="/login" className="text-link hover:text-link-hover">
          Back to sign in
        </Link>
      </p>
    </Card>
  );
}
