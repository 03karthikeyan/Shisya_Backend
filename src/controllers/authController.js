const User = require('../models/User');
const Otp = require('../models/Otp');
const { generateOtp } = require('../utils/otpGenerator');

// 🔹 LOGIN (SEND OTP)
exports.login = async (req, res, next) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile number required"
      });
    }

    // 🔴 CHECK USER EXISTS
    const user = await User.findOne({ mobile });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Mobile number not registered. Please register first."
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
    next(error);
  }
};


// 🔹 VERIFY OTP (FIXED)
exports.verifyOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({
        success: false,
        message: "Mobile & OTP required"
      });
    }

    const validOtp = await Otp.findOne({ mobile, otp });

    if (!validOtp) {
      return res.json({
        success: false,
        message: "Invalid OTP"
      });
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
      data: user
    });

  } catch (error) {
    console.error("VERIFY OTP ERROR:", error); // 🔥 better debugging
    res.status(500).json({
      success: false,
      error: error.message   // 👈 show actual error
    });
  }
};


// 🔹 REGISTER USER (FIXED)
exports.registerUser = async (req, res, next) => {
  try {
    const data = req.body;

    if (!data.mobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile required"
      });
    }

    const existingUser = await User.findOne({ mobile: data.mobile });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "This mobile number already exists"
      });
    }

    if (req.file) {
      data.profile_img = req.file.filename;
    }

    const user = await User.create(data);

    const imageUrl = user.profile_img
      ? `${req.protocol}://${req.get('host')}/uploads/profile_images/${user.profile_img}`
      : null;

    return res.json({
      success: true,
      message: "User Registered Successfully",
      user: {
        ...user.toObject(),
        profile_img_url: imageUrl
      }
    });

  } catch (error) {
    console.error(error); // 👈 helpful log
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
