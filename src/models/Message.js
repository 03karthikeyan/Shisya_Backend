const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender_id: String,
  receiver_id: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);