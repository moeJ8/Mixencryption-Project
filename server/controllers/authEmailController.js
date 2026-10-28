const User = require('../models/User');
const { writeAuditLog } = require('../services/auditLogService');
const {
  clearPasswordResetFields,
  findUserForPasswordReset,
  issueEmailVerification,
  issuePasswordReset,
  verifyEmailWithToken,
} = require('../services/verificationService');
const getClientIp = require('../utils/getClientIp');
const bcrypt = require('bcryptjs');
const {
  emailOnlySchema,
  resetPasswordSchema,
  verifyEmailSchema,
} = require('../validators/authSchemas');

const BCRYPT_ROUNDS = 12;

const PASSWORD_RESET_GENERIC = {
  message:
    'If an account exists for this email, you will receive password reset instructions shortly.',
};

async function verifyEmail(req, res, next) {
  const ip = getClientIp(req);
  try {
    const { token } = verifyEmailSchema.parse(req.body);
    const user = await verifyEmailWithToken(token);

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification link.' });
    }

    await writeAuditLog({
      userId: user._id,
      action: 'EMAIL_VERIFIED',
      ipAddress: ip,
      status: 'SUCCESS',
    });

    return res.json({
      message: 'Email verified. You can sign in now.',
      isEmailVerified: true,
    });
  } catch (err) {
    return next(err);
  }
}

async function resendVerification(req, res, next) {
  const ip = getClientIp(req);
  try {
    const { email } = emailOnlySchema.parse(req.body);
    const user = await User.findOne({ email });

    if (!user || user.isEmailVerified) {
      return res.json({
        message:
          'If your account needs verification, a new email has been sent when applicable.',
      });
    }

    try {
      await issueEmailVerification(user);
      await writeAuditLog({
        userId: user._id,
        action: 'EMAIL_VERIFICATION_SENT',
        ipAddress: ip,
        status: 'SUCCESS',
        details: 'resend',
      });
    } catch (emailErr) {
      console.error('Resend verification email failed:', emailErr);
      return res.status(503).json({
        message: 'Could not send email. Check SMTP settings or try again later.',
      });
    }

    return res.json({
      message: 'Verification email sent. Check your inbox.',
    });
  } catch (err) {
    return next(err);
  }
}

async function forgotPassword(req, res, next) {
  const ip = getClientIp(req);
  try {
    const { email } = emailOnlySchema.parse(req.body);
    const user = await User.findOne({ email });

    if (!user) {
      return res.json(PASSWORD_RESET_GENERIC);
    }

    try {
      await issuePasswordReset(user);
      await writeAuditLog({
        userId: user._id,
        action: 'PASSWORD_RESET_REQUESTED',
        ipAddress: ip,
        status: 'SUCCESS',
      });
    } catch (emailErr) {
      console.error('Password reset email failed:', emailErr);
    }

    return res.json(PASSWORD_RESET_GENERIC);
  } catch (err) {
    return next(err);
  }
}

async function resetPassword(req, res, next) {
  const ip = getClientIp(req);
  try {
    const body = resetPasswordSchema.parse(req.body);
    const user = await findUserForPasswordReset(body.token);

    if (!user) {
      return res.status(400).json({
        message: 'Invalid or expired reset link. Request a new password reset.',
      });
    }

    user.passwordHash = await bcrypt.hash(body.password, BCRYPT_ROUNDS);
    clearPasswordResetFields(user);
    await user.save();

    await writeAuditLog({
      userId: user._id,
      action: 'PASSWORD_RESET',
      ipAddress: ip,
      status: 'SUCCESS',
    });

    return res.json({ message: 'Password updated. You can sign in now.' });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
};
