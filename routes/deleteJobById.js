const Job = require("../models/job.js");

const express = require("express");

const router = express.Router();

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const sgMail = require("@sendgrid/mail");
const { default: mongoose } = require("mongoose");

const { ObjectId } = mongoose;

router.post("/", async (req, res) => {
  // console.log(req.body.id);
  if (!req.body.id) {
    return res.status(400).send({ message: "Missing required parameters" });
  }

  const { id } = req.body;

  Job.findByIdAndDelete(id).then((resss)=>{
    // console.log(id);
    // console.log(resss);
    res.status(200).send({message: "Job deleted successfully"});
  }).catch((err)=>{
    console.log(err);
    res.status(400).send({message: "Job deletion failed"});
  });
});

module.exports = router;
