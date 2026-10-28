const User = require('../models/User');
const { isCloudinaryConfigured } = require('../config/cloudinary');
const { writeAuditLog } = require('../services/auditLogService');
const { deleteUserAvatar, uploadUserAvatar } = require('../services/cloudinaryAvatarService');
const getClientIp = require('../utils/getClientIp');

async function uploadAvatar(req, res, next) {
  const ip = getClientIp(req);
  try {
    if (!isCloudinaryConfigured()) {
      return res.status(503).json({ message: 'Profile photo upload is not configured.' });
    }

    const user = await User.findById(req.user.id).select('+profileImagePublicId');
    if (!user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    if (user.profileImagePublicId) {
      await deleteUserAvatar(user.profileImagePublicId);
    }

    const result = await uploadUserAvatar(user._id.toString(), req.file.buffer);
    user.profileImageUrl = result.secure_url;
    user.profileImagePublicId = result.public_id;
    await user.save();

    await writeAuditLog({
      userId: user._id,
      action: 'PROFILE_AVATAR_UPDATED',
      ipAddress: ip,
      status: 'SUCCESS',
    });

    return res.json({
      message: 'Profile photo updated.',
      user: user.toSafeJSON(),
    });
  } catch (err) {
    console.error('Avatar upload failed:', err.message);
    return next(err);
  }
}

async function removeAvatar(req, res, next) {
  const ip = getClientIp(req);
  try {
    const user = await User.findById(req.user.id).select('+profileImagePublicId');
    if (!user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    if (user.profileImagePublicId) {
      await deleteUserAvatar(user.profileImagePublicId);
    }

    user.profileImageUrl = null;
    user.profileImagePublicId = null;
    await user.save();

    await writeAuditLog({
      userId: user._id,
      action: 'PROFILE_AVATAR_REMOVED',
      ipAddress: ip,
      status: 'SUCCESS',
    });

    return res.json({
      message: 'Profile photo removed.',
      user: user.toSafeJSON(),
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { uploadAvatar, removeAvatar };
