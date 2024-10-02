const mongoose = require('mongoose');
const slugify = require('slugify');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false, required: true },
    isSeller: { type: Boolean, default: false, required: true },
    seller: {
      name: String,
      logo: String,
      description: String,
      rating: { type: Number, default: 0, required: true },
      numReviews: { type: Number, default: 0, required: true },
      kycStatus: { type: String, enum: ['pending', 'verified', 'unverified'], default: 'unverified' }, // KYC status
    },
    kycDetails: { // KYC details
      dob: Date,
      address: String,
      city: String,
      postalCode: String,
      country: String,
      documentType: String,
      documentNumber: String,
    },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model('User', UserSchema);

module.exports = User;