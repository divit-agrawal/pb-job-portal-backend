const mongoose = require("mongoose");

const postingSchema = new mongoose.Schema({
  poster_email: { type: String, default: null },
  username: { type: String, default: null },
  seeker_email: { type: String, default: null },
});

module.exports = mongoose.model("PostingSignUp", postingSchema);
