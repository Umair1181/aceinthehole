const Seller = require("./sellerModel");
const EmailVerification = require("./emailVerification");
const Service = require("./service");
const ServiceCategory = require("./serviceCategory");
//////////////// Modals Are Exporting ///////////////
module.exports = {
  Seller,
  EmailVerification,
  Service,
  ServiceCategory
};
