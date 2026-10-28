import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import FieldGroup from '../components/common/FieldGroup';
import FormError from '../components/common/FormError';
import { useAuth } from '../context/AuthContext';

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

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(form);
      navigate('/check-email', { replace: true, state: { email: form.email } });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card title="Create account">
      <p className="mb-6 text-sm text-muted-foreground">
        Local accounts only for Phase 1. You must verify your email before signing in.
      </p>
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <FormError message={error} />
        <FieldGroup
          id="name"
          label="Full name"
          autoComplete="name"
          required
          value={form.name}
          onChange={(e) => updateField('name', e.target.value)}
        />
        <FieldGroup
          id="username"
          label="Username"
          autoComplete="username"
          required
          value={form.username}
          onChange={(e) => updateField('username', e.target.value)}
        />
        <FieldGroup
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={form.email}
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
          onChange={(e) => updateField('password', e.target.value)}
        />
        <p className="text-xs text-subtle-foreground">At least 8 characters.</p>
        <Button type="submit" className="w-full" disabled={submitting}>
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
