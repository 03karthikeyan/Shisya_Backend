const mongoose = require('mongoose');

const profileViewSchema = new mongoose.Schema({
  profile_id: String,
  viewer_id: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ProfileView', profileViewSchema);