const { cloudinary, configureCloudinary } = require('../config/cloudinary');

const AVATAR_FOLDER = process.env.CLOUDINARY_AVATAR_FOLDER?.trim() || 'mixencryption/avatars';

function avatarPublicId(userId) {
  return `${AVATAR_FOLDER}/user_${userId}`;
}

function uploadUserAvatar(userId, buffer) {
  if (!configureCloudinary()) {
    throw new Error('Cloudinary is not configured.');
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: AVATAR_FOLDER,
        public_id: `user_${userId}`,
        overwrite: true,
        invalidate: true,
        resource_type: 'image',
        format: 'webp',
        transformation: [{ width: 256, height: 256, crop: 'fill', gravity: 'auto' }],
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      },
    );
    stream.end(buffer);
  });
}

async function deleteUserAvatar(publicId) {
  if (!publicId || !configureCloudinary()) {
    return;
  }

  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'image', invalidate: true });
  } catch (err) {
    console.error('Cloudinary avatar delete failed:', err.message);
  }
}

module.exports = { uploadUserAvatar, deleteUserAvatar, avatarPublicId };
