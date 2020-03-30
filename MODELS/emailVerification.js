const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EmailVerification = new Schema({
  email: {
    type: String,
    required: true
  },

  code: {
    type: String
  }
});
module.exports = mongoose.model("tblemailverifications", EmailVerification);
