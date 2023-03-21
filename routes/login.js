const User = require("../models/user");

const express = require("express");

const router = express.Router();

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
  // console.log(req.body.password);
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: "Missing required parameters" });
  }
  // Our login logic starts here
  try {
    // Get user input
    const { email, password } = req.body;
    // Validate user input
    if (!(email && password)) {
      return res.status(400).json("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });
    if (!user.is_verified) {
      return res.status(400).json({ error: "user present but not verified" });
    }
    if (!user.is_approved) {
      res
        .status(400)
        .send({ error: "user verified but not approved by admin" });
    }
    if (user && (await bcrypt.compare(password, user.password))) {

      // Create token
      const token = jwt.sign({ user_id: user._id, email }, process.env.TOKEN);
      // save user token
      user.token = token;
      // user
      res.status(200).json(user);
    } else res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
