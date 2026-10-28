const jwt = require('jsonwebtoken');

const AUTH_COOKIE_NAME = 'mixencryption_token';
const AUTH_EXPIRES_IN = '7d';
const AUTH_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function cookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
    maxAge: AUTH_MAX_AGE_MS,
  };
}

function setAuthCookie(res, token) {
  res.cookie(AUTH_COOKIE_NAME, token, cookieOptions());
}

function clearAuthCookie(res) {
  res.clearCookie(AUTH_COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  });
}

function getRequestToken(req) {
  const token = req.cookies?.[AUTH_COOKIE_NAME];
  if (typeof token !== 'string' || token.split('.').length !== 3) {
    return null;
  }
  return token;
}

function signAuthToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: AUTH_EXPIRES_IN },
  );
}

module.exports = {
  AUTH_COOKIE_NAME,
  AUTH_MAX_AGE_MS,
  setAuthCookie,
  clearAuthCookie,
  getRequestToken,
  signAuthToken,
};
