const User = require("../models/user.js");

const express = require("express");

const router = express.Router();

const jwt = require("jsonwebtoken");

const sgMail = require("@sendgrid/mail");

router.get("/:token", async (req, res) => {
  try {
    jwt.verify(
      req.params.token,
      process.env.TOKEN_REG,
      async function (err, decoded) {
        if (err) {
          console.log(err);
        } else {
          // console.log(decoded);
          let email = decoded.email;
          const oldUser = await User.findOne({ email });
          // console.log(oldUser);
          if (oldUser) {
            User.findOneAndUpdate(
              { email: email },
              { is_approved: true },
              { new: true },
              (err, doc) => {
                if (err) {
                  console.log("Something wrong when updating data!");
                } else {
                  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                  // console.log(doc);
                  const message = {
                    to: email, //admin
                    from: "emailverified@positionbuilding.com",
                    subject: "emailverified",
                    text: "emailverified",
                    html: "Your job posting has been approved by the admin. Following are the instructions:",
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
                }
                // console.log(doc);
              }
            );
            return res.send("Email verified successfully");
          }
          // console.log(decoded);
          // res.send("Email verifified successfully");
        }
      }
    );
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

module.exports = router;
