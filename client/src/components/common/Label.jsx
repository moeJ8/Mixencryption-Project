export default function Label({ htmlFor, children, required }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-sm font-medium text-foreground"
    >
      {children}
      {required ? <span className="text-subtle-foreground"> (required)</span> : null}
    </label>
  );
}
