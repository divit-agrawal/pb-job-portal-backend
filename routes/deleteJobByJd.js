const User = require("../models/user.js");

const express = require("express");

const router = express.Router();

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const sgMail = require("@sendgrid/mail");

router.post("/", async (req, res) => {
  //  console.log(req.body)
  if (!req.body.jd || !req.body.email) {
    return res.status(400).send({ message: "Missing required parameters" });
  }

  try {
    // Get user input
    const { jd, email } = req.body;

    User.deleteOne({ email: email, "jobs.jd": jd }, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Successful deletion");
      }
    });

    res.status(201).json({ message: "Job deleted" });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

module.exports = router;
