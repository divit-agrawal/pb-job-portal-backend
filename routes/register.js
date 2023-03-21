const User = require("../models/user.js");

const express = require("express");

const router = express.Router();

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const sgMail = require("@sendgrid/mail");

router.post("/", async (req, res) => {
 console.log(req.body)
  if (
    !req.body.phone_number ||
    !req.body.username ||
    !req.body.email ||
    !req.body.about ||
    !req.body.password
  ) {
    return res.status(400).send({ message: "Missing required parameters" });
  }

  try {
    // Get user input
    const { phone_number, username, email, about, password } = req.body;

    // Validate user input
    if (!(email && password && phone_number && username && about)) {
      res.status(400).json({ error: "All input is required" });
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res
        .status(409)
        .json({ error: "User Already Exist. Please Login" });
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);
    // Create user in our  database
    const user = await User.create({
      phone_number,
      username,
      email: email.toLowerCase(),
      about,
      password: encryptedPassword,
    });

    await user.save();

    // Create token
    const token = jwt.sign({ user_id: user._id, email }, process.env.TOKEN);
    // save user token
    user.token = token;

    //SendGrid send email
    const token_reg = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_REG
    );

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const message = {
      to: req.body.email,
      from: "divit@positionbuilding.com",
      subject: "hellow",
      text: "hellow",
      html: `<p>Please click on this link to approve yourself for PB Jobs. Only after admin approval, you will be able to post jobs. <a href="${process.env.BASE_URL}/verify/${token_reg}">${process.env.BASE_URL}/verify/${token_reg}</a></p>`,
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
    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

module.exports = router;
