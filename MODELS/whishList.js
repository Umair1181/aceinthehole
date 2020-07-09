const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WishList = new Schema({
  seller: {
    ///////// Seller Id Foreign Key
    type: mongoose.Schema.Types.ObjectId,
    ref: "tblsellers",
  },
  user: {
    ///////// user Id Foreign Key///////////
    type: mongoose.Schema.Types.ObjectId,
    ref: "tblusers",
  },
  services: [
    {
      ///////// Product Id Foreign Key///////////////
      type: mongoose.Schema.Types.ObjectId,
      ref: "tblservices",
    },
  ],
  date: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = mongoose.model("tblwishlists", WishList);
