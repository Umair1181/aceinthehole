const Seller = require("./sellerModel");
const EmailVerification = require("./emailVerification");
const Service = require("./service");
const ServiceCategory = require("./serviceCategory");
const TermsAndCondition = require("./termsAndCondition");
const Admin = require("./adminModel");
const User = require("./userModel");
const Order = require("./order");
const Reviews = require("./reviews");
const Cart = require("./cart");
const Chat = require("./chat");
const Notifications = require("./notifications");
const WishList = require("./whishList");
const Configs = require("./config");
//////////////// Modals Are Exporting ///////////////
module.exports = {
  Seller,
  EmailVerification,
  Service,
  ServiceCategory,
  TermsAndCondition,
  Admin,
  User,
  Order,
  Reviews,
  Cart,
  Chat,
  Notifications,
  WishList,
  Configs
};
