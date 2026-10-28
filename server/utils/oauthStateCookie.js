const crypto = require('crypto');

const OAUTH_STATE_COOKIE = 'mixencryption_oauth_state';
const OAUTH_STATE_MAX_AGE_MS = 10 * 60 * 1000;

function oauthStateCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/api/auth/google',
    maxAge: OAUTH_STATE_MAX_AGE_MS,
  };
}

function createOAuthState() {
  return crypto.randomBytes(32).toString('hex');
}

function setOAuthStateCookie(res, state) {
  res.cookie(OAUTH_STATE_COOKIE, state, oauthStateCookieOptions());
}

function readOAuthStateCookie(req) {
  const value = req.cookies?.[OAUTH_STATE_COOKIE];
  return typeof value === 'string' && value.length >= 16 ? value : null;
}

function clearOAuthStateCookie(res) {
  res.clearCookie(OAUTH_STATE_COOKIE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/api/auth/google',
  });
}

module.exports = {
  createOAuthState,
  setOAuthStateCookie,
  readOAuthStateCookie,
  clearOAuthStateCookie,
};
