import FormError from './FormError';
import Input from './Input';
import Label from './Label';

export default function FieldGroup({
  id,
  label,
  type = 'text',
  required,
  error,
  ...inputProps
}) {
  return (
    <div>
      <Label htmlFor={id} required={required}>{label}</Label>
      <Input id={id} type={type} error={error} required={required} {...inputProps} />
      {error ? <p className="mt-1 text-xs text-red-400">{error}</p> : null}
    </div>
  );
}
