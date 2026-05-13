const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const userId = req.query.user_id || req.body.user_id || 'unknown';

    return {
      folder: 'profile_images',
      public_id: `profile_${userId}_${Date.now()}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    };
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = upload;