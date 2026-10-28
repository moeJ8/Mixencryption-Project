import { useEffect, useState } from 'react';
import Button from '../common/Button';
import FieldGroup from '../common/FieldGroup';
import FormError from '../common/FormError';
import Modal from '../common/Modal';
import Select from '../common/Select';
import { mapAuthFieldErrors } from '../../utils/formFieldErrors';
import { updateAdminUser } from '../../services/adminService';

const ROLE_OPTIONS = [
  { value: 'user', label: 'User' },
  { value: 'admin', label: 'Admin' },
];

export default function AdminEditUserModal({ open, user, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    role: 'user',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open || !user) return;
    setForm({
      name: user.name || '',
      username: user.username || '',
      email: user.email || '',
      role: user.role || 'user',
    });
    setError('');
  }, [open, user]);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!user?.id) return;

    setSaving(true);
    setError('');
    try {
      const updated = await updateAdminUser(user.id, form);
      onSaved?.(updated);
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message;
      const { formError } = mapAuthFieldErrors(msg);
      setError(formError || msg || 'Could not save user.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit user"
      description={user ? `@${user.username}` : undefined}
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" form="admin-edit-user-form" loading={saving}>
            Save changes
          </Button>
        </div>
      }
    >
      <form id="admin-edit-user-form" className="space-y-4" onSubmit={handleSubmit} noValidate>
        <FormError message={error} />
        <FieldGroup
          id="edit-name"
          label="Full name"
          required
          value={form.name}
          onChange={(event) => updateField('name', event.target.value)}
        />
        <FieldGroup
          id="edit-username"
          label="Username"
          required
          value={form.username}
          onChange={(event) => updateField('username', event.target.value.toLowerCase())}
        />
        <FieldGroup
          id="edit-email"
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={(event) => updateField('email', event.target.value)}
        />
        <Select
          id="edit-role"
          label="Role"
          required
          value={form.role}
          onChange={(role) => updateField('role', role)}
          options={ROLE_OPTIONS}
          size="md"
        />
      </form>
    </Modal>
  );
}
