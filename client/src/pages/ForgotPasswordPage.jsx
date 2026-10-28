import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import FieldGroup from '../components/common/FieldGroup';
import { requestPasswordReset } from '../services/authService';
import { toastError, toastSuccess } from '../theme/toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [emailInvalid, setEmailInvalid] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setEmailInvalid(false);
    setSubmitting(true);
    try {
      const data = await requestPasswordReset(email);
      toastSuccess(data.message);
    } catch (err) {
      const msg = err.response?.data?.message || 'Request failed. Try again.';
      toastError(msg);
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
