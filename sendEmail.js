const sgMail = require("@sendgrid/mail");



sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const message = {
  to: "divitagrawal@gmail.com",
  from: "divit@positionbuilding.com",
  subject: "hellow",
  text: "hellow",
  html: "<h1>Hellow from sendgrid</h1>",
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
