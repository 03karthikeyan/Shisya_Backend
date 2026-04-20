const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // 🔐 Basic Auth
  mobile: { type: String, required: true, unique: true },
  isVerified: { type: Boolean, default: false },

  // 👤 Profile Basics
  name: String,
  email: String,
  dob: String,
  age: String,
  gender: String,
  profileFor: String, // Self / Son / Daughter

  // 🧬 Religion & Community
  religion: String,
  caste: String,
  subCaste: String,
  motherTongue: String,
  interCaste: String,
  dosham: String,

  // 💼 Education & Career
  higherEducation: String,
  employeeIn: String, // Govt / Private / Business
  occupation: String,
  annualIncome: String,
  workLocation: String,

  // 🏠 Location
  country: String,
  state: String,
  city: String,
  district: String,
  address: String,
  pincode: String,
  nativePlace: String,

  // 👨‍👩‍👧 Family Details
  fatherName: String,
  motherName: String,
  siblings: String,
  familyStatus: String,

  // 💪 Physical Details
  height: String,
  weight: String,
  skinColor: String,
  physicalStatus: String,

  // ❤️ Lifestyle
  diet: String,
  hobbies: String,
  interests: String,
  aboutYourself: String,

  // 💍 Marital Info
  maritalStatus: String,

  // 📸 Images & Documents
  profileImage: String,
  gallery: [String],
  aadharImage: String,
  communityCertificate: String,
  jathakam: String,

  // ⭐ Premium / Subscription
  isPremium: { type: Boolean, default: false },
  premiumExpiry: Date,

  // 🟢 Status
  isActive: { type: Boolean, default: true },
  isProfileCompleted: { type: Boolean, default: false },

  // 📅 Timestamps
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);