const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getRequestToken, clearAuthCookie } = require('../utils/authCookie');

async function verifyToken(req, res, next) {
  try {
    const token = getRequestToken(req);
    if (!token) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (!user) {
      clearAuthCookie(res);
      return res.status(401).json({ message: 'Authentication required.' });
    }

    if (user.role !== payload.role) {
      clearAuthCookie(res);
      return res.status(401).json({ message: 'Authentication required.' });
    }

    req.user = {
      id: user._id.toString(),
      role: user.role,
      isEmailVerified: user.isEmailVerified,
    };
    return next();
  } catch {
    clearAuthCookie(res);
    return res.status(401).json({ message: 'Authentication required.' });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied.' });
    }
    return next();
  };
}

module.exports = { verifyToken, requireRole };
