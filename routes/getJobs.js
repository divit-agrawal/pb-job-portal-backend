const express = require("express");

const router = express.Router();

const Job = require("../models/job");

const User = require("../models/user");

router.get("/", async (req, res) => {
  const jobs = await Job.find();
  let arr = [];
  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];
    const user = await User.findOne({ email: job.email });
    // job.username = user.username;
    // console.log(job);
    // console.log(user);
    arr.push({
      id: job.id,
      email: job.email,
      jd: job.jd,
      username: user.username,
      about: user.about,
      phone: user.phone_number,
      company_name: user.company_name,
    });
    // console.log(arr[i]);
  }
  res.send(arr);
});

module.exports = router;
