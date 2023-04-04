const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  phone_number: { type: String, default: null },
  company_name: { type: String, default: null },
  username: { type: String, default: null },
  email: { type: String, default: null },
  about: { type: String, default: null },
  password: { type: String },
  token: { type: String },
  is_verified: { type: Boolean, default: false },
  is_approved: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);
