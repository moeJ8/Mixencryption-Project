function getGoogleOAuthConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  const callbackUrl =
    process.env.GOOGLE_CALLBACK_URL?.trim() ||
    'http://localhost:5173/api/auth/google/callback';

  if (!clientId || !clientSecret) {
    return null;
  }

  return {
    clientId,
    clientSecret,
    callbackUrl,
  };
}

function isGoogleOAuthEnabled() {
  return Boolean(getGoogleOAuthConfig());
}

module.exports = { getGoogleOAuthConfig, isGoogleOAuthEnabled };
