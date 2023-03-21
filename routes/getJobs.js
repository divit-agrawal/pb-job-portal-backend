const express = require("express");

const router = express.Router();

const Job = require("../models/job");

const verify = require("./verifyMiddleware");

router.get("/", async (req, res) => {
  // console.log(req.body);
  const jobs = await Job.find();
  console.log(jobs);
  res.send(jobs);
});

module.exports = router;
