const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  name: String,
  price: Number,
  duration: Number,
});

module.exports = mongoose.model('Subscription', subscriptionSchema);