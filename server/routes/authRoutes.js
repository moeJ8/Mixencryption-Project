const express = require('express');
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');
const authEmailController = require('../controllers/authEmailController');
const activityController = require('../controllers/activityController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts. Try again later.' },
});

router.post('/register', authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);
router.post('/logout', authController.logout);
router.get('/me', verifyToken, authController.getMe);
router.get('/activity', verifyToken, activityController.listMyActivity);

router.post('/verify-email', authLimiter, authEmailController.verifyEmail);
router.post('/resend-verification', authLimiter, authEmailController.resendVerification);
router.post('/forgot-password', authLimiter, authEmailController.forgotPassword);
router.post('/reset-password', authLimiter, authEmailController.resetPassword);

module.exports = router;
