var nodemailer = require("nodemailer");

module.exports = transporter = nodemailer.createTransport({
  host: "host",
  port: 25,
  secure: false,
  service: "gmail",
  auth: {
    user: "mhanzlanaveed@gmail.com",
    pass: "hanzla@123",
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
  },
});
