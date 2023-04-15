const User = require("../models/user");

const express = require("express");

const router = express.Router();

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
  // console.log(req.body.password);
  if (!req.body.email || !req.body.old_password || !req.body.new_password) {
    return res.status(400).send({ message: "Missing required parameters" });
  }
  // Our login logic starts here
  try {
    // Get user input
    const { email, old_password, new_password } = req.body;
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
    if (user && (await bcrypt.compare(old_password, user.password))) {
      // console.log(new_password);
      //Encrypt user password
      encryptedPassword = await bcrypt.hash(new_password, 10);

      // Update user in our database
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { password: encryptedPassword },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(400).json({ error: "User update failed" });
      }
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
