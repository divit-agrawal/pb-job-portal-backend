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
              { is_verified: true },
              { new: true },
              (err, doc) => {
                if (err) {
                  console.log("Something wrong when updating data!");
                } else {
                  //send email to admin for approval

                  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                  // console.log(doc);
                  const message = {
                    to: process.env.ADMIN_EMAIL, //admin
                    from: "adminverify@positionbuilding.com",
                    subject: "Adminverify",
                    text: "Adminverify",
                    html: `<h3>New job posting!</h3><p>Username: ${doc.username}</p><p>Phone number: ${doc.phone_number}</p><p>Email: ${doc.email}</p><p>Click here to approve this job posting:</p><a href="${process.env.BASE_URL}/verifyJobPoster/${req.params.token}">${process.env.BASE_URL}/verifyJobPoster/${req.params.token}</a>`,
                  };

                  sgMail
                    .send(message)
                    .then((resp) => {
                      console.log("email sent");
                      console.log(resp);
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }
              }
            );
            res.setHeader("Content-Type", "text/html");
            res.send(
              '<div style="width: 95vw; height: 95vh; display: flex; justify-content: center;align-items: center">Email verified successfully</div>'
            );
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
