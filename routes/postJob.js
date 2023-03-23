const express = require("express");
const multer = require("multer");

const upload = multer();

const router = express.Router();

const Job = require("../models/job");

const sgMail = require("@sendgrid/mail");

const PostingSignUp = require("../models/posting");

router.post("/", upload.none(), async (req, res) => {
  const body = req.body;

  // console.log(`From: ${body.from}`);
  // console.log(`HTML: ${body.html}`);
  var re = /[^< ]+(?=>)/g;
  var em;
  await body.from.match(re).forEach(function (email) {
    em = email;
    // console.log(email);
  });
  const job = await Job.create({
    email: em,
    jd: body.html,
  });

  await job
    .save()
    .then(async (data) => {
      const subscribers = await PostingSignUp.find({ poster_email: em });
      if (subscribers) {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        subscribers.map((sub) => {
          const message = {
            to: sub.seeker_email,
            from: "adminverify@positionbuilding.com",
            subject: "Adminverify",
            text: "Adminverify",
            html: `<p>New job posting by ${sub.username}</p>`,
          };
          sgMail
            .send(message)
            .then((resp) => {
              console.log("email sent to all subscribers");
              // console.log(resp);
            })
            .catch((err) => {
              console.log(err);
            }); 
        });
      }
      console.log("Saved job record");
    })
    .catch((err) => {
      console.log(err);
    });
  return res.status(200).send();
});

module.exports = router;
