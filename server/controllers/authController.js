const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { writeAuditLog } = require('../services/auditLogService');
const getClientIp = require('../utils/getClientIp');
const {
  setAuthCookie,
  clearAuthCookie,
  signAuthToken,
} = require('../utils/authCookie');
const { registerSchema, loginSchema } = require('../validators/authSchemas');
const { buildUserLookupQuery } = require('../utils/resolveAuthIdentifier');
const { issueEmailVerification } = require('../services/verificationService');

const BCRYPT_ROUNDS = 12;
const GENERIC_AUTH_MESSAGE = 'Invalid email or password.';

async function register(req, res, next) {
  try {
    const body = registerSchema.parse(req.body);
    const passwordHash = await bcrypt.hash(body.password, BCRYPT_ROUNDS);

    const user = await User.create({
      name: body.name,
      username: body.username,
      email: body.email,
      passwordHash,
      authProvider: 'local',
      role: 'user',
      isEmailVerified: false,
    });

    try {
      await issueEmailVerification(user);
    } catch (emailErr) {
      console.error('Verification email failed:', emailErr);
      await User.findByIdAndDelete(user._id);
      return res.status(503).json({
        message: 'Could not send verification email. Try again later or contact support.',
      });
    }

    await writeAuditLog({
      userId: user._id,
      action: 'SIGNUP',
      ipAddress: getClientIp(req),
      status: 'SUCCESS',
      details: `username=${user.username}`,
    });

    await writeAuditLog({
      userId: user._id,
      action: 'EMAIL_VERIFICATION_SENT',
      ipAddress: getClientIp(req),
      status: 'SUCCESS',
      details: 'signup',
    });

    return res.status(201).json({
      message: 'Account created. Check your email to verify your account.',
      user: user.toSafeJSON(),
    });
  } catch (err) {
    return next(err);
  }
}

async function login(req, res, next) {
  const ip = getClientIp(req);
  try {
    const body = loginSchema.parse(req.body);

    const user = await User.findOne(buildUserLookupQuery(body.identifier)).select(
      '+passwordHash',
    );
    if (!user) {
      await writeAuditLog({
        action: 'LOGIN_FAILURE',
        ipAddress: ip,
        status: 'FAILURE',
        details: 'unknown_account',
      });
      return res.status(401).json({ message: GENERIC_AUTH_MESSAGE });
    }

    const passwordOk = await bcrypt.compare(body.password, user.passwordHash);
    if (!passwordOk) {
      await writeAuditLog({
        userId: user._id,
        action: 'LOGIN_FAILURE',
        ipAddress: ip,
        status: 'FAILURE',
        details: 'bad_password',
      });
      return res.status(401).json({ message: GENERIC_AUTH_MESSAGE });
    }

    const token = signAuthToken(user);
    setAuthCookie(res, token);

    await writeAuditLog({
      userId: user._id,
      action: 'LOGIN',
      ipAddress: ip,
      status: 'SUCCESS',
    });

    return res.json({ user: user.toSafeJSON() });
  } catch (err) {
    return next(err);
  }
}

async function logout(req, res, next) {
  try {
    clearAuthCookie(res);
    if (req.user?.id) {
      await writeAuditLog({
        userId: req.user.id,
        action: 'LOGOUT',
        ipAddress: getClientIp(req),
        status: 'SUCCESS',
      });
    }
    return res.json({ ok: true });
  } catch (err) {
    return next(err);
  }
}

async function getMe(req, res) {
  const user = await User.findById(req.user.id);
  if (!user) {
    clearAuthCookie(res);
    return res.status(401).json({ message: 'Authentication required.' });
  }
  return res.json({ user: user.toSafeJSON() });
}

module.exports = {
  register,
  login,
  logout,
  getMe,
};
