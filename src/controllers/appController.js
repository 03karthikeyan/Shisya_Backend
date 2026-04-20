const User = require('../models/User');
const Message = require('../models/Message');
const Interest = require('../models/Interest');
const ProfileView = require('../models/ProfileView');
const Subscription = require('../models/Subscription');


// 🔹 RELIGION LIST
exports.getReligions = async (req, res) => {
  res.json({
    success: true,
    data: [
      { religion: "Hindu" },
      { religion: "Muslim" },
      { religion: "Christian" }
    ]
  });
};


// 🔹 STATE LIST
exports.getStates = async (req, res) => {
  res.json({
    success: true,
    data: [
      { entity_name: "Tamil Nadu" },
      { entity_name: "Kerala" }
    ]
  });
};


// 🔹 SUBSCRIPTION LIST
exports.getSubscriptionPlans = async (req, res) => {
  const plans = await Subscription.find();
  res.json({ success: true, data: plans });
};


// 🔹 PURCHASE SUBSCRIPTION
exports.purchaseSubscription = async (req, res) => {
  const { user_id, plan_id } = req.query;

  await User.findByIdAndUpdate(user_id, {
    subscription: plan_id
  });

  res.json({ success: true, message: "Subscribed successfully" });
};


// 🔹 SUBSCRIPTION STATUS
exports.getSubscriptionStatus = async (req, res) => {
  const { user_id } = req.query;

  const user = await User.findById(user_id);

  res.json({
    status: "success",
    subscription: user?.subscription || null
  });
};


// 🔹 MATCHING PROFILES
exports.getMatchingProfiles = async (req, res) => {
  const { user_id, ...filters } = req.query;

  let query = {};

  if (filters.from_age && filters.to_age) {
    query.age = { $gte: filters.from_age, $lte: filters.to_age };
  }

  if (filters.city) query.city = filters.city;

  const users = await User.find(query);

  res.json({ success: true, data: users });
};


// 🔹 GET MESSAGES
exports.getMessages = async (req, res) => {
  const { sender_id, receiver_id } = req.query;

  const messages = await Message.find({
    $or: [
      { sender_id, receiver_id },
      { sender_id: receiver_id, receiver_id: sender_id }
    ]
  });

  res.json({ success: true, data: messages });
};


// 🔹 SEND MESSAGE
exports.sendMessage = async (req, res) => {
  const { sender_id, receiver_id, message } = req.query;

  await Message.create({ sender_id, receiver_id, message });

  res.json({ success: true, message: "Message sent" });
};


// 🔹 PROFILE FETCH
exports.getProfile = async (req, res) => {
  const { user_id } = req.query;

  const user = await User.findById(user_id);

  res.json({
    status: "success",
    user_data: user,
    badge: user?.badge || ""
  });
};


// 🔹 UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  const { user_id, ...data } = req.query;

  const user = await User.findByIdAndUpdate(user_id, data, { new: true });

  res.json({ success: true, user });
};


// 🔹 ACTIVATE USER
exports.activateUser = async (req, res) => {
  const { user_id } = req.query;

  await User.findByIdAndUpdate(user_id, { user_sts: "0" });

  res.json({ success: true, message: "User activated" });
};


// 🔹 DEACTIVATE USER
exports.deactivateUser = async (req, res) => {
  const { user_id } = req.query;

  await User.findByIdAndUpdate(user_id, { user_sts: "1" });

  res.json({ success: true, message: "User deactivated" });
};


// 🔹 SEND INTEREST
exports.sendInterest = async (req, res) => {
  const { sender_id, receiver_id } = req.query;

  await Interest.create({ sender_id, receiver_id });

  res.json({ success: true, message: "Interest sent" });
};


// 🔹 RESPOND INTEREST
exports.respondInterest = async (req, res) => {
  const { interest_id, action } = req.query;

  await Interest.findByIdAndUpdate(interest_id, { status: action });

  res.json({ success: true, message: "Updated" });
};


// 🔹 PROFILE VIEW TRACK
exports.viewProfile = async (req, res) => {
  const { profile_id, viewer_id } = req.query;

  await ProfileView.create({ profile_id, viewer_id });

  res.json({ success: true });
};


// 🔹 WHO VIEWED MY PROFILE
exports.whoViewedMyProfile = async (req, res) => {
  const { profile_id } = req.query;

  const data = await ProfileView.find({ profile_id });

  res.json({ success: true, data });
};


// 🔹 RECENTLY VIEWED
exports.recentlyViewedProfiles = async (req, res) => {
  const { viewer_id } = req.query;

  const data = await ProfileView.find({ viewer_id });

  res.json({ success: true, data });
};


// 🔹 UPLOAD IMAGE
exports.uploadProfileImage = async (req, res) => {
  res.json({
    success: true,
    message: "Image uploaded (implement multer here)"
  });
};