const User = require("../models/user");

const express = require("express");

const router = express.Router();

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const sgMail = require("@sendgrid/mail");

router.post("/", async (req, res) => {
  // console.log(req.body.password);
  if (!req.body.email) {
    return res.status(400).send({ message: "Missing required parameters" });
  }
  // Our login logic starts here
  try {
    // Get user input
    const { email } = req.body;
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (!user.is_verified) {
      return res.status(400).json({ error: "user present but not verified" });
    }
    if (!user.is_approved) {
      res
        .status(400)
        .send({ error: "user verified but not approved by admin" });
    }
    let newPassword = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0");
    // console.log(newPassword);

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(newPassword, 10);

    // Update user in our database
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { password: encryptedPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(400).json({ error: "User update failed" });
    }
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const message = {
      to: email,
      from: "divit@positionbuilding.com",
      subject: "hellow",
      text: "hellow",
      html: `<div><p>Your new password is: ${newPassword}</p><br/><p>To update it, go to positionbuilding portal, log in, and go to profile.</p></div>`,
    };

    sgMail
      .send(message)
      .then((resp) => {
        console.log("email sent");
        // console.log(resp);
      })
      .catch((err) => {
        console.log(err);
      });
    res.status(200).send("Email sent");
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

module.exports = router;
