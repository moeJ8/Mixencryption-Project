const express = require('express');
const rateLimit = require('express-rate-limit');
const adminController = require('../controllers/adminController');
const { avatarUploadMiddleware } = require('../middleware/uploadAvatar');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

const avatarLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many upload attempts. Try again later.' },
});

router.use(verifyToken, requireRole('admin'));

router.get('/users', adminController.listUsers);
router.get('/users/:id/activity', adminController.listUserActivity);
router.post(
  '/users/:id/avatar',
  avatarLimiter,
  avatarUploadMiddleware,
  adminController.uploadUserAvatar,
);
router.delete('/users/:id/avatar', avatarLimiter, adminController.removeUserAvatar);
router.get('/users/:id', adminController.getUser);
router.patch('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);
router.get('/audit', adminController.listAuditLogs);

module.exports = router;
