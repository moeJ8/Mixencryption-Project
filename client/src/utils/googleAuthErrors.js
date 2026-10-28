const GOOGLE_AUTH_ERRORS = {
  google_denied: 'Google sign-in was cancelled.',
  google_state_invalid: 'Sign-in session expired. Try again.',
  google_account_exists:
    'This Google account cannot be linked to that email. Sign in with password or use another Google account.',
  google_signin_failed: 'Google sign-in failed. Try again.',
  google_not_configured: 'Google sign-in is not available right now.',
};

export function googleAuthErrorMessage(code) {
  if (!code || typeof code !== 'string') return null;
  return GOOGLE_AUTH_ERRORS[code] || 'Sign-in failed. Try again.';
}
