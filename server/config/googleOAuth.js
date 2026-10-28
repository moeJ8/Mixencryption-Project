function resolveDefaultGoogleCallbackUrl() {
  const explicit = process.env.GOOGLE_CALLBACK_URL?.trim();
  if (explicit) return explicit;

  const renderApiUrl = process.env.RENDER_EXTERNAL_URL?.trim().replace(/\/$/, '');
  if (renderApiUrl) {
    return `${renderApiUrl}/api/auth/google/callback`;
  }

  return 'http://localhost:5173/api/auth/google/callback';
}

function getGoogleOAuthConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  const callbackUrl = resolveDefaultGoogleCallbackUrl();

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
