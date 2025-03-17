const mongoose = require("mongoose");
const OTP = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: Number,
    required: true,
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 120000), 
    expires: 120, 
  },
});

const otp = mongoose.model("OTP", OTP);
module.exports = otp;
