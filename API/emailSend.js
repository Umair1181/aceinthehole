var nodemailer = require("nodemailer");

module.exports = transporter = nodemailer.createTransport({
  host: "host",
  port: 25,
  secure: false,
  service: "gmail",
  auth: {
    user: "aceintheholeapp@gmail.com",
    pass: "Aith2020",
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
  },
});
