const User = require('../models/User');
const {
  RESET_TTL_MS,
  VERIFICATION_TTL_MS,
  sendPasswordResetEmail,
  sendVerificationEmail,
} = require('./emailService');
const { generateSecureToken, hashToken } = require('../utils/secureToken');

async function issueEmailVerification(user) {
  const token = generateSecureToken();
  user.emailVerificationTokenHash = hashToken(token);
  user.emailVerificationExpires = new Date(Date.now() + VERIFICATION_TTL_MS);
  user.isEmailVerified = false;
  await user.save();
  await sendVerificationEmail(user, token);
  return token;
}

async function verifyEmailWithToken(rawToken) {
  const tokenHash = hashToken(rawToken);
  const user = await User.findOne({
    emailVerificationTokenHash: tokenHash,
    emailVerificationExpires: { $gt: new Date() },
  }).select('+emailVerificationTokenHash +emailVerificationExpires');

  if (!user) {
    return null;
  }

  user.isEmailVerified = true;
  user.emailVerificationTokenHash = null;
  user.emailVerificationExpires = null;
  await user.save();
  return user;
}

async function issuePasswordReset(user) {
  const token = generateSecureToken();
  user.passwordResetTokenHash = hashToken(token);
  user.passwordResetExpires = new Date(Date.now() + RESET_TTL_MS);
  await user.save();
  await sendPasswordResetEmail(user, token);
  return token;
}

async function findUserForPasswordReset(rawToken) {
  const tokenHash = hashToken(rawToken);
  return User.findOne({
    passwordResetTokenHash: tokenHash,
    passwordResetExpires: { $gt: new Date() },
  }).select('+passwordResetTokenHash +passwordResetExpires +passwordHash');
}

function clearPasswordResetFields(user) {
  user.passwordResetTokenHash = null;
  user.passwordResetExpires = null;
}

module.exports = {
  issueEmailVerification,
  verifyEmailWithToken,
  issuePasswordReset,
  findUserForPasswordReset,
  clearPasswordResetFields,
};
