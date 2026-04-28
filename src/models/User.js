const mongoose = require('mongoose'); // ✅ REQUIRED
const AutoIncrement = require('mongoose-sequence')(mongoose);

const userSchema = new mongoose.Schema({
  userId: { type: Number, unique: true },

  mobile: { type: String, required: true, unique: true },
  isVerified: { type: Boolean, default: false },

  name: String,
  email: String,
  dob: String,
  age: String,
  gender: String,
  profileFor: String,

  religion: String,
  caste: String,
  subCaste: String,
  motherTongue: String,
  interCaste: String,
  dosham: String,

  higherEducation: String,
  employeeIn: String,
  occupation: String,
  annualIncome: String,
  workLocation: String,

  country: String,
  state: String,
  city: String,
  district: String,
  address: String,
  addressLane1: String,
  pincode: String,
  nativePlace: String,

  fatherName: String,
  motherName: String,
  siblings: String,
  familyStatus: String,

  height: String,
  weight: String,
  skinColor: String,
  physicalStatus: String,

  diet: String,
  hobbies: String,
  interests: String,
  aboutYourself: String,

  maritalStatus: String,

  profile_img: String, // ✅ important for Flutter
  gallery: [String],

  subscription: { type: String, default: null },
  subscription_plan: { type: String, default: null },
  subscription_type: { type: String, default: null },
  subscription_start: { type: Date, default: null },
  subscription_expiry: { type: Date, default: null },
  isPremium: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  isProfileCompleted: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now }
});

userSchema.plugin(AutoIncrement, { inc_field: 'userId' });

module.exports = mongoose.model('User', userSchema);