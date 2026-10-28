const multer = require('multer');

const MAX_BYTES = 2 * 1024 * 1024;

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_BYTES, files: 1 },
  fileFilter(_req, file, callback) {
    if (!ALLOWED_MIME.has(file.mimetype)) {
      callback(new Error('INVALID_IMAGE_TYPE'));
      return;
    }
    callback(null, true);
  },
});

function avatarUploadMiddleware(req, res, next) {
  upload.single('avatar')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'Image must be 2 MB or smaller.' });
      }
      return res.status(400).json({ message: 'Invalid upload.' });
    }
    if (err?.message === 'INVALID_IMAGE_TYPE') {
      return res.status(400).json({
        message: 'Use a JPEG, PNG, or WebP image.',
      });
    }
    if (err) {
      return next(err);
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Choose an image to upload.' });
    }
    return next();
  });
}

module.exports = { avatarUploadMiddleware };
