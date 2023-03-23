const User = require("../models/user.js");

const Posting = require("../models/posting.js");
const express = require("express");

const router = express.Router();

router.post("/", async (req, res) => {
  if (!req.body.poster_email || !req.body.username || !req.body.seeker_email) {
    return res.status(400).send({ message: "Missing required parameters" });
  }

  try {
    const { poster_email, username, seeker_email } = req.body;
    // const oldUser = await User.findOne({ email });

    // if (oldUser) {
    //   return res.status(200).json({
    //     status: "You have alreadys signed up for posts from this user",
    //   });
    // }

    const posting = await Posting.create({
      poster_email,
      username,
      seeker_email,
    });

    await posting.save().then((data) => {
      console.log("signed up for posts");
      res.status(200).json({
        status: "You have successfully signed up for posts from this user",
      });
    });
  } catch (err) {
    console.log(err);
    res.send(err);
  }

  //  console.log(req.body)
});

module.exports = router;
