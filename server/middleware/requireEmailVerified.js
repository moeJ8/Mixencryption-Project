const User = require('../models/User');

/** Use on routes that need a verified inbox (crypto, vault, etc.). */
async function requireEmailVerified(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select('isEmailVerified');
    if (!user?.isEmailVerified) {
      return res.status(403).json({
        message: 'Verify your email to use this feature.',
        code: 'EMAIL_NOT_VERIFIED',
      });
    }
    return next();
  } catch {
    return res.status(500).json({ message: 'Something went wrong.' });
  }
}

module.exports = { requireEmailVerified };
