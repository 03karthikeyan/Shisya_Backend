const User = require('../models/User');
const Otp = require('../models/Otp');
const { generateOtp } = require('../utils/otpGenerator');

// 🔹 LOGIN (SEND OTP)
exports.login = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile number required"
      });
    }

    const otp = generateOtp();

    await Otp.create({ mobile, otp });

    return res.json({
      success: true,
      message: "OTP Sent",
      otp // ⚠ remove in production
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


// 🔹 VERIFY OTP (FIXED)
exports.verifyOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body; // ✅ FIXED

    if (!mobile || !otp) {
      return res.status(400).json({
        success: false,
        message: "Mobile & OTP required"
      });
    }

    const validOtp = await Otp.findOne({ mobile, otp });

    if (!validOtp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    // ✅ Delete OTP after use
    await Otp.deleteMany({ mobile });

    let user = await User.findOne({ mobile });

    if (!user) {
      user = await User.create({ mobile });
    }

    return res.json({
      success: true,
      message: "OTP Verified",
      user
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


// 🔹 REGISTER USER (FIXED)
exports.registerUser = async (req, res) => {
  try {
    const data = req.body; // ✅ FIXED

    if (!data.mobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile required"
      });
    }

    const user = await User.findOneAndUpdate(
      { mobile: data.mobile },
      data,
      { new: true, upsert: true }
    );

    return res.json({
      success: true,
      message: "User Registered",
      user
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};