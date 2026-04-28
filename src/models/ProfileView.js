const mongoose = require('mongoose');

const profileViewSchema = new mongoose.Schema({
  viewer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  profile_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ProfileView', profileViewSchema);