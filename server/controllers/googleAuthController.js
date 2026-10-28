const User = require('../models/User');
const { getClientAppUrl } = require('../config/clientAppUrl');
const { isGoogleOAuthEnabled } = require('../config/googleOAuth');
const { writeAuditLog } = require('../services/auditLogService');
const { buildGoogleAuthUrl, exchangeGoogleCode } = require('../services/googleAuthService');
const getClientIp = require('../utils/getClientIp');
const { setAuthCookie, signAuthToken } = require('../utils/authCookie');
const { generateUniqueUsername } = require('../utils/generateUniqueUsername');
const {
  clearOAuthStateCookie,
  createOAuthState,
  readOAuthStateCookie,
  setOAuthStateCookie,
} = require('../utils/oauthStateCookie');

function redirectWithError(res, code) {
  const url = new URL('/login', getClientAppUrl());
  url.searchParams.set('error', code);
  return res.redirect(url.toString());
}

async function startGoogleAuth(req, res) {
  if (!isGoogleOAuthEnabled()) {
    return res.status(503).json({ message: 'Google sign-in is not configured.' });
  }

  const state = createOAuthState();
  setOAuthStateCookie(res, state);
  return res.redirect(buildGoogleAuthUrl(state));
}

async function googleAuthCallback(req, res) {
  const ip = getClientIp(req);
  const expectedState = readOAuthStateCookie(req);
  clearOAuthStateCookie(res);

  if (!isGoogleOAuthEnabled()) {
    return redirectWithError(res, 'google_not_configured');
  }

  const oauthError = req.query.error;
  if (oauthError) {
    await writeAuditLog({
      action: 'LOGIN_FAILURE',
      ipAddress: ip,
      status: 'FAILURE',
      details: `google_oauth_${oauthError}`,
    });
    return redirectWithError(res, oauthError === 'access_denied' ? 'google_denied' : 'google_signin_failed');
  }

  const code = typeof req.query.code === 'string' ? req.query.code : '';
  const state = typeof req.query.state === 'string' ? req.query.state : '';

  if (!code || !state || !expectedState || state !== expectedState) {
    await writeAuditLog({
      action: 'LOGIN_FAILURE',
      ipAddress: ip,
      status: 'FAILURE',
      details: 'google_state_invalid',
    });
    return redirectWithError(res, 'google_state_invalid');
  }

  let profile;
  try {
    profile = await exchangeGoogleCode(code);
  } catch (err) {
    console.error('Google OAuth callback failed:', err.message);
    await writeAuditLog({
      action: 'LOGIN_FAILURE',
      ipAddress: ip,
      status: 'FAILURE',
      details: 'google_token_or_profile',
    });
    return redirectWithError(res, 'google_signin_failed');
  }

  let user = await User.findOne({ googleId: profile.googleId });

  if (!user) {
    const existingByEmail = await User.findOne({ email: profile.email }).select('+googleId');
    if (existingByEmail) {
      if (existingByEmail.googleId && existingByEmail.googleId !== profile.googleId) {
        await writeAuditLog({
          userId: existingByEmail._id,
          action: 'LOGIN_FAILURE',
          ipAddress: ip,
          status: 'FAILURE',
          details: 'google_id_mismatch',
        });
        return redirectWithError(res, 'google_account_exists');
      }

      existingByEmail.googleId = profile.googleId;
      if (profile.picture && !existingByEmail.profileImageUrl) {
        existingByEmail.profileImageUrl = profile.picture;
      }
      if (!existingByEmail.isEmailVerified) {
        existingByEmail.isEmailVerified = true;
      }
      user = await existingByEmail.save();

      await writeAuditLog({
        userId: user._id,
        action: 'USER_UPDATED',
        ipAddress: ip,
        status: 'SUCCESS',
        details: 'google_linked',
      });
    }
  }

  if (!user) {
    const username = await generateUniqueUsername(profile.email.split('@')[0]);
    user = await User.create({
      name: profile.name,
      username,
      email: profile.email,
      authProvider: 'google',
      googleId: profile.googleId,
      role: 'user',
      isEmailVerified: true,
      profileImageUrl: profile.picture,
    });

    await writeAuditLog({
      userId: user._id,
      action: 'SIGNUP',
      ipAddress: ip,
      status: 'SUCCESS',
      details: 'google',
    });
  } else if (profile.picture && !user.profileImageUrl) {
    user.profileImageUrl = profile.picture;
    await user.save();
  }

  const token = signAuthToken(user);
  setAuthCookie(res, token);

  await writeAuditLog({
    userId: user._id,
    action: 'LOGIN',
    ipAddress: ip,
    status: 'SUCCESS',
    details: 'google',
  });

  const successUrl = new URL('/', getClientAppUrl());
  successUrl.searchParams.set('signed_in', 'google');
  return res.redirect(successUrl.toString());
}

async function getAuthProviders(_req, res) {
  return res.json({
    google: isGoogleOAuthEnabled(),
  });
}

module.exports = {
  startGoogleAuth,
  googleAuthCallback,
  getAuthProviders,
};
