import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import FieldGroup from "../components/common/FieldGroup";
import GoogleSignInButton from "../components/auth/GoogleSignInButton";
import { useAuth } from "../context/AuthContext";
import { mapAuthFieldErrors } from "../utils/formFieldErrors";
import { PASSWORD_HINT, validatePassword } from "../utils/passwordPolicy";
import { validateRegisterFields } from "../utils/registerValidation";
import { toastError, toastSuccess } from "../theme/toast";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [invalidFields, setInvalidFields] = useState({});

  function clearInvalid(key) {
    setInvalidFields((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function updateField(key, value) {
    clearInvalid(key);
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function markInvalid(fieldErrors) {
    const flags = {};
    Object.keys(fieldErrors).forEach((key) => {
      flags[key] = true;
    });
    setInvalidFields(flags);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setInvalidFields({});
    const registerCheck = validateRegisterFields(form);
    if (!registerCheck.ok) {
      markInvalid(registerCheck.fieldErrors);
      const toastMessage =
        registerCheck.fieldErrors.username ||
        registerCheck.fieldErrors.email ||
        registerCheck.fieldErrors.name ||
        "Fix the highlighted fields and try again.";
      toastError(toastMessage, {
        duration: registerCheck.fieldErrors.username ? 5500 : 4000,
      });
      return;
    }
    const passwordCheck = validatePassword(form.password);
    if (!passwordCheck.ok) {
      setInvalidFields({ password: true });
      toastError(passwordCheck.message);
      return;
    }
    setSubmitting(true);
    try {
      const result = await register(form);
      toastSuccess(
        result?.message || "Account created. Check your email to verify.",
      );
      navigate("/check-email", { replace: true, state: { email: form.email } });
    } catch (err) {
      const msg = err.response?.data?.message;
      const { formError, fieldErrors: mapped } = mapAuthFieldErrors(msg);
      markInvalid(mapped);
      if (mapped.username) {
        toastError(mapped.username, { duration: 5500 });
      } else if (formError) {
        toastError(formError);
      } else if (Object.keys(mapped).length > 0) {
        toastError(msg || "Fix the highlighted fields and try again.");
      } else {
        toastError(msg || "Registration failed. Try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card title="Create account">
      <p className="mb-6 text-sm text-muted-foreground">
        We email a verification link after signup.
      </p>
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-start">
          <FieldGroup
            id="name"
            label="Full name"
            autoComplete="name"
            required
            value={form.name}
            invalid={invalidFields.name}
            onChange={(e) => updateField("name", e.target.value)}
          />
          <FieldGroup
            id="username"
            label="Username"
            autoComplete="username"
            required
            minLength={4}
            maxLength={32}
            value={form.username}
            invalid={invalidFields.username}
            onChange={(e) => updateField("username", e.target.value)}
          />
        </div>
        <FieldGroup
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          required
          inputMode="email"
          maxLength={254}
          value={form.email}
          invalid={invalidFields.email}
          onChange={(e) => updateField("email", e.target.value)}
        />
        <FieldGroup
          id="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={form.password}
          invalid={invalidFields.password}
          helperText={PASSWORD_HINT}
          helperVisible="always"
          onChange={(e) => updateField("password", e.target.value)}
        />
        <Button type="submit" fullWidth disabled={submitting}>
          {submitting ? "Creating account…" : "Create account"}
        </Button>
        <div className="flex items-center gap-3 py-1">
          <span className="h-px flex-1 bg-border" aria-hidden />
          <span className="text-xs text-muted-foreground">or</span>
          <span className="h-px flex-1 bg-border" aria-hidden />
        </div>
        <GoogleSignInButton disabled={submitting} />
      </form>
      <p className="mt-6 text-center text-sm text-subtle-foreground">
        Already registered?{" "}
        <Link to="/login" className="text-link hover:text-link-hover">
          Sign in
        </Link>
      </p>
    </Card>
  );
}
