const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ✅ Create uploads folder if not exists
const uploadDir = 'uploads/profile_images';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // ✅ Filename: userId_timestamp.ext
        const ext = path.extname(file.originalname);
        const userId = req.query.user_id || req.body.user_id || 'unknown';
        const filename = `profile_${userId}_${Date.now()}${ext}`;
        cb(null, filename);
    }
});

// ✅ Only allow images
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const allowedExt = ['.jpg', '.jpeg', '.png', '.webp'];

    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedMimeTypes.includes(file.mimetype) || allowedExt.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPG, PNG, WEBP images allowed'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

module.exports = upload;