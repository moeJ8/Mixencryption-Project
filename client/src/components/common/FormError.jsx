import Alert from './Alert';

export default function FormError({ message, className = '' }) {
  if (!message) return null;
  return (
    <Alert variant="failure" className={className}>
      {message}
    </Alert>
  );
}
