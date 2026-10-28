/**
 * Map API error messages to field keys when the server points at one field.
 */
export function mapAuthFieldErrors(message) {
  if (!message || typeof message !== 'string') {
    return { formError: 'Something went wrong. Try again.', fieldErrors: {} };
  }

  const lower = message.toLowerCase();

  if (lower.includes('password')) {
    return { formError: '', fieldErrors: { password: message } };
  }
  if (lower.includes('username')) {
    return { formError: '', fieldErrors: { username: message } };
  }
  if (lower.includes('email')) {
    return { formError: '', fieldErrors: { email: message } };
  }
  if (lower.includes('name')) {
    return { formError: '', fieldErrors: { name: message } };
  }

  return { formError: message, fieldErrors: {} };
}
