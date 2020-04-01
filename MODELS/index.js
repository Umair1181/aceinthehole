const Seller = require("./sellerModel");
const EmailVerification = require("./emailVerification");
const Service = require("./service");
const ServiceCategory = require("./serviceCategory");
const TermsAndCondition = require("./termsAndCondition");
const Admin = require("./adminModel");
//////////////// Modals Are Exporting ///////////////
module.exports = {
  Seller,
  EmailVerification,
  Service,
  ServiceCategory,
  TermsAndCondition,
  Admin
};
