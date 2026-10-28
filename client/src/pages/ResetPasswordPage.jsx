import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import FieldGroup from '../components/common/FieldGroup';
import { resetPassword } from '../services/authService';
import { mapAuthFieldErrors } from '../utils/formFieldErrors';
import { PASSWORD_HINT, validatePassword } from '../utils/passwordPolicy';
import { toastError, toastSuccess } from '../theme/toast';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [done, setDone] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!token) {
      toastError('Reset token is missing. Use the link from your email.');
      return;
    }
    const passwordCheck = validatePassword(password);
    if (!passwordCheck.ok) {
      setPasswordError(passwordCheck.message);
      toastError(passwordCheck.message);
      return;
    }
    setPasswordError('');
    setSubmitting(true);
    try {
      await resetPassword({ token, password });
      setDone(true);
      toastSuccess('Password updated. You can sign in now.');
    } catch (err) {
      const msg = err.response?.data?.message;
      const { formError, fieldErrors: mapped } = mapAuthFieldErrors(msg);
      setPasswordError(mapped.password || '');
      const displayError = formError || (mapped.password ? '' : msg || 'Could not reset password.');
      if (displayError) toastError(displayError);
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
        <p className="text-sm text-muted-foreground">
          Password updated. You can sign in with your new password.
        </p>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <FieldGroup
            id="password"
            label="New password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            error={passwordError}
            helperText={PASSWORD_HINT}
            helperVisible="focus-or-error"
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError('');
            }}
          />
          <Button type="submit" fullWidth disabled={submitting}>
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
