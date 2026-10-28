import Alert from './Alert';
import Button from './Button';
import Modal from './Modal';

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  loading = false,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  dangerTitle = 'Danger zone',
  dangerMessage,
}) {
  const isDanger = variant === 'danger';

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      maxWidthClass="max-w-md"
      footer={
        <div className="modal-footer-actions">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={isDanger ? 'danger' : 'primary'}
            loading={loading}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      }
    >
      <p className="text-sm text-muted-foreground">{message}</p>
      {isDanger && dangerMessage ? (
        <Alert variant="failure" title={dangerTitle} icon={null} bodyTone="foreground" className="mt-4">
          {dangerMessage}
        </Alert>
      ) : null}
    </Modal>
  );
}
