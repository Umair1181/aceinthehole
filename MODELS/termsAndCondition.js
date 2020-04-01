const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TermsAndCondition = new Schema({
  termsAndCondition: {
    type: String
  },

  isSellerOrUser: {
    //seller or user?
    type: String,
    default: false
  }
});
module.exports = mongoose.model("tbltermsandconditions", TermsAndCondition);
