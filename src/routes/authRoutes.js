const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); // ✅ ADD THIS

const {
  login,
  verifyOtp,
  registerUser
} = require('../controllers/authController');

router.post('/login', login);
router.post('/verify-otp', verifyOtp);
router.post('/register', upload.single('profile_img'), registerUser);

module.exports = router;