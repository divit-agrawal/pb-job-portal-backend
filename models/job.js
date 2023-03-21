const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  email: { type: String, default: null },
  jd: { type: String, default: null },
});

module.exports = mongoose.model("Job", jobSchema);
