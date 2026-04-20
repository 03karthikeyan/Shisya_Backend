const mongoose = require('mongoose');

const interestSchema = new mongoose.Schema({
  sender_id: Number,
  receiver_id: Number,
  status: { type: String, default: 'pending' }
});

module.exports = mongoose.model('Interest', interestSchema);