const express = require('express');
const rateLimit = require('express-rate-limit');
const profileController = require('../controllers/profileController');
const { avatarUploadMiddleware } = require('../middleware/uploadAvatar');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

const avatarLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many upload attempts. Try again later.' },
});

router.use(verifyToken);

router.post(
  '/avatar',
  avatarLimiter,
  avatarUploadMiddleware,
  profileController.uploadAvatar,
);
router.delete('/avatar', avatarLimiter, profileController.removeAvatar);

module.exports = router;
