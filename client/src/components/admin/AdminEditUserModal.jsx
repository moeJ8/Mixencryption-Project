import { useEffect, useRef, useState } from 'react';
import Button from '../common/Button';
import FieldGroup from '../common/FieldGroup';
import FormError from '../common/FormError';
import Modal from '../common/Modal';
import Select from '../common/Select';
import { mapAuthFieldErrors } from '../../utils/formFieldErrors';
import {
  removeAdminUserAvatar,
  updateAdminUser,
  uploadAdminUserAvatar,
} from '../../services/adminService';
import { toastError, toastSuccess } from '../../theme/toast';
import { getUserAvatarUrl } from '../../utils/userAvatar';

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
  const [avatarUser, setAvatarUser] = useState(null);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!open || !user) return;
    setAvatarUser(user);
    setForm({
      name: user.name || '',
      username: user.username || '',
      email: user.email || '',
      role: user.role || 'user',
    });
    setError('');
  }, [open, user]);

  const displayUser = avatarUser || user;
  const hasCustomPhoto = Boolean(displayUser?.profileImageUrl);
  const formBusy = saving || avatarBusy;

  async function handlePhotoPick(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !user?.id) return;

    setAvatarBusy(true);
    setError('');
    try {
      const data = await uploadAdminUserAvatar(user.id, file);
      setAvatarUser(data.user);
      onSaved?.(data.user);
      toastSuccess(data.message || 'Profile photo updated.');
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not upload photo.';
      setError(msg);
      toastError(msg);
    } finally {
      setAvatarBusy(false);
    }
  }

  async function handleRemovePhoto() {
    if (!user?.id) return;

    setAvatarBusy(true);
    setError('');
    try {
      const data = await removeAdminUserAvatar(user.id);
      setAvatarUser(data.user);
      onSaved?.(data.user);
      toastSuccess(data.message || 'Profile photo removed.');
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not remove photo.';
      setError(msg);
      toastError(msg);
    } finally {
      setAvatarBusy(false);
    }
  }

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
      toastSuccess('User updated.');
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
        <div className="modal-footer-actions">
          <Button type="button" variant="secondary" onClick={onClose} disabled={formBusy}>
            Cancel
          </Button>
          <Button type="submit" form="admin-edit-user-form" loading={saving} disabled={avatarBusy}>
            Save changes
          </Button>
        </div>
      }
    >
      <form id="admin-edit-user-form" className="space-y-4" onSubmit={handleSubmit} noValidate>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={handlePhotoPick}
        />
        <div className="flex flex-col items-center gap-3 border-b border-border pb-4 sm:flex-row sm:items-center">
          <img
            src={getUserAvatarUrl(displayUser)}
            alt=""
            className="size-20 shrink-0 rounded-full border border-border object-cover"
            width={80}
            height={80}
            referrerPolicy="no-referrer"
          />
          <div className="flex min-w-0 flex-col items-center gap-2 sm:items-start">
            <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={formBusy}
                loading={avatarBusy}
                onClick={() => fileInputRef.current?.click()}
              >
                Change photo
              </Button>
              {hasCustomPhoto ? (
                <Button
                  type="button"
                  variant="dangerOutline"
                  size="sm"
                  disabled={formBusy}
                  onClick={handleRemovePhoto}
                >
                  Remove photo
                </Button>
              ) : null}
            </div>
            <p className="text-center text-xs text-muted-foreground sm:text-left">
              JPEG, PNG, or WebP. Max 2 MB.
            </p>
          </div>
        </div>
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
