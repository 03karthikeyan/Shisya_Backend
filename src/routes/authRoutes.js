const express = require('express');
const router = express.Router();

const {
  login,
  verifyOtp,
  registerUser
} = require('../controllers/authController');

router.post('/login', login);
router.post('/verify-otp', verifyOtp);
router.post('/register', registerUser);

module.exports = router;