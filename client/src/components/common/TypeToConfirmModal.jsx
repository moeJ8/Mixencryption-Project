import { useEffect, useId, useState } from 'react';
import Alert from './Alert';
import Button from './Button';
import Input from './Input';
import Modal from './Modal';

/**
 * GitHub-style danger confirm: action stays disabled until the user types the exact phrase.
 */
export default function TypeToConfirmModal({
  open,
  onClose,
  onConfirm,
  loading = false,
  title,
  confirmPhrase = '',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  children,
}) {
  const formId = useId();
  const [typed, setTyped] = useState('');

  useEffect(() => {
    if (open) {
      setTyped('');
    }
  }, [open, confirmPhrase]);

  const matches = typed.trim() === confirmPhrase;

  const close = () => {
    if (loading) return;
    onClose();
  };

  function handleSubmit(event) {
    event.preventDefault();
    if (!matches || loading) return;
    onConfirm();
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title={title}
      maxWidthClass="max-w-md"
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={close} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            type="submit"
            form={formId}
            variant="danger"
            loading={loading}
            disabled={!matches || loading}
          >
            {confirmLabel}
          </Button>
        </div>
      }
    >
      <form id={formId} className="space-y-4" onSubmit={handleSubmit}>
        <Alert variant="failure" title="Danger zone" icon={null} bodyTone="foreground">
          {children}
        </Alert>
        <div>
          <p className="mb-2 text-sm text-muted-foreground">
            Type{' '}
            <span className="font-mono font-semibold text-foreground">{confirmPhrase}</span> to confirm
          </p>
          <Input
            id="type-to-confirm"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            disabled={loading}
            value={typed}
            onChange={(event) => setTyped(event.target.value)}
            placeholder={confirmPhrase}
            autoFocus
          />
        </div>
      </form>
    </Modal>
  );
}
