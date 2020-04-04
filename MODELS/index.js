const Seller = require("./sellerModel");
const EmailVerification = require("./emailVerification");
const Service = require("./service");
const ServiceCategory = require("./serviceCategory");
const TermsAndCondition = require("./termsAndCondition");
const Admin = require("./adminModel");
const User = require("./userModel");
//////////////// Modals Are Exporting ///////////////
module.exports = {
  Seller,
  EmailVerification,
  Service,
  ServiceCategory,
  TermsAndCondition,
  Admin,
  User
};
