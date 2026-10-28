import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import FieldGroup from '../components/common/FieldGroup';
import FormError from '../components/common/FormError';
import { useAuth } from '../context/AuthContext';
import { mapAuthFieldErrors } from '../utils/formFieldErrors';
import { PASSWORD_HINT, validatePassword } from '../utils/passwordPolicy';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  function clearFieldError(key) {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function updateField(key, value) {
    clearFieldError(key);
    setError('');
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setFieldErrors({});
    const passwordCheck = validatePassword(form.password);
    if (!passwordCheck.ok) {
      setFieldErrors({ password: passwordCheck.message });
      return;
    }
    setSubmitting(true);
    try {
      await register(form);
      navigate('/check-email', { replace: true, state: { email: form.email } });
    } catch (err) {
      const msg = err.response?.data?.message;
      const { formError, fieldErrors: mapped } = mapAuthFieldErrors(msg);
      setFieldErrors(mapped);
      setError(
        formError ||
          (Object.keys(mapped).length === 0 ? msg || 'Registration failed. Try again.' : ''),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card title="Create account">
      <p className="mb-6 text-sm text-muted-foreground">
        We email you a verification link after signup. You can open it from your inbox
        or finish verification after you sign in.
      </p>
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <FormError message={error} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldGroup
            id="name"
            label="Full name"
            autoComplete="name"
            required
            value={form.name}
            error={fieldErrors.name}
            onChange={(e) => updateField('name', e.target.value)}
          />
          <FieldGroup
            id="username"
            label="Username"
            autoComplete="username"
            required
            value={form.username}
            error={fieldErrors.username}
            onChange={(e) => updateField('username', e.target.value)}
          />
        </div>
        <FieldGroup
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          error={fieldErrors.email}
          onChange={(e) => updateField('email', e.target.value)}
        />
        <FieldGroup
          id="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={form.password}
          error={fieldErrors.password}
          helperText={PASSWORD_HINT}
          helperVisible="focus-or-error"
          onChange={(e) => updateField('password', e.target.value)}
        />
        <Button type="submit" fullWidth disabled={submitting}>
          {submitting ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-subtle-foreground">
        Already registered?{' '}
        <Link to="/login" className="text-link hover:text-link-hover">
          Sign in
        </Link>
      </p>
    </Card>
  );
}
