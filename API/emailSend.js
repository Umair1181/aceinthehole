var nodemailer = require("nodemailer");

module.exports = transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mhanzlanaveed@gmail.com",
    pass: "mhanzlanaveed@12345"
  }
});
