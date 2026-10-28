const { getGoogleOAuthConfig } = require('../config/googleOAuth');

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://openidconnect.googleapis.com/v1/userinfo';

function buildGoogleAuthUrl(state) {
  const config = getGoogleOAuthConfig();
  if (!config) {
    throw new Error('Google OAuth is not configured.');
  }

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.callbackUrl,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    prompt: 'select_account',
  });

  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

async function exchangeGoogleCode(code) {
  const config = getGoogleOAuthConfig();
  if (!config) {
    throw new Error('Google OAuth is not configured.');
  }

  const body = new URLSearchParams({
    code,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uri: config.callbackUrl,
    grant_type: 'authorization_code',
  });

  const tokenRes = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  const tokenData = await tokenRes.json();
  if (!tokenRes.ok || !tokenData.access_token) {
    const detail = tokenData.error_description || tokenData.error || 'token_exchange_failed';
    throw new Error(String(detail));
  }

  const profileRes = await fetch(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });

  const profile = await profileRes.json();
  if (!profileRes.ok || !profile.sub || !profile.email) {
    throw new Error('google_profile_incomplete');
  }

  if (profile.email_verified === false) {
    throw new Error('google_email_not_verified');
  }

  return {
    googleId: profile.sub,
    email: String(profile.email).trim().toLowerCase(),
    name: String(profile.name || profile.email).trim().slice(0, 120),
    picture: profile.picture ? String(profile.picture).trim().slice(0, 2048) : null,
  };
}

module.exports = { buildGoogleAuthUrl, exchangeGoogleCode };
