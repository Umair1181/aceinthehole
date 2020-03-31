const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EmailVerification = new Schema({
  email: {
    type: String
  },

  code: {
    type: String
  }
});
module.exports = mongoose.model("tblemailverifications", EmailVerification);
