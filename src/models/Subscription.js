const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  plan_name: { type: String, required: true },
  plan_type: { type: String, enum: ['basic', 'standard', 'premium'] },
  price: { type: Number, required: true },
  duration_months: { type: Number, required: true },
  description: { type: String },
  color: { type: String },
  icon: { type: String },
  is_popular: { type: Boolean, default: false },
  features: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);