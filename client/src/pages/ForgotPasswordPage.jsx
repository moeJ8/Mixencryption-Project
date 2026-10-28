import { useState } from 'react';
import { Link } from 'react-router-dom';
import Alert from '../components/common/Alert';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import FieldGroup from '../components/common/FieldGroup';
import FormError from '../components/common/FormError';
import { requestPasswordReset } from '../services/authService';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [status, setStatus] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setEmailInvalid(false);
    setStatus('');
    setSubmitting(true);
    try {
      const data = await requestPasswordReset(email);
      setStatus(data.message);
    } catch (err) {
      const msg = err.response?.data?.message || 'Request failed. Try again.';
      setError(msg);
      setEmailInvalid(true);
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
          <Alert variant="success">{status}</Alert>
        ) : null}
        <FieldGroup
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          invalid={emailInvalid}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailInvalid(false);
            setError('');
          }}
        />
        <Button type="submit" fullWidth disabled={submitting}>
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
