const express = require("express");
const multer = require("multer");

const upload = multer();

const router = express.Router();

const Job = require("../models/job");

const sgMail = require("@sendgrid/mail");

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
    .then((data) => {
      console.log("Saved job record");
    })
    .catch((err) => {
      console.log(err);
    });
  return res.status(200).send();
});

module.exports = router;
